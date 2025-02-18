import close from './close.svg';
import config from './config';
import getLocalizedValue from './localization';

export const getCloseButton = (className: string, onClick: () => void) => {
  const styleElement = document.createElement('style');

  styleElement.textContent = `
    .cohort-engagement-vector-close {
      width: 20px;
      height: 20px;
      color: rgba(0, 0, 0, 0.60);
    }
  `;
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
  document.head.appendChild(styleElement);
  return closeButton;
};

export const getChallengeViewButton = (
  className: string,
  url: string,
  color: string,
  onClick: () => void,
) => {
  const styleElement = document.createElement('style');

  styleElement.textContent = `
    .cohort-engagement-vector-link {
      display: block;
      padding: 0.25rem 0.75rem;
      background-color: ${color};
      color: #fff;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      text-decoration: none;
      font-weight: 500;
      text-align: center;
    }
  `;
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
  document.head.appendChild(styleElement);
  return link;
};
