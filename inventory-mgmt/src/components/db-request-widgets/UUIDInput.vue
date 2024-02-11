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
        ></v-text-field>
        <v-text-field
          label="Content"
          v-model="item.content"
          placeholder="Enter Content"
          outlined
          dense
        ></v-text-field>
        <v-btn color="primary" class="mt-3" type="submit">Submit</v-btn>
      </v-form>
    </v-card>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UUIDInput',
    data() {
      return {
        item: {
          uuid: '',
          content: ''
        }
      };
    },
    methods: {
      submitItem() {
        axios.post('/api/items', this.item)
          .then(() => {
            this.$emit('item-submitted');
            this.item.uuid = '';
            this.item.content = '';
            this.$router.push('/'); // Optionally, navigate to a confirmation or home page
          })
          .catch(error => {
            console.error('Error submitting item:', error);
            // Handle submission error (e.g., show a notification)
          });
      }
    }
  };
  </script>
  