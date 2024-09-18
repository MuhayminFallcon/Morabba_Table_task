delete.vue
<script setup>
import { ref } from 'vue';
import { del } from '@/services/apiService';
import { useI18n } from 'vue-i18n';
import { refreshState } from '@/stores/refreshState';

const { t } = useI18n();
const emit = defineEmits(['rowDeleted', 'loading','DeleteError']);

const props = defineProps({
  endPoint: { type: String, default: '', required: true },
  id: { type: Number, required: true },
  state: { type: Object, required: true },
  rowName: { type: String, default: 'row', required: true }
});

const dialog = ref(false);
const loading = ref(false);

const deleteRow = async () => {
  try {
    loading.value = true;
    emit('loading', true);
    dialog.value = false;
    await del(props.endPoint, props.id);
    if (props.state && props.state.value) {
      props.state.value = props.state.value.filter((item) => item.id !== props.id);
    }
    emit('rowDeleted');
    refreshState.toggleRefresh();
  } catch (error) {
    console.error('Failed to delete the row:', error);
    emit('DeleteError')
  } finally {
    loading.value = false;
    emit('loading', false);
  }
};
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-tooltip :text="t('Delete')">
          <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props , activatorProps"
                icon="tabler-trash"
                variant="text"
                color="error"
            ></v-btn>
          </template>
        </v-tooltip>
      </template>

      <v-card style="padding:16px 0px 0px 16px">
        <v-card-title>{{ t(`Delete ${props.rowName}`) }}</v-card-title>
        <v-card-text>
          <p>{{ t('Are you sure you want to delete this') }} {{ t(props.rowName) }} {{ t('?') }}</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="footer">
          <v-spacer></v-spacer>
          <v-btn :text="t('Close')" variant="plain" @click="dialog = false"></v-btn>
          <v-btn id="submit-btn" color="primary" :text="t('Delete')" @click="deleteRow"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>