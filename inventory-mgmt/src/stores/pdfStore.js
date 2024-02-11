// src/stores/pdfStore.js
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'; // Correct import for StandardFonts

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
      const font = await pdfDoc.embedFont(StandardFonts.Courier); // Use Courier for clear character distinction

      const labelWidth = 612 / 3; // Divide page width by 3 columns
      const labelHeight = 792 / 10; // Divide page height by 10 rows
      const qrCodeSize = Math.min(labelWidth, labelHeight) / 3; // Adjust size for padding
      const padding = 10; // Padding from the left edge

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

        // Draw the UUID text below the QR code
        const textSize = 10; // Adjust as needed
        page.drawText(uuid, {
          x: x,
          y: y - qrCodeSize - textSize, // Adjust Y position to place text below QR code
          size: textSize,
          font: font,
          color: rgb(0, 0, 0), // Correct usage of rgb for color
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
