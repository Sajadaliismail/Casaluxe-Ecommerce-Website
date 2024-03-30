const ExcelJS = require('exceljs');

/**
 * Generate an Excel spreadsheet containing sales report data.
 * @param {Array} reportData - Array of objects containing sales report data.
 * @returns {Promise<Buffer>} A promise that resolves with the generated Excel buffer.
 */
async function generateExcelReports(reportData) {
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    // Add a worksheet named 'Sales Report'
    const worksheet = workbook.addWorksheet('Sales Report');

    // Define columns for the worksheet
    worksheet.columns = [
        { 
            header: 'Order Date', 
            key: 'orderDate', 
            width: 15,
            outlineLevel: 1,
            type: 'date',
            style: { numFmt: 'dd/mm/yyyy' }
        },
        { header: 'Order ID', key: 'orderId', width: 15 },
        { header: 'Total Amount', key: 'totalAmount', width: 15 },
        { header: 'Discounted Amount', key: 'totalAmountAfterDiscount', width: 15 }
    ];

    reportData.forEach(order => {
        worksheet.addRow({
            orderDate: order.orderdate,
            orderId: order.orderId,
            totalAmount: order.totalAmount,
            totalAmountAfterDiscount: order.totalAmountAfterDiscount
        });
    });

    // Write the workbook to a buffer in xlsx format
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

module.exports = generateExcelReports;
