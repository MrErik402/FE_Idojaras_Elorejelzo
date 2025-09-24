//User regexp
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function userRegister(){
    let name = document.querySelector('#nameField');
    let email = document.querySelector('#emailField');
    let password = document.querySelector('#passwordField');
    let confirmPassword = document.querySelector('#confirmpasswordField');
    if(name.value == "" || email.value == "" || password.value == "" || confirmPassword.value == ""){
        showAlert("Figyelmeztetés", "Nem adtál meg minden adatot!", "warning")
        return;
    }
    if(!emailRegex.test(email.value)){
        showAlert("Hiba", "Az általad megadott e-mail cím nem megfelelő formátumú!", "danger")
        return;
    }
    if(!passwdRegExp.test(password.value)){
        showAlert("Hiba", "A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kis- és nagybetűt, valamint számot.", "danger")
        return;
    }
    if(password.value != confirmPassword.value){
        showAlert("Hiba", "Az általad megadott két jelszó nem egyezik!", "danger")
        return;
    }
    try {
        const res = await fetch(`${ServerURL}/users`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        const data = await res.json();
        if(res.status == 200){
            name.value = "";
            email.value = "";
            password.value = "";
            confirmPassword.value = "";
        }
        showAlert(data.title, data.message, data.type)
    } catch (err) {
        showAlert("Hiba", "Hiba történt a regisztrációs folyamat során!", "danger")
        return;
    }

}

async function userLogin() {
    let email = document.querySelector('#emailField');
    let password = document.querySelector('#passwordField');
    if(email.value == "" || password.value == ""){
        showAlert("Figyelmeztetés", "Nem adtál meg minden adatot!", "warning")
        return;
    }

    let user = {}
    try {
        const res = await fetch(`${ServerURL}/users/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailField.value,
                password: passwordField.value
            }),
        });

        user = await res.json();
        if (user.id != undefined) {
            showAlert("Bejelentkezés","Sikeres bejelentkezés!", "success")
            loggedUser = user;
        }
        if (!loggedUser) {
            showAlert("Hiba","Hibás adatokat adott meg!", "danger");
            return;
        }

        //Session storageba kell menteni a bejelentkezett usert.
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        getLoggedUser();
       
    } catch (error) {
        showAlert("Hiba!", "Hiba a bejelentkezési folyamatban!", "danger");
        console.error(error);
    }
}

function userLogout(){
    sessionStorage.removeItem("loggedUser");
    getLoggedUser()
    showAlert("Kijelentkezés!", "Sikeres kijelentkezés!", "success")
}

async function getProfile() {
    try {
      const res = await fetch(`${ServerURL}/users/${loggedUser.id}`);
      if (!res.ok) throw new Error("Hiba a profil lekérésénél");
  
      const data = await res.json(); 

      document.getElementById("nameField").value = data.name;
      document.getElementById("emailField").value = data.email;
    } catch (err) {
      showAlert("Figyelmeztetés", "Nem sikerült betölteni a profilt", "danger");
      console.error(err);
    }
}

async function userProfileUpdate() {
    try {
        if(document.getElementById("nameField").value == ""||document.getElementById("emailField").value == ""){
            showAlert("Figyelmeztetés", "Nem adtál meg minden adatot!", "warning")
            return
        }
        const res = await fetch(`${ServerURL}/users/profile`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id : loggedUser.id,
                name: document.getElementById("nameField").value,
                email: document.getElementById("emailField").value
            })
        })

        let data = await res.json();
        if(res.status == 200) showAlert(data.title, data.message, data.type)
        if(res.status == 400) showAlert(data.title, data.message, data.type)
        
    } catch (error) {
        console.log(error)
        showAlert("Hiba","Hiba a felhasználnói adatok módosításában! ", "danger")
    }
}

async function userPasswordUpdate() {
    const oldPassword = document.getElementById("oldpasswordField").value;
    const newPassword = document.getElementById("passwordField").value;
    const confirmPassword = document.getElementById("confirmpasswordField").value;
  
  
    if (newPassword == "" || confirmPassword == "" || oldPassword == "") {
      return showAlert("Figyelmeztetés", "Nem adtál meg minden adatot", "warning");
    }
  
    if (newPassword !== confirmPassword) {
      return showAlert("Figyelmeztetés", "Az új jelszavak nem egyeznek!", "warning");
    }
  
    if (!passwdRegExp.test(newPassword)) {
      return showAlert("Figyelmeztetés", "A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kis- és nagybetűt, valamint számot.", "warning");
    }
  
    try {
      const res = await fetch(`${ServerURL}/users/password`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json"
       },
        body: JSON.stringify({
          id: loggedUser.id, 
          oldPassword, 
          newPassword })
      });
  
      const data = await res.json();
      if(res.status == 200){
          showAlert(data.title, data.message, data.type);
      }else{
          showAlert(data.title, data.message, data.type)
      }
  
  
    } catch (err) {
      showAlert("Hiba!", err.message, "danger");
    }
}