<script setup>
import { ref } from 'vue';

const props = defineProps({
  endPoint: { type: String, default: '', required: true },
  headers: { type: Array, default: [], required: false },
  state: { type: Object, required: true },
  AddMessage: { type: String, default: '', required: false },
  EditMessage: { type: String, default: '', required: false },
  rowName: { type: String, default: 'row', required: false },
  delete: { type: Boolean, default: false, required: false },
  edit: { type: Boolean, default: false, required: false },
  search: { type: Boolean, default: false, required: false },
  filter: { type: Boolean, default: false, required: false },
  add: { type: Boolean, default: false, required: false },
  tableAndCards: { type: Boolean, default: false, required: false },
  onlyTable: { type: Boolean, default: false, required: false },
  onlyCards: { type: Boolean, default: false, required: false },
  pagination: { type: Boolean, default: true, required: false },
});

const filterField1 = ref('');
const filterField2 = ref('');
const filterField3 = ref('');
const filterField4 = ref('');
const filterField5 = ref('');
const filterField6 = ref('');

const clearFilter = () => {
  filterField1.value = '';
  filterField2.value = '';
  filterField3.value = '';
  filterField4.value = '';
  filterField5.value = '';
  filterField6.value = '';
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

const handleDataAdded = () => {
  refreshData.value = !refreshData.value;
};
</script>

<template>
  <div class="grid gap-5">
    <v-card v-if="props.search || props.filter || props.add || props.tableAndCards" max-width="100%">
      <v-card-text class="inline-flex items-center space-between w-[100%] p-0 m-0">
        <div v-if="props.search" class="flex items-center justify-conent-center gap-2">
          <v-text-field
            v-if="props.search"
            id="search-templates"
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
          <v-tabs v-if="props.tableAndCards" v-model="tab">
            <v-tab value="one" prepend-icon="tabler-border-all" />
            <v-tab value="two" prepend-icon="tabler-layout-grid" />
          </v-tabs>
        </div>
        <Add
          class="ml-auto"
          :endPoint="props.endPoint"
          imageEndpoint="File"
          :AddMessage="props.AddMessage"
          :state="props.state"
          @DataAdded="handleDataAdded"
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
          <v-card-text>
            <div class="flex gap-2">
              <v-text-field :label="$t('Name')" v-model="filterField1" clearable></v-text-field>
              <v-text-field :label="$t('JobTitle')" v-model="filterField3" clearable></v-text-field>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-expand-transition>
    <v-window v-if="props.tableAndCards" v-model="tab">
      <v-window-item value="one">
        <div>
          <Table
            :endPoint="props.endPoint"
            :rowName="props.rowName"
            :EditMessage="props.EditMessage"
            :headers="props.headers"
            :state="props.state"
            :delete="props.delete"
            :edit="props.edit"
            :pagination="props.pagination"
            :refreshData="refreshData"
          />
        </div>
      </v-window-item>
      <v-window-item value="two">
        <div>
          <cards
            :endPoint="props.endPoint"
            :rowName="props.rowName"
            :EditMessage="props.EditMessage"
            :headers="props.headers"
            :state="props.state"
            :delete="props.delete"
            :edit="props.edit"
            :pagination="props.pagination"
            :refreshData="refreshData"
          />
        </div>
      </v-window-item>
    </v-window>
    <Table
      v-if="props.onlyTable"
      :endPoint="props.endPoint"
      :rowName="props.rowName"
      :EditMessage="props.EditMessage"
      :headers="props.headers"
      :state="props.state"
      :delete="props.delete"
      :edit="props.edit"
      :pagination="props.pagination"
      :refreshData="refreshData"
    />
    <cards
      v-if="props.onlyCards"
      :endPoint="props.endPoint"
      :rowName="props.rowName"
      :EditMessage="props.EditMessage"
      :headers="props.headers"
      :state="props.state"
      :delete="props.delete"
      :edit="props.edit"
      :pagination="props.pagination"
      :refreshData="refreshData"
    />
  </div>
</template>