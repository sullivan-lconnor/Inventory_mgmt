<template>
  <div>
    <h1>Home Page</h1>
    <button @click="goToRequestItem">Request Item</button>
    <button @click="goToSubmitItem">Submit Item</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToRequestItem() {
      this.$router.push('/request-item');
    },
    goToSubmitItem() {
      this.$router.push('/submit-item');
    },
  },
};
</script>
