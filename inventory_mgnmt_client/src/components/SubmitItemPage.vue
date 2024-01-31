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

    <div v-if="showErrorPopup" class="error-popup">
      <p>Warning: {{ errorMessage }}</p>
      <button @click="closeErrorPopup">OK</button>
    </div>
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
      },
      showErrorPopup: false,
      errorMessage: ''
    };
  },
  methods: {
    onSubmit() {
      axios.post('/api/items', this.item)
        .then(response => {
          console.log('Response:', response.data);
          this.item.uuid = '';
          this.item.content = '';
        })
        .catch(error => {
          if (error.response && error.response.status === 500 && error.response.data.error.includes('UNIQUE constraint failed: items.uuid')) {
            this.errorMessage = 'UUID already in database';
            this.showErrorPopup = true;
          } else {
            console.error('Error submitting item:', error);
          }
        });
    },
    closeErrorPopup() {
      this.showErrorPopup = false;
      this.errorMessage = '';
    }
  }
};
</script>

<style>
.error-popup {
  background-color: red;
  color: white;
  padding: 10px;
  position: fixed;
  top: 20px;
  right: 20px;
  border: 1px solid darkred;
}
</style>
