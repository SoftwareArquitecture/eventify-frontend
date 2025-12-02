import en from '../locales/en.json';
import es from '../locales/es.json';

import {createI18n} from "vue-i18n";

const savedLocale = localStorage.getItem('locale') || 'en';

const i18n = createI18n({
    locale: savedLocale,
    fallbackLocale: 'en',
    globalInjection: true,
    messages:{en,es}
});

export default i18n;