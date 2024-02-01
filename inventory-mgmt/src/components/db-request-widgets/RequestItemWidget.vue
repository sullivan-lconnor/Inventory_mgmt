<template>
    <div class="request-item-widget">
      <h2>Request Item</h2>
      <form @submit.prevent="onSubmit">
        <input type="text" v-model="uuid" placeholder="Enter UUID">
        <button type="submit">Submit</button>
      </form>
  
      <div v-if="showItemPopup" class="item-popup">
        <p><strong>UUID:</strong> {{ item.uuid }}</p>
        <p><strong>Content:</strong> {{ item.content }}</p>
        <button @click="closeItemPopup">OK</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RequestItemWidget',
    data() {
      return {
        uuid: '',
        item: {},
        showItemPopup: false
      };
    },
    methods: {
      onSubmit() {
        axios.get(`/api/items/${this.uuid}`)
          .then(response => {
            this.item = response.data;
            this.showItemPopup = true;
            this.uuid = '';
          })
          .catch(error => {
            console.error('Error retrieving items:', error);
            // Consider adding error handling for the UI
          });
      },
      closeItemPopup() {
        this.showItemPopup = false;
        this.item = null;
      }
    }
  };
  </script>
  
  <style scoped>
  .request-item-widget {
    /* Widget specific styles here */
  }
  
  .item-popup {
    background-color: #f9f9f9;
    color: #333;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
  }
  
  .item-popup strong {
    font-weight: bold;
  }
  </style>
  