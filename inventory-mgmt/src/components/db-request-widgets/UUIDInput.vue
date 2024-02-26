<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 pb-3">Add New Item</v-card-title>
    <v-form @submit.prevent="submitItem">
      <v-text-field
        label="UUID"
        v-model="item.uuid"
        placeholder="Enter UUID"
        outlined
        dense
        readonly
      ></v-text-field>
      <v-text-field
        label="Name"
        v-model="item.name"
        placeholder="Enter Name"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        label="Joy Percentage"
        v-model="item.joy_percentage"
        placeholder="0-100"
        type="number"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        label="Length"
        v-model="item.len"
        type="number"
        placeholder="Enter Length"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        label="Height"
        v-model="item.height"
        type="number"
        placeholder="Enter Height"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        label="Weight"
        v-model="item.weight"
        type="number"
        placeholder="Enter Weight"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        label="Quantity"
        v-model="item.quantity"
        type="number"
        placeholder="Enter Quantity"
        outlined
        dense
      ></v-text-field>
      <v-btn color="primary" class="mt-3" type="submit">Submit</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Adjust the path as necessary

export default {
  name: 'ItemInput',
  props: {
    uuid: String, // Accept uuid as prop
  },
  data() {
    return {
      item: {
        uuid: this.uuid, // Initialize uuid with prop value
        name: '',
        joy_percentage: null,
        len: null,
        height: null,
        weight: null,
        quantity: null,
      },
    };
  },
  methods: {
    submitItem() {
      const authStore = useAuthStore(); // Access the auth store

      axios.post('/api/items', this.item, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      .then(() => {
        this.$emit('item-submitted');
        this.$router.push('/'); // Navigate to a confirmation or list page
      })
      .catch(error => {
        console.error('Error submitting item:', error);
        // Handle submission error
      });
    }
  }
};
</script>
