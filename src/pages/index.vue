<script setup>
import { get } from '@/services/apiService';
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';

const { locale } = useI18n();
const state = ref({
  projectsFinished: 0,
  equipmentInstalled: 0,
  envestments: 0
});

const fetchStatistics = async () => {
  try {
    const response = await get('Statistic');
    state.value = {
      projectsFinished: response.projectsFinished,
      equipmentInstalled: response.equipmentInstalled,
      envestments: response.envestments
    };
    console.log('state', state.value);
  } catch (error) {
    console.error('Failed to fetch statistics', error);
  }
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(number);
};

onMounted(() => {
  fetchStatistics();
});
</script>

<template>
  <v-card max-width="100%">
    <v-card-text class="inline-flex items-center space-between w-[100%] p-0 m-0">
      <Add
          :class="locale === 'ar' ? 'mr-auto' : 'ml-auto'"
          endPoint="Statistic"
          imageEndpoint="File"
          AddMessage="change statistics"
          :state="{
          projectsFinished: state.projectsFinished || 0,
          equipmentInstalled: state.equipmentInstalled || 0,
          envestments: state.envestments || 0
        }"
          @DataAdded="fetchStatistics"
      />
    </v-card-text>
  </v-card>

  <div class="flex flex-wrap gap-4 w-full">
    <template v-for="(value, key) in state" :key="key">
      <div v-if="key !== 'id'" class="flex-grow flex-basis-1/3">
        <v-card class="w-full my-4">
          <v-card-text class="flex flex-col items-center text-center">
            <div>
              <!-- Projects Finished -->
              <div class="grid gap-2" v-if="key === 'projectsFinished'">
                <p class="text-3xl text-primary"> {{ formatNumber(value) }} </p>
                <p class="text-lg"> {{ $t('projects finished') }} </p>
              </div>

              <!-- Equipment Installed -->
              <div class="grid gap-2" v-if="key === 'equipmentInstalled'">
                <p class="text-3xl text-primary"> {{ formatNumber(value) }} </p>
                <p class="text-lg"> {{ $t('equipment installed') }} </p>
              </div>

              <!-- Investments -->
              <div class="grid gap-2" v-if="key === 'envestments'">
                <p class="text-3xl text-primary"> {{ formatNumber(value) }} </p>
                <p class="text-lg"> {{ $t('investments') }} </p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </div>
</template>
