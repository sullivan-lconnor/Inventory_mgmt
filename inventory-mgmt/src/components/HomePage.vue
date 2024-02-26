<template>
  <v-app>
    <!-- Check if user is logged in -->
    <template v-if="isLoggedIn">
      <router-view :key="$route.fullPath"></router-view>
      <AppBar></AppBar>
      <NavigationDrawer></NavigationDrawer>
      <MainContent></MainContent>
      <FooterBar></FooterBar>
    </template>
    <template v-else>
      <!-- User is not logged in, show login page -->
      <LoginPage @login-success="handleLoginSuccess"></LoginPage>
    </template>
  </v-app>
</template>

<script>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import AppBar from './v-main/AppBar.vue';
import NavigationDrawer from './v-main/NavigationDrawer.vue';
import MainContent from './v-main/MainContent.vue';
import FooterBar from './v-main/FooterBar.vue';
import LoginPage from './login-page/LoginPage.vue';

export default {
  components: {
    AppBar,
    NavigationDrawer,
    MainContent,
    FooterBar,
    LoginPage
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    // Computed property to check login status
    const isLoggedIn = computed(() => !!authStore.userId);

    // Method to handle login success
    const handleLoginSuccess = () => {
      // You could force a reroute or just directly update the UI to reflect the login
      // Forcing a reroute to the home page or another dashboard page
      router.push('/main-content').catch(err => {});
    };

    return {
      isLoggedIn,
      handleLoginSuccess
    };
  }
};
</script>