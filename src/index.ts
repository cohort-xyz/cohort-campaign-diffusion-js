import config from './config';
import CampaignEngagementFactory from './factory';
import getLocalizedValue from './localization';
import Logger from './logger';
import type { CampaignEngagementVector, RawSDKConfig, SDKConfig } from './utils';

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type FetchOptions = {
  maxRetries?: number;
  initialDelay?: number;
};

class CohortCampaignSDK {
  #apiKey: string;
  #isReady = false;
  #verbose: boolean;
  #config: SDKConfig | null = null;
  #hasInteracted = false;
  #timeoutId: number | null = null;
  #logger: Logger;
  #engagementVector: CampaignEngagementVector | null = null;
  #scrollCallback: ((event: WheelEvent) => void) | null = null;
  #urlChangeCallback: (() => void) | null = null;

  constructor(apiKey: string, verbose = false) {
    this.#apiKey = apiKey;
    this.#verbose = verbose;
    this.#logger = new Logger(verbose);
    this.#init().catch(error => {
      this.#logger.error('Failed to initialize SDK', {error});
    });
  }

  async #fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retryOptions: FetchOptions = {}
  ): Promise<unknown> {
    const {
      maxRetries = config.DEFAULT_EXPONENTIAL_BACKOFF_RETRIES,
      initialDelay = config.DEFAULT_EXPONENTIAL_BACKOFF_INITIAL_DELAY,
    } = retryOptions;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${this.#apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error status ${response.status}`);
        }
        const text = await response.text();

        return text ? JSON.parse(text) : null;
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          throw error;
        }
        // Calculate delay with exponential backoff: 1s, 2s, 4s, etc.
        const delay = initialDelay * Math.pow(2, attempt - 1);

        await wait(delay);
      }
    }
  }

  #displayCampaignEngagement(): void {
    if (!this.#config || this.#engagementVector) {
      return;
    }
    this.#engagementVector = CampaignEngagementFactory.create(this.#config, this.#verbose);
    this.#engagementVector.show();
  }

  #hasDismissedCampaignEngagement(): boolean {
    return sessionStorage.getItem(config.SESSION_STORAGE_KEY) === 'true';
  }

  #setupInteractionListeners(): void {
    if (this.#hasDismissedCampaignEngagement()) {
      return;
    }

    this.#timeoutId = window.setTimeout(() => {
      if (!this.#hasInteracted) {
        this.#hasInteracted = true;
        this.#logger.log(
          `No interaction detected, displaying campaign engagement after ${config.DEFAULT_DISPLAY_TIMEOUT}ms`
        );
        this.#displayCampaignEngagement();
      }
    }, config.DEFAULT_DISPLAY_TIMEOUT);

    this.#scrollCallback = (event: WheelEvent): void => {
      if (this.#hasInteracted) {
        return;
      }
      // Find the scrollable container
      const target = event.target as HTMLElement;
      const scrollableParent = this.#findScrollableParent(target);

      if (!scrollableParent) {
        return;
      }
      // Calculate scroll percentage using the scrollable container
      const scrolled = scrollableParent.scrollTop;
      const height = scrollableParent.scrollHeight - scrollableParent.clientHeight;
      const scrollPercent = (scrolled / height) * 100;

      if (scrollPercent >= config.DEFAULT_SCROLL_TRIGGER_PERCENTAGE) {
        this.#logger.log(
          `User scrolled more than ${config.DEFAULT_SCROLL_TRIGGER_PERCENTAGE}%, displaying campaign engagement`
        );
        this.#hasInteracted = true;

        if (this.#timeoutId) {
          window.clearTimeout(this.#timeoutId);
        }

        if (this.#scrollCallback) {
          window.removeEventListener('wheel', this.#scrollCallback);
        }
        this.#displayCampaignEngagement();
      }
    };

    window.addEventListener('wheel', this.#scrollCallback, {passive: true});
  }

  #findScrollableParent(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
      return null;
    }

    // Check if element is scrollable
    const hasScrollableContent = (el: HTMLElement): boolean => {
      const hasScrollableY = el.scrollHeight > el.clientHeight;
      const style = window.getComputedStyle(el);
      const isScrollable = style.overflowY === 'auto' || style.overflowY === 'scroll';

      return hasScrollableY && isScrollable;
    };
    let parent: HTMLElement | null = element;

    // Walk up the DOM tree to find the scrollable container
    while (parent) {
      if (hasScrollableContent(parent)) {
        return parent;
      }
      parent = parent.parentElement;
    }

    return null;
  }

  #isUrlWhitelisted(): boolean {
    if (!this.#config?.whitelistedUrls?.length) {
      this.#logger.log('No whitelist specified, allowing all URLs');
      return true;
    }
    const currentUrl = window.location.href;

    return this.#config.whitelistedUrls.some(whitelistedUrl => {
      try {
        const pattern = new RegExp(whitelistedUrl);
        const match = pattern.test(currentUrl);

        if (match) {
          this.#logger.log(`URL ${currentUrl} matches whitelist pattern ${whitelistedUrl}`);
        }
        return match;
      } catch (error) {
        this.#logger.error(`Invalid URL pattern: ${whitelistedUrl}`, {error});
        return false;
      }
    });
  }

  #reset(): void {
    if (this.#timeoutId) {
      window.clearTimeout(this.#timeoutId);
    }
    this.#hasInteracted = false;
    this.#engagementVector?.destroy();
    this.#engagementVector = null;

    if (this.#scrollCallback) {
      window.removeEventListener('wheel', this.#scrollCallback);
    }
  }

  #setupUrlWatcher(): void {
    // Clean up previous listener if it exists
    if (this.#urlChangeCallback) {
      window.removeEventListener('popstate', this.#urlChangeCallback);
    }

    // Create new callback
    this.#urlChangeCallback = () => {
      this.#logger.log('URL changed, checking whitelist...');
      this.#reset();
      if (this.#isUrlWhitelisted()) {
        this.#setupInteractionListeners();
      }
    };

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', this.#urlChangeCallback);

    // Patch history methods to detect client-side navigation
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      originalPushState(...args);
      this.#urlChangeCallback?.();
    };

    history.replaceState = (...args) => {
      originalReplaceState(...args);
      this.#urlChangeCallback?.();
    };
  }

  #extractContentFromHtml(html: string): string {
    const span = document.createElement('span');

    span.innerHTML = html;
    // Recursive function to find first non-empty text content
    function findFirstTextContent(element: Element): string | null {
      // If this element has direct text content, return it
      if (element.childNodes.length === 1 && element.firstChild?.nodeType === Node.TEXT_NODE) {
        const text = element.textContent?.trim();

        return text || null;
      }

      // Otherwise, search through children
      for (const child of Array.from(element.children)) {
        const text = findFirstTextContent(child);

        if (text) {
          return text;
        }
      }
      return null;
    }
    const text = findFirstTextContent(span);

    return text?.replace(/\s+/g, ' ') || '';
  }

  async #init(): Promise<void> {
    const isConfigValid = (config: unknown): config is RawSDKConfig => {
      return (
        typeof config === 'object' &&
        config !== null &&
        'type' in config &&
        'typeConfig' in config &&
        'campaign' in config &&
        'supportedLanguages' in config &&
        'whitelistedUrls' in config &&
        typeof config.campaign === 'object' &&
        config.campaign !== null &&
        'id' in config.campaign &&
        'name' in config.campaign &&
        'description' in config.campaign &&
        'imageUrl' in config.campaign &&
        'link' in config.campaign &&
        'accentColor' in config.campaign
      );
    };
    this.#logger.log(
      `Fetching sdk config from ${config.API_URL}/merchants/campaign-diffusion-configuration...`
    );
    const data = await this.#fetchWithRetry(
      `${config.API_URL}/merchants/campaign-diffusion-configuration`
    );

    if (data === null) {
      this.#logger.error('Campaign diffusion is not enabled');
      return;
    }
    if (!isConfigValid(data)) {
      throw new Error('Invalid config');
    }
    this.#isReady = true;
    this.#config = {
      ...data,
      campaign: {
        ...data.campaign,
        name: getLocalizedValue(data.campaign.name),
        description: this.#extractContentFromHtml(getLocalizedValue(data.campaign.description)),
      },
    };
    this.#logger.log('Initialized', this.#config);
    if (this.#isUrlWhitelisted()) {
      this.#setupInteractionListeners();
    }
    this.#setupUrlWatcher();
  }

  public get isReady(): boolean {
    return this.#isReady;
  }
}

export default CohortCampaignSDK;
