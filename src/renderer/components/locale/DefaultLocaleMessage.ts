import { LocaleDescriptionType } from '../../types/Types';

export default function DefaultLocaleMessage(locales: LocaleDescriptionType[]) {
  if (locales.length < 1) {
    return '';
  }

  let defaultLocale: LocaleDescriptionType;
  const rest: LocaleDescriptionType[] = [];
  locales.forEach((locale) => {
    if (!defaultLocale && locale.default) {
      defaultLocale = locale;
    } else {
      rest.push(locale);
    }
  });

  let restText = '';
  let sep = '';
  rest.forEach((locale) => {
    restText += `${sep}${locale.code} (${locale.localeDescription})`;
    sep = ', ';
  });

  // @ts-ignore
  return `Default locale is ${defaultLocale.code} (${defaultLocale.localeDescription}) and the rest are ${restText}.`;
}
