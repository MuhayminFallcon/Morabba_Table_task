import { reactive } from 'vue';

export const refreshState = reactive({
  refresh: false,
  toggleRefresh() {
    this.refresh = !this.refresh;
  }
});