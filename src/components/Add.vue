<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import { post } from '@/services/apiService';
import { iconMap } from '@/iconMap';
import { refreshState } from '@/stores/refreshState';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, Undo, FontColor, Image, ImageUpload, Base64UploadAdapter, ImageResize, ImageToolbar, ImageCaption, ImageStyle, ImageInsert, ImageTextAlternative, ImageBlock, ImageInline, ImageUtils, Alignment, Autoformat, BlockQuote, CKFinder, CKFinderUploadAdapter, CloudServices, EasyImage, Heading, Highlight, HorizontalLine, HtmlEmbed, Indent, IndentBlock, Link, List, MediaEmbed, PasteFromOffice, Table, TableToolbar, TextTransformation } from 'ckeditor5';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

const props = defineProps({
  endPoint: { type: String, required: true },
  AddMessage: { type: String, required: true },
  state: {
    type: Object,
    required: true,
  },
  imageEndpoint: { type: String, required: true },
  useCKEditor: { type: Boolean, default: false },
});

const editor = ClassicEditor;
const editorConfig = ref({
  plugins: [
    Essentials, Bold, Italic, Paragraph, Undo, FontColor, Image, ImageUpload, Base64UploadAdapter, ImageResize, ImageToolbar, ImageCaption, ImageStyle, ImageInsert, ImageTextAlternative, ImageBlock, ImageInline, ImageUtils,
    Alignment, Autoformat, BlockQuote, CKFinder, CKFinderUploadAdapter, CloudServices, EasyImage, Heading, Highlight, HorizontalLine, HtmlEmbed, Indent, IndentBlock, Link, List, MediaEmbed, PasteFromOffice, Table, TableToolbar, TextTransformation
  ],
  toolbar: [
    'bold', 'italic', 'undo', 'redo', 'fontColor', 'imageUpload', 'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight', 'alignment', 'autoformat', 'blockQuote', 'ckFinder', 'cloudServices', 'easyImage', 'heading', 'highlight', 'horizontalLine', 'htmlEmbed', 'indent', 'indentBlock', 'link', 'list', 'mediaEmbed', 'pasteFromOffice', 'table', 'tableToolbar', 'textTransformation'
  ],
  image: {
    resizeOptions: [
      {
        name: 'resizeImage:original',
        value: null,
        label: 'Original'
      },
      {
        name: 'resizeImage:50',
        value: '50',
        label: '50%'
      },
      {
        name: 'resizeImage:75',
        value: '75',
        label: '75%'
      }
    ],
    toolbar: ['imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight', '|', 'resizeImage', '|', 'imageTextAlternative'],
    styles: {
      options: [
        'alignLeft', 'alignCenter', 'alignRight'
      ]
    },
    caption: true
  },
  imageUpload: {
    types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
    multiple: true
  }
});

const emit = defineEmits(['DataAdded']);
const state = ref({ ...props.state });

const isImageUploading = ref(false);
const imageUpload = async () => {
  if ((!state.value.url && !state.value.image && !state.value.urlImage) || isImageUploading.value) return;
  emit('loading', true);
  isImageUploading.value = true;
  try {
    const formData = new FormData();
    if (state.value.image && state.value.image[0]) {
      formData.append('file', state.value.image[0]);
    } else if (state.value.url && state.value.url[0]) {
      formData.append('file', state.value.url[0]);
    } else if (state.value.urlImage && state.value.urlImage[0]) {
      formData.append('file', state.value.urlImage[0]);
    }

    const response = await post(props.imageEndpoint, formData, '', true);
    if (state.value.image) {
      state.value.image = response;
    } else if (state.value.url) {
      state.value.url = response;
    } else if (state.value.urlImage) {
      state.value.urlImage = response;
    }
    console.log('Image response:', response);
  } catch (error) {
    console.error('Failed to upload image', error);
  } finally {
    isImageUploading.value = false;
  }
};

const areImagesUploading = ref(false);
const imagesUpload = async () => {
  if (!state.value.urls || state.value.urls.length === 0 || areImagesUploading.value) return;
  emit('loading', true);
  areImagesUploading.value = true;
  try {
    const formData = new FormData();
    state.value.urls.forEach((url) => {
      formData.append('files', url);
    });
    const response = await post(props.imageEndpoint, formData, '', true);
    state.value.urls = response;
    console.log('Images response:', response);
  } catch (error) {
    console.error('Failed to upload images', error);
  } finally {
    areImagesUploading.value = false;
  }
};

watch(() => props.state, (newState) => {
  state.value = { ...newState };
}, { deep: true });

const dialog = ref(false);

const addData = async () => {
  if (isImageUploading.value || areImagesUploading.value) return;
  dialog.value = false;
  emit('loading', true);
  try {
    if (state.value.url || state.value.image || state.value.urlImage) await imageUpload();
    if (state.value.urls && state.value.urls.length !== 0) await imagesUpload();

    // Submit main form data
    const data = { ...state.value };
    let response;
    if (state.value.url) {
      response = await post(`${props.endPoint}?url=${state.value.url}`);
    } else {
      response = await post(props.endPoint, data);
    }

    console.log('Data added successfully:', response);
    state.value = { ...props.state };
    emit('DataAdded');
    refreshState.toggleRefresh(); // Trigger refresh
  } catch (error) {
    console.log('Failed to add data', error);
  }finally{
    emit('loading', false);
  }
};

// Validation helper methods
const numericOnly = (value) => {
  const pattern = /^[0-9]*$/;
  return pattern.test(value) || t('this field must have only numbers');
};


