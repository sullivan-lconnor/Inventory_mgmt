import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/authStore';
import HomePage from './components/HomePage.vue';
import MainContent from './components/v-main/MainContent.vue';
import axios from 'axios';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.userId) {
    if (to.path !== '/') {
      next('/');
      return;
    }
    next();
    return;
  }

  try {
    // Attempt to validate the token
    await axios.get('/api/validate-token', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    // Token is valid
    next();
  } catch (error) {
    // Token is invalid or request failed for some reason
    console.error('Token validation failed:', error);
    authStore.logoutUser(); // Optionally clear auth state
    next('/'); // Redirect to login page
  }
});

export default router;
