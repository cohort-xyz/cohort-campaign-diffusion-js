import {getChallengeViewButton, getCloseButton, getImageOrVideo} from './dom';
import {CampaignEngagementVector} from './utils';

class Modal extends CampaignEngagementVector {
  #dialog: HTMLDialogElement | null = null;

  generateStyles(): HTMLStyleElement {
    const styleElement = document.createElement('style');

    styleElement.textContent = `
      .cohort-modal-content {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .cohort-modal-media-wrapper {
        display: flex;
        position: relative;
        justify-content: center;
        width: 100%;
      }

      .cohort-modal-media {
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
    const dialogStyleElement = document.createElement('style');

    dialogStyleElement.textContent = `
      dialog#cohort-campaign-diffusion-modal {
        border-radius: 0.5rem;
        border: none;
        max-width: 80vw;
        width: 500px;
        padding: 1rem;
      }

      dialog#cohort-campaign-diffusion-modal::backdrop {
        background: rgba(0, 0, 0, 0.4);
      }
    `;
    // Creating dialog in the Shadow DOM would break dialog behavior
    this.#dialog = document.createElement('dialog');
    this.#dialog.id = 'cohort-campaign-diffusion-modal';

    const handleClose = (): void => this.destroy();

    this.#dialog.addEventListener('click', e => {
      if (e.target === this.#dialog) {
        handleClose();
      }
    });
    this.#dialog.addEventListener('cancel', handleClose);

    const container = this.createShadowContainer();
    // Create content wrapper in shadow DOM
    const content = document.createElement('div');
    content.className = 'cohort-modal-content';

    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'cohort-modal-media-wrapper';
    const media = getImageOrVideo(this.campaignConfig.imageUrl, this.campaignConfig.videoUrl);

    if (media) {
      media.className = 'cohort-modal-media';
      mediaWrapper.appendChild(media);
    }
    const closeButton = getCloseButton('cohort-modal-close', handleClose);
    mediaWrapper.appendChild(closeButton);

    const title = document.createElement('h2');
    title.className = 'cohort-modal-title';
    title.textContent = this.campaignConfig.name;

    const description = document.createElement('p');
    description.className = 'cohort-modal-description';
    description.textContent = this.campaignConfig.description;

    const link = getChallengeViewButton('cohort-modal-link', this.campaignConfig.link, handleClose);

    content.appendChild(mediaWrapper);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(link);

    // Add content to shadow DOM
    this.addStylesToShadowRoot(this.generateStyles());
    this.shadowRoot?.appendChild(content);

    // Add shadow root container to dialog
    this.#dialog.appendChild(container);

    // Add dialog to light DOM and show it
    document.head.appendChild(dialogStyleElement);
    document.body.appendChild(this.#dialog);
    this.#dialog.showModal();
  }

  override destroy(): void {
    this.#dialog?.remove();
    this.#dialog = null;
  }
}

export default Modal;
