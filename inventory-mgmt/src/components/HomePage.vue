<template>
  <v-app>
    <router-view></router-view>
    <AppBar></AppBar>
    <NavigationDrawer></NavigationDrawer>
    <MainContent></MainContent>
    <FooterBar></FooterBar>
  </v-app>
</template>

<script>
import AppBar from './v-main/AppBar.vue';
import NavigationDrawer from './v-main/NavigationDrawer.vue';
import MainContent from './v-main/MainContent.vue';
import FooterBar from './v-main/FooterBar.vue';

export default {
  components: {
    AppBar,
    NavigationDrawer,
    MainContent,
    FooterBar
  }
};
</script>
