<script setup>
import { ref } from 'vue';
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { refreshState } from '@/stores/refreshState';
const { locale } = useI18n();

const requestLoading = ref(false)
const filterField1 = ref('');
const filterField2 = ref('');
const filterField3 = ref('');
const filterField4 = ref('');
const searchValue = ref('');

const clearFilter = () => {
  filterField1.value = '';
  filterField2.value = '';
  filterField3.value = '';
  filterField4.value = '';
};

const showSection = ref(false);
const buttonVariant = ref('solo');
const buttonColor = ref('grey');
const toggleSection = () => {
  showSection.value = !showSection.value;
  buttonVariant.value = showSection.value ? 'flat' : 'solo';
  buttonColor.value = showSection.value ? 'primary' : 'grey';
  if ((filterField1.value || filterField2.value) && !showSection.value) {
    buttonVariant.value = 'tonal', buttonColor.value = 'primary';
  }
};

const refreshData = ref(false);

const tab = ref(null);

const handleDataChange = () => {
  refreshData.value = !refreshData.value;
  refreshState.toggleRefresh();
};
const newDate = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');
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
          <v-btn prepend-icon="tabler-filter" :variant="buttonVariant" :color="buttonColor" :text="$t('Filter')" @click="toggleSection"></v-btn>
          <v-tabs v-model="tab">
            <v-tab value="one" prepend-icon="tabler-border-all" />
            <v-tab value="two" prepend-icon="tabler-layout-grid" />
          </v-tabs>
        </div>
        <Add
            :class="locale === 'ar'? 'mr-auto' : 'ml-auto'"
            :useCKEditor="true"
            endPoint="Duty"
            imageEndpoint="File/multiple"
            tableId="servicesTable"
            AddMessage="add new service"
            :state="{
              title: '',
              subtitle: '',
              urls: [],
              description: '',
              phoneNumberService: '',
              iconId: '',
            }"
            @DataAdded="handleDataChange"
            @loading="requestLoading = $event"
        />
      </v-card-text>
    </v-card>
    <v-expand-transition>
      <div v-if="showSection">
        <v-card class="mx-auto-1 px-4 py-4" max-width="100%">
          <v-card-title style="margin-bottom: 16px;">
            {{$t('Filter')}}
            <v-btn prepend-icon="tabler-rotate" @click="clearFilter" variant="text" :text="$t('Clear filter')"></v-btn>
          </v-card-title>
          <v-card-text class="grid gap-4">
            <div class="flex gap-2">
              <v-text-field :label="$t('title')" v-model="filterField1" clearable></v-text-field>
              <v-text-field :label="$t('subtitle')" v-model="filterField2" clearable></v-text-field>
            </div>
            <div class="flex gap-2">
              <v-text-field :label="$t('description')" v-model="filterField3" clearable></v-text-field>
              <v-text-field :label="$t('phone number')" v-model="filterField4" clearable></v-text-field>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <v-progress-linear v-if="requestLoading" indeterminate></v-progress-linear>
    </v-expand-transition>
    <v-window v-model="tab">
      <v-window-item value="one">
        <div>
          <Table
              :useCKEditor="true"
              endPoint="Duty"
              rowName="service"
              imageEndpoint="File/multiple"
              EditMessage="edit service"
              :headers="[
              { title: $t('title'), key: 'title' },
              { title: $t('subtitle'), key: 'subtitle' },
              { title: $t('images'), key: 'urls' },
              { title: $t('phone number'), key: 'phoneNumberService' },
              { title: $t('icon'), key: 'iconId' },
              { title: $t('custom style'), key: 'description' },
            ]"
              :state="{
              title: '',
              subtitle: '',
              urls: [],
              description: '',
              phoneNumberService: '',
              iconId: '',
            }"
              :delete="true"
              :edit="true"
              :pagination="true"
              :refreshData="refreshState.refresh + refreshData"
              :searchValue="searchValue"
              :filters="{ title: filterField1, subtitle: filterField2, description: filterField3, phoneNumberService: filterField4}"
          />
        </div>
      </v-window-item>
      <v-window-item value="two">
        <div>
          <cards
              :useCKEditor="true"
              endPoint="Duty"
              rowName="service"
              imageEndpoint="File/multiple"
              EditMessage="edit service"
              :headers="[
              { title: $t('title'), key: 'title' },
              { title: $t('subtitle'), key: 'subtitle' },
              { title: $t('images'), key: 'urls' },
              { title: $t('phone number'), key: 'phoneNumberService' },
              { title: $t('icon'), key: 'iconId' },
              { title: $t('custom style'), key: 'description' },
            ]"
              :state="{
              title: '',
              subtitle: '',
              urls: [],
              description: '',
              phoneNumberService: '',
              iconId: '',
            }"
              :delete="true"
              :edit="true"
              :pagination="true"
              :refreshData="refreshState.refresh + refreshData"
              :searchValue="searchValue"
              :filters="{ title: filterField1, subtitle: filterField2, description: filterField3, phoneNumberService: filterField4}"
          />
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

