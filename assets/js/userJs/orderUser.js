

function useCode(code,index) {
  const id = document.getElementById('order_id').value
  const removeBtn = document.getElementById(`removeBtn${index}`)
  const applyBtn = document.getElementById(`applyBtn${index}`)
  const buttons = document.querySelectorAll('.copy-btn');
const paymentOptions = document.querySelectorAll('.single-payment')

axios
  .post("/api/applycoupon", { couponId: code, orderId : id })
  .then((response) => {
    
    if(response.data.success){
removeBtn.hidden = false
applyBtn.textContent = 'Applied'
buttons.forEach(button => {

  button.disabled = true;
 
});
console.log(response.data.order);
let orderItems = response.data.order;
document.getElementById('TotalAmountAfterDiscount').textContent = response.data.order.totalAmountAfterDiscount.toFixed(2)
        $('#orderItems').empty();
if(orderItems.totalAmountAfterDiscount == 0){
  paymentOptions.forEach(payment=>{
    payment.style.display = 'none'
  })
}
        orderItems.items.forEach((item) =>{
          let itemHtml = `<tr class="product-row">
          <td class="Product-name" colspan="2">
              <p class="m-0">
                  <input type="text" hidden value="" name="">
                  <strong>${item.product.name} × ${item.count}</strong>
              </p>
          </td>
      </tr>
      <tr class="product-row">
          <td class="Product-price" colspan="2">
              <p class="d-flex justify-content-between my-0 ms-5 ps-5">
              <span>Product Price:</span><span> ${(item.productPrice * item.count).toFixed(2)}<span></p>`;
      if (item.offerPriceReduction > 0) {
          itemHtml += `<p class="d-flex justify-content-between my-0 ms-5 ps-5"><span>Product Discount:</span><span> ${(item.offerPriceReduction * item.count).toFixed(2)}</span></p>`;
      }
      if (item.couponDiscountReduction > 0) {
      itemHtml += `<p class="d-flex justify-content-between my-0 ms-5 ps-5"><span>Coupon Discount:</span><span> ${(item.couponDiscountReduction * item.count).toFixed(2)}</span></p>`;
    }
    if (item.priceAfterDiscounts < item.productPrice) {

    itemHtml += `    <p class="d-flex justify-content-between my-0 ms-5 ps-5"><span>Discounted Price:</span><span> ${(item.priceAfterDiscounts * item.count).toFixed(2)}</span></p>
          </td>`;
        }
        itemHtml += ` 
      </tr>`;
      
      $('#orderItems').append(itemHtml);
      

    })
  }
  else if(response.data.success === false){
    Toast.fire({
      icon: "info",
      title: "One coupon is already applied",
    });
  }
  else if(response.data.expired){
    Toast.fire({
      icon: "info",
      title: "coupon is expired",
    });
  }
  })
  .catch((error) => {
   
  });
 
}

