import close from './close.svg';
import config from './config';
import getLocalizedValue from './localization';

export const getCloseButton = (className: string, onClick: () => void) => {
  const closeButton = document.createElement('button');
  const closeIcon = document.createElement('img');

  closeButton.className = `cohort-engagement-vector-close ${className}`;

  closeIcon.src = close;
  closeIcon.alt = 'Close';
  closeButton.appendChild(closeIcon);

  closeButton.onclick = () => {
    sessionStorage.setItem(config.SESSION_STORAGE_KEY, 'true');
    onClick();
  };
  return closeButton;
};

export const getChallengeViewButton = (className: string, url: string, onClick: () => void) => {
  const link = document.createElement('a');
  const translations = {
    en: 'View Challenge',
    fr: 'Voir le Challenge',
  };

  link.className = `cohort-engagement-vector-link ${className}`;
  link.href = url;
  link.target = '_blank';
  link.textContent = getLocalizedValue(translations);
  link.onclick = () => {
    sessionStorage.setItem(config.SESSION_STORAGE_KEY, 'true');
    onClick();
  };
  return link;
};

export const getImageOrVideo = (imageUrl: string | null, videoUrl: string | null) => {
  if (videoUrl) {
    const video = document.createElement('video');

    video.src = videoUrl;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = false;
    return video;
  }

  if (imageUrl) {
    const image = document.createElement('img');

    image.src = imageUrl;
    return image;
  }
  return null;
};
