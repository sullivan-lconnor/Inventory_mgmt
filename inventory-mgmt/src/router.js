import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import MainContent from './components/v-main/MainContent.vue';

const routes = [
  { path: '/', component: HomePage },
  {
    path: '/request-item',
    component: MainContent,
    name: 'request-item' // Adding a name property
  },
  {
    path: '/submit-item',
    component: MainContent,
    name: 'submit-item' // Adding a name property
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
