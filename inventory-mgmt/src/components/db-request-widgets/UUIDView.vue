<template>
    <v-card class="pa-4" v-if="item">
      <v-card-title class="text-h5 pb-3">Item Details</v-card-title>
      <v-card-text>
        <p><strong>UUID:</strong> {{ item.uuid }}</p>
        <p><strong>Content:</strong> {{ item.content }}</p>
      </v-card-text>
      <v-btn color="primary" @click="$router.push('/')">Back to List</v-btn>
    </v-card>
    <v-alert type="error" v-else>No item found for this UUID.</v-alert>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UUIDView',
    props: {
      uuid: String
    },
    data() {
      return {
        item: null
      };
    },
    created() {
      this.fetchItem();
    },
    methods: {
      fetchItem() {
        axios.get(`/api/items/${this.uuid}`)
          .then(response => {
            this.item = response.data;
          })
          .catch(error => {
            console.error('Error fetching item:', error);
            this.item = null;
            // Handle fetch error (e.g., show a notification or error message)
          });
      }
    }
  };
  </script>
  