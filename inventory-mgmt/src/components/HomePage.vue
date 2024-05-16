<template>
  <v-app>
    <router-view :key="$route.fullPath"></router-view>
    <AppBar></AppBar>
    <NavigationDrawer></NavigationDrawer>
    <FooterBar></FooterBar>
  </v-app>
</template>

<script>
import AppBar from './v-main/AppBar.vue';
import NavigationDrawer from './v-main/NavigationDrawer.vue';
import FooterBar from './v-main/FooterBar.vue';

export default {
  components: {
    AppBar,
    NavigationDrawer,
    FooterBar
  }
};
</script>
