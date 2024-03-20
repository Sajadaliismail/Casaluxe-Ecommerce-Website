$(document).ready(function ()  {
  if(window.location.pathname == '/admin/statistics') {
        $.ajax({
            url: '/admin/api/statistics',
      method: 'GET',
      success: function(response) {
          const data = response.data
  
            // Process data as needed
            const totalAmounts = data.map(order => order.totalAmount);
            const totalAmountsAfterDiscount = data.map(order => order.totalAmountAfterDiscount);
            const totalOrders = data.map(order => order.totalOrders);
            const orderIds = data.map(order => new Date(order.date).toLocaleDateString());

            // Render the chart
            renderChart(orderIds, totalAmounts,totalAmountsAfterDiscount,totalOrders);
            renderPieChart(orderIds, totalAmountsAfterDiscount);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
        }
    });

  }
  
  function renderPieChart(labels, values) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'red',
                'blue',
                'green',
                'orange',
                'purple', // Add more colors as needed
                'yellow',
                'cyan',
                'magenta',
                'brown'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
  }
  
  function renderChart(labels, values,values2,values3) {
    try {
        // Get the canvas element
        const ctx = document.getElementById('myChart').getContext('2d');
  
        // Create the chart
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total sales',
                    data: values,
                    tension: 0.3,
                        fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Adjust color if needed
                    borderColor: 'rgba(54, 162, 235, 1)' , // Adjust color if needed
                
                },
                {
                    label: 'Total Amount After Discount',
                    data: values2,
                    tension: 0.3,
                        fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust color if needed
                    borderColor: 'rgba(255, 99, 132, 1)', // Adjust color if needed
                
                },
                {
                    label: 'Total orders',
                    data: values3,

                    tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(4, 209, 130, 0.2)',
                        borderColor: 'rgb(4, 209, 130)',
                }]
            },
            
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
  }

  })
  function monthly () {
    {
     $.ajax({
         url: '/admin/api/statistics/monthly',
   method: 'GET',
   success: function(response) {
       console.log(response);
       const data = response.data
   
         // Process data as needed
         const totalAmounts = data.map(order => order.totalAmount);
         const totalAmountsAfterDiscount = data.map(order => order.totalAmountAfterDiscount);

        const orderIds = data.map(order => {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[order.month - 1];
            const year = order.year;
            return `${monthName} ${year}`;
        });
        
        
         // Render the chart
         renderChartMonthly(orderIds, totalAmounts,totalAmountsAfterDiscount);
         renderPieChartMonthly(orderIds, totalAmountsAfterDiscount);
     },
     error: function(xhr, status, error) {
         console.error('Error fetching data:', error);
     }
   });
   }
   }
  
