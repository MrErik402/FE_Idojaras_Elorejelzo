function showAlert(title, message, type) {
  const alertBox = document.getElementById("alertBox");
  const alertMessage = document.getElementById("alertMessage");
  const alertTitle = document.getElementById('alertTitle');

  alertBox.classList.remove("alert-success", "alert-danger", "alert-warning", "alert-info", "hide");
  alertBox.classList.add(`alert-${type}`);

  alertTitle.textContent = title;
  alertMessage.textContent = message;

  //Automatikus eltünés 3 másodperc után
  setTimeout(() => {
    alertBox.classList.add("hide")
  }, 3000);
}

function hideAlert() {
  const alertBox = document.getElementById("alertBox");
  alertBox.classList.add("hide");
}