function removeCoupon(code,index) {
  const id = document.getElementById('order_id').value
  const removeBtn = document.getElementById(`removeBtn${index}`)
  const applyBtn = document.getElementById(`applyBtn${index}`)
  const buttons = document.querySelectorAll('.copy-btn');
const paymentOptions = document.querySelectorAll('.single-payment')
paymentOptions.forEach(payment=>{
  payment.style.display = 'block'
})
axios
  .post("/api/removecoupon", { couponId: code, orderId : id })
  .then((response) => {
    if(response.data.success){
      removeBtn.hidden = true
      applyBtn.textContent = 'Apply Coupon'
      buttons.forEach(button => {
        button.disabled = false;
      });
      console.log(response.data.order);
let orderItems = response.data.order;
document.getElementById('TotalAmountAfterDiscount').textContent = response.data.order.totalAmountAfterDiscount.toFixed(2)

        $('#orderItems').empty();

        orderItems.items.forEach((item) =>{
          let itemHtml = `<tr class="product-row">
          <td class="Product-name" colspan="2">
              <p class="m-0">
                  <input type="text" hidden value="" name="">
                  <strong>${item.product.name} × ${item.count}</strong>
              </p>
          </td>
      </tr>
      <tr class="product-row">
          <td class="Product-price" colspan="2">
              <p class="d-flex justify-content-between my-0 ms-5 ps-5"><span>Product Price:</span><span> ${(item.productPrice * item.count).toFixed(2)}</span></p>`;
      if (item.offerPriceReduction > 0) {
          itemHtml += `<p class="d-flex justify-content-between my-0 ms-5 ps-5"><span>Product Discount:</span><span> ${(item.offerPriceReduction * item.count).toFixed(2)}</span></p>`;
      }
      if (item.couponDiscountReduction > 0) {
      itemHtml += `<p class="d-flex justify-content-between my-0 ms-5 ps-5"><span>Coupon Discount:</span><span> ${(item.couponDiscountReduction * item.count).toFixed(2)}</span></p>`;
    }
    if (item.priceAfterDiscounts < item.productPrice) {
    itemHtml += `    <p class="d-flex justify-content-between my-0 ms-5 ps-5"><span>Discounted Price:</span><span> ${(item.priceAfterDiscounts * item.count).toFixed(2)}</span></p>
          </td>`;
    }
    itemHtml += ` 
      </tr>`;
      
      $('#orderItems').append(itemHtml);
      

    })
  }
  })
          
   
  
  .catch((error) => {
   
  });
 
}

