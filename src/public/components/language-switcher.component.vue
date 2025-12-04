<script>
import {SelectButton as PvSelectButton} from "primevue";

export default {
  name: "language-switcher",
  components: {PvSelectButton},
  data() {
    return {
      languages: [],
      selectedLocale: 'en'
    }
  },
  created() {
    this.languages = this.$i18n.availableLocales;
    this.selectedLocale = this.$i18n.locale;
  },
  watch: {
    selectedLocale(newLocale) {
      // Asegurarse de que newLocale sea un string válido
      if (!newLocale || newLocale === 'null' || newLocale === 'undefined') {
        return;
      }
      const locale = typeof newLocale === 'string' ? newLocale : String(newLocale);
      if (this.$i18n.availableLocales.includes(locale)) {
        this.$i18n.locale = locale;
        localStorage.setItem('locale', locale);
      }
    }
  }
}
</script>

<template>
  <pv-select-button v-model="selectedLocale" :options="languages">
    <template #option="slotProps">
      {{ slotProps.option.toUpperCase() }}
    </template>
  </pv-select-button>
</template>

<style scoped>

</style>