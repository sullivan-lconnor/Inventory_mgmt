<template>
  <div>
    <h1>Request Item Page</h1>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="uuid" placeholder="Enter UUID">
      <button type="submit">Submit</button>
    </form>

    <div v-if="showItemPopup">
      <p>UUID: {{ item.uuid }}</p>
      <p>Content: {{ item.content }}</p>
      <button @click="closeItemPopup">OK</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      uuid: '',
      item: null,
      showItemPopup: false
    };
  },
  methods: {
    onSubmit() {
      axios.get(`/api/items/${this.uuid}`)
        .then(response => {
          console.log("Items retrieved:", response.data);
          this.item = response.data;
          this.showItemPopup = true;
          this.uuid = '';
        })
        .catch(error => {
          console.error('Error retrieving items:', error);
        });
    },
    closeItemPopup() {
      this.showItemPopup = false;
      this.item = null;
    }
  },
};
</script>

<style>
/* Add styles for your popup */
</style>
