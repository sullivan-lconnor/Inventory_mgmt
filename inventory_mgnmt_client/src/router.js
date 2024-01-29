import { createRouter, createWebHistory } from 'vue-router';

// Import your component files here
import HomePage from './components/HomePage.vue';
import RequestItemPage from './components/RequestItemPage.vue';
import SubmitItemPage from './components/SubmitItemPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/request-item', component: RequestItemPage },
  { path: '/submit-item', component: SubmitItemPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
