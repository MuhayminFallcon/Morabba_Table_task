import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import { registerPlugins } from '@core/utils/plugins';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';

// Styles
import '@core/scss/template/index.scss';
import '@styles/styles.scss';
import '@/assets/css/main.css';

// Create vue app
const app = createApp(App);

// Create Pinia instance
const pinia = createPinia();

// Register plugins
registerPlugins(app);

// Use Pinia
app.use(pinia);
app.use( CkeditorPlugin )

// Mount vue app
app.mount('#app');