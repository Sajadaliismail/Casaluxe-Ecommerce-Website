const Order = require('../../models/orderSchema');
const generatePDFReports = require('../../services/pdfReportGenerator');
const generateExcelReports = require('../../services/excelReportGenerator');


// app.get('/api/download-pdf', 
const generatePDFReport = async (req, res) => {
console.log(req.query);
    try {

      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : new Date('2023-01-01'); 
      const end = endDate ? new Date(endDate) : new Date(); 
      end.setHours(23, 59, 59, 999);
      console.log(start,end);
      const reportData = await Order.aggregate([
        {
          $match: {
            orderdate: { $gte: start, $lte: end } ,
          }
        }
      ]);
    
      const { filename, pdfBuffer } = await generatePDFReports(reportData, start, end);
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        res.send(pdfBuffer);

} catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
}
}


const generateExcelReport = async (req, res) => {
  
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : new Date('2023-01-01'); 
      const end = endDate ? new Date(endDate) : new Date(); 
      end.setHours(23, 59, 59, 999);
      const reportData = await Order.aggregate([
        {
          $match: {
            orderdate: { $gte: start, $lte: end } 
          }
        }
      ]);

      const excelBuffer = await generateExcelReports(reportData);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.xlsx"');
      res.send(excelBuffer);
    } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
 



module.exports = { generatePDFReport, generateExcelReport };
