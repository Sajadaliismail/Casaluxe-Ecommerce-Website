

const PDFDocument = require('pdfkit');


async function generateInvoice(orderData) {
  return new Promise((resolve, reject) => {
      try {

        function generateInvoiceNumber() {
          const currentDate = orderData.orderdate;
          const year = currentDate.getFullYear();
          const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); 
          const day = ('0' + currentDate.getDate()).slice(-2); 
          const uniqueNumber = Math.floor(Math.random() * 10000); 
      
 
          const invoiceNumber = `INV-${year}${month}${day}-${uniqueNumber}`;
          return invoiceNumber;
      }
let companyLogo = "./assets/images/logo.png";
let fileName = `${orderData.orderId}.pdf`;
let fontNormal = 'Helvetica';
let fontBold = 'Helvetica-Bold';
const options = {
  hour12: true,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Asia/Kolkata',
  timeZoneName: 'short'
};
let date = new Date()

let sellerInfo = {
"companyName": "Casaluxe",
"address": "Mumbai Central",
"city": "Mumbai",
"state": "Maharashtra",
"pincode": "400017",
"country": "India",
"contactNo": "+910000000600"
}





let pdfDoc = new PDFDocument();

pdfDoc.image(companyLogo, 10, 20, { width: 100, height: 50 });
pdfDoc.font(fontBold).text('CASALUXE', 7, 75);
pdfDoc.font(fontNormal).fontSize(14).text('Order Invoice/Bill Receipt', 400, 30, { width: 200 });
pdfDoc.fontSize(10).text(date.toLocaleDateString(), 400, 46, { width: 200 });

pdfDoc.font(fontBold).text("Sold by:", 7, 100);
pdfDoc.font(fontNormal).text(sellerInfo.companyName, 7, 115, { width: 250 });
pdfDoc.text(sellerInfo.address, 7, 130, { width: 250 });
pdfDoc.text(sellerInfo.city + " " + sellerInfo.pincode, 7, 145, { width: 250 });
pdfDoc.text(sellerInfo.state + " " + sellerInfo.country, 7, 160, { width: 250 });

pdfDoc.font(fontBold).text("Customer details:", 400, 100);
pdfDoc.font(fontNormal).text(orderData.address.name, 400, 115, { width: 250 });
pdfDoc.text(orderData.address.street, 400, 130, { width: 250 });
pdfDoc.text(orderData.address.landmark + " " + orderData.address.postalCode, 400, 145, { width: 250 });
pdfDoc.text(orderData.address.district + " " + orderData.address.state, 400, 160, { width: 250 });

pdfDoc.text("Order No:" + orderData.orderId, 7, 195, { width: 250 });
pdfDoc.text("Invoice No:" + generateInvoiceNumber(), 7, 210, { width: 250 });
pdfDoc.text("Date:" + orderData.orderdate.toLocaleDateString() + " " + orderData.orderdate.toLocaleTimeString('en-IN', options), 7, 225, { width: 250 });

pdfDoc.rect(7, 250, 560, 20).fill("#427BFC").stroke("#427BFC");
pdfDoc.fillColor("#fff").text("ID", 20, 256, { width: 90 });
pdfDoc.text("Product", 110, 256, { width: 190 });
pdfDoc.text("Qty", 300, 256, { width: 100 });
pdfDoc.text("Price", 350, 256, { width: 100 });
pdfDoc.text("Discounts", 420, 256, { width: 100 });
pdfDoc.text("Total Price", 500, 256, { width: 100 });

let productNo = 1;
orderData.items.forEach(product => {
console.log("adding", product.product.name);
let y = 256 + (productNo * 20);
pdfDoc.fillColor("#000").text(product.product.sku.toUpperCase(), 20, y, { width: 90 });
pdfDoc.text(product.product.name, 110, y, { width: 190 });
pdfDoc.text(product.count, 300, y, { width: 100 });
pdfDoc.text(product.productPrice.toFixed(2), 350, y, { width: 100 });
pdfDoc.text((product.offerPriceReduction+product.couponDiscountReduction).toFixed(2), 420, y, { width: 100 });
pdfDoc.text((product.priceAfterDiscounts*product.count).toFixed(2), 500, y, { width: 100 });
productNo++;
});

pdfDoc.rect(7, 256 + (productNo * 20), 560, 0.2).fillColor("#000").stroke("#000");
productNo++;

pdfDoc.font(fontNormal).text("Total:", 400, 256 + (productNo * 17));
pdfDoc.font(fontNormal).text(orderData.totalAmount.toFixed(2), 500, 256 + (productNo * 17));
pdfDoc.font(fontNormal).text("Discounts:", 400, 271 + (productNo * 17));
pdfDoc.font(fontNormal).text((orderData.totalAmount-orderData.totalAmountAfterDiscount).toFixed(2), 500, 271 + (productNo * 17));
pdfDoc.lineWidth(1);
pdfDoc.moveTo(390, 281 + (productNo * 17)).lineTo(550, 281 + (productNo * 17)) .stroke();
pdfDoc.font(fontBold).text("Grand total:", 400, 286 + (productNo * 17));
pdfDoc.font(fontBold).text(orderData.totalAmountAfterDiscount.toFixed(2), 500, 286 + (productNo * 17));

const chunks = [];
            pdfDoc.on('data', (chunk) => {
                chunks.push(chunk);
            });
            pdfDoc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve({ fileName, pdfBuffer });
            });

pdfDoc.end();
console.log("pdf generate successfully");


} catch (error) {
  reject(error);
}
});
}

module.exports = generateInvoice;