<template>
  <v-container>
    <v-row class="qr-row" justify="start">
      <v-col
        cols="12"
        md="4"
        v-for="(qrCode, index) in qrCodes"
        :key="index"
      >
        <div class="qr-item">
          <qrcode-vue :value="qrCode" :size="128" class="qr-code"></qrcode-vue>
          <span class="uuid-text">{{ qrCode.split('=')[1] }}</span>
        </div>
      </v-col>
    </v-row>
    <v-btn color="primary" @click="generatePDF" class="generate-btn">Generate PDF</v-btn>
  </v-container>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import QrcodeVue from 'qrcode.vue';
import { v4 as uuidv4 } from 'uuid';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const baseURL = 'https://yourwebsite.com?uuid=';
const qrCodes = ref([]);

const generateQRCodeURLs = (baseURL, arraySize) => {
  return Array.from({ length: arraySize }, () => `${baseURL}${uuidv4()}`);
};

const arraySize = 30; // Configurable size for 3x10 array
qrCodes.value = generateQRCodeURLs(baseURL, arraySize);

const generatePDF = async () => {
  await nextTick(); // Ensure the DOM is updated
  const element = document.querySelector('.v-container');
  const btn = document.querySelector('.generate-btn');
  btn.style.display = 'none'; // Temporarily hide the button
  
  const canvas = await html2canvas(element, {
    scale: 3, // Increase scale for better resolution
    useCORS: true,
    windowHeight: element.scrollHeight,
    windowWidth: element.scrollWidth
  });
  btn.style.display = ''; // Re-display the button

  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new JsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
  pdf.save('qr-codes.pdf');
};
</script>

<style>
.qr-row {
  margin-bottom: 10mm; /* Adjust the spacing between rows */
}

.qr-item {
  display: flex;
  align-items: center;
}

.uuid-text {
  margin-left: 12px; /* Space between QR code and text */
  white-space: nowrap; /* Ensure text does not wrap */
}

.generate-btn {
  margin-top: 12mm; /* Space above the generate button */
}
</style>
