import en from '../locales/en.json';
import es from '../locales/es.json';

import {createI18n} from "vue-i18n";

// Obtener locale guardado y validarlo
const savedLocale = localStorage.getItem('locale');
const validLocales = ['en', 'es'];
const defaultLocale = 'en';

// Validar que el locale guardado sea válido
let locale = defaultLocale;
if (savedLocale && savedLocale !== 'null' && savedLocale !== 'undefined' && validLocales.includes(savedLocale)) {
    locale = savedLocale;
} else {
    // Si el locale guardado no es válido, limpiar el localStorage
    localStorage.removeItem('locale');
}

const i18n = createI18n({
    locale: locale,
    fallbackLocale: 'en',
    globalInjection: true,
    messages:{en,es}
});

export default i18n;