function updateWallet() {
  var checkbox = document.getElementById("useWallet");
  var isChecked = checkbox.checked;
  
  if (isChecked) {
      deductMoneyFromWallet();
  } else {
      addMoneyToWallet();
  }
}

function deductMoneyFromWallet() {
  console.log('on');
 
  // Perform AJAX request to deduct money from wallet
  // Example:
  // $.post("deduct_money.php", { amount: 10 }, function(response) {
  //     console.log(response);
  // });
}

function addMoneyToWallet() {
  console.log('off');
  // Perform AJAX request to add money to wallet
  // Example:
  // $.post("add_money.php", { amount: 10 }, function(response) {
  //     console.log(response);
  // });
}
