<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const requestLoading = ref(false)
const refreshData = ref(false);

const handleDataAdded = () => {
  refreshData.value = !refreshData.value;
};
</script>

<template>
  <div class="grid gap-5 ">
    <v-card max-width="100%">
      <v-card-text class="inline-flex items-center space-between w-[100%] p-0 m-0">
        <Add
            :class="locale === 'ar'? 'mr-auto' : 'ml-auto'"
            endPoint="Sponser"
            imageEndpoint="File"
            AddMessage="Add new sponsor"
            :state="{
              url: '',
            }"
            @DataAdded="handleDataAdded"
            @loading="requestLoading = $event"
        />

      </v-card-text>
    </v-card>
    <v-progress-linear v-if="requestLoading" indeterminate></v-progress-linear>
    <cards
        endPoint="Sponser"
        imageEndpoint="File"
        :fetchRow="false"
        rowName="Sponsor"
        EditMessage="Edit sponsor"
        :headers="[{ title: $t('image'), key: 'url' }]"
        :state="{url: ''}"
        :delete="true"
        :edit="true"
        :pagination="false"
        :refreshData="refreshData"
    />
  </div>
</template>