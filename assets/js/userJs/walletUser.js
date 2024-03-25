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
    checkbox.checked = false
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


  function addMoney() {
   
    let amountInput = document.getElementById('amount');
    let amount = Number(amountInput.value) ;
console.log(amount);
    if (amount < 50) {
      Toast.fire({
        icon: "info",
        title: `Minimum 50.00 shold be added`,
      });
      return;
    }
else{
    $.ajax({
      url: '/addmoneytowallet', 
      method: 'POST',
      data: { amount: amount },
      success: function(response) {
        console.log(response);

        const transaction = response.Transaction
      const order = response.message;
      const user = response.user;

      var options = {
        key: "rzp_test_N10HdSb3UEKLbM",
        amount: order.amount,
        currency: "INR",
        name: "Casaluxe",
        description: "Test Transaction",
        image: "/imgs/images/logo.png",
        order_id: order.id,
        handler: function (response) {
          console.log(response);
          $.ajax({
            url: "/wallet/success",
            method: "POST",
            data: {
              transaction : transaction._id,
              amount : transaction.amount,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            },
            success: function (data) {
       console.log(data)

              if (data.success) {
                Toast.fire({
                  icon: "success",
                  title: "payment success,Money added to wallet",
                }).then(()=>{
                  window.location.href = `/myaccount`;
                })  
              }
            },
            error: function (xhr, status, error) {
              console.error(error);
            },
          });
        },
        modal: {
          ondismiss: function(){

                  Toast.fire({
                    icon: "info",
                    title: "Payment cancelled",
                  });
                }
               
      },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        Toast.fire({
          icon: "info",
          title: "Payment failed",
        });
     
      });
      rzp1.open();
    
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

    
    console.log("Payment made!");
  }
   
  
  }