let myPieChartMonthly;
  function renderPieChartMonthly(labels, values) {
    try {
        const ctx = document.getElementById('pieChartMonthly').getContext('2d');

        // Check if the pie chart instance already exists
        if (!myPieChartMonthly) {
            // If the pie chart instance doesn't exist, create a new chart
            myPieChartMonthly = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            'red',
                'blue',
                'green',
                'orange',
                'purple', // Add more colors as needed
                'yellow',
                'cyan',
                'magenta',
                'brown'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } else {
            // If the pie chart instance already exists, update the data
            myPieChartMonthly.data.labels = labels;
            myPieChartMonthly.data.datasets[0].data = values;
            myPieChartMonthly.data.datasets[0].backgroundColor =  [
                'red',
                'blue',
                'green',
                'orange',
                'purple', // Add more colors as needed
                'yellow',
                'cyan',
                'magenta',
                'brown'
            ];
            myPieChartMonthly.update();
        }
    } catch (error) {
        console.error('Error rendering pie chart:', error);
    }
  }
  let myChartMonthly; 
  function renderChartMonthly(labels, values,values2) {
    try {
        // Get the canvas element
        const ctx = document.getElementById('myChartMonthly').getContext('2d');

        // Check if the chart instance already exists
        if (!myChartMonthly) {
            // If the chart instance doesn't exist, create a new chart
            myChartMonthly = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                            label: 'Total sales',
                            data: values,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total Amount After Discount',
                            data: values2,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            // If the chart instance already exists, update the data
            myChartMonthly.data.labels = labels;
            myChartMonthly.data.datasets[0].data = values;
            myChartMonthly.data.datasets[1].data = values2;
            myChartMonthly.update();
        }
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
  }
  
  function yearly () {
    {
     $.ajax({
         url: '/admin/api/statistics/yearly',
   method: 'GET',
   success: function(response) {
       console.log(response);
       const data = response.data
   
         // Process data as needed
         const totalAmounts = data.map(order => order.totalAmount);
         const totalAmountsAfterDiscount = data.map(order => order.totalAmountAfterDiscount);
         const orderIds = data.map(order => order.year);
         // Render the chart
         renderChartYearly(orderIds, totalAmounts,totalAmountsAfterDiscount);
         renderPieChartYearly(orderIds, totalAmountsAfterDiscount);
     },
     error: function(xhr, status, error) {
         console.error('Error fetching data:', error);
     }
   });
   }
   }
   let myPieChartYearly;
  function renderPieChartYearly(labels, values) {
    try {
        const ctx = document.getElementById('pieChartYearly').getContext('2d');

        // Check if the pie chart instance already exists
        if (!myPieChartYearly) {
            // If the pie chart instance doesn't exist, create a new chart
            myPieChartYearly = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            'red',
                            'blue',
                            'green',
                            'orange',
                            'purple', // Add more colors as needed
                            'yellow',
                            'cyan',
                            'magenta',
                            'brown'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } else {
            // If the pie chart instance already exists, update the data
            myPieChartYearly.data.labels = labels;
            myPieChartYearly.data.datasets[0].data = values;
            myPieChartYearly.update();
        }
    } catch (error) {
        console.error('Error rendering pie chart:', error);
    }
  }
  let myChartYearly; 
  function renderChartYearly(labels, values,values2) {
    try {
        const ctx = document.getElementById('myChartYearly').getContext('2d');

        // Check if the chart instance already exists
        if (!myChartYearly) {
            // If the chart instance doesn't exist, create a new chart
            myChartYearly = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                            label: 'Total sales',
                            data: values,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total Amount After Discount',
                            data: values2,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            // If the chart instance already exists, update the data
            myChartYearly.data.labels = labels;
            myChartYearly.data.datasets[0].data = values;
            myChartYearly.data.datasets[1].data = values2;
            myChartYearly.update();
        }
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
  }
  function daily(){
    $.ajax({
        url: '/admin/api/statistics',
  method: 'GET',
  success: function(response) {
      const data = response.data

        // Process data as needed
        const totalAmounts = data.map(order => order.totalAmount);
        const totalAmountsAfterDiscount = data.map(order => order.totalAmountAfterDiscount);
        const totalOrders = data.map(order => order.totalOrders);
        const orderIds = data.map(order => new Date(order.date).toLocaleDateString());
        
        renderChartCustom(orderIds, totalAmounts,totalAmountsAfterDiscount);
        renderPieChartCustom(orderIds, totalAmountsAfterDiscount);
    },
    error: function(xhr, status, error) {
        console.error('Error fetching data:', error);
    }
})
  }

  
  function custom () {
    {
        const startDate = document.getElementById('startDateChart').value;
        const endDate = document.getElementById('endDateChart').value;
      

     $.ajax({
         url: `/admin/api/statistics/custom?startDate=${startDate}&endDate=${endDate}`,
   method: 'GET',
   success: function(response) {
       console.log(response);
       const data = response.data
       console.log(data);
   if(data.length==0){
    Toast.fire({
        icon: "info",
        title: "Sorry, no data.",
      });
   }
         // Process data as needed
         const totalAmounts = data.map(order => order.totalAmount);
         const totalAmountsAfterDiscount = data.map(order => order.totalAmountAfterDiscount);
         const orderIds = data.map(order => new Date(order.date).toLocaleDateString());

        
        
        
         // Render the chart
         renderChartCustom(orderIds, totalAmounts,totalAmountsAfterDiscount);
         renderPieChartCustom(orderIds, totalAmountsAfterDiscount);
     },
     error: function(xhr, status, error) {
         console.error('Error fetching data:', error);
     }
   });
   }
   }
  
  
   let myPieChartCustom;
  function renderPieChartCustom(labels, values) {
    try {
        const ctx = document.getElementById('pieChartCustom').getContext('2d');

        // Check if the custom pie chart instance already exists
        if (!myPieChartCustom) {
            // If the chart instance doesn't exist, create a new chart
            myPieChartCustom = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            'red',
                            'blue',
                            'green',
                            'orange',
                            'purple', // Add more colors as needed
                            'yellow',
                            'cyan',
                            'magenta',
                            'brown'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } else {
            // If the chart instance already exists, update the data
            myPieChartCustom.data.labels = labels;
            myPieChartCustom.data.datasets[0].data = values;
            myPieChartCustom.update();
        }
    } catch (error) {
        console.error('Error rendering custom pie chart:', error);
    }
  }
  let myChartCustom;
  function renderChartCustom(labels, values,values2) {
    try {
        const ctx = document.getElementById('myChartCustom').getContext('2d');

        // Check if the chart instance already exists
        if (!myChartCustom) {
            // If the chart instance doesn't exist, create a new chart
            myChartCustom = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                            label: 'Total sales',
                            data: values,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Total Amount After Discount',
                            data: values2,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            // If the chart instance already exists, update the data
            myChartCustom.data.labels = labels;
            myChartCustom.data.datasets[0].data = values;
            myChartCustom.data.datasets[1].data = values2;
            myChartCustom.update();
        }
    } catch (error) {
        console.error('Error rendering custom chart:', error);
    }
  }