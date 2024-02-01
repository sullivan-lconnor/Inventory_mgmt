import { createApp } from 'vue';
import HomePage from './components/HomePage.vue'
import router from './router';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
})

createApp(HomePage)
.use(vuetify)
.use(router)
.mount('#app')