import type {LocalizedString} from './localization';

export type CampaignConfig = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  link: string;
  accentColor: string;
};

type BaseSDKConfig = {
  type: 'modal' | 'banner' | 'toast';
  typeConfig: unknown;
  campaign: CampaignConfig;
  whitelistedUrls: string[] | null;
};

type ModalSDKConfig = BaseSDKConfig & {
  type: 'modal';
  typeConfig: null;
};

export type BannerSDKConfig = BaseSDKConfig & {
  type: 'banner';
  typeConfig: {
    selector: string;
  };
};

export type ToastSDKConfig = BaseSDKConfig & {
  type: 'toast';
  typeConfig: {
    position: 'bottom-left' | 'bottom-right';
  };
};
export type SDKConfig = ModalSDKConfig | BannerSDKConfig | ToastSDKConfig;
export type RawSDKConfig = SDKConfig & {
  campaign: {
    name: LocalizedString;
    description: LocalizedString;
  };
};

abstract class CampaignEngagementVector {
  protected readonly campaignConfig: CampaignConfig;
  protected shadowRoot: ShadowRoot | null = null;
  protected container: HTMLDivElement | null = null;

  constructor(campaignConfig: CampaignConfig) {
    this.campaignConfig = campaignConfig;
  }

  protected createShadowContainer(): HTMLDivElement {
    this.container = document.createElement('div');
    this.shadowRoot = this.container.attachShadow({mode: 'closed'});

    // Add base styles
    const baseStyles = document.createElement('style');
    baseStyles.textContent = `
      :host {
        all: initial;
        font: inherit;
        color: inherit;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      button {
        border: none;
        background: none;
        font: inherit;
        color: inherit;
        cursor: pointer;
        padding: 0;
      }

      img, video {
        max-width: 100%;
        height: auto;
        display: block;
      }

      .cohort-engagement-vector-link {
        display: block;
        padding: 0.25rem 0.75rem;
        background-color: ${this.campaignConfig.accentColor};
        color: #fff;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        text-decoration: none;
        font-weight: 500;
        text-align: center;
      }

      .cohort-engagement-vector-close {
        width: 20px;
        height: 20px;
        color: rgba(0, 0, 0, 0.60);
      }
    `;

    this.shadowRoot.appendChild(baseStyles);
    return this.container;
  }

  protected addStylesToShadowRoot(styles: HTMLStyleElement): void {
    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.appendChild(styles);
  }

  abstract generateStyles(): HTMLStyleElement;

  abstract show(): void;

  destroy(): void {
    if (this.container) {
      this.container.remove();
    }
  }
}

export {CampaignEngagementVector};
