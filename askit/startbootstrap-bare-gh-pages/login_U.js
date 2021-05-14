$(document).ready(function () {
        document.getElementById("logout").style.display = "none";

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
            ref.child(_id).get().then(function (snapshot) {
                if (snapshot.exists()) {
        u = snapshot.val();
                    if (u.password == _password) {
                        if (u.status == "Approved") {
        storeToLS();
    document.location.href = "Questions.html";
    document.getElementById("logout").style.display = "block";
}
                        else {
        alert("Your user is not yet approved in the system. Please contact your administrator.");
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

