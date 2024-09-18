<script setup>
import { passwordValidator } from '@/@core/utils/validators'
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
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
//mport { c } from 'ofetch/dist/shared/ofetch.8459ad38'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
definePage({ meta: { layout: 'blank' } })

const router = useRouter()

const state = ref({
  email: '',
  password: '',
})
const errorMessage = ref('')
const login = async () => {
  try {
    const response = await axios.post('https://api.alifawzi.software/api/Autors/login', state.value)

    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('email',response.data.email)
    location.reload()
  } catch (error) {
    console.log('Failed:', error)
    state.value.errorMessage = t(error.response.data.message) || t('An error occurred.')
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
  <VRow no-gutters class="auth-wrapper bg-surface">


    <VCol cols="12" md="12" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <v-img src="/MainLogo.png" class="mb-4 w-16 h-auto" ></v-img>
          <p class="mb-0">
            {{ t('Please sign-in to your account') }}
          </p>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="login">
            <VRow>
              <!-- email -->
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
                    :rules="[passwordMinLength]"
                    v-model="state.password"
                  :label="t('Password')"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    clearable
                />

                <VBtn class="mt-8" block type="submit">
                  {{ t('sign in') }}
                </VBtn>
                <!-- Display error message -->
                <p v-if="state.errorMessage" class="text-error mt-2">{{ state.errorMessage }}</p>
              </VCol>

              <VCol cols="12" class="text-center text-base">
                <span>{{ t('New on our platform ?') }}</span>
                <button class="text-primary ms-2" @click.prevent="router.push('/register')">
                  {{ t('Create an account') }}
                </button>
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
