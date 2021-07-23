
function storeToLS() {
    Admin = { // create a new JSON object
        id: document.getElementById("idTB").value,
        password: document.getElementById("passwordTB").value
    }
    // stringify before storing in localstorage
    //הערה
    localStorage["Admin"] = JSON.stringify(Admin);
}
function Login() {

    let _id = $("#idTB").val();
    let _password = $("#passwordTB").val();
    ref = firebase.database().ref("Admins");
    ref.child(_id).get().then(function (snapshot) {
        if (snapshot.exists()) {
            a = snapshot.val();
            if (a.password == _password) {
                storeToLS();
                document.location.href = "Home - Admin.html";
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
//function Logout() {
//    localStorage.clear();
//    document.getElementById("logout").style.display = "none";
//}

function RedirectToRegistration() {
    location.replace("RegistrationAdmin.html");
}