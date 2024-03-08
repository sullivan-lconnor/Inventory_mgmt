<template>
  <v-card class="pa-4" v-if="item">
    <v-card-title class="text-h5 pb-3">Item Details</v-card-title>
    <v-card-text>
      <p><strong>UUID:</strong> {{ item.uuid }}</p>
      <v-text-field label="Name" v-model="item.name" outlined dense></v-text-field>
      <v-text-field label="Joy Percentage" v-model="item.joy_percentage" type="number" outlined dense></v-text-field>
      <v-text-field label="Length" v-model="item.len" type="number" outlined dense></v-text-field>
      <v-text-field label="Height" v-model="item.height" type="number" outlined dense></v-text-field>
      <v-text-field label="Weight" v-model="item.weight" type="number" outlined dense></v-text-field>
      <v-text-field label="Quantity" v-model="item.quantity" type="number" outlined dense></v-text-field>
      <!-- For date_added and last_modified, consider using date pickers or displaying them as read-only if they are auto-updated -->
      <p><strong>Date Added:</strong> {{ item.date_added }}</p>
      <p><strong>Last Modified:</strong> {{ item.last_modified }}</p>
    </v-card-text>
    <v-btn color="primary" @click="updateItem">Save Changes</v-btn>
    <v-btn color="secondary" @click="$router.push('/search-items')">Back to List</v-btn>
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
        });
    },
    updateItem() {
      axios.put(`/api/items/${this.uuid}`, this.item)
        .then(() => {
          alert('Item updated successfully');
          // Optionally navigate back or refresh the item
        })
        .catch(error => {
          console.error('Error updating item:', error);
          // Handle update error (e.g., show a notification or error message)
        });
    }
  }
};
</script>
