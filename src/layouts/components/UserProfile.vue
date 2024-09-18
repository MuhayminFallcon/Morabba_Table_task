<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import { useRouter } from 'vue-router'
const router = useRouter();

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const logout = () => {
  localStorage.removeItem('auth_token');
  router.push('/login');
}
</script>

<template>
  <div

  >
<!--    <VAvatar-->
<!--      class="cursor-pointer"-->
<!--      color="primary"-->
<!--      variant="tonal"-->
<!--    >-->
      <v-btn variant="tonal" size="small">{{ $t('account') }}</v-btn>

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
<!--          <VListItem>-->
<!--            <template #prepend>-->
<!--              <VListItemAction start>-->
<!--                <VBadge-->
<!--                  dot-->
<!--                  location="bottom right"-->
<!--                  offset-x="3"-->
<!--                  offset-y="3"-->
<!--                  color="success"-->
<!--                >-->
<!--                  <VAvatar-->
<!--                    color="primary"-->
<!--                    variant="tonal"-->
<!--                  >-->
<!--                    <VImg :src="avatar1" />-->
<!--                  </VAvatar>-->
<!--                </VBadge>-->
<!--              </VListItemAction>-->
<!--            </template>-->

<!--            <VListItemTitle class="font-weight-semibold">-->
<!--              {{ fullname }}-->
<!--            </VListItemTitle>-->
<!--            <VListItemSubtitle>Admin</VListItemSubtitle>-->
<!--          </VListItem>-->

          <VDivider class="my-2" />

<!--          &lt;!&ndash; 👉 Profile &ndash;&gt;-->
<!--          <VListItem link>-->
<!--            <template #prepend>-->
<!--              <VIcon-->
<!--                class="me-2"-->
<!--                icon="tabler-user"-->
<!--                size="22"-->
<!--              />-->
<!--            </template>-->

<!--            <VListItemTitle>Profile</VListItemTitle>-->
<!--          </VListItem>-->



          <!-- 👉 Pricing -->


          <!-- 👉 FAQ -->


          <!-- Divider -->

          <!-- 👉 Logout -->
          <VListItem @click="logout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>{{t('Logout')}}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
<!--    </VAvatar>-->
  </div>
</template>
