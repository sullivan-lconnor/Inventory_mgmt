<template>
  <div>
    <h1>Submit Item Page</h1>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      item: {
        uuid: '',
        content: ''
      }
    };
  },
  methods: {
    onSubmit() {
      // Make an HTTP POST request to your server endpoint
      axios.post('/api/items', this.item)
        .then(response => {
          // Handle the response, maybe clear the inputs or show a success message
          console.log('Response:', response.data);
          this.item.uuid = '';
          this.item.content = '';
        })
        .catch(error => {
          // Handle any errors, maybe show an error message
          console.error('Error submitting item:', error);
        });
    }
  }
};
</script>
