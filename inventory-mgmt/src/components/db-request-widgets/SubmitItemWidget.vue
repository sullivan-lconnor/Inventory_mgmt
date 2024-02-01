<template>
    <div class="submit-item-widget">
      <h2>Submit Item</h2>
      <form @submit.prevent="onSubmit">
        <div>
          <label for="uuid">UUID:</label>
          <input type="text" id="uuid" v-model="item.uuid" placeholder="Enter UUID">
        </div>
        <div>
          <label for="content">Content:</label>
          <input type="text" id="content" v-model="item.content" placeholder="Enter Content">
        </div>
        <button type="submit">Submit</button>
      </form>
  
      <div v-if="showErrorPopup" class="error-popup">
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorPopup">OK</button>
      </div>
    </div>
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
  