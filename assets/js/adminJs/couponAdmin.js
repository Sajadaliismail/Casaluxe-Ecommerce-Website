if (window.location.pathname === "/admin/coupons") {
  $ondelete = $(".table tbody td  a.delete");
  $ondelete.click(function (event) {
    event.preventDefault();

    let id = $(this).attr("data-id");
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Activate/Deactivate!",
    }).then((result) => {
      if (result.isConfirmed) {
        let request = {
          method: "POST",
        };

        fetch(`/admin/api/coupon/${id}`, request)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Acton failed");
            }
          })
          .then((data) => {
            Toast.fire({
              icon: "success",
              title: `Action done`,
            }).then(function () {
              location.reload();
            });
          })
          .catch((error) => {
            console.error("Error during action:", error);
            Swal.fire("Oops! Something went wrong.", "error");
          });
      } else {
        Toast.fire({
          icon: "info",
          title: `Action canceled`,
        });
      }
    });
  });
}
if (window.location.pathname === "/admin/createCoupon") {
  document.getElementById("couponType").addEventListener("change", function () {
    var couponType = this.value;
    if (couponType === "products") {
      document.getElementById("categories").value = "none";
      document.getElementById("productsSection").style.display = "inline-block";
      document.getElementById("categoriesSection").style.display = "none";
    } else if (couponType === "categories") {
      document.getElementById("products").value = "none";
      document.getElementById("productsSection").style.display = "none";
      document.getElementById("categoriesSection").style.display =
        "inline-block";
    }
  });

  document
    .getElementById("generateCodeBtn")
    .addEventListener("click", function () {
      const randomCode = generateRandomCode();
      document.getElementById("code").value = randomCode;
    });
}

if (window.location.pathname.startsWith("/admin/couponEdit/")) {
  document
    .getElementById("generateCodeBtn")
    .addEventListener("click", function () {
      const randomCode = generateRandomCode();
      document.getElementById("code").value = randomCode;
    });

  const product = document.getElementById("productValue").value;
  const category = document.getElementById("categoriesValue").value;
  const couponTypeSelect = document.getElementById("couponType");
  if (!product) {
    couponTypeSelect.value = "categories";
    document.getElementById("categories").value = category;
    document.getElementById("productsSection").style.display = "none";
    document.getElementById("categoriesSection").style.display = "inline-block";
  } else if (!category) {
    couponTypeSelect.value = "products";
    document.getElementById("products").value = product;
    document.getElementById("productsSection").style.display = "inline-block";
    document.getElementById("categoriesSection").style.display = "none";
  }

  document.getElementById("couponType").addEventListener("change", function () {
    var couponType = this.value;
    if (couponType === "products") {
      document.getElementById("categories").value = "none";
      document.getElementById("productsSection").style.display = "inline-block";
      document.getElementById("categoriesSection").style.display = "none";
    } else if (couponType === "categories") {
      document.getElementById("products").value = "none";
      document.getElementById("productsSection").style.display = "none";
      document.getElementById("categoriesSection").style.display =
        "inline-block";
    }
  });
}

$(document).ready(function () {
  $('#couponCreateForm button[type="submit"]').click(function () {
    // Collect form data
    let formData = {
      name: $("#name").val(),
      code: $("#code").val(),
      description: $("#description").val(),
      discount: $("#discount").val(),
      minAmount: $("#minAmount").val(),
      maxDiscount: $("#maxDiscount").val(),
      startDate: $("#startDate").val(),
      endDate: $("#endDate").val(),
      usageLimit: $("#usageLimit").val(),
      couponType: $("#couponType").val(),
      products: $("#products").val(),
      categories: $("#categories").val(),
    };

    $.ajax({
      type: "POST",
      url: "/admin/createCoupon",
      data: formData,
      success: function (response) {
        if (response.success) {
          Toast.fire({
            icon: "success",
            title: `Coupon created`,
          }).then(function () {
            window.location.href = `/admin/coupons`;
          });
        } else if (response.validation) {
          Toast.fire({
            icon: "info",
            title: `Invalid entry`,
          });
        } else if (response.filled) {
          Toast.fire({
            icon: "info",
            title: `Required fields contain only blank spaces`,
          });
        } else if (response.duplicate) {
          Toast.fire({
            icon: "info",
            title: `Duplicate Entry`,
          });
        }
      },
      error: function (xhr, status, error) {
        Toast.fire({
          icon: "info",
          title: `Some error occured`,
        });
        console.error("Error:", error);
      },
    });
    return false;
  });
});

$(document).ready(function () {
  $('#couponUpdateForm button[type="submit"]').click(function () {
    // Collect form data
    let formData = {
      coupnId: $("#coupnId").val(),
      name: $("#name").val(),
      code: $("#code").val(),
      description: $("#description").val(),
      discount: $("#discount").val(),
      minAmount: $("#minAmount").val(),
      maxDiscount: $("#maxDiscount").val(),
      startDate: $("#startDate").val(),
      endDate: $("#endDate").val(),
      usageLimit: $("#usageLimit").val(),
      couponType: $("#couponType").val(),
      products: $("#products").val(),
      categories: $("#categories").val(),
    };

    console.log(formData);

    $.ajax({
      type: "POST",
      url: "/admin/couponEdit",
      data: formData,
      success: function (response) {
        console.log(response);
        if (response.success) {
          Toast.fire({
            icon: "success",
            title: `Coupon updated`,
          }).then(function () {
            window.location.href = `/admin/coupons`;
          });
        } else if (response.validation) {
          Toast.fire({
            icon: "info",
            title: `Invalid entry`,
          });
        } else if (response.filled) {
          Toast.fire({
            icon: "info",
            title: `Required fields contain only blank spaces`,
          });
        } else if (response.duplicate) {
          Toast.fire({
            icon: "info",
            title: `Duplicate Entry`,
          });
        }

        console.log("Response:", response);
      },
      error: function (xhr, status, error) {
        Toast.fire({
          icon: "info",
          title: `Some error occured`,
        });
        console.error("Error:", error);
      },
    });
    return false;
  });
});

function generateRandomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 8;
  let randomCode = "";
  for (let i = 0; i < codeLength; i++) {
    randomCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomCode;
}
