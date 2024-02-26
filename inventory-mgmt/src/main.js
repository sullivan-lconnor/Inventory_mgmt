import { createApp } from 'vue';
import HomePage from './components/HomePage.vue'
import router from './router';
import { createPinia } from 'pinia';

// Import the auth store
import { useAuthStore } from './stores/authStore'; // Adjust the path as necessary

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
})
const pinia = createPinia();

// Initialize the app
const app = createApp(HomePage);

// Use plugins
app.use(vuetify);
app.use(router);
app.use(pinia);

// Load the user authentication state from storage
const authStore = useAuthStore();
authStore.loadUserFromStorage(); // This will load the user state right after Pinia is initialized

// Finally, mount the app
app.mount('#app');