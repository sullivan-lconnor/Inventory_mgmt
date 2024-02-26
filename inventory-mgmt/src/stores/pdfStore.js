// src/stores/pdfStore.js
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Conversion factor from mm to points (pt)
const mmToPt = 2.83465;

// Adjustable variables in mm, converted to points
const pagePaddingTopMm = 25;
const pagePaddingLeftMm = -30;
const horizontalSpacingMm = -20;
const verticalSpacingMm = -6;
const labelPaddingMm = 2;
const qrCodeScale = 0.75; // Scale of QR code

// Conversion to points
const pagePaddingTopPt = pagePaddingTopMm * mmToPt;
const pagePaddingLeftPt = pagePaddingLeftMm * mmToPt;
const horizontalSpacingPt = horizontalSpacingMm * mmToPt;
const verticalSpacingPt = verticalSpacingMm * mmToPt;
const labelPaddingPt = labelPaddingMm * mmToPt;

export const usePdfStore = defineStore('pdfStore', {
  state: () => ({
    // Example IP address, adjust as needed
    serverIp: 'http://192.168.1.171:8080',
    labels: [],
  }),
  actions: {
    async generateLabels() {
      this.labels = [];
      for (let i = 0; i < 30; i++) {
        const uuid = uuidv4();
        // Construct the URL using the server IP and dynamic segment for UUID
        const url = `${this.serverIp}/mainpage-item/${uuid}`;
        try {
          // Generate QR code Data URI with the constructed URL
          const qrCodeDataUri = await QRCode.toDataURL(url, { margin: 1, width: 120 });
          // Push the generated details into the labels array
          this.labels.push({ uuid, url, qrCodeDataUri });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    },
    async generatePdf() {
      await this.generateLabels();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.Courier);

      const labelWidth = (612 - pagePaddingLeftPt - 2 * horizontalSpacingPt) / 3;
      const labelHeight = (792 - pagePaddingTopPt - 9 * verticalSpacingPt) / 10;

      for (let i = 0; i < this.labels.length; i++) {
        const { uuid, qrCodeDataUri } = this.labels[i];
        const columnIndex = i % 3;
        const rowIndex = Math.floor(i / 3);

        const x = pagePaddingLeftPt + columnIndex * (labelWidth + horizontalSpacingPt) + labelPaddingPt;
        const yStart = 792 - pagePaddingTopPt - (rowIndex + 1) * (labelHeight + verticalSpacingPt) + labelPaddingPt;

        const qrCodeSize = Math.min(labelWidth, labelHeight) * qrCodeScale - 2 * labelPaddingPt;
        const qrX = x + (labelWidth - qrCodeSize) / 2;
        const qrY = yStart + labelHeight - qrCodeSize - labelPaddingPt;

        const qrImage = await pdfDoc.embedPng(qrCodeDataUri);
        page.drawImage(qrImage, {
          x: qrX,
          y: qrY,
          width: qrCodeSize,
          height: qrCodeSize,
        });

        // Calculating space for UUID text next to the QR code
        const textX = qrX + qrCodeSize + labelPaddingPt;
        const textWidth = labelWidth - qrCodeSize - 3 * labelPaddingPt; // Adjust textWidth based on QR code size and padding
        const textSize = 6; // Smaller text size to fit text next to QR code

        // Split UUID for two lines if necessary, ensuring dashes are included
        const uuidPart1 = uuid.substring(0, uuid.lastIndexOf('-') - 4); // Split before the last segment
        const uuidPart2 = uuid.substring(uuid.lastIndexOf('-') - 4); // Last segment of UUID

        // Draw the UUID text in two parts, right next to the QR code
        page.drawText(uuidPart1, {
          x: textX,
          y: qrY + qrCodeSize / 2 + textSize, // Position for the first line of UUID
          size: textSize,
          font: font,
          color: rgb(0, 0, 0),
          maxWidth: textWidth,
        });
        page.drawText(uuidPart2, {
          x: textX,
          y: qrY + qrCodeSize / 2, // Position for the second line of UUID
          size: textSize,
          font: font,
          color: rgb(0, 0, 0),
          maxWidth: textWidth,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'labels.pdf';
      link.click();
    }
  },
});
