<template>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Rummage</v-list-item-title>
            <v-list-item-subtitle>Inventory Management for Few</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="navigateTo('request-item')">
          <v-list-item-icon>
            <v-icon>mdi-inbox-arrow-down</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Request Item</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('submit-item')">
          <v-list-item-icon>
            <v-icon>mdi-inbox-arrow-up</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Submit Item</v-list-item-title>
        </v-list-item>
        <!-- Add more items as needed -->
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  export default {
    name: 'NavigationDrawer',
    methods: {
      navigateTo(routeName) {
        this.$router.push({ name: routeName });
      }
    }
  };
  </script>
  