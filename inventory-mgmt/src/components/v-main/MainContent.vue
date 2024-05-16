<template>
  <v-main>
    <v-container fluid>
      <RequestItemWidget v-if="currentWidget === 'request-item'" />
      <SubmitItemWidget v-if="currentWidget === 'submit-item'" />
      <!-- Pass uuid as a prop directly -->
      <UUIDItemRouter v-if="currentWidget === 'mainpage-item'" :uuid="uuid"></UUIDItemRouter>
      <QRUtility v-if="currentWidget === 'barcode-gen'"/>
      <SearchUtility v-if="currentWidget === 'search-items'"/>
      <UUIDInput v-if="currentWidget === 'new-item'"/>
    </v-container>
  </v-main>
</template>

<script>

import RequestItemWidget from '@/components/db-request-widgets/RequestItemWidget.vue';
import QRUtility from '@/components/barcode-utility/QRUtility.vue';
import UUIDItemRouter from '@/components/db-request-widgets/UUIDItemRouter.vue';
import SearchUtility from '@/components/db-request-widgets/SearchUtility.vue';
import UUIDInput from '@/components/db-request-widgets/UUIDInput.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "MainContent",
  props: {
    // Receive UUID as a prop
    uuid: String,
  },
  components: {
    RequestItemWidget,
    QRUtility,
    UUIDItemRouter,
    SearchUtility,
    UUIDInput,
},
  setup(props) {
    const route = useRoute();
    // Use the route's name to determine the current widget
    const currentWidget = computed(() => route.name);

    return { currentWidget, uuid: props.uuid };
  }
};
</script>
