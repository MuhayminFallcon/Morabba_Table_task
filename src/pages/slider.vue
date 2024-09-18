<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const requestLoading = ref(false)
const searchValue = ref('');
const refreshData = ref(false);

const handleDataAdded = () => {
  refreshData.value = !refreshData.value;
};
</script>

<template>
  <div class="grid gap-5">
    <v-card max-width="100%">
      <v-card-text class="inline-flex items-center space-between w-[100%] p-0 m-0">
        <div class="flex items-center justify-conent-center gap-4">
          <v-text-field
              id="search-templates"
              v-model="searchValue"
              append-inner-icon="tabler-search"
              density="compact"
              :label="$t('Search')"
              variant="outlined"
              clearable
              hide-details
              single-line
              style="width: 300px;"
          ></v-text-field>
        </div>
        <Add
            :class="locale === 'ar'? 'mr-auto' : 'ml-auto'"
            endPoint="Slider"
            imageEndpoint="File"
            AddMessage="add new slider"
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
        endPoint="Slider"
        imageEndpoint="File"
        :fetchRow="false"
        rowName="slider"
        EditMessage="edit slider"
        :headers="[
              { title: $t('image'), key: 'url' },
            ]"
        :state="{
              url: '',
            }"
        :delete="true"
        :edit="true"
        :pagination="true"
        :refreshData="refreshData"
        :searchValue="searchValue"
    />
  </div>
</template>