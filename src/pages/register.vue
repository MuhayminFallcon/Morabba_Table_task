<script setup>
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { post, put, get } from '@/services/apiService';
definePage({ meta: { layout: 'blank' } })
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router= useRouter();
const errorMessage = ref('')
const state = ref({
  name: '',
  email: '',
  password: '',
})

const register = async () => {
  try {
    const response = await axios.post('https://api.alifawzi.software/api/Autors/signUp',state.value)
    router.push('/login')
  } catch (error) {
    console.error('Failed to register:', error)
    state.value.errorMessage = t(error.response.data.message) || t('An error occurred.') // Set error message
  }
}

const passwordMinLength = (value) => {
  return value.length >= 8 || t('Password must be at least 8 characters long');
};
const emailOnly = (value) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(value) || t('Invalid email address');
};


const isPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      cols="12"
      md="12"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <v-img src="/MainLogo.png" class="mb-4 w-16 h-auto" ></v-img>
          <p class="mb-0">
            {{ t('Please sign-up to a new account') }}
          </p>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="register">
            <VRow>
              <!-- name -->
              <VCol cols="12">
                <v-text-field
                  v-model="state.name"
                  autofocus
                  :label="t('name')"
                  type="text"
                  clearable
                />
              </VCol>

              <VCol cols="12">
                <v-text-field
                    :rules="[emailOnly]"
                    v-model="state.email"
                  autofocus
                  :label="t('Email')"
                  type="email"
                    clearable
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <v-text-field
                  v-model="state.password"
                  :label="t('Password')"
                  :rules="[passwordMinLength]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  clearable
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                  class="mt-2"
                >
                  {{ t('Sign up')}}
                </VBtn>
                <!-- Display error message -->
                <p v-if="state.errorMessage" class="text-error mt-2">{{ state.errorMessage }}</p>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span>{{ t('Already have account ?') }}</span>

                <button
                  class="text-primary ms-2"
                  @click="router.push('/login')"
                >
                  {{ t('sign in') }}
                </button>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
              </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
