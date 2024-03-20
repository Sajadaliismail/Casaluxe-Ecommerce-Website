!(function (e) {
  "use strict";
  if (
    (e(".menu-item.has-submenu .menu-link").on("click", function (s) {
      s.preventDefault(),
        e(this).next(".submenu").is(":hidden") &&
          e(this)
            .parent(".has-submenu")
            .siblings()
            .find(".submenu")
            .slideUp(200),
        e(this).next(".submenu").slideToggle(200);
    }),
    e("[data-trigger]").on("click", function (s) {
      s.preventDefault(), s.stopPropagation();
      var n = e(this).attr("data-trigger");
      e(n).toggleClass("show"),
        e("body").toggleClass("offcanvas-active"),
        e(".screen-overlay").toggleClass("show");
    }),
    e(".screen-overlay, .btn-close").click(function (s) {
      e(".screen-overlay").removeClass("show"),
        e(".mobile-offcanvas, .show").removeClass("show"),
        e("body").removeClass("offcanvas-active");
    }),
    e(".btn-aside-minimize").on("click", function () {
      window.innerWidth < 768
        ? (e("body").removeClass("aside-mini"),
          e(".screen-overlay").removeClass("show"),
          e(".navbar-aside").removeClass("show"),
          e("body").removeClass("offcanvas-active"))
        : e("body").toggleClass("aside-mini");
    }),
    e(".select-nice").length && e(".select-nice").select2(),
    e("#offcanvas_aside").length)
  ) {
    const e = document.querySelector("#offcanvas_aside");
    new PerfectScrollbar(e);
  }
  e(".darkmode").on("click", function () {
    e("body").toggleClass("dark");
  });
})(jQuery);

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  showClass: {
    popup: "animate__animated animate__fadeInDown",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutUp",
  },
});


//orders//
if (window.location.pathname.startsWith("/admin/order-details/")) {
  const select = document.getElementById("ordeStatus");
  const option = document.getElementById("defaultStatusOrder").value;
  if (option === "canceled") {
    select.disabled = true;
  }
  for (let i = 1; i < select.options.length; i++) {
    console.log(select.options[i].value);
    if (select.options[i].value === option) {
      select.options[i].selected = true;
      break;
    }
  }

  const selectpaymentStatus = document.getElementById("paymentStatus");
  const optionpaymentStatus = document.getElementById(
    "defaultpaymentStatus"
  ).value;

  for (let i = 1; i < selectpaymentStatus.options.length; i++) {
    if (selectpaymentStatus.options[i].value === optionpaymentStatus) {
      selectpaymentStatus.options[i].selected = true;
      break;
    }
  }

  const selectshippingStatus = document.getElementById("shippingStatus");
  const optionshippingStatus = document.getElementById(
    "defaultshippingStatus"
  ).value;

  for (let i = 1; i < selectshippingStatus.options.length; i++) {
    if (selectshippingStatus.options[i].value === optionshippingStatus) {
      selectshippingStatus.options[i].selected = true;
      break;
    }
  }

  console.log(optionshippingStatus, optionpaymentStatus, option);
}

// if (window.location.pathname == "/admin/users") {
//   $ondelete = $(".table tbody td  a.delete");
//   $ondelete.click(function (event) {
//     event.preventDefault();

//     let id = $(this).attr("data-id");
//     Swal.fire({
//       title: "Are you sure?",
//       text: "Once deleted, you will not be able recover this",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Delete!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         let request = {
//           method: "DELETE",
//         };
//         fetch(`/admin/api/users/${id}`, request)
//           .then((response) => {
//             if (response.ok) {
//               return response.json();
//             } else {
//               throw new Error("Deletion failed");
//             }
//           })
//           .then((data) => {
//             Swal.fire("Deleted!", "User has been deleted.", "success").then(
//               function () {
//                 location.reload();
//               }
//             );
//           })
//           .catch((error) => {
//             console.error("Error during deletion:", error);
//             Swal.fire("Oops! Something went wrong.", "error");
//           });
//       } else {
//         Swal.fire("Cancelled", "Deletion canceled", "info");
//       }
//     });
//   });
// }

function blockunblock(button) {
  let id = button.getAttribute("data-block-id");
  Swal.fire({
    title: "Are you sure?",
    text: "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Confirm!",
  }).then((result) => {
    if (result.isConfirmed) {
      let request = {
        method: "PATCH",
      };
      fetch(`/admin/api/users/${id}`, request)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed");
          }
        })
        .then((data) => {
          Swal.fire("Success!", "Success", "success").then(function () {
            location.reload();
          });
        })
        .catch((error) => {
          console.error("Error :", error);
          Swal.fire("Oops! Something went wrong.", "error");
        });
    } else {
      Swal.fire("Cancelled", "Action canceled", "info");
    }
  });
}

function pricecheck() {
  const price = document.getElementById("price");
  const alert = document.getElementById("pricealert");
  const button = document.getElementById("submitbtn");

  if (price.value <= 0) {
    alert.textContent = "Price should be greater than 0";
    button.disabled = true;
  } else {
    alert.textContent = "";
    button.disabled = false;
  }
}
function stockcheck() {
  const stock = document.getElementById("stock");
  const alert = document.getElementById("stockalert");
  const button = document.getElementById("submitbtn");

  if (stock.value <= 0) {
    alert.textContent = "Stock should be greater than 0";
    button.disabled = true;
  } else {
    alert.textContent = "";
    button.disabled = false;
  }
}

let table = new DataTable("#myTable", {
  language: {
    emptyTable: "No results",
    paginate: {
      first: "First",
      last: "Last",
      next: "Next",
      previous: "Previous",
    },
    search: "Search:",
    info: "Showing _START_ to _END_ of _TOTAL_ entries",
  },
});

