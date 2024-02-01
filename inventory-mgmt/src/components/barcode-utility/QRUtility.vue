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
    <v-btn color="primary" @click="generatePDF">Generate PDF</v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { v4 as uuidv4 } from 'uuid';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const baseURL = 'https://yourwebsite.com?uuid=';
const qrCodes = ref([]);

const generateQRCodeURLs = (baseURL, arraySize) => {
  return Array.from({ length: arraySize }, () => baseURL + uuidv4());
};

const arraySize = 30; // Configurable size for 3x10 array
qrCodes.value = generateQRCodeURLs(baseURL, arraySize);

const generatePDF = async () => {
  const element = document.querySelector('.v-container'); // Adjust selector as needed
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new JsPDF({
    orientation: 'landscape',
  });
  const imgProps= pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('qr-codes.pdf');
};
</script>
