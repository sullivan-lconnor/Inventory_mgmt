// src/stores/pdfStore.js
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';

export const usePdfStore = defineStore('pdfStore', {
  state: () => ({
    labels: [],
  }),
  actions: {
    async generateLabels() {
      this.labels = [];
      for (let i = 0; i < 30; i++) { // 3 columns * 10 rows = 30 labels
        const uuid = uuidv4();
        const url = `http://localhost:3000/view/${uuid}`;
        try {
          const qrCodeDataUri = await QRCode.toDataURL(url);
          this.labels.push({ uuid, url, qrCodeDataUri });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    },
    async generatePdf() {
      await this.generateLabels(); // Ensure labels are ready

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // US Letter in points (8.5" x 11")

      const labelWidth = 612 / 3; // Divide page width by 3 columns
      const labelHeight = 792 / 10; // Divide page height by 10 rows

      for (let i = 0; i < this.labels.length; i++) {
        const { qrCodeDataUri } = this.labels[i];
        const x = (i % 3) * labelWidth;
        const y = 792 - (Math.floor(i / 3) + 1) * labelHeight; // Adjusting for PDF coordinate system

        // Convert QR code Data URI to Uint8Array
        const qrImage = await pdfDoc.embedPng(qrCodeDataUri);

        page.drawImage(qrImage, {
          x: x + (labelWidth - qrImage.width) / 2,
          y: y + (labelHeight - qrImage.height) / 2,
          width: qrImage.width,
          height: qrImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      // Save the PDF to a file or trigger a download in a web app
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'labels.pdf';
      link.click();
    }
  },
});
