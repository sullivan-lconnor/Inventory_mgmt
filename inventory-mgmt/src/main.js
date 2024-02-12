import { createApp } from 'vue';
import HomePage from './components/HomePage.vue'
import router from './router';
import { createPinia } from 'pinia';

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

createApp(HomePage)
.use(vuetify)
.use(router)
.use(pinia)
.mount('#app')
