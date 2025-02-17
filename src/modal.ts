import config from './config';
import { CampaignEngagementVector } from './utils';

class Modal extends CampaignEngagementVector {
  generateStyles(): HTMLStyleElement {
    const styleElement = document.createElement('style');

    styleElement.textContent = `
      dialog#cohort-campaign-diffusion-modal {
        border-radius: 0.5rem;
        border: none;
        max-width: 80vw;
        width: 500px;
        position: relative;
      }

      dialog#cohort-campaign-diffusion-modal::backdrop {
        background: rgba(0, 0, 0, 0.5);
      }

      .cohort-modal-close-wrapper {
        padding-right: 0.5rem;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

     .cohort-modal-close {
        border: none;
        background: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        transition: color 0.2s;
      }

      .cohort-modal-close:hover {
        color: #333;
      }

      .cohort-modal-close:focus {
        outline: none;
      }

      .cohort-modal-content {
        padding: 1rem;
        padding-top: 0;
      }

      .cohort-modal-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }

      .cohort-modal-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }

      .cohort-modal-description {
        font-size: 1rem;
        margin-bottom: 1rem;
        color: #666;
      }

      .cohort-modal-link {
        display: block;
        text-align: center;
        padding: 0.5rem 1rem;
        background-color: ${this.campaignConfig.accentColor};
        color: #fff;
        border-radius: 0.5rem;
      }
    `;
    return styleElement;
  }

  show(): void {
    // Create dialog element
    const dialog = document.createElement('dialog');
    dialog.id = 'cohort-campaign-diffusion-modal';

    // Dialog close wrapper
    const closeWrapper = document.createElement('div');
    closeWrapper.className = 'cohort-modal-close-wrapper';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'cohort-modal-close';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close modal');

    closeWrapper.appendChild(closeButton);
    dialog.appendChild(closeWrapper);

    // Handle closing
    const handleClose = (): void => {
      sessionStorage.setItem(config.SESSION_STORAGE_KEY, 'true');
      dialog.close();
      dialog.remove();
    };

    closeButton.onclick = handleClose;
    dialog.addEventListener('click', e => {
      if (e.target === dialog) {
        handleClose();
      }
    });
    // Handle escape key (built into dialog)
    dialog.addEventListener('cancel', handleClose);

    const dialogContent = document.createElement('div');
    dialogContent.className = 'cohort-modal-content';
    dialog.appendChild(dialogContent);

    // Campaign image
    if (this.campaignConfig.imageUrl) {
      const image = document.createElement('img');

      image.className = 'cohort-modal-image';
      image.src = this.campaignConfig.imageUrl;
      image.alt = this.campaignConfig.name;
      dialogContent.appendChild(image);
    }

    // Campaign title
    const title = document.createElement('h2');
    title.className = 'cohort-modal-title';
    title.textContent = this.campaignConfig.name;

    // Campaign description
    const description = document.createElement('p');
    description.className = 'cohort-modal-description';
    description.textContent = this.campaignConfig.description;

    const link = document.createElement('a');
    link.className = 'cohort-modal-link';
    link.href = this.campaignConfig.link;
    link.textContent = 'View challenge';

    dialogContent.appendChild(title);
    dialogContent.appendChild(description);
    dialogContent.appendChild(link);

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
