<template>
  <v-main>
    <v-container fluid>
      <h1>Welcome to Rummage</h1>
      <p>This is the main content area of the application.</p>
      <!-- Conditionally display widgets based on the route -->
      <RequestItemWidget v-if="currentRoute === 'request-item'" />
      <SubmitItemWidget v-if="currentRoute === 'submit-item'" />
    </v-container>
  </v-main>
</template>

<script>
import RequestItemWidget from './db-request-widgets/RequestItemWidget.vue';
import SubmitItemWidget from './db-request-widgets/SubmitItemWidget.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "MainContent",
  components: {
    RequestItemWidget,
    SubmitItemWidget
  },
  setup() {
    const route = useRoute();
    const currentRoute = computed(() => route.path.split('/')[1]); // Get the first segment after the slash

    return { currentRoute };
  }
};
</script>