const emailOnly = (value) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(value) || t('Invalid email address');
};

const iconOptions = Object.keys(iconMap).map(key => ({
  value: iconMap[key],
  title: key
}));

const menu = ref(false);
const selectedIcon = ref('');
const handleItemClick = (item) => {
  state.value.iconId = item.value;
  menu.value = false;
};
</script>

<template>

  <div class="pa-0 text-center">
    <v-dialog v-model="dialog" max-width="fit-content">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="text-none font-weight-regular" prepend-icon="tabler-plus" :text="$t(props.AddMessage)" v-bind="activatorProps"></v-btn>
      </template>

      <form  @submit.prevent="addData">
        <v-card class="w-[750px] scrollable-card" :title="$t(props.AddMessage)">
          <v-card-text class="scrollable-content">
            <v-row dense class="container">
              <v-col v-for="(value, key) in state" :key="key" cols="12" md="12" sm="12" v-if="value !== null && typeof value !== 'object'">
                <template v-if="key === 'name'">
                  <v-text-field v-model="state[key]" :label="$t('name') " clearable required></v-text-field>
                </template>
                <template v-if="key === 'costumerName'">
                  <v-text-field v-model="state[key]" :label="$t('name') " clearable required></v-text-field>
                </template>
                <template v-if="key === 'services'">
                  <v-text-field v-model="state[key]" :label="$t('service') " clearable required></v-text-field>
                </template>
                <template v-if="key === 'propertieses'">
                  <v-text-field v-model="state[key]" :label="$t('properties') " clearable required></v-text-field>
                </template>
                <template v-if="key === 'subtitle'">
                  <v-text-field v-model="state[key]" :label="$t('subtitle') " clearable required></v-text-field>
                </template>
                <template v-else-if="key === 'email'">
                  <v-text-field v-model="state[key]" type="email" :rules="[emailOnly]" :label="$t('email')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'message'">
                  <v-text-field v-model="state[key]" :label="$t('message')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'location'">
                  <v-text-field v-model="state[key]" :label="$t('location')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'phoneNumber' || key === 'phoneNumberService'">
                  <v-text-field v-model="state[key]" type="tel" :rules="[numericOnly]" :label="$t('phone number')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'projectsFinished'">
                  <v-text-field v-model="state[key]" type="tel" :rules="[numericOnly]" :label="$t('projects finished')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'equipmentInstalled'">
                  <v-text-field v-model="state[key]" type="tel" :rules="[numericOnly]" :label="$t('equipment installed')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'envestments'">
                  <v-text-field v-model="state[key]" type="tel" :rules="[numericOnly]" :label="$t('investments')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'title'">
                  <v-text-field v-model="state[key]" :label="$t('title')" clearable></v-text-field>
                </template>
                <template v-else-if="key === 'iconId'">
                  <v-select
                      ref="select"
                      v-model="state[key]"
                      :items="iconOptions"
                      item-value="value"
                      item-text="title"
                      icon
                      persistent-hint
                      :label="$t('Icon')"
                      clearable
                      v-model:menu="menu"
                  >
                    <template v-slot:selection="data">
                      <v-icon>{{ data.item.value }}</v-icon>
                    </template>

                    <template v-slot:item="data">
                      <v-list-item @click="handleItemClick(data.item)">
                        <div class="flex gap-3">
                          <v-icon>{{ data.item.value }}</v-icon>
                          <p>{{ data.item.title }}</p>
                        </div>
                      </v-list-item>
                    </template>
                  </v-select>
                </template>
                <template v-else-if="key === 'description'">
                  <template v-if="props.useCKEditor">
                    <span >{{$t('custom style')}}</span>
                    <div class="mt-2 w-[700px]">
                      <ckeditor :editor="editor" v-model="state[key]" :config="editorConfig"></ckeditor>
                    </div>
                  </template>
                  <v-textarea v-else v-model="state[key]" :label="$t('description')" clearable></v-textarea>
                </template>

                <template v-else-if="key === 'createdAt'"></template>

                <template v-else-if="key === 'image'">
                  <v-file-input v-model="state[key]" :label="$t('Image') + '*'" required clearable accept="image/*"></v-file-input>
                </template>
                <template v-else-if="key === 'url'">
                  <v-file-input v-model="state[key]" :label="$t('Image') + '*'" required clearable accept="image/*"></v-file-input>
                </template>
                <template v-else-if="key === 'urlImage'">
                  <v-file-input v-model="state[key]" :label="$t('Image') + '*'" required clearable accept="image/*"></v-file-input>
                </template>
                <template v-else-if="key === 'images' || key === 'urls'">
                  <v-file-input v-model="state[key]" :label="$t('Images')" clearable multiple accept="image/*"></v-file-input>
                </template>
              </v-col>
            </v-row>
            <small class="text-caption text-medium-emphasis">{{$t('*indicates required field')}}</small>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="footer">
            <v-spacer></v-spacer>
            <v-btn :text="$t('Close')" variant="plain" @click="dialog = false"></v-btn>
            <v-btn id="submit-btn" color="primary" :text="$t('Add')" type="submit" variant="tonal"></v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>

<style>
.container {
  display: grid;
  gap: 12px;
  margin: 8px 0px 8px 0px;
}

.footer {
  margin: 16px 16px 8px 0px;
}

.scrollable-content {
  max-height: 400px;
  min-height: 400px;
  overflow-y: auto;
}
</style>