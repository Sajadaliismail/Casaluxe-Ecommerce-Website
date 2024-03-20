

async function pdfReport(){
  startDate = document.getElementById('startDate').value
  endDate = document.getElementById('endDate').value

  console.log(startDate,endDate);
  try {
    const response = await fetch(`/admin/api/reports/pdf?startDate=${startDate}&endDate=${endDate}`);
    if (response.ok) {
      // If successful response, download the generated PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sales-report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error("Failed to generate PDF report:", response.statusText);
    }
  } catch (error) {
    console.error("Error generating PDF report:", error);
  }
}

async function excelReport() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  console.log(startDate, endDate);
  
  try {
    const response = await fetch(`/admin/api/reports/excel?startDate=${startDate}&endDate=${endDate}`);
    if (response.ok) {
      // If successful response, download the generated Excel file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sales-report.xlsx"; // Adjust the file name if needed
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error("Failed to generate Excel report:", response.statusText);
    }
  } catch (error) {
    console.error("Error generating Excel report:", error);
  }
}
