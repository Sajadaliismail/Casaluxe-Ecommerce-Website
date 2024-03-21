

function checkemail() {
  const check = document.getElementById("check");
  const email = document.getElementById("email").value;
  const data = { email };
  event.preventDefault();

  let countdown = 60;
  function updateCountdown() {
    document.getElementById("countdown").textContent =
      "Resend in : " + countdown;

    if (countdown < 1) {
      clearInterval(count);
      document.getElementById("collapse").disabled = false;
      document.getElementById("countdown").textContent = "";
    } else {
      countdown--;
    }
  }
  const count = setInterval(updateCountdown, 1000);

  $.ajax({
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    url: "/checkemail",
    success: function (response) {
      if (response.success) {
        document.getElementById("view").style.display = "flex";
        document.getElementById("collapse").disabled = true;
        document.getElementById("checkbutton").style.display = "none";

        check.innerHTML = response.message;
      } else {
        check.innerHTML = response.error;
      }
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}

function sendforgotOTP() {
  const email = document.getElementById("email").value;
  const data = { email };
  $.ajax({
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    url: "/checkemail",
    success: function (response) {
      document.getElementById("view").style.display = "flex";
      document.getElementById("collapse").disabled = true;
    },
    error: function () {},
  });

  let countdown = 60;

  function updateCountdown() {
    document.getElementById("countdown").textContent =
      "Resend in : " + countdown;

    if (countdown < 1) {
      clearInterval(countdownInterval);
      document.getElementById("collapse").disabled = false;
      document.getElementById("countdown").textContent = "";
    } else {
      countdown--;
    }
  }
  const countdownInterval = setInterval(updateCountdown, 1000);
}

function verifyOTP() {
  const otpValue = document.getElementById("otp").value;
  const emailvalue = document.getElementById("email").value;
  console.log(otpValue, emailvalue);

  $.ajax({
    type: "POST",
    url: "/verify-otp",
    data: { otp: otpValue, email: emailvalue },
    success: function (response) {
      document.getElementById("result").innerHTML = response.message;
      if (response.success) {
        document.getElementById("result").style.color = "green";
        document.getElementById("email").readOnly = true;
        document.getElementById("otp").style.display = "none";
        (document.getElementById("collapse").disabled = true),
          document
            .getElementById("dummy")
            .removeChild(document.getElementById("countdown")),
          (document.getElementById("verify").style.display = "none");
        document.getElementById("passwordfield").style.display = "block";
      }
    },
    error: function () {
      document.getElementById("result").innerHTML =
        "Error occurred while verifying OTP.";
    },
  });
  email.ariaReadOnly = true;
}

function checkPasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const messageElement = document.getElementById("passwordMatchMessage");
  const submitButton = document.getElementById("signupbtn");

  if (password === confirmPassword) {
    messageElement.textContent = "Passwords match!";
    messageElement.style.color = "green";
    submitButton.disabled = false;
  } else {
    messageElement.textContent = "Passwords do not match!";
    messageElement.style.color = "red";
    submitButton.disabled = true;
  }
}

function isstrong(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);

  let message = "Password strength :";
  if (password.length <= minLength) {
    message += "Too short.";
    document.getElementById("strong-password").classList = "text-danger";
  } else if (!hasUppercase || !hasDigit || !hasLowercase || !hasSpecialChar) {
    message +=
      "Password missing  digits,lowercase,uppercase or special characters.";
    document.getElementById("strong-password").classList = "text-danger";
  } else {
    message += "Strong";
    document.getElementById("strong-password").classList = "text-success";
  }

  document.getElementById("strong-password").textContent = message;
}

function sendOTP() {
  document.getElementById("view").style.display = "flex";
  document.getElementById("collapse").disabled = true;

  const email = document.getElementById("email").value;
  const data = { email };
  $.ajax({
    type: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    url: "/send-otp", //
    success: function (response) {
      
    },
    error: function () {},
  });

  let countdown = 60;

  function updateCountdown() {
    document.getElementById("countdown").textContent =
      "Resend in : " + countdown;

    if (countdown < 1) {
      clearInterval(countdownInterval);
      document.getElementById("collapse").disabled = false;
      document.getElementById("countdown").textContent = "";
    } else {
      countdown--;
    }
  }
  const countdownInterval = setInterval(updateCountdown, 1000);
}

function viewbutton() {
  document.getElementById("collapse").style.display = "block";
}

function editUserDetails(){
  const name = document.getElementById('userName')
  const oldEmail = document.getElementById('oldEmail')
  const newEmail = document.getElementById('email')
  const phone = document.getElementById('phone')
  const button = document.getElementById('submitButtonUpdate')

  name.readOnly = false
  oldEmail.hidden = true
  newEmail.hidden = false
  newEmail.disabled = false
  phone.readOnly = false
  button.hidden = false
}


$(document).ready(function() {
  const name = document.getElementById('userName')
  const oldEmail = document.getElementById('oldEmail')
  const newEmail = document.getElementById('email')
  const phone = document.getElementById('phone')
  const button = document.getElementById('submitButtonUpdate')

$('#updateDetailsForm').submit(function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Collect form data
  let formData = {
      userName: $('#userName').val(),
      email: $('#email').val(),
      phone: $('#phone').val()
  };


  $.ajax({
      type: 'POST',
      url: '/updateDetails',
      data: formData,
      success: function(response) {
 if(response.success){
  name.readOnly = true
  oldEmail.hidden = true
  newEmail.disabled = true
  phone.readOnly = true
  button.hidden = true

  Toast.fire({
    icon: "success",
    title: `${response.message}`,
  })
 }
 if(response.failed){
  Toast.fire({
    icon: "info",
    title: `${response.message}`,
  })
 }
      },
      error: function(xhr, status, error) {
          // Handle error
          console.error('Error submitting form:', error);
      }
  });
});
});


$(document).ready(function() {
  $('#signupForm').submit(function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Collect form data
    let formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        password: $('#password').val(),
        referralCode: $('#referralCode').val()
         };

         console.log(formData);
  
    // Send AJAX POST request
    $.ajax({
        type: 'POST',
        url: '/signup',
        data: formData,
        success: function(response) {
            if(response.success){
              Toast.fire({
                icon: "success",
                title: `Signup successfull
                Please login`,
              }).then(function () {
                window.location.href = `/login`;
              });
            }
            else{
              Toast.fire({
                icon: "info",
                title: `${response.message}`,
              });
            }
            console.log('Form submitted successfully');
            console.log(response); 
        },
        error: function(xhr, status, error) {
            // Handle error
            Toast.fire({
              icon: "error",
              title: `Internal server error`,
            });
            console.error('Error submitting form:', error);
        }
    });
  });
  });

  function validateEmail() {
    const emailInput = document.getElementById('email');
    

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
    if (emailPattern.test(emailInput.value)) {
       
        document.getElementById("collapse").style.display = "block";

    } else {
       
        document.getElementById("collapse").style.display = "none";

    }
}