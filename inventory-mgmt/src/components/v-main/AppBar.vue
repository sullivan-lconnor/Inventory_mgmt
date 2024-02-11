<template>
    <v-app-bar app>
      <v-toolbar-title>Rummage</v-toolbar-title>
      <v-spacer></v-spacer>
      <SearchBar></SearchBar>
      <!-- Add more toolbar items here -->
    </v-app-bar>
  </template>
  
  <script>
  import SearchBar from '@/components/topbar-widgets/SearchBar.vue';

  export default {
    name: "AppBar",
    components: {
      SearchBar
    }
  };
  </script>

  
  