// src/stores/pdfStore.js
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
          const qrCodeDataUri = await QRCode.toDataURL(url, { margin: 1, width: 100 });
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
      const font = await pdfDoc.embedFont(StandardFonts.Courier);

      const labelWidth = 612 / 3; // Divide page width by 3 columns
      const labelHeight = 792 / 10; // Divide page height by 10 rows
      const qrCodeSize = Math.min(labelWidth, labelHeight) / 4; // Adjust size for smaller QR code and text fit
      const padding = 10; // Padding from the left edge
      const textSize = 8; // Reduced text size to fit alongside QR code

      for (let i = 0; i < this.labels.length; i++) {
        const { uuid, qrCodeDataUri } = this.labels[i];
        const x = (i % 3) * labelWidth + padding; // Left justify with padding
        const y = 792 - Math.floor(i / 3 + 1) * labelHeight + (labelHeight - qrCodeSize) / 2 - qrCodeSize / 2; // Adjust for vertical centering

        // Convert QR code Data URI to image
        const qrImage = await pdfDoc.embedPng(qrCodeDataUri);

        page.drawImage(qrImage, {
          x: x,
          y: y,
          width: qrCodeSize,
          height: qrCodeSize,
        });

        // Adjust X position for text to align it next to the QR code
        const textX = x + qrCodeSize + 5; // Add a small gap after the QR code

        // Draw the UUID text next to the QR code
        page.drawText(uuid, {
          x: textX,
          y: y + qrCodeSize / 2 - textSize / 2, // Vertically center text relative to QR code
          size: textSize,
          font: font,
          color: rgb(0, 0, 0),
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
