<template>
    <div>
      <!-- Conditionally render components based on the UUID validity -->
      <UUIDView v-if="uuidExists" :uuid="uuid" />
      <UUIDInput v-else :uuid="uuid" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import UUIDView from '@/components/db-request-widgets/UUIDView.vue';
  import UUIDInput from '@/components/db-request-widgets/UUIDInput.vue';
  
  export default {
    name: 'UUIDItemRouter',
    components: {
      UUIDView,
      UUIDInput,
    },
    props: {
      uuid: String,
    },
    data() {
      return {
        uuidExists: false,
      };
    },
    created() {
      this.checkUUIDExists();
    },
    methods: {
      async checkUUIDExists() {
        try {
          const response = await axios.get(`/api/items/${this.uuid}`);
          // Assuming the backend returns a 404 or similar when the UUID doesn't exist
          this.uuidExists = !!response.data;
        } catch (error) {
          this.uuidExists = false;
        }
      },
    },
  };
  </script>
