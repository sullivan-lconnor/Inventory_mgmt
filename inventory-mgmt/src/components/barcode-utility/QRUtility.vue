<template>
  <v-btn @click="generatePdf">Generate PDF</v-btn>
</template>

<script setup>
import { usePdfStore } from '@/stores/pdfStore';

const store = usePdfStore();

function generatePdf() {
  store.generatePdf();
}

</script>
