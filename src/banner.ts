import {getChallengeViewButton, getCloseButton} from './dom';
import Logger from './logger';
import type {BannerSDKConfig, CampaignConfig} from './utils';
import {CampaignEngagementVector} from './utils';

class Banner extends CampaignEngagementVector {
  #bannerConfig: BannerSDKConfig['typeConfig'];
  #logger: Logger;

  constructor(
    campaignConfig: CampaignConfig,
    bannerConfig: BannerSDKConfig['typeConfig'],
    verbose = false,
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
        padding: 0.875rem 1.25rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        border-bottom: 1px solid #E2E8F0;
      }

      @media (max-width: 640px) {
        #cohort-campaign-diffusion-banner {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .cohort-banner-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 0.25rem;
      }

      @media (max-width: 640px) {
        .cohort-banner-image {
          display: none;
        }
      }

      .cohort-banner-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .cohort-banner-title-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .cohort-banner-close-mobile {
        display: none;
      }

      @media (max-width: 640px) {
        .cohort-banner-close-mobile {
          display: block;
        }
      }

      .cohort-banner-title {
        font-size: 0.875rem;
        font-weight: bold;
      }

      .cohort-banner-description {
        font-size: 0.75rem;
        color: rgba(0, 0, 0, 0.60);
      }

      .cohort-banner-right-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      @media (max-width: 640px) {
        .cohort-banner-right-content {
          width: 100%;
        }
      }

      @media (max-width: 640px) {
        .cohort-banner-link {
          width: 100%;
        }
      }

      @media (max-width: 640px) {
        .cohort-banner-close {
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
    const handleRemoval = () => banner.remove();

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
    const titleWrapper = document.createElement('div');

    titleWrapper.className = 'cohort-banner-title-wrapper';
    const title = document.createElement('h3');

    title.className = 'cohort-banner-title';
    title.textContent = this.campaignConfig.name;
    const closeButtonMobile = getCloseButton('cohort-banner-close-mobile', handleRemoval);

    titleWrapper.appendChild(title);
    titleWrapper.appendChild(closeButtonMobile);
    const description = document.createElement('p');

    description.className = 'cohort-banner-description';
    description.textContent = this.campaignConfig.description;
    const rightContent = document.createElement('div');

    rightContent.className = 'cohort-banner-right-content';
    const link = getChallengeViewButton(
      'cohort-banner-link',
      this.campaignConfig.link,
      this.campaignConfig.accentColor,
      handleRemoval,
    );
    const closeButton = getCloseButton('cohort-banner-close', handleRemoval);

    rightContent.appendChild(link);
    rightContent.appendChild(closeButton);

    content.appendChild(titleWrapper);
    content.appendChild(description);
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
