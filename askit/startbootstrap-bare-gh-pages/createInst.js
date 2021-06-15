function init() {

    var database = firebase.database();
    refA = firebase.database().ref("Admins");
    if (localStorage["Admin"] != null) { // check if the entry exists
        // after getting the localStorage string, parse it to a JSON object
        Admin = JSON.parse(localStorage["Admin"]);
        refA.child(Admin.id).get().then(function (snapshot) {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                AdminP = snapshot.val();
                //הוספת שם בצד ימין
                var ProfileName = document.getElementById("dropdownMenuLink");
                ProfileName.innerHTML = AdminP.firstname + " " + AdminP.lastname;
                var InstName = document.getElementById("userInst");
                InstName.innerHTML = AdminP.institute;
            }
            else {
                console.log("No data available");
            }
        }).catch(function (error) {
            console.error(error);
        });
        //אתחול מערך מוסדות,מחלקות
        instArr = [];
        depArr = [];
        db = firebase.database();
        ref = firebase.database().ref("Institute");
        console.log(ref);

        dref = firebase.database().ref("Departments");
        // listen to incoming institutes
        listenToNewInstitute();
        //listenToNewDepartments();
        // listen to removing institutes
        //listenToRemove();
        ph = document.getElementById("ph");
    }
    else {
        userA = {};
    }
    ////הורדת העפרון ברגע שעולה הדף 
    //document.getElementById("PencilIcon").style.display = "none";

}
function Logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        localStorage.clear();
    }).catch((error) => {
        alert(error);
        // An error happened.
    });
}
//////
function SelectUserInstitute() {
    //לוקח את המוסד של המשתמש
    let inst = document.getElementById("instTB").value;
    //רשימת מחלקות
    let depList = [];
    //תכתוב את הערך של המשתמש בתוך תיבת הטקסט של המוסד
    //document.getElementById("instTB").value = inst;

    // Set the Departments on the Select Options
    refI = firebase.database().ref("Institutes");
    //מוסד של אותו הלקוח
    //רינדור מחלקות של אותו מוסד שהלקוח רשום אליו
    refI.child(inst).get().then(function (snapshot) {
        if (snapshot.exists()) {
            //הבאת האובייקט
            instData = snapshot.val();

            for (var i = 0; i < Object.keys(instData.Departments).length; i++) {
                //דחיפה לרשימת מחלקות
                depList.push(Object.keys(instData.Departments)[i]);
            }

            var str = "<option value = '-1'>בחר מחלקה</option>";
            for (k in depList) {
                str += "<option value = '" + depList[k] + "'>" + depList[k] + "</option>";
            }
            document.getElementById("depTB").innerHTML = str;
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function listenToNewInstitute() {
    // child_added will be evoked for every child that was added
    // on the first entry, it will bring all the childs
    ref.on("child_added", snapshot => {
        inst = {
            name: snapshot.val().name,
            content: snapshot.val().inst,
        }
        instArr.push(inst)
        printMessage(inst);

    })
}



function AddSubject() {
    let inst = document.getElementById("instTB").value;
    let dep = document.getElementById("depTB").value;
    let course = document.getElementById("CourseTB").value;
    let subject = document.getElementById("SubjectTB").value;
    let subjectData = '';
    console.log(dep);
    console.log(course);
    console.log(subject);

    if (dep == "" || course == "" || subject == "") {
        alert("Please fill all of the missing fields!");
        return;
    }

    refC = firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects");
    refC.child(subject).get().then(function (snapshot) {
        if (snapshot.exists()) {
            alert("This subject already exists!");
            return;
        }

        else {
            firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject).set({ "status": "Active" });
            alert("Subject Added Successfully!");
        }
    }).catch(function (error) {
        console.error(error);
    });

}

//function funcDisabel() {
//    document.getElementById("instTB").disabled = true;
//    document.getElementById("PencilIcon").style.display = "block";

//}
//function notDisable() {
//    document.getElementById("instTB").disabled = false;
//    document.getElementById("PencilIcon").style.display = "none";

//}