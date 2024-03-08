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
    path: '/mainpage-item/:uuid', // Using dynamic segment for UUID
    component: MainContent,
    name: 'mainpage-item', 
    props: true // Enables route params to be passed as props to the component
  },
  {
    path: '/barcode-gen',
    component: MainContent,
    name: 'barcode-gen' // Adding a name property
  },
  {
    path: '/search-items',
    component: MainContent,
    name: 'search-items'
  },
  {
    path: '/new-item',
    component: MainContent,
    name: 'new-item'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
