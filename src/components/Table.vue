<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { get } from '@/services/apiService';
import { useTextLengthStore } from '@/stores/textLength';
import { VSkeletonLoader } from 'vuetify/labs/components';
import { useI18n } from 'vue-i18n';
import { useColumnWidthsStore } from '@/stores/columnWidths';

const { locale } = useI18n();
const columnWidthsStore = useColumnWidthsStore();

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
  lettersLenght: { type: Number, default: 15, required: false },
  useCKEditor: { type: Boolean, default: false, required: false },
  fetchRow: { type: Boolean, default: true, required: false },
  tableId: { type: String, required: true }, // Add a unique identifier for each table
});

const loading = ref(true);
const requestLoading = ref(false);
const state = ref([]);
const selectedItem = ref(null);
const dialogVisible = ref(false);
const currentPage = ref(1);
const totalPages = ref(0);
const totalCount = ref(0);
const itemsPerPage = ref(5);
const textLengthStore = useTextLengthStore();

const EditError = ref(false);
const DeleteError = ref(false);

const fetchData = async (page = 1) => {
  try {
    const response = await get(props.endPoint, { page, size: itemsPerPage.value });
    state.value = response.data;
    totalCount.value = response.data.length;
    totalPages.value = Math.ceil(totalCount.value / itemsPerPage.value);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
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

const filteredState = computed(() => {
  let filtered = state.value;

  if (props.searchValue) {
    filtered = filtered.filter((item) => {
      return Object.values(item).some((value) =>
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

const showItemDetails = (item) => {
  selectedItem.value = item;
  dialogVisible.value = true;
};

watch(() => props.refreshData, () => {
  fetchData(currentPage.value);
});

watch(currentPage, () => {
  fetchData(currentPage.value);
});

onMounted(() => {
  const email = localStorage.getItem('email');
  if (email) {
    columnWidthsStore.loadColumnWidths(email, props.tableId);
  }
  fetchData(currentPage.value);
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const baseUrl = 'https://api.alifawzi.software/';

const fullImageUrl = (path) => `${baseUrl}${path}`;

const startResize = (event, index) => {
  const resizer = event.target;
  const th = resizer.parentElement.parentElement;
  const startX = event.clientX;
  const startWidth = th.offsetWidth;

  const doResize = (e) => {
    const direction = locale.value === 'ar' ? -1 : 1;
    const newWidth = startWidth + direction * (e.clientX - startX);
    th.style.width = `${newWidth}px`;
    columnWidthsStore.setColumnWidth(props.tableId, index, newWidth);
  };

  const stopResize = () => {
    const email = localStorage.getItem('email');
    if (email) {
      columnWidthsStore.saveColumnWidths(email, props.tableId);
    }
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  };

  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
};
</script>

<template>
  <p v-if="EditError" class="text-error text-center">{{$t('edit data error')}}</p>
  <p v-if="DeleteError" class="text-error text-center">{{$t('delete data error')}}</p>
  <v-progress-linear v-if="requestLoading" indeterminate></v-progress-linear>
  <v-skeleton-loader v-if="loading" loading type="heading, table-tbody" />
  <v-table v-if="!loading">
    <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="header.key" class="resizable-th" :style="{ width: columnWidthsStore.columnWidths[props.tableId]?.[index] + 'px' }">
          <div class="resizer-container">
            <span>{{ header.title }}</span>
            <div :class="locale === 'ar' ? 'ArResizer' : 'EnResizer'" @mousedown="startResize($event, index)"></div>
          </div>
        </th>
        <th class="text-center" v-if="props.edit || props.delete">
          {{ $t('Actions') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <td v-if="displayedState.length === 0" colspan="10" class="text-error px-6 py-4 whitespace-nowrap text-center"> {{$t('no data found please add')}} </td>
      <tr
        v-for="item in displayedState"
        :key="item.id"
        class="cursor-pointer hover:bg-[#757575] hover:bg-opacity-20 transition-colors duration-300"
        @click="showItemDetails(item)"
      >
        <td v-for="header in headers" :key="header.key">
          <template v-if="header.key === 'image' || header.key === 'urlImage'">
            <img :src="fullImageUrl(item[header.key])" class="w-[60px] h-[60px] object-cover my-2" />
          </template>
          <template v-else-if="header.key === 'urls'">
            <div class="images-display my-3">
              <div v-for="(image, index) in item[header.key]" :key="image" :style="{ zIndex: index + 1 }">
                <img :src="fullImageUrl(image)" alt="images" class="images" :style="{ right: `${index * 4}px`, top: `${index * 1}px` }" />
              </div>
            </div>
          </template>
          <template v-else-if="header.key == 'createdAt'">
            {{ item[header.key] }}
          </template>
          <template v-else-if="header.key == 'iconId'">
            <v-icon>{{item[header.key]}}</v-icon>
          </template>
          <template v-else>
            {{ textLengthStore.textLength(item[header.key], props.lettersLenght) }}
          </template>
        </td>
        <td v-if="props.delete || props.edit">
          <div class="flex items-center">
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
              class="ml-auto"
              :endPoint="props.endPoint"
              :imageEndpoint="props.imageEndpoint"
              :EditMessage="props.EditMessage"
              :state="props.state"
              @DataEdited="fetchData"
              @EditError="handleEditError(true)"
              @loading="requestLoading = $event"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-pagination
    class="mt-5"
    v-if="props.pagination"
    v-model="currentPage"
    :total-visible="5"
    :length="totalPages"
    active-color="primary"
    @update:modelValue="fetchData"
  />

  <!-- Dialog for displaying selected row info -->
  <v-dialog v-model="dialogVisible" max-width="600">
    <v-card v-if="selectedItem" class="pt-4 pl-4">
      <v-card-title>{{ $t('details') }}</v-card-title>
      <v-card-text>
        <div class="grid gap-2">
          <div class="w-[530px]" v-for="header in headers" :key="header.key">
            <div class="flex flex-sm-column" v-if="selectedItem[header.key] && header.key !=='iconId' && header.key !== 'description' && header.key !== 'image' && header.key !== 'url' && header.key !== 'urls' && header.key !== 'urlImage'">
              <span class="mr-2">{{ header.title }}:</span>
              <strong v-if="header.key !== 'description'">{{ selectedItem[header.key] }}</strong>
            </div>
          </div>
          <div v-if="selectedItem.iconId">
            <div class="flex gap-2 mb-4">
              <span>{{ $t('icon') }}</span>
              <v-icon> {{ selectedItem.iconId }}</v-icon>
            </div>
          </div>
          <div v-if="selectedItem.image">
            <span>{{ $t('image') }}</span>
            <img :src="fullImageUrl(selectedItem.image)" class="w-[350px] h-auto object-cover mt-3" />
          </div>
          <div v-if="selectedItem.urlImage">
            <span>{{ $t('image') }}</span>
            <img :src="fullImageUrl(selectedItem.urlImage)" class="w-[350px] h-auto object-cover mt-3" />
          </div>
          <div v-if="selectedItem.urls" class="grid grid-cols-1 ">
            <span class="mb-4">{{ $t('images') }}</span>
            <div class="grid grid-cols-2 gap-3 ">
              <div v-for="image in selectedItem.urls" :key="image">
                <img :src="fullImageUrl(image)" class="h-[auto] w-auto " />
              </div>
            </div>
          </div>
          <div v-if="selectedItem.description">
            <span v-if="props.customStyleTitle" :class="locale === 'ar'? 'ml-2' : 'mr-2'">{{ $t('custom style') }}:</span>
            <span v-else>{{$t('description')}}</span>
            <v-divider></v-divider>
            <div class="my-4" v-html="selectedItem.description"></div>
          </div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="footer">
        <v-spacer></v-spacer>
        <v-btn :text="$t('Close')" variant="plain" @click="dialogVisible = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.resizable-th {
  position: relative;
  padding: 8px;
}

.resizer-container {
  display: flex;
  align-items: center;
  position: relative;
}

.EnResizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background-color: #ddd;
  cursor: col-resize;
  user-select: none;
}
.ArResizer {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #ddd;
  cursor: col-resize;
  user-select: none;
}
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