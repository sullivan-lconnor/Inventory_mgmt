<template>
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item @click="goTo('/request-item')">
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Request Item</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goTo('/submit-item')">
          <v-list-item-icon>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Submit Item</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Add more items as needed -->
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const drawer = ref(true); // Or false, depending on how you want the sidebar to initially appear
  
      const goTo = (path) => {
        // Assuming you have Vue Router installed and configured
        this.$router.push(path);
      };
  
      return { drawer, goTo };
    }
  };
  </script>
  