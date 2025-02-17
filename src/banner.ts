import config from './config';
import Logger from './logger';
import type { BannerSDKConfig, CampaignConfig } from './utils';
import { CampaignEngagementVector } from './utils';

class Banner extends CampaignEngagementVector {
  #bannerConfig: BannerSDKConfig['typeConfig'];
  #logger: Logger;

  constructor(
    campaignConfig: CampaignConfig,
    bannerConfig: BannerSDKConfig['typeConfig'],
    verbose = false
  ) {
    super(campaignConfig);
    this.#bannerConfig = bannerConfig;
    this.#logger = new Logger(verbose);
  }

  generateStyles(): HTMLStyleElement {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      #cohort-campaign-diffusion-banner {
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 0.5rem 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .cohort-banner-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 0.25rem;
      }

      .cohort-banner-content {
        flex: 1;
      }

      .cohort-banner-title {
        font-size: 1rem;
        font-weight: bold;
      }

      @media (max-width: 640px) {
        .cohort-banner-title {
          font-size: 0.875rem;
        }
      }

      .cohort-banner-description {
        font-size: 0.875rem;
        color: #666;
      }

      .cohort-banner-right-content {
        display: flex;
        gap: 0.5rem;
      }

      .cohort-banner-link {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background-color: ${this.campaignConfig.accentColor};
        color: #fff;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        text-decoration: none;
      }

      .cohort-banner-mobile-link {
        display: none;
        padding: 0.25rem 0.5rem;
        background-color: ${this.campaignConfig.accentColor};
        color: #fff;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        text-decoration: none;
      }

      @media (max-width: 640px) {
        .cohort-banner-mobile-link {
          display: inline-block;
        }
      }

      .cohort-banner-close {
        font-size: 1rem;
        cursor: pointer;
        color: #666;
        font-family: sans-serif;
      }

      @media (max-width: 640px) {
        .cohort-banner-right-content {
          display: none;
        }
      }
    `;
    return styleElement;
  }

  show(): void {
    const targetElement = document.querySelector(this.#bannerConfig.selector);

    if (!targetElement) {
      this.#logger.error(`Target element with selector "${this.#bannerConfig.selector}" not found`);
      return;
    }
    const banner = document.createElement('div');

    banner.id = 'cohort-campaign-diffusion-banner';

    if (this.campaignConfig.imageUrl) {
      const image = document.createElement('img');
      image.className = 'cohort-banner-image';
      image.src = this.campaignConfig.imageUrl;
      image.alt = this.campaignConfig.name;
      banner.appendChild(image);
    }

    const content = document.createElement('div');
    content.className = 'cohort-banner-content';

    const title = document.createElement('h3');
    title.className = 'cohort-banner-title';
    title.textContent = this.campaignConfig.name;

    const description = document.createElement('p');
    description.className = 'cohort-banner-description';
    description.textContent = this.campaignConfig.description;

    const mobileLink = document.createElement('a');
    mobileLink.className = 'cohort-banner-mobile-link';
    mobileLink.href = this.campaignConfig.link;
    mobileLink.textContent = 'View challenge';

    const rightContent = document.createElement('div');
    rightContent.className = 'cohort-banner-right-content';

    const link = document.createElement('a');
    link.className = 'cohort-banner-link';
    link.href = this.campaignConfig.link;
    link.textContent = 'View challenge';

    const closeButton = document.createElement('button');
    closeButton.className = 'cohort-banner-close';
    closeButton.textContent = 'x';

    closeButton.onclick = () => {
      sessionStorage.setItem(config.SESSION_STORAGE_KEY, 'true');
      banner.remove();
    };

    rightContent.appendChild(link);
    rightContent.appendChild(closeButton);

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(mobileLink);
    banner.appendChild(content);
    banner.appendChild(rightContent);

    document.head.appendChild(this.generateStyles());
    targetElement.insertAdjacentElement('afterend', banner);
  }

  destroy(): void {
    const banner = document.getElementById('cohort-campaign-diffusion-banner');

    if (banner) {
      banner.remove();
    }
  }
}

export default Banner;
