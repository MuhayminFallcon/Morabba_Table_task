<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const headers = ref([
  { text: "Dessert (100g serving)", value: "name" },
  { text: "Calories", value: "calories" },
  { text: "Fat (g)", value: "fat" },
  { text: "Carbs (g)", value: "carbs" },
  { text: "Protein (g)", value: "protein" },
  { text: "Iron (%)", value: "iron" }
]);

const desserts = ref([
  { name: "Frozen Yogurt", calories: 159, fat: 6.0, carbs: 24, protein: 4.0, iron: "1%" },
  { name: "Ice cream sandwich", calories: 237, fat: 9.0, carbs: 37, protein: 4.3, iron: "1%" },
  { name: "Eclair", calories: 262, fat: 16.0, carbs: 23, protein: 6.0, iron: "7%" },
  { name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3, iron: "8%" },
  { name: "Gingerbread", calories: 356, fat: 16.0, carbs: 49, protein: 3.9, iron: "16%" },
  { name: "Jelly bean", calories: 375, fat: 0.0, carbs: 94, protein: 0.0, iron: "0%" },
  { name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0, iron: "2%" },
  { name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5, iron: "45%" },
  { name: "Donut", calories: 452, fat: 25.0, carbs: 51, protein: 4.9, iron: "22%" },
  { name: "KitKat", calories: 518, fat: 26.0, carbs: 65, protein: 7, iron: "6%" }
]);

const startResize = (event, index) => {
  const resizer = event.target;
  const th = resizer.parentElement.parentElement;
  const startX = event.clientX;
  const startWidth = th.offsetWidth;

  const doResize = (e) => {
    const direction = locale.value === 'ar' ? -1 : 1;
    th.style.width = `${startWidth + direction * (e.clientX - startX)}px`;
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  };

  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
};
</script>

<template>
  <v-container>
    <v-simple-table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="resizable-th">
            <div class="resizer-container">
              <span>{{ header.text }}</span>
              <div :class="locale === 'ar' ? 'ArResizer' : 'EnResizer' " @mousedown="startResize($event, index)"></div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dessert, rowIndex) in desserts" :key="rowIndex">
          <td v-for="(header, index) in headers" :key="index">
            {{ dessert[header.value] }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<style scoped>
.resizable-th {
  position: relative;
  border: 1px solid #ccc;
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
  width: 2px;
  height: 100%;
  background-color: #ddd;
  cursor: col-resize;
  user-select: none;
}
.ArResizer {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background-color: #ddd;
  cursor: col-resize;
  user-select: none;
}
</style>