

function changeAddress(param) {
  const data = param;
  console.log(data);
  $.ajax({
    type: "POST",
    url: "/api/defaultaddress",
    data: { index: data },
    success: function (response) {
      console.log(response);
      window.location.reload();
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", error);
    },
  });
}


function deleteAddress(param) {
  const data = param;
  console.log(data);
  $.ajax({
    type: "DELETE",
    url: "/api/deleteaddress",
    data: { index: data },
    success: function (response) {
      console.log(response);
    },
  });
}

function editAddress(params,event) {
  event.preventDefault();
  const data = params;
  document.getElementById("editcollapse").click();

  $.ajax({
    type: "GET",
    url: `/api/editaddress/${data}`,
    success: function (response) {
      const form = document.getElementById("editAddressform");
      const nameInput = document.getElementById("name");
      const streetInput = document.getElementById("street");
      const landmarkInput = document.getElementById("landmark");
      const stateSelect = document.getElementById("state");
      const cityInput = document.getElementById("city");
      const districtInput = document.getElementById("district");
      const zipcodeInput = document.getElementById("zipcode");
      const phonenumberInput = document.getElementById("phonenumber");

      console.log(response.name);

      form.setAttribute("action", `/api/editaddress/${response._id}`);
      nameInput.value = response.name;
      streetInput.value = response.street;
      landmarkInput.value = response.landmark;
      cityInput.value = response.city;
      districtInput.value = response.district;
      zipcodeInput.value = response.postalCode;
      phonenumberInput.value = response.phone;

      const stateOption = stateSelect.querySelector(
        `option[value="${response.state}"]`
      );

      if (stateOption) {
        stateOption.selected = true;
      }
    },
  });
}
