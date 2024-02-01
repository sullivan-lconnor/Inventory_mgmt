<template>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
          v-for="(qrCode, index) in qrCodes"
          :key="index"
        >
          <qrcode-vue :value="qrCode" :size="128"></qrcode-vue>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="printQRs">Print QR Codes</v-btn>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import QrcodeVue from 'qrcode.vue';
  import { v4 as uuidv4 } from 'uuid';
  
  const baseURL = 'http://localhost:3000/?uuid=';
  const qrCodes = ref([]);
  
  const generateQRCodeURLs = (baseURL, arraySize) => {
    return Array.from({ length: arraySize }, () => baseURL + uuidv4());
  };
  
  const arraySize = 30; // Configurable size for 3x10 array
  qrCodes.value = generateQRCodeURLs(baseURL, arraySize);
  
  const printQRs = () => {
    window.print();
  };
  </script>
  