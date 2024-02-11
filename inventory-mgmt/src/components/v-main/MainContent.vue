<template>
  <v-main>
    <v-container fluid>
      <RequestItemWidget v-if="currentWidget === 'request-item'" />
      <SubmitItemWidget v-if="currentWidget === 'submit-item'" />
      <UUIDItemRouter v-if="currentWidget === 'mainpage-item'" :uuid="uuid"></UUIDItemRouter>
      <QRUtility v-if="currentWidget === 'barcode-gen'"/>
    </v-container>
  </v-main>
</template>

<script>
import RequestItemWidget from '@/components/db-request-widgets/RequestItemWidget.vue';
import QRUtility from '@/components/barcode-utility/QRUtility.vue'
import UUIDItemRouter from '@/components/db-request-widgets/UUIDItemRouter.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "MainContent",
  components: {
    RequestItemWidget,
    QRUtility,
    UUIDItemRouter
  },
  setup() {
    const route = useRoute();
    // Use the route's name to determine the current widget
    const currentWidget = computed(() => route.name);
    // Extract the UUID from the route parameters
    const uuid = computed(() => route.params.uuid);

    return { currentWidget, uuid };
  }
};
</script>
