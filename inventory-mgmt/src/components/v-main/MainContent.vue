<template>
  <v-main>
    <v-container fluid>
      <component :is="currentComponent" :uuid="uuid" />
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
    const uuid = computed(() => route.params.uuid);
    
    const currentComponent = computed(() => {
      switch (route.name) {
        case 'request-item': return RequestItemWidget;
        case 'mainpage-item': return UUIDItemRouter;
        case 'barcode-gen': return QRUtility;
        default: return null; // No component for unmatched routes
      }
    });

    return { currentComponent, uuid };
  }
};
</script>
