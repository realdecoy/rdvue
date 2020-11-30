import Vue from 'vue';
import VueI18n, { LocaleMessageObject, LocaleMessages } from 'vue-i18n';

Vue.use(VueI18n);

// ----------------------------------------------------------------------------
// Module Constants
// ----------------------------------------------------------------------------
const DEFAULT_LOCALE = 'en';

const SUPPORTED_LOCALES = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Espanol (Spanish)',
    value: 'es',
  },
];

// ----------------------------------------------------------------------------
// Module Functions
// ----------------------------------------------------------------------------
function getBrowserLocale(countryCodeOnly = false) {
  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;

  if (!navigatorLocale) {
    return undefined;
  }
  const trimmedLocale = countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[0]
    : navigatorLocale.trim();

  return trimmedLocale;
}

function getStartingLocale() {
  const browserLocale = getBrowserLocale(true);
  let result: string;

  if (SUPPORTED_LOCALES.find((p) => p.value === browserLocale)) {
    result = browserLocale as string;
  } else {
    result = process.env.VUE_APP_I18N_LOCALE ?? DEFAULT_LOCALE;
  }

  return result;
}

function loadLocaleMessages() {
  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]\.json$/i,
  );
  const messages: LocaleMessages = {};

  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key) as LocaleMessageObject;
    }
  });

  return messages;
}

// ----------------------------------------------------------------------------
// Module Exports
// ----------------------------------------------------------------------------
const i18n = new VueI18n({
  locale: getStartingLocale(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE ?? DEFAULT_LOCALE,
  messages: loadLocaleMessages(),
});

export { i18n as default, SUPPORTED_LOCALES };
