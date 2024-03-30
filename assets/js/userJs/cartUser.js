

function getcartdata() {
  document.getElementById("cartIconUl").innerHTML = "";
  document.getElementById("subtotal").innerHTML = "";
  document.getElementById("totalprice").innerHTML = "";
  document.getElementById("cartPriceDiv").style.display = "none";
  document.getElementById("cartTotal").style.display = "none";
  document.getElementById("checkoutButton").style.display = "none";
  document.getElementById("noItemsDiv").style.display = "block";
  document.getElementById("cartItemNumber").innerHTML = "0";

  $.ajax({
    type: "GET",
    url: "/cartdetails",
    success: function (response) {
      console.log("done");
      console.log(response);
      let cart = response.cart;
      let totalPriceAfterReduction = response.totalPriceAfterReduction
      let discounts = response.discounts
      let totalPrice = response.totalPrice;
      let product = cart.products;
      if (cart.products.length > 0) {
        document.getElementById("noItemsDiv").style.display = "none";
        document.getElementById("cartPriceDiv").style.display = "block";
        document.getElementById("cartTotal").style.display = "block";
        document.getElementById("checkoutButton").style.display = "block";
        document.getElementById("cartItemNumber").innerHTML =
          cart.products.length;
      }
      let cartItemsHTML = "";

for (let i = 0; i < product.length; i++) {
    const prod = product[i].product;

    cartItemsHTML += `
        <li>
            <div class="single-cart-item">
                <div class="cart-thumb">
                    <img src="../imgs/uploads/${prod.image[0]}" width="98" height="98" alt="Cart">
                    <span class="product-quantity">${product[i].count}</span>
                </div>
                <div class="cart-item-content">
                    <h6 class="product-name"><a href="/product/${prod._id}">${prod.name}</a></h6>
                    <span class="product-price">₹${prod.price.toFixed(2)}</span>
                    <div class="attributes-content">
                        <span>${prod.details}</span>`;
                        if(product[i].priceAfterDiscounts<prod.price){
                          cartItemsHTML +=
                        `<span class="d-flex flex-row justify-content-end my-1"><strike> ₹${prod.price.toFixed(2)} × ${product[i].count} </strike></span>`;
                        }
                        else{
                          cartItemsHTML +=
                        `<span class="d-flex flex-row justify-content-end my-1">₹${prod.price.toFixed(2)} × ${product[i].count}</span>`;
                        }
if(product[i].priceAfterDiscounts<prod.price){
  cartItemsHTML += `    <span class="d-flex flex-row justify-content-end my-1">₹${product[i].priceAfterDiscounts.toFixed(2)} × ${product[i].count}</span>`;
}
cartItemsHTML +=             `</div>
                    <a class="cart-remove" id="remove${prod._id}" onclick="removeCartItem('${prod._id}',event)">
                        <span>\uD83D\uDDD9</span>
                    </a>
                </div>  
            </div>
        </li>`;
}

document.getElementById("cartIconUl").innerHTML += cartItemsHTML;

      // for (let i = 0; i < product.length; i++) {
      //   const prod = product[i].product;

      //   const li = document.createElement("li");

      //   const singleCartItemDiv = document.createElement("div");
      //   singleCartItemDiv.classList.add("single-cart-item");

      //   const cartThumbDiv = document.createElement("div");
      //   cartThumbDiv.classList.add("cart-thumb");

      //   const img = document.createElement("img");
      //   img.setAttribute("src", "../imgs/uploads/" + prod.image[0]);
      //   img.setAttribute("width", "98");
      //   img.setAttribute("height", "98");
      //   img.setAttribute("alt", "Cart");

      //   const productQuantitySpan = document.createElement("span");
      //   productQuantitySpan.classList.add("product-quantity");
      //   productQuantitySpan.textContent = product[i].count;

      //   cartThumbDiv.appendChild(img);
      //   cartThumbDiv.appendChild(productQuantitySpan);

      //   const cartItemContentDiv = document.createElement("div");
      //   cartItemContentDiv.classList.add("cart-item-content");

      //   const productnameH6 = document.createElement("h6");
      //   productnameH6.classList.add("product-name");

      //   const productnameLink = document.createElement("a");
      //   productnameLink.setAttribute("href", "/product/" + prod._id);
      //   productnameLink.textContent = prod.name;

      //   productnameH6.appendChild(productnameLink);

      //   const productPriceSpan = document.createElement("span");
      //   productPriceSpan.classList.add("product-price");
      //   productPriceSpan.textContent = "₹" + prod.price.toFixed(2);

      //   const attributesContentDiv = document.createElement("div");
      //   attributesContentDiv.classList.add("attributes-content");

      //   const details = document.createElement("span");
      //   details.innerHTML = prod.details;

      //   const detail = document.createElement("span");
      //   detail.classList.add(
      //     "d-flex",
      //     "flex-row",
      //     "justify-content-end",
      //     "my-1"
      //   );
      //   detail.innerHTML =
      //     "₹" + prod.price.toFixed(2) + " × " + product[i].count;

      //   attributesContentDiv.appendChild(details);
      //   attributesContentDiv.appendChild(detail);

      //   const cartRemoveA = document.createElement("a");
      //   cartRemoveA.classList.add("cart-remove");
      //   cartRemoveA.id = `remove${prod._id}`;
      //   cartRemoveA.setAttribute(
      //     "onclick",
      //     `removeCartItem('${prod._id}',event)`
      //   );

      //   const cartRemoveIconI = document.createElement("span");
      //   cartRemoveIconI.innerHTML = "\uD83D\uDDD9";

      //   cartRemoveA.appendChild(cartRemoveIconI);

      //   cartItemContentDiv.appendChild(productnameH6);
      //   cartItemContentDiv.appendChild(productPriceSpan);
      //   cartItemContentDiv.appendChild(attributesContentDiv);
      //   cartItemContentDiv.appendChild(cartRemoveA);

      //   singleCartItemDiv.appendChild(cartThumbDiv);
      //   singleCartItemDiv.appendChild(cartItemContentDiv);

      //   li.appendChild(singleCartItemDiv);

      //   document.getElementById("cartIconUl").appendChild(li);
      // }
      document.getElementById("subtotal").textContent = totalPrice.toFixed(2);
      document.getElementById("discountsTotal").textContent = discounts.toFixed(2);
      document.getElementById("totalprice").textContent = totalPriceAfterReduction.toFixed(2);
    },
    error: function () {
      console.log("error");
    },
  });
}

