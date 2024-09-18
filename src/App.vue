<script setup>
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { useI18n } from 'vue-i18n'

const { global } = useTheme()
initCore()
initConfigStore()

const configStore = useConfigStore()
const { locale } = useI18n()

watch(locale, (newLocale) => {
  if (newLocale === 'ar') {
    document.body.classList.add('ar')
    loadCiroFont()
  } else {
    document.body.classList.remove('ar')
    document.body.style.fontFamily = ''
  }
}, { immediate: true })

function loadCiroFont() {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
  document.body.style.fontFamily = '"Cairo", sans-serif'
}
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>