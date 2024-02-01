import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';

const routes = [
  { path: '/', component: HomePage },
  { 
    path: '/request-item', 
    component: HomePage, 
    meta: { widget: 'request-item' }
  },
  { 
    path: '/submit-item', 
    component: HomePage, 
    meta: { widget: 'submit-item' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
