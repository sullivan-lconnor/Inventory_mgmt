<template>
  <v-main>
    <v-container fluid>
      <h1>Welcome to Rummage</h1>
      <p>This is the main content area of the application.</p>
      <RequestItemWidget v-if="currentWidget === 'request-item'" />
      <SubmitItemWidget v-if="currentWidget === 'submit-item'" />
    </v-container>
  </v-main>
</template>

<script>
import RequestItemWidget from '@/components/db-request-widgets/RequestItemWidget.vue';
import SubmitItemWidget from '@/components/db-request-widgets/SubmitItemWidget.vue';
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
    const currentWidget = computed(() => route.name); // Use route name instead of path segment

    return { currentWidget };
  }
};
</script>
