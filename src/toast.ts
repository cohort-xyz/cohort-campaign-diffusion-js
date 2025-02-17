import config from './config';
import type { CampaignConfig, ToastSDKConfig } from './utils';
import { CampaignEngagementVector } from './utils';

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
        width: 400px;
        transition: all 0.3s ease-in-out;
      }

      .cohort-toast-container.bottom-right {
        right: 24px;
      }

      .cohort-toast-container.bottom-left {
        left: 24px;
      }

      .cohort-toast {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1rem;
        display: flex;
        gap: 0.75rem;
        cursor: pointer;
        transition: transform 0.2s ease;
        position: relative;
        align-items: center;
      }

      .cohort-toast-close {
        z-index: 9999;
        position: absolute;
        padding-right: 0.5rem;
        top: 0;
        right: 0;
        font-size: 1rem;
        cursor: pointer;
        color: #666;
        font-family: sans-serif;
      }

      .cohort-toast:hover {
        transform: translateY(-2px);
      }

      .cohort-toast-image {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
      }

      .cohort-toast-content {
        flex: 1;
        min-width: 0;
      }

      .cohort-toast-title {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #1a1a1a;
      }

      .cohort-toast-description {
        font-size: 0.75rem;
        color: #666;
        margin: 0;
        overflow: hidden;
      }

      @media (max-width: 640px) {
        .cohort-toast-container {
          width: calc(100% - 32px);
          left: 16px !important;
          right: 16px !important;
          bottom: 16px !important;
        }
      }
    `;
    return styleElement;
  }

  show(): void {
    const position = this.#toastConfig.position;
    const container = document.createElement('div');

    container.id = 'cohort-campaign-diffusion-toast';
    container.className = `cohort-toast-container ${position}`;

    const closeButton = document.createElement('button');
    closeButton.className = 'cohort-toast-close';
    closeButton.textContent = 'x';

    closeButton.onclick = () => {
      sessionStorage.setItem(config.SESSION_STORAGE_KEY, 'true');
      container.remove();
    };

    container.appendChild(closeButton);

    const toast = document.createElement('div');
    toast.className = 'cohort-toast';
    toast.addEventListener('click', () => {
      if (this.campaignConfig.link) {
        window.open(this.campaignConfig.link, '_blank');
      }
    });

    if (this.campaignConfig.imageUrl) {
      const image = document.createElement('img');

      image.className = 'cohort-toast-image';
      image.src = this.campaignConfig.imageUrl;
      image.alt = this.campaignConfig.name;
      toast.appendChild(image);
    }

    const content = document.createElement('div');
    content.className = 'cohort-toast-content';

    const title = document.createElement('h3');
    title.className = 'cohort-toast-title';
    title.textContent = this.campaignConfig.name;

    const description = document.createElement('p');
    description.className = 'cohort-toast-description';
    description.textContent = this.campaignConfig.description;

    content.appendChild(title);
    content.appendChild(description);
    toast.appendChild(content);
    container.appendChild(toast);

    document.head.appendChild(this.generateStyles());
    document.body.appendChild(container);
  }

  destroy(): void {
    const container = document.getElementById('cohort-campaign-diffusion-toast');

    if (container) {
      container.remove();
    }
  }
}

export default Toast;
