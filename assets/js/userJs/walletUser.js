function updateWallet() {
  let checkbox = document.getElementById("useWallet");
  let isChecked = checkbox.checked;
  const orderId = document.getElementById('order_id').value
  if (isChecked) {
      deductMoneyFromWallet(orderId);
  } else {
    returnMoneyToWallet(orderId);
  }
}

function deductMoneyFromWallet(val) {
  let checkbox = document.getElementById("useWallet");

  const orderId = val
 $.ajax({
  url:'/useWalletCash',
  method: 'POST',
  data : {orderId : orderId},
  success: function(response){
    console.log(response);
    if(response.success){

    Toast.fire({
      icon: "success",
      title: `${response.message}`,
    });
  }
  else if(response.failed){
      Toast.fire({
        icon: "info",
        title: `${response.message}`,
      });
    }

  },
  error : function (error){
    Toast.fire({
      icon: "info",
      title: `${error.message}`,
    });
  }
 })
  
}

function returnMoneyToWallet(orderId) {
  console.log('off');
  $.ajax({
    url: '/returnWalletCash', 
    method: 'POST',
    data: { orderId: orderId },
    success: function(response) {
      Toast.fire({
        icon: "success",
        title: `${response.message}`,
      });
     
    },
    error: function(error) {
      Toast.fire({
        icon: "info",
        title: `${error.message}`,
      });
    }
  });
}

