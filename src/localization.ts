export type LocalizedString = Record<string, string>;

function getBrowserLanguage(): string {
  return navigator.language.split('-')[0]?.toLowerCase() ?? 'en';
}

function getPreferredLanguages(): string[] {
  return (
    navigator.languages
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(lang => lang.split('-')[0]!.toLowerCase())
      .filter((lang, index, self) => self.indexOf(lang) === index)
  );
}

function getLocalizedValue(localizedString: LocalizedString): string {
  if (!Object.keys(localizedString).length) {
    return '';
  }

  const languagePriority = [
    getBrowserLanguage(), // 1. Primary browser language
    ...getPreferredLanguages(), // 2. Other browser languages
    'en', // 3. English fallback
    Object.keys(localizedString)[0], // 4. First available language
  ];
  const selectedLanguage = languagePriority.find(lang => lang && lang in localizedString);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return selectedLanguage ? localizedString[selectedLanguage]! : '';
}

export default getLocalizedValue;
