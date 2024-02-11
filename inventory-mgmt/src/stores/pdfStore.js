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

      const labelWidth = 612 / 3;
      const labelHeight = 792 / 10;
      const qrCodeSize = Math.min(labelWidth, labelHeight) / 3 * 1.25; // Increase QR code size
      const padding = 10;
      const textSize = 6; // Shrink text size to accommodate larger QR code

      for (let i = 0; i < this.labels.length; i++) {
        const { uuid, qrCodeDataUri } = this.labels[i];
        const x = (i % 3) * labelWidth + padding; // Left justify with padding
        const y = 792 - Math.floor(i / 3 + 1) * labelHeight + (labelHeight - qrCodeSize) / 2 - qrCodeSize / 2;

        // Convert QR code Data URI to image
        const qrImage = await pdfDoc.embedPng(qrCodeDataUri);

        page.drawImage(qrImage, {
          x: x,
          y: y,
          width: qrCodeSize,
          height: qrCodeSize,
        });

        // Calculate space available for text
        const textMaxWidth = labelWidth - qrCodeSize - padding * 2;
        // Draw the UUID text next to the QR code, potentially wrapping it
        const uuidText = uuid.slice(0, 13) + '\n' + uuid.slice(13); // Example split for multiline
        page.drawText(uuidText, {
          x: x + qrCodeSize + 5,
          y: y + qrCodeSize / 2 - textSize, // Adjust based on actual text height
          size: textSize,
          font: font,
          color: rgb(0, 0, 0),
          maxWidth: textMaxWidth,
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
