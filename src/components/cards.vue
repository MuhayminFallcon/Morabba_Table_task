<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { get } from '@/services/apiService';
import { useTextLengthStore } from '@/stores/textLength';
import { VSkeletonLoader } from 'vuetify/labs/components';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const props = defineProps({
  endPoint: { type: String, default: '', required: true },
  EditMessage: { type: String, default: '', required: false },
  imageEndpoint: { type: String, default: '', required: false },
  state: { type: Object, required: true },
  searchValue: { type: String, default: '', required: false },
  headers: { type: Array, default: [], required: false },
  rowName: { type: String, default: 'row', required: false },
  refreshData: { type: Boolean, default: false, required: false },
  delete: { type: Boolean, default: false, required: false },
  edit: { type: Boolean, default: false, required: false },
  pagination: { type: Boolean, default: true, required: false },
  filters: { type: Object, default: () => ({}), required: false },
  useCKEditor: { type: Boolean, default: false, required: false },
  fetchRow: { type: Boolean, default: true, required: false },
  customStyleTitle: { type: Boolean, default: true, required: false },
});

const requestLoading = ref(false);
const loading = ref(true);
const state = ref([]);
const dialogStates = ref({});
const currentPage = ref(1);
const totalPages = ref(0);
const totalCount = ref(0);
const itemsPerPage = ref(6);
const textLengthStore = useTextLengthStore();

const EditError = ref(false)
const DeleteError = ref(false)
const fetchData = async (page = 1) => {
  try {
    const response = await get(props.endPoint, { page, size: itemsPerPage.value });
    if(response.data){
      state.value = response.data
    }else{
      state.value = response;
    }
    totalCount.value = response.data.length;
    totalPages.value = Math.ceil(totalCount.value / itemsPerPage.value);
    initializeDialogStates();
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }finally{
    loading.value = false
  }
};

const handleEditError = (value) => {
  EditError.value = value;
  if (value) {
    setTimeout(() => {
      EditError.value = false;
    }, 3000);
  }
};

const handleDeleteError = (value) => {
  DeleteError.value = value;
  if (value) {
    setTimeout(() => {
      DeleteError.value = false;
    }, 3000);
  }
};

const initializeDialogStates = () => {
  dialogStates.value = {};
  state.value.forEach(item => {
    dialogStates.value[item.id] = false;
  });
};

const filteredState = computed(() => {
  let filtered = state.value;

  if (props.searchValue) {
    filtered = filtered.filter((item) => {
      return Object.values(item).some(value =>
          String(value).toLowerCase().includes(props.searchValue.toLowerCase())
      );
    });
  }

  Object.keys(props.filters).forEach((key) => {
    if (props.filters[key]) {
      filtered = filtered.filter((item) => {
        return String(item[key]).toLowerCase().includes(props.filters[key].toLowerCase());
      });
    }
  });

  return filtered;
});

const displayedState = computed(() => {
  if (!filteredState.value || filteredState.value.length === 0) {
    return [];
  }
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredState.value.slice(start, end);
});

watch(() => props.refreshData, () => {
  fetchData(currentPage.value);
});

watch(currentPage, () => {
  fetchData(currentPage.value);
});

onMounted(() => {
  fetchData(currentPage.value);
});

watch(state, initializeDialogStates);

const headers = ref(props.headers);

const openDialog = (id) => {
  dialogStates.value[id] = true;
};

const closeDialog = (id) => {
  dialogStates.value[id] = false;
}

const baseUrl = 'https://api.alifawzi.software/';

const fullImageUrl = (path) => `${baseUrl}${path}`;

const formatDate = (date) =>{
  return new Date(date).toLocaleDateString();
}
</script>