$(document).ready(function () {
  $("#placeOrder").submit(function (event) {
    event.preventDefault();
    const formData = $(this).serialize();

    console.log(formData);
    $.ajax({
      url: "/placeorder",
      method: "POST",
      data: formData,
      success: function (response) {
        console.log(response);
        if (response.addressNotFilled) {
          Toast.fire({
            icon: "info",
            title: `${response.message} `,
          });
        } else if (response.Address) {
          Toast.fire({
            icon: "info",
            title: `${response.message} `,
          });
        } else if (response.placed) {
          window.location.href = `/ordersuccess?orderid=${response.message}`;
        }
        else if (response.alreadyConfirmed){
          Toast.fire({
            icon: "info",
            title: `${response.message} `,
          });
        }
        else if(response.codnotallowed){
          Toast.fire({
            icon: "info",
            title: `${response.message} `,
          });
        } else if (response.razorpay) {
          const order = response.message;
          const user = response.user;
          const orderId = response.orderId;

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
           
              // alert(response.razorpay_payment_id);
              // alert(response.razorpay_order_id);
              // alert(response.razorpay_signature)
              $.ajax({
                url: "/payment/success",
                method: "POST",
                data: {
                  orderId: orderId,
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                },
                success: function (data) {
                  if (data.success) {
                    Toast.fire({
                      icon: "Success",
                      title: "Payment success",
                    }).then(()=>{
                      window.location.href = `/ordersuccess?orderid=${data.message}`;

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
                $.ajax({
                  url: "/paymentfailure",
                  method: "POST",
                  data: {
                    payment : 'failed',
                    orderId: orderId,
                confirmed : false

                  },
                  success: function (data) {
                  
                    if (data.success) {

                      Toast.fire({
                        icon: "info",
                        title: "Payment cancelled",
                      });
                    }
                  },
                  error: function (xhr, status, error) {
                    console.error(error);
                  },
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
           console.log(response)
           

            alert(response.error.code);
            alert(response.error.description);
            
            $.ajax({
              url: "/paymentfailure",
              method: "POST",
              data: {
                payment : 'failed',
                orderId: orderId,
                confirmed : true
              },
              success: function (data) {
                console.log(data);
                if (data.success) {
                  
                  Toast.fire({
                    icon: "info",
                    title: "payment failed",
                  });
                  window.location.href = `/ordersuccess?orderid=${data.order.orderId}`;
                }
              },
              error: function (xhr, status, error) {
                console.error(error);
              },
            });
          });
          rzp1.open();
          console.log(response);
        }
      },
      error: function (xhr, status, error) {
        Toast.fire({
          icon: "error",
          title: `Sorry, some error occured`,
        });

        console.log(error);
      },
    });
  });
});


function toggleSubTable(index) {
  const subTable = document.getElementById(`subTable${index}`);
  subTable.classList.toggle("d-none");
  if (!subTable.classList.contains("d-none")) {
    subTable.classList.add("d-block");
  } else {
    subTable.classList.remove("d-block");
  }
}

function cancelorder(params,index) {

  const order_id = params;
  const button = document.getElementById(`cancel${index}`)

  $.ajax({
    url: "/cancelorder",
    method: "POST",
    data: {
      orderId: order_id,
    },
    success: function (response) {
      if(response.success){
        Toast.fire({
          icon: "success",
          title: `Order canceled`,
        });
button.disabled = true
button.textContent = 'Order Canceled'
      }
    },
    error: function (error) {
      // handle error
    },
  });
}


function returnOrder(params,index){
  const orderId = params
  const button = document.getElementById(`returnBtn${index}`)
  $.ajax({
    url: "/returnorder",
    method: "POST",
    data: {
      orderId: orderId,
    },
    success: function (response) {
      if(response.success){
        Toast.fire({
          icon: "success",
          title: `Your refund will proceed once the item is picked up`,
        });
button.disabled = true
button.textContent = 'Processing'
      }
      console.log(response);
      
    },
    error: function (error) {
      // handle error
    },
  });

}

function backToCart(params){
  const orderId = params

  $.ajax({
    url: '/movetocart',
    method: 'POST',
    data: {orderId:orderId},
    success: function(response){
      if(response.paymentInProgress){
        Toast.fire({
          icon: "info",
          title: `${response.message}`,
        });
      }
if(response.success){
  window.location.href = '/cart'
}
    },
    error : function (error){

    }
  })
}

function makePayment(params){
const order_id = params
console.log(order_id);
  $.ajax({
    url: "/retrypayment",
    method: "POST",
    data : {order_id},
    success: function (response){
      console.log(response)

      const order = response.message;
          const user = response.user;
          const orderId = response.orderId;

      var options = {
        key: "rzp_test_N10HdSb3UEKLbM",
        amount: order.amount,
        currency: "INR",
        name: "Casaluxe",
        description: "Test Transaction",
        image: "/imgs/images/logo.png",
        order_id: order.id,
        handler: function (response) {
          $.ajax({
            url: "/payment/success",
            method: "POST",
            data: {
              orderId: orderId,
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            },
            success: function (data) {
       console.log(data)

              if (data.success) {
                // window.location.href = `/ordersuccess?orderid=${data.message}`;
                Toast.fire({
                  icon: "Success",
                  title: "payment success",
                });
              }
            },
            error: function (xhr, status, error) {
              console.error(error);
            },
          });
        },
        modal: {
          ondismiss: function(){
            $.ajax({
              url: "/paymentfailure",
              method: "POST",
              data: {
                payment : 'failed',
                orderId: orderId,
            confirmed : false
    
              },
              success: function (data) {
              
                if (data.success) {
    
                  Toast.fire({
                    icon: "info",
                    title: "payment cancelled",
                  });
                }
              },
              error: function (xhr, status, error) {
                console.error(error);
              },
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
       console.log(response)
       
    
        alert(response.error.code);
        alert(response.error.description);
        
        $.ajax({
          url: "/paymentfailure",
          method: "POST",
          data: {
            payment : 'failed',
            orderId: orderId,
            confirmed : true
          },
          success: function (data) {
            console.log(data);
            if (data.success) {
              
              Toast.fire({
                icon: "info",
                title: "payment failed",
              });
              // window.location.href = `/ordersuccess?orderid=${data.order.orderId}`;
            }
          },
          error: function (xhr, status, error) {
            console.error(error);
          },
        });
      });
      rzp1.open();
    },
    error: function(error){

    }
  })


}