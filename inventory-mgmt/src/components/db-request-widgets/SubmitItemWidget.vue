<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 pb-3">Submit Item</v-card-title>
    <v-form @submit.prevent="onSubmit">
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

    <v-dialog v-model="showErrorPopup" persistent max-width="300px">
      <v-card>
        <v-card-title class="text-h6">Error</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeErrorPopup">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'SubmitItemWidget',
    data() {
      return {
        item: {
          uuid: '',
          content: ''
        },
        showErrorPopup: false,
        errorMessage: ''
      };
    },
    methods: {
      onSubmit() {
        axios.post('/api/items', this.item)
          .then(response => {
            this.$emit('submitted', response.data); // Emit an event for parent components
            this.item.uuid = '';
            this.item.content = '';
          })
          .catch(error => {
            this.errorMessage = 'Error submitting item.';
            if (error.response && error.response.status === 500 && error.response.data.error.includes('UNIQUE constraint failed: items.uuid')) {
              this.errorMessage = 'UUID already in database';
            }
            this.showErrorPopup = true;
          });
      },
      closeErrorPopup() {
        this.showErrorPopup = false;
        this.errorMessage = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .submit-item-widget {
    /* Styles scoped to the widget */
  }
  
  .error-popup {
    background-color: red;
    color: white;
    padding: 10px;
    position: absolute; /* Changed from 'fixed' to 'absolute' for widget-specific positioning */
    top: 20px;
    right: 20px;
    border: 1px solid darkred;
    z-index: 10; /* Ensure it appears above other widget content */
  }
  </style>
  