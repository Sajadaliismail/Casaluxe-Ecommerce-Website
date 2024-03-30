const PDFDocument = require('pdfkit');
const moment = require('moment');

/**
 * Generates a PDF report based on the provided report data, start date, and end date.
 * @param {Array} reportData - The array containing order information for the report.
 * @param {Date} startDate - The start date of the report period.
 * @param {Date} endDate - The end date of the report period.
 * @returns {Promise<{filename: string, pdfBuffer: Buffer}>} - A promise resolving to an object containing the filename and PDF buffer.
 */
async function generatePDFReports(reportData, startDate, endDate) {
    return new Promise((resolve, reject) => {
        try {
            // Create a new PDF document
            const pdfDoc = new PDFDocument();

            // Generate a filename based on the current date
            const filename = `sales-report-${moment().format('YYYY-MM-DD')}.pdf`;

            // Add title and report period information to the PDF
            pdfDoc.text("Order Report", { align: "center" });
            pdfDoc.moveDown();
            pdfDoc.text(`Report from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`, { align: "center" });
            pdfDoc.moveDown();

            // Add seller information to the PDF
            pdfDoc.text("Seller Information:");
            pdfDoc.text(`Company Name: Casaluxe`);
            pdfDoc.text(`Address: cassa`);
            pdfDoc.text(`Contact No: +919999999999`);
            pdfDoc.moveDown();

            // Add orders section to the PDF
            pdfDoc.text("Orders:");
            pdfDoc.fontSize(10);
            let startY = pdfDoc.y + 15;
            let rowHeight = 20;

            // Add headers
            pdfDoc.text("No", 50, startY);
            pdfDoc.text("Order Id", 75, startY);
            pdfDoc.text("Order Date", 190, startY);
            pdfDoc.text("Amount", 255, startY);
            pdfDoc.text("Order Amount", 310, startY);
            pdfDoc.text("Order Status", 380, startY);
            pdfDoc.text("Payment Status", 450, startY);

            // Function to add a new page and reset startY
            const addNewPage = () => {
                pdfDoc.addPage();
                startY = 50; // Reset startY for the new page
            
                // Add headers again on the new page
                pdfDoc.text("No", 50, startY);
                pdfDoc.text("Order Id", 75, startY);
                pdfDoc.text("Order Date", 190, startY);
                pdfDoc.text("Amount", 255, startY);
                pdfDoc.text("Order Amount", 310, startY);
                pdfDoc.text("Order Status", 380, startY);
                pdfDoc.text("Payment Status", 450, startY);
            
                // Update startY to the position below the headers
                startY += rowHeight;
            };

            // Add data
            startY += rowHeight;
            reportData.forEach((orderInfo, index) => {
                if (startY > pdfDoc.page.height - 100) {
                    console.log(pdfDoc.page.height);
                    addNewPage();
                }

                pdfDoc.text(`${index + 1}`, 50, startY);
                pdfDoc.text(`${orderInfo.orderId}`, 75, startY);
                pdfDoc.text(`${orderInfo.orderdate.toLocaleDateString()}`, 190, startY);
                pdfDoc.text(`${orderInfo.totalAmount.toFixed(2)}`, 255, startY);
                pdfDoc.text(`${orderInfo.totalAmountAfterDiscount.toFixed(2)}`, 310, startY);
                pdfDoc.text(`${orderInfo.orderStatus}`, 380, startY);
                pdfDoc.text(`${orderInfo.paymentStatus}`, 450, startY);

                startY += rowHeight;
            });

            // Add total value of orders
            pdfDoc.moveDown();
            pdfDoc.moveDown();
            const totalValue = reportData.reduce((acc, value) => acc + value.totalAmountAfterDiscount, 0);
            pdfDoc.fontSize(12).text(`Total Value: ${totalValue.toFixed(2)}`, 420, startY, { bold: true });

            // Generate the PDF and resolve the promise when done
            const chunks = [];
            pdfDoc.on('data', (chunk) => {
                chunks.push(chunk);
            });
            pdfDoc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve({ filename, pdfBuffer });
            });
            pdfDoc.end();
        } catch (error) {
            // Reject the promise if an error occurs
            reject(error);
        }
    });
}

module.exports = generatePDFReports;
