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
          const qrCodeDataUri = await QRCode.toDataURL(url, { margin: 1, width: 120 }); // Adjust QR code width for bigger display
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

      const labelWidth = 612 / 3; // 3 columns
      const labelHeight = 792 / 10; // 10 rows
      const qrCodeSize = Math.min(labelWidth, labelHeight) / 3; // Adjusted QR code size
      const padding = 10; // Padding from the left edge
      const textSize = 6; // Adjusted text size

      for (let i = 0; i < this.labels.length; i++) {
        const { uuid, qrCodeDataUri } = this.labels[i];
        const columnIndex = i % 3;
        const rowIndex = Math.floor(i / 3);
        const x = columnIndex * labelWidth + padding; // Left justify with padding

        // Calculate vertical start position for this label
        const yStart = 792 - (rowIndex + 1) * labelHeight + labelHeight / 2 - qrCodeSize / 2;

        // Convert QR code Data URI to image
        const qrImage = await pdfDoc.embedPng(qrCodeDataUri);

        page.drawImage(qrImage, {
          x: x,
          y: yStart,
          width: qrCodeSize,
          height: qrCodeSize,
        });

        // Find the third hyphen to keep the dash at the end of the first line
        const splitIndex = uuid.indexOf('-', uuid.indexOf('-', uuid.indexOf('-') + 1) + 1);
        const uuidPart1 = uuid.substring(0, splitIndex + 1); // Include the dash in the first line
        const uuidPart2 = uuid.substring(splitIndex + 1);
        const textY = yStart - textSize * 2; // Adjust Y for text below QR code, accounting for two lines

        // Draw the UUID text in two parts
        page.drawText(uuidPart1, {
          x: x,
          y: textY + textSize, // Position for the first line
          size: textSize,
          font: font,
          color: rgb(0, 0, 0),
        });

        page.drawText(uuidPart2, {
          x: x,
          y: textY, // Position for the second line
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
