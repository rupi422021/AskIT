function Init() {
    ref = firebase.database().ref("users");
    InitInstitutes();
}
//------------Insert Processs-------------------//


function insertuser() {
    let idU = document.getElementById('idTB').value;
    let firstnameU = document.getElementById('nameTB').value;
    let lastnameU = document.getElementById('lastnameTB').value;
    let emailU = document.getElementById('emailTB').value;
    let passwordU = document.getElementById('passwordTB').value;
    let instituteU = document.getElementById('InstituteTB').value;

    var today = new Date();
    //קריאה לAUT
    ref.child(idU).set({
        id: idU,
        firstname: firstnameU,
        lastname: lastnameU,
        email: emailU,
        password: passwordU,
        institute: instituteU,
        dateReg: getDateString(today),
        status: "Waiting for approval"
    });
    swal({
        icon: 'success',
        title: 'User Created Successfully!'
    }); 



}

function getDateString(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}


function f1() {
    insertuser();

}

function InitInstitutes() {
    let instList = [];
    refI = firebase.database().ref("Institutes");
    refI.get().then(function (snapshot) {
        if (snapshot.exists()) {
            //הבאת האובייקט
            instData = snapshot.val();
            console.log(instData);
            for (var i = 0; i < Object.keys(instData).length; i++) {
                //דחיפה לרשימת מחלקות
                instList.push(Object.keys(instData)[i]);
            }
            console.log(instList);
            var str = "<option value = '-1'>בחר מוסד</option>";
            for (k in instList) {
                str += "<option value = '" + instList[k] + "'>" + instList[k] + "</option>";
            }
            document.getElementById("InstituteTB").innerHTML = str;
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });
}