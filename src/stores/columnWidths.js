import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useColumnWidthsStore = defineStore('columnWidths', () => {
  const columnWidths = ref({});

  const loadColumnWidths = (email, tableId) => {
    const savedWidths = localStorage.getItem(`columnWidths_${email}_${tableId}`);
    if (savedWidths) {
      columnWidths.value[tableId] = JSON.parse(savedWidths);
    } else {
      columnWidths.value[tableId] = {};
    }
  };

  const saveColumnWidths = (email, tableId) => {
    localStorage.setItem(`columnWidths_${email}_${tableId}`, JSON.stringify(columnWidths.value[tableId]));
  };

  const setColumnWidth = (tableId, index, width) => {
    if (!columnWidths.value[tableId]) {
      columnWidths.value[tableId] = {};
    }
    columnWidths.value[tableId][index] = width;
  };

  return {
    columnWidths,
    loadColumnWidths,
    saveColumnWidths,
    setColumnWidth,
  };
});