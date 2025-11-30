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
      this.$i18n.locale = newLocale;
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