//clear cart
function clearCart() {
  $.ajax({
    url: "clearcart",
    method: "POST",
    success: function (data) {
      Toast.fire({
        icon: "success",
        title: "Cart cleared",
      });
    },
    error: function (data) {
 
    },
  });
}

//movetocart

function moveToCart(id, i, itemId) {
  try {
    const productid = id;
    const counts = document.getElementById(`countInput${i}`).value;

    $.ajax({
      type: "POST",
      url: "/addtocart",
      data: { product: productid, count: counts },
      success: function (response) {
        console.log("done", response);
        if (response.message) {
          Toast.fire({
            icon: "error",
            title: "Atleast one item should be added",
          });
        } else if (response.limit) {
          Toast.fire({
            icon: "info",
            title: "Sorry, you can buy only three items.",
          });
        } else if (response.stockout) {
          Toast.fire({
            icon: "info",
            title: "Sorry! Item out of stock",
          });
        } else if (response.success) {
          Toast.fire({
            icon: "success",
            title: "Added to cart",
          });
          removeFromWishlist(itemId, event);
          getcartdata();
        } else {
          Toast.fire({
            icon: "error",
            title: "Some error occured",
          });
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  } catch (error) {
    console.log(error);
  }
}

//add to cart
function addtocart(id) {
  try {
    const productid = id;
    const counts = document.getElementById(`count${productid}`).value;

    $.ajax({ 
      type: "POST",
      url: "/addtocart",
      data: { product: productid, count: counts },
      success: function (response) {
        console.log("done", response);
        if (response.message) {
          Toast.fire({
            icon: "info",
            title: "Sorry, add atleast one item.",
          });
        } else if (response.limit) {
          Toast.fire({
            icon: "info",
            title: "Sorry, you can buy only three items.",
          });
        } else if (response.stockout) {
          Toast.fire({
            icon: "info",
            title: "Sorry! Item out of stock",
          });
        } else if (response.success) {
          Toast.fire({
            icon: "success",
            title: "Added to cart",
          });
          getcartdata();
        } else {
          Toast.fire({
            icon: "info",
            title: "Please login to continue",
          }).then(()=>{
            window.location.href = '/login'
          })
        }
      },
      error: function (error) {
        console.log(error);
        document.getElementById("errornumber").innerHTML =
          "Value should be atleast one";
      },
    });
  } catch (error) {
    console.log(error);
  }

}

//remove from cart
function removeCartItem(itemId, event) {
  event.preventDefault();

  const item = itemId;
  console.log(item);
  $.ajax({
    type: "PATCH",
    url: "/removeitem",
    data: { itemId: item },
    success: function (response) {
      console.log(response);
      getcartdata();

      location.reload();
    },
  });
  console.log("ethy");
}

function removeFromWishlist(itemId, event) {
  event.preventDefault();

  const item = itemId;
  console.log(item);
  $.ajax({
    type: "PATCH",
    url: "/removeitemwishlist",
    data: { itemId: item },
    success: function (response) {
      console.log(response, "fhh");

      location.reload();
    },
  });
}

// changeTotal
$(document).ready(function() {
  if (window.location.pathname === '/cart') {
      $(".add").off().on("click", function () {
          let input = $(this).prev();
          let currentValue = parseInt(input.val(), 10);
          if (!isNaN(currentValue)) {
              let newValue = currentValue + 1;
              input.val(newValue);
              changeTotal($(this).data('index'), newValue);
          }
      });

      $(".sub").off().on("click", function () {
          let input = $(this).next();
          let currentValue = parseInt(input.val(), 10);
          if (!isNaN(currentValue) && currentValue > 1) {
              let newValue = currentValue - 1;
              input.val(newValue);
              changeTotal($(this).data('index'), newValue);
          }
      });
  }
});


function changeTotal(params, value) {
  const index = params;
  const val = value;
  const itemprice = document.getElementById(`itemPrice${index}`);
  const Totalprice = document.getElementById(`Totalprice${index}`);
  const subTotalprice = document.getElementById("subTotalprice");
  const TotalpricesAll = document.getElementById(`priceTotal`);
  const currencyValueString = Totalprice.textContent.trim();
  const currencyValueNumber = parseFloat(
    currencyValueString.replace(/[^\d.]/g, "")
  );

  if (Number(itemprice.getAttribute("data-id")) * val > 0) {
    subTotalprice.value =
      Number(subTotalprice.value) -
      currencyValueNumber +
      Number(itemprice.getAttribute("data-id")) * val;
    Totalprice.innerHTML =
      "₹" + (Number(itemprice.getAttribute("data-id")) * val).toFixed(2);
    TotalpricesAll.innerHTML = "₹" + Number(subTotalprice.value).toFixed(2);
  } else {
    Totalprice.innerHTML = "₹" + 0;
  }
}

function changeprice(params, value) {
  const index = params;
  const val = value;
  const itemprice = document.getElementById(`itemPrice${index}`);
  const Totalprice = document.getElementById(`Totalprice${index}`);

  if (Number(itemprice.getAttribute("data-id")) * val > 0) {
    Totalprice.innerHTML =
      "₹" + (Number(itemprice.getAttribute("data-id")) * val).toFixed(2);
  } else {
    Totalprice.innerHTML = "₹" + 0;
  }
}

//wishlist

function addtowishlist(id) {
  try {
    const productid = id;
    const counts = document.getElementById(`count${productid}`).value;
    $.ajax({
      type: "POST",
      url: "/addtowishlist",
      data: { product: productid, count: counts },
      success: function (response) {
        console.log("done", response);
        if (response.success) {
          Toast.fire({
            icon: "success",
            title: "Added to your wishlist",
          });
        } else if (response.failed) {
          Toast.fire({
            icon: "error",
            title: "Sorry, some error occured",
          });
        } else {
          Toast.fire({
            icon: "info",
            title: "Please login to continue",
          }).then(()=>{
            window.location.href = '/login'
          })
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  } catch (error) {
    console.log(error);
  }

}

$(document).ready(function () {
  $("#formCheckout").submit(function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    console.log(formData);

    $.ajax({
      url: "/checkout",
      method: "POST",
      data: formData,
      success: function (response) {
        console.log(response);
        if (response.lessThanOne) {
          Toast.fire({
            icon: "info",
            title: `Add atleast one ${response.message} `,
          });
        } else if (response.greater) {
          Toast.fire({
            icon: "info",
            title: `Sorry you can only buy three ${response.message}`,
          });
        } else if (response.noStock) {
          Toast.fire({
            icon: "info",
            title: `Sorry ${response.message} is out of stock`,
          });
        } else if (response.success) {
          window.location.href = `/checkout?orderid=${response.message}`;
        }
      },
      error: function (xhr, status, error) {
        Toast.fire({
          icon: "error",
          title: `Sorry some error occured`,
        });
        console.log(error);
      },
    });
  });
});
