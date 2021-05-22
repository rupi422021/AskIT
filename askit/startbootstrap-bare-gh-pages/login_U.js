$(document).ready(function () {
  //  document.getElementById("logout").style.display = "none";

});

function storeToLS() {
    user = { // create a new JSON object
        id: document.getElementById("idTB").value,
        password: document.getElementById("passwordTB").value
    }
    // stringify before storing in localstorage
    //הערה
    localStorage["user"] = JSON.stringify(user);
}
function Login() {
    let _id = $("#idTB").val();
    let _password = $("#passwordTB").val();
    ref = firebase.database().ref("users");
    console.log("********");
    console.log(ref);
    ref.child(_id).get().then(function (snapshot) {
        if (snapshot.exists()) {
            debugger;
            u = snapshot.val();
            if (u.password == _password) {
                if (u.status == "Approved") {
                    storeToLS();
                    document.location.href = "Home.html";
                 
                }
                else {
                    swal({
                        icon: 'error',
                        title: 'אין גישה',
                        text: 'המשתמש טרם אושר במערכת'
                    });                
                    return;
                }

            }
            else {
                swal({
                    icon: 'error',
                    title: 'הסיסמה אינה נכונה'
                });
            }
        }
        else {
            swal({
                icon: 'error',
                title: 'התעודת זהות אינה קיימת במערכת'
            });
        }
    }).catch(function (error) {
        console.error(error);
    });


}
function Logout() {
    localStorage.clear();
    document.getElementById("logout").style.display = "none";
}

function RedirectToRegistration() {
    location.replace("Registration.html");
}

function f1() {
    return false;
    Login();
}
