<template>
  <div class="request-item-widget">
    <v-card class="pa-5">
      <v-card-title class="text-h5">
        Request Item
      </v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-text-field
          label="Enter UUID"
          v-model="uuid"
          outlined
          dense
        ></v-text-field>
        <v-btn
          color="primary"
          class="mt-3"
          type="submit"
        >
          Submit
        </v-btn>
      </v-form>

      <v-dialog
        v-model="showItemPopup"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h6">
            Item Details
          </v-card-title>
          <v-card-text>
            <p><strong>UUID:</strong> {{ item.uuid }}</p>
            <p><strong>Content:</strong> {{ item.content }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="blue darken-1"
              text
              @click="closeItemPopup"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

  
<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Ensure this is pointing to your auth store

export default {
  name: 'RequestItemWidget',
  data() {
    return {
      uuid: '',
      item: {},
      showItemPopup: false,
    };
  },
  methods: {
    onSubmit() {
      const authStore = useAuthStore(); // Access the auth store
      
      // Ensure you have the token. If not, handle accordingly
      if (!authStore.token) {
        console.error('No authentication token available.');
        // You might want to redirect to the login page or show an error message
        return;
      }

      axios.get(`/api/items/${this.uuid}`, {
        headers: {
          // Include the token in the request headers
          Authorization: `Bearer ${authStore.token}`
        }
      })
      .then(response => {
        this.item = response.data;
        this.showItemPopup = true;
        this.uuid = ''; // Clear the input field
      })
      .catch(error => {
        console.error('Error retrieving item:', error);
        // Consider adding error handling for the UI
      });
    },
    closeItemPopup() {
      this.showItemPopup = false;
      this.item = null; // Corrected from 'this.item = null;' to ensure consistency
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
  