import {getChallengeViewButton, getCloseButton} from './dom';
import {CampaignEngagementVector} from './utils';

class Modal extends CampaignEngagementVector {
  generateStyles(): HTMLStyleElement {
    const styleElement = document.createElement('style');

    styleElement.textContent = `
      dialog#cohort-campaign-diffusion-modal {
        border-radius: 0.5rem;
        border: none;
        max-width: 80vw;
        width: 500px;
        padding: 1rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      dialog#cohort-campaign-diffusion-modal::backdrop {
        background: rgba(0, 0, 0, 0.4);
      }

      .cohort-modal-image-wrapper {
        display: flex;
        position: relative;
        justify-content: center;
        width: 100%;
      }

      .cohort-modal-image {
        height: 200px;
        width: 200px;
        aspect-ratio: 1 / 1;
        border-radius: 0.5rem;
      }

      .cohort-modal-close {
        position: absolute;
        right: 0;
      }

      .cohort-modal-close:focus {
        outline: none;
      }

      .cohort-modal-title {
        font-size: 1rem;
        font-weight: bold;
      }

      .cohort-modal-description {
        margin-top: -0.5rem;
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.60);
      }

      .cohort-modal-link {
        padding: 0.5rem 1rem;
      }


    `;
    return styleElement;
  }

  show(): void {
    // Create dialog element
    const dialog = document.createElement('dialog');
    dialog.id = 'cohort-campaign-diffusion-modal';

    const handleClose = (): void => {
      // sessionStorage.setItem(config.SESSION_STORAGE_KEY, 'true');
      dialog.close();
      dialog.remove();
    };

    dialog.addEventListener('click', e => {
      if (e.target === dialog) {
        handleClose();
      }
    });
    // Handle escape key (built into dialog)
    dialog.addEventListener('cancel', handleClose);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'cohort-modal-image-wrapper';

    if (this.campaignConfig.imageUrl) {
      const image = document.createElement('img');

      image.className = 'cohort-modal-image';
      image.src = this.campaignConfig.imageUrl;
      image.alt = this.campaignConfig.name;
      imageWrapper.appendChild(image);
    }
    const closeButton = getCloseButton('cohort-modal-close', handleClose);
    imageWrapper.appendChild(closeButton);

    const title = document.createElement('h2');
    title.className = 'cohort-modal-title';
    title.textContent = this.campaignConfig.name;

    const description = document.createElement('p');
    description.className = 'cohort-modal-description';
    description.textContent = this.campaignConfig.description;

    const link = getChallengeViewButton(
      'cohort-modal-link',
      this.campaignConfig.link,
      this.campaignConfig.accentColor,
      handleClose,
    );

    dialog.appendChild(imageWrapper);
    dialog.appendChild(title);
    dialog.appendChild(description);
    dialog.appendChild(link);

    // Add styles to document
    document.head.appendChild(this.generateStyles());

    // Add dialog to document and show it
    document.body.appendChild(dialog);
    dialog.showModal();
  }

  destroy(): void {
    const modal = document.getElementById('cohort-campaign-diffusion-modal');

    if (modal) {
      modal.remove();
    }
  }
}

export default Modal;
