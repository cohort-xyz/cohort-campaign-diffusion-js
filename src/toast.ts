import {getChallengeViewButton, getCloseButton, getImageOrVideo} from './dom';
import type {CampaignConfig, ToastSDKConfig} from './utils';
import {CampaignEngagementVector} from './utils';

class Toast extends CampaignEngagementVector {
  #toastConfig: ToastSDKConfig['typeConfig'];

  constructor(campaignConfig: CampaignConfig, toastConfig: ToastSDKConfig['typeConfig']) {
    super(campaignConfig);
    this.#toastConfig = toastConfig;
  }

  generateStyles(): HTMLStyleElement {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .cohort-toast-container {
        position: fixed;
        bottom: 24px;
        z-index: 9999;
        min-width: 400px;
        max-width: 600px;
        transition: all 0.3s ease-in-out;
      }

       @media (max-width: 640px) {
        .cohort-toast-container {
          width: calc(100% - 32px);
          min-width: auto;
          left: 16px !important;
          right: 16px !important;
          bottom: 16px !important;
        }
      }

      .cohort-toast-container.bottom-right {
        right: 24px;
      }

      .cohort-toast-container.bottom-left {
        left: 24px;
      }

      .cohort-toast {
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1rem;
        display: flex;
        gap: 0.75rem;
        cursor: pointer;
        align-items: flex-start;
      }

      .cohort-toast-media {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
      }

      @media (max-width: 640px) {
        .cohort-toast-media {
          display: none;
        }
      }

      .cohort-toast-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 0;
      }

      .cohort-toast-title-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .cohort-toast-title {
        font-size: 0.875rem;
        font-weight: 600;
      }

      .cohort-toast-description {
        font-size: 0.75rem;
        color: #666;
        margin: 0;
        overflow: hidden;
        color: rgba(0, 0, 0, 0.60);
      }

      .cohort-toast-link {
        margin-top: 0.5rem;
        width: fit-content;
      }

      @media (max-width: 640px) {
        .cohort-toast-link {
          width: 100%;
        }
      }
    `;
    return styleElement;
  }

  show(): void {
    const container = this.createShadowContainer();

    const handleRemoval = () => this.destroy();

    const toastContainer = document.createElement('div');
    toastContainer.className = `cohort-toast-container ${this.#toastConfig.position}`;
    container.appendChild(toastContainer);

    const toast = document.createElement('div');
    toast.className = 'cohort-toast';
    toastContainer.appendChild(toast);

    const media = getImageOrVideo(this.campaignConfig.imageUrl, this.campaignConfig.videoUrl);

    if (media) {
      media.className = 'cohort-toast-media';
      toast.appendChild(media);
    }

    const content = document.createElement('div');
    content.className = 'cohort-toast-content';

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'cohort-toast-title-wrapper';

    const title = document.createElement('h3');
    title.className = 'cohort-toast-title';
    title.textContent = this.campaignConfig.name;

    const closeButton = getCloseButton('cohort-toast-close', handleRemoval);
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(closeButton);

    const description = document.createElement('p');
    description.className = 'cohort-toast-description';
    description.textContent = this.campaignConfig.description;

    const link = getChallengeViewButton(
      'cohort-toast-link',
      this.campaignConfig.link,
      handleRemoval,
    );

    content.appendChild(titleWrapper);
    content.appendChild(description);
    content.appendChild(link);
    toast.appendChild(content);

    this.addStylesToShadowRoot(this.generateStyles());
    this.shadowRoot?.appendChild(toastContainer);
    document.body.appendChild(container);
  }
}

export default Toast;
