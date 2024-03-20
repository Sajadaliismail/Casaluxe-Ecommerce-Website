const PDFDocument = require('pdfkit');
const moment = require('moment');

async function generatePDFReports(reportData, startDate, endDate) {
    return new Promise((resolve, reject) => {
        try {
            const pdfDoc = new PDFDocument();
            const filename = `sales-report-${moment().format('YYYY-MM-DD')}.pdf`;

            pdfDoc.text("Order Report", { align: "center" });
            pdfDoc.moveDown();
            pdfDoc.text(`Report from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`, { align: "center" });
            pdfDoc.moveDown();

            pdfDoc.text("Seller Information:");
            pdfDoc.text(`Company Name: Casaluxe`);
            pdfDoc.text(`Address: cassa`);
            pdfDoc.text(`Contact No: +919999999999`);
            pdfDoc.moveDown();

            pdfDoc.text("Orders:");
            pdfDoc.fontSize(10);
            let startY = pdfDoc.y + 15;
            let rowHeight = 20;

            // Headers
            pdfDoc.text("No", 50, startY);
            pdfDoc.text("Order Id", 75, startY);
            pdfDoc.text("Order Date", 200, startY);
            pdfDoc.text("Amount", 270, startY);
            pdfDoc.text("Order Amount", 330, startY);
            pdfDoc.text("Order Status", 400, startY);
            pdfDoc.text("Payment Status", 470, startY);

            // Data
            startY += rowHeight;
            reportData.forEach((orderInfo, index) => {
                pdfDoc.text(`${index + 1}`, 50, startY);
                pdfDoc.text(`${orderInfo.orderId}`, 75, startY);
                pdfDoc.text(`${orderInfo.orderdate.toLocaleDateString()}`, 200, startY);
                pdfDoc.text(`${orderInfo.totalAmount.toFixed(2)}`, 270, startY);
                pdfDoc.text(`${orderInfo.totalAmountAfterDiscount.toFixed(2)}`, 330, startY);
                pdfDoc.text(`${orderInfo.orderStatus}`, 400, startY);
                pdfDoc.text(`${orderInfo.paymentStatus}`, 470, startY);

                startY += rowHeight;
            });

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
            reject(error);
        }
    });
}

module.exports = generatePDFReports;
