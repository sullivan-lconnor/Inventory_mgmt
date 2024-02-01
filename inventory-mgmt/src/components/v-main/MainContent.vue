<template>
  <v-main>
    <v-container fluid>
      <RequestItemWidget v-if="currentWidget === 'request-item'" />
      <SubmitItemWidget v-if="currentWidget === 'submit-item'" />
      <BarcodeUtility v-if="currentWidget === 'barcode-gen'"/>
    </v-container>
  </v-main>
</template>

<script>
import RequestItemWidget from '@/components/db-request-widgets/RequestItemWidget.vue';
import SubmitItemWidget from '@/components/db-request-widgets/SubmitItemWidget.vue';
import BarcodeUtility from '@/components/barcode-utility/BarcodeUtility.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "MainContent",
  components: {
    RequestItemWidget,
    SubmitItemWidget,
    BarcodeUtility
  },
  setup() {
    const route = useRoute();
    const currentWidget = computed(() => route.name); // Use route name instead of path segment

    return { currentWidget };
  }
};
</script>
