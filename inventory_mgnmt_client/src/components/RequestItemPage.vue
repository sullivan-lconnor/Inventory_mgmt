<template>
  <div>
    <h1>Request Item Page</h1>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="uuid" placeholder="Enter UUID">
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      uuid: '', // This will hold the UUID input by the user
    };
  },
  methods: {
    onSubmit() {
      // Make an HTTP request to your server endpoint
      axios.get(`/api/items/${this.uuid}`)
        .then(response => {
          console.log("Items retrieved:", response.data);
          // Clear the input or handle the data as needed
          this.uuid = '';
        })
        .catch(error => {
          console.error('Error retrieving items:', error);
        });
    },
  },
};
</script>
