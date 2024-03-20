// categories //
if (window.location.pathname == "/admin/categories") {
  $ondelete = $(".table tbody td a.delete");
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

        fetch(`/admin/api/category/${id}`, request)
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

if (window.location.pathname == "/admin/categories") {
  $(document).ready(function () {
    $("#submitButtoncategory").click(function () {
      const dataToSend = {
        name: $("#name").val(),
        url: $("#url").val(),
        description: $("#description").val(),
      };
      $.ajax({
        type: "POST",
        url: "/admin/api/addcategory",
        contentType: "application/json",
        data: JSON.stringify(dataToSend),
        success: function (response) {
          document.getElementById("result").innerHTML = response.message;

          if (response.success) {
            document.getElementById("name").disabled = true;
            document.getElementById("url").disabled = true;
            document.getElementById("description").disabled = true;
            document.getElementById("result").style.color = "green";
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else if (response.validation) {
            document.getElementById("result").style.color = "red";
          } else if (response.duplicate) {
            document.getElementById("result").style.color = "red";
          }
        },
        error: function (error) {
          console.log(error);
          document.getElementById("result").innerHTML = "Duplicate entry";
          document.getElementById("result").style.color = "red";
        },
      });
    });
  });
}

// roomtype //
if (window.location.pathname == "/admin/roomtypes") {
  $(document).ready(function () {
    $("#submitButtonroom").click(function () {
      const dataToSend = {
        name: $("#name").val(),
        url: $("#url").val(),
        description: $("#description").val(),
        id: $("#id").val(),
      };
      $.ajax({
        type: "POST",
        url: "/admin/api/addroomtype",
        contentType: "application/json",
        data: JSON.stringify(dataToSend),
        success: function (response) {
          document.getElementById("result").innerHTML = response.message;
          if (response.success) {
            document.getElementById("name").disabled = true;
            document.getElementById("url").disabled = true;
            document.getElementById("description").disabled = true;
            // document.getElementById("id").disabled = true;
            document.getElementById("result").style.color = "green";
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else if (response.validation) {
            document.getElementById("result").style.color = "red";
          } else if (response.duplicate) {
            document.getElementById("result").style.color = "red";
          }
        },
        error: function (error) {
          console.log(error);
          document.getElementById("result").innerHTML = "Duplicate Entry";
          document.getElementById("result").style.color = "red";
        },
      });
    });
  });
}

if (window.location.pathname == "/admin/roomtypes") {
  $ondelete = $(".table tbody td a.delete");
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

        fetch(`/admin/api/roomtype/${id}`, request)
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