<template>
  <p v-if="EditError" class="mb-4 text-error text-center">{{$t('edit data error')}}</p>
  <p v-if="DeleteError" class="mb-4 text-error text-center">{{$t('delete data error')}}</p>
  <v-progress-linear v-if="requestLoading" indeterminate></v-progress-linear>
  <div v-if="loading" class="grid grid-cols-3 gap-4">
    <v-skeleton-loader
        v-for="n in 6"
        :key="n"
        type="card"
        class="mb-4"
    />
  </div>

  <v-container v-if="!loading" fluid class="w-full p-0 py-0 px-0">
    <p v-if="displayedState.length === 0 && !loading" class="text-error px-6 py-4 whitespace-nowrap text-center"> {{$t('no data found please add')}} </p>
    <v-row>
      <v-col v-for="item in displayedState" :key="item.id" cols="12" sm="6" md="4">
        <v-card @click="openDialog(item.id)">
          <v-card-title class="d-flex justify-space-between align-center">
          </v-card-title>
          <v-card-text>
            <div v-for="header in headers" :key="header.key" class="mb-2">
              <template v-if="header.key === 'url' || header.key === 'image'">
                <img :src="fullImageUrl(item[header.key])" class="w-[100%] h-[200px] object-cover"/>
              </template>
            </div>
            <div v-for="header in headers" :key="header.key" class="mb-2">
              <template v-if="header.key !== 'urls' && header.key !== 'images' && header.key !== 'iconId' && header.key !== 'url' && header.key !== 'image' && header.key !=='urlImage' ">
                <span>{{ $t(header.title) }}:</span>
                <v-chip class="ma-2" label>
                  {{ textLengthStore.textLength(item[header.key], 20) }}
                </v-chip>
              </template>
            </div>
            <div v-for="header in headers" :key="header.key" class="mb-2">
              <template v-if="header.key === 'iconId'">
                <span>{{$t('icon')}}</span>
                <v-chip class="ma-2" label>
                  <v-icon>{{ item[header.key] }}</v-icon>
                </v-chip>
              </template>
            </div>
            <div v-if="item.urls" class="images-display mt-2 ">
              <div v-for="(image, index) in  item.urls" :key="image" :style="{ zIndex: index + 1 }">
                <img :src="fullImageUrl(image)" alt="images" class="images" :style="{ right: `${index * 2}px`, top: `${index * 0}px` }" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <strong>{{ $t('actions') }}</strong>
              <Delete
                  v-if="props.delete"
                  :endPoint="props.endPoint"
                  :state="state"
                  :rowName="props.rowName"
                  :id="item.id"
                  @rowDeleted="fetchData"
                  @DeleteError="handleDeleteError(true)"
                  @loading="requestLoading = $event"
              />
              <Edit
                  v-if="props.edit"
                  :useCKEditor="props.useCKEditor"
                  :id="item.id"
                  :endPoint="props.endPoint"
                  :fetchRow="props.fetchRow"
                  :imageEndpoint="props.imageEndpoint"
                  :EditMessage="props.EditMessage"
                  :state="props.state"
                  @DataEdited="fetchData"
                  @DataEdit="handleEditError(true)"
                  @loading="requestLoading = $event"
              />
            </div>
          </v-card-text>
        </v-card>

        <v-dialog v-model="dialogStates[item.id]" max-width="600">
          <v-card v-if="item" class="pt-4 pl-4">
            <v-card-title>{{ $t('details') }}</v-card-title>
            <v-card-text>
              <div class="grid gap-2">
                <div class="w-[530px]" v-for="header in headers" :key="header.key">
                  <div class="flex flex-sm-column" v-if="item[header.key] && header.key !== 'description' && header.key !== 'iconId' && header.key !== 'image' && header.key !=='urlImage' && header.key !== 'url' && header.key !== 'urls'">
                    <span :class="locale === 'ar'? 'ml-2' : 'mr-2'">{{ header.title }}:</span>
                    <strong v-if="header.key !== 'description'">{{ item[header.key] }}</strong>
                  </div>
                </div>
                <div class="flex gap-2 mb-4" v-if="item.iconId">
                  <span>{{ $t('icon') }}</span>
                  <v-icon> {{ item.iconId }}</v-icon>
                </div>
                <div v-if="item.image">
                  <span>{{ $t('image') }}</span>
                  <img :src="fullImageUrl(item.image)" class="w-[350px] h-auto object-cover mt-3" />
                </div>
                <div v-if="item.url">
                  <span>{{ $t('image') }}</span>
                  <img :src="fullImageUrl(item.url)" class="w-[auto] h-auto object-cover mt-3" />
                </div>
                <div v-if="item.urlImage">
                  <span>{{ $t('image') }}</span>
                  <img :src="fullImageUrl(item.urlImage)" class="w-[350px] h-auto object-cover mt-3" />
                </div>
                <div v-if="item.urls" class="grid grid-cols-1">
                  <span class="mb-2">{{ $t('images') }}</span>
                  <div class="grid grid-cols-2 gap-3 ">
                    <div v-for="image in item.urls" :key="image">
                      <img :src="fullImageUrl(image)" class="h-[auto] w-auto" />
                    </div>
                  </div>
                </div>
                <div class="w-[530px]" v-for="header in headers" :key="header.key">
                  <div class="flex flex-sm-column" v-if="item[header.key] && header.key === 'description'">
                    <span class="mr-2" v-if="customStyleTitle" >{{ $t('custom style') }}:</span>
                    <span v-else> {{$t('description')}} </span>
                    <div>
                      <v-divider></v-divider>
                      <div class="my-4" v-html="item[header.key]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="footer">
              <v-spacer></v-spacer>
              <v-btn :text="$t('Close')" variant="plain" @click="closeDialog(item.id)"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-pagination
        class="mt-5"
        v-if="props.pagination"
        v-model="currentPage"
        :total-visible="5"
        :length="totalPages"
        active-color="primary"
        @update:modelValue="fetchData"
    />
  </v-container>
</template>

<style scoped>
.images {
  width: 60px;
  height: 60px;
  object-fit: cover;
  position: absolute;
}
.images-display {
  position: relative;
  width: 60px;
  height: 60px;
}
</style>