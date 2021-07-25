var pageQuestion = [];
var isCreator = 0;
var userName = "";
var userList = [];
var quesViewers = [];
var sharableUsersList = [];
var unSharableUsersList = [];
        function init() {
        var userInst = "";
        var database = firebase.database();
            ref = firebase.database().ref("users");
            document.getElementById("SaveChangesBTN").style.display = "none";
        if (localStorage["user"] != null) { // check if the entry exists
        // after getting the localStorage string, parse it to a JSON object
        user = JSON.parse(localStorage["user"]);
    console.log(user);
                ref.child(user.id).get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log(snapshot.val());
                        userP = snapshot.val();
                        userInst = userP.institute;
                        userName = userP.firstname + " " + userP.lastname;
                        userEmail = userP.email;
                        ShowQuestion();
                        document.getElementById("myForm").style.display = "none";
                        setUsersList();
                        
                        
    //הוספת שם בצד ימין
                        var ProfileName = document.getElementById("dropdownMenuLink");
                        ProfileName.innerHTML = userP.firstname + " " + userP.lastname;
                        var InstName = document.getElementById("userInst");
                        InstName.innerHTML = userInst;
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



dref = firebase.database().ref("Departments");
// listen to incoming institutes
//listenToNewInstitute();
//listenToNewDepartments();
// listen to removing institutes
//listenToRemove();
ph = document.getElementById("ph");
}
            else {
            userA = {};
            swal({
                icon: 'error',
                title: 'You are not signed in!',
                text: 'Please log in to continue.'
            });  

    RedirectToLogin();
}



}
        function Logout() {
            localStorage.clear();
            RedirectToLogin();
}
//////
        function RedirectToLogin() {
        location.replace("Login.html");
}




    function EnableEditing() {
    console.log("Enable Editing!");
    document.getElementById("quesTypeTB").disabled = false;
    document.getElementById("quesContentTB").disabled = false;
    document.getElementById("diffTB").disabled = false;
    //document.getElementById("tagTB").disabled = false;
        document.getElementById("isPublishedTB").disabled = false;
        if (document.getElementById("isPublishedTB").value == 'לא') {
            document.getElementById("published").style.display = "none";
        }
    document.getElementById("pubTypeTB").disabled = false;
    document.getElementById("pubYearTB").disabled = false;
    document.getElementById("pubAttemptTB").disabled = false;
    document.getElementById("ShareBTN").disabled = false;
    document.getElementById("PublicBTN").disabled = false;
    document.getElementById("DuplicateBTN").disabled = false;
    document.getElementById("SaveChangesBTN").disabled = false;
    document.getElementById("SaveChangesBTN").style.display = "block";
    document.getElementById("PrivateBTN").disabled = false;
}




    function ShowQuestion() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    console.log(url_string);
    questionTitle = url.searchParams.get("questionTitle");
    console.log(questionTitle);



    let inst = userP.institute;
    let userID = userP.id;
    let courses = "";
    let subjects = "";
    let questions = "";
    let questionData = '';
    let depData = '';
    let thisDep = "";
    let thisCourse = "";
    let thisSubject = "";

    let question = [];

    refD = firebase.database().ref("Institutes").child(inst).child("Departments");
    console.log(refD);
            refD.get().then(function (snapshot) {
                if (snapshot.exists()) {
        depData = snapshot.val();
    console.log(depData);
                    for (var i = 0; i < Object.keys(depData).length; i++) {  // Running over all of the Departments
        thisDep = Object.keys(depData)[i];
    courses = depData[Object.keys(depData)[i]].Courses;
                        for (var j = 0; j < Object.keys(courses).length; j++) { // Running over all of the Courses
        thisCourse = Object.keys(courses)[j];
    subjects = courses[Object.keys(courses)[j]].Subjects;
                            for (var k = 0; k < Object.keys(subjects).length; k++) { // Running over all of the Subjects
        thisSubject = Object.keys(subjects)[k];
                                if (subjects[Object.keys(subjects)[k]].Questions != null) {
        questions = subjects[Object.keys(subjects)[k]].Questions;
}
                                for (var m = 0; m < Object.keys(questions).length; m++) { // Running over all of the Questions
        ques = questions[Object.keys(questions)[m]];
                                    if (ques.creator_id != null && Object.keys(questions)[m] == questionTitle) {
        question.push({
            questionTitle: Object.keys(questions)[m],
            question: ques,
            department: thisDep,
            course: thisCourse,
            subject: thisSubject
        });
}

}
}
}

}
console.log(question);
pageQuestion = question;

ShowQuestionHTML(question);
}

                else {
        console.log("No data available");
}
            }).catch(function (error) {
        console.error(error);
});

}



var filename='';
        function ShowQuestionHTML(question) {

        console.log("*********************");
    console.log(question);
    document.getElementById("instTB").value = userP.institute;
    document.getElementById("depTB").value  = question[0].department;
    document.getElementById("CourseTB").value  = question[0].course;
    document.getElementById("SubjectTB").value  = question[0].subject;
    document.getElementById("quesTB").value = question[0].questionTitle;
    document.getElementById("quesTypeTB").value = question[0].question.type;
    document.getElementById("quesContentTB").value = question[0].question.content;
            document.getElementById("diffTB").value = question[0].question.difficulty;
          
            document.getElementById("tagTB").value = question[0].question.tags;
    document.getElementById("isPublishedTB").value = question[0].question.is_published;
    document.getElementById("pubTypeTB").value = question[0].question.publish_type;
    document.getElementById("pubYearTB").value = question[0].question.publish_year;
            document.getElementById("pubAttemptTB").value = question[0].question.publish_attempt;
            if (question[0].question.file_name != null && question[0].question.file_name != "") {
                downloadViaUrl(question);
                filename = question[0].question.file_name;
                document.getElementById("files").style.display = "block";
            }
            else {
                document.getElementById("files").style.display = "none";
            }

           
            
    let viewers = [];
    let viewersString = "";
            if (question[0].question.Viewers != null) {
        let viewers_ = question[0].question.Viewers;
                for (var i = 0; i < Object.keys(viewers_).length; i++) {
        viewers.push(Object.keys(viewers_)[i]);
                    viewersString += Object.keys(viewers_)[i] + ", "
                    quesViewers = viewers;
}
            }

console.log("---------------");
console.log(question[0].question.is_public);

            if (question[0].question.is_public == 1) {
        let x = document.getElementById("private");
    x.style.display = "none";
    let y = document.getElementById("PublicBTN");
    y.style.display = "none";
    let z = document.getElementById("viewersTB");
    z.style.display = "none";
    let w = document.getElementById("ShareBTN");
                w.style.display = "none";
                let m = document.getElementById("PrivateBTN");
                m.disabled = false;
}
            else {
        let x = document.getElementById("PrivateBTN");
    x.style.display = "none";
    let y = document.getElementById("public");
    y.style.display = "none";
}

            console.log("BATATAAAAAAAA");
            quesViewers = viewers;
            UpdateSharableUsers();
            UpdateUnSharableUsers();
            autocomplete(document.getElementById("userToShareTB"), sharableUsersList);
            autocomplete(document.getElementById("userToUnShareTB"), unSharableUsersList);
 
console.log(viewers);
console.log(viewersString);
document.getElementById("viewersTB").value = viewersString;
let creator = document.getElementById("creatorPH");
creator.innerHTML = "נוצרה על ידי: " + question[0].question.creator_name;

            if (userP.id == question[0].question.creator_id) {
        EnableEditing();
}


}

        function setPublic() {
        let question = pageQuestion;
    let inst = userP.institute;
    let dep = question[0].department;
    let course = question[0].course;
    let subject = question[0].subject;
    let quesName = question[0].questionTitle;
    let isPublic = 1;
            firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject).child("Questions").child(quesName).update({"is_public": isPublic });
    location.reload();
}
        function setPrivate() {
        let question = pageQuestion;
    let inst = userP.institute;
    let dep = question[0].department;
    let course = question[0].course;
    let subject = question[0].subject;
    let quesName = question[0].questionTitle;
    let isPublic = 0;
            firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject).child("Questions").child(quesName).update({"is_public": isPublic });
    location.reload();
}

        function ShareQuestion() {
        console.log("test");
    let userToShare = document.getElementById("userToShareTB").value;
    let question = pageQuestion;
    let inst = userP.institute;
    let dep = question[0].department;
    let course = question[0].course;
    let subject = question[0].subject;
    let quesName = question[0].questionTitle;
    //let content = question[0].question.content;
    //let creator_id = question[0].question.creator_id;
    //let creator_name = question[0].question.creator_name;
    //let difficulty = question[0].question.difficulty;
    //let is_published = question[0].question.is_published;
    //let publish_attempt = question[0].question.publish_attempt;
    //let publish_type = question[0].question.publish_type;
    //let publish_year = question[0].question.publish_year;
    //let tags = question[0].question.tags;
    //let type = question[0].question.type;
    //let veiwers = question[0].question.viewers;


            firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject).child("Questions").child(quesName).child("Viewers").child(userToShare).set({"name": userToShare });

            swal({
                icon: 'success',
                title: 'השאלה שותפה בהצלחה!'  
            });  
    document.getElementById("userToShareTB").value = "";
           
            ShowQuestion();
            
}

function UnShareQuestion() {
    

    let userToUnShare = document.getElementById("userToUnShareTB").value;
    let question = pageQuestion;
    let inst = userP.institute;
    let dep = question[0].department;
    let course = question[0].course;
    let subject = question[0].subject;
    let quesName = question[0].questionTitle;

    firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject).child("Questions").child(quesName).child("Viewers").child(userToUnShare).remove();

    swal({
        icon: 'success',
        title: 'משתמש הוסר בהצלחה!'
 
    });  
    document.getElementById("userToUnShareTB").value = "";

    ShowQuestion();
}

        function DuplicateQuestion() {
        qustionTitle = document.getElementById("quesTB").value;
    console.log(qustionTitle); // Question Title
            window.location.href = "CreateQuestion.html?questionTitle=" + qustionTitle;
}


function UpdateSharableUsers() {
    sharableUsersList = [];
    let flag = 0;
    for (var i = 0; i < userList.length; i++) {
        flag = 0;
        for (var j = 0; j < quesViewers.length; j++) {
            if (userList[i] == quesViewers[j]) {
                flag = 1;
            }
        }
        if (userList[i] == userName) {
            flag = 1;
        }
        if (flag == 0) {
            sharableUsersList.push(userList[i]);
        }
    }
}

function UpdateUnSharableUsers() {
    unSharableUsersList = [];
    let flag = 0;
    for (var i = 0; i < userList.length; i++) {
        flag = 0;
        for (var j = 0; j < quesViewers.length; j++) {
            if (userList[i] == quesViewers[j]) {
                flag = 1;
            }
        }

        if (flag == 1) {
            unSharableUsersList.push(userList[i]);
        }
    }
}

function openForm() {
    UpdateSharableUsers();
    UpdateUnSharableUsers();
    console.log("PIZZA");
    console.log(sharableUsersList);
    console.log("UN-PIZZA");
    console.log(unSharableUsersList);

    document.getElementById("myForm").style.display = "block";
    autocomplete(document.getElementById("userToShareTB"), sharableUsersList);
    autocomplete(document.getElementById("userToUnShareTB"), unSharableUsersList);
      
}

        function closeForm() {
        document.getElementById("myForm").style.display = "none";
}

        function f1() {
            return false;
}

function downloadViaUrl(q) {
    
    const storageRef = firebase.storage().ref();
  
    // [START storage_download_via_url]
    storageRef.child(q[0].question.file_name).getDownloadURL()
        .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            // Or inserted into an <img> element
            var file = document.getElementById('files');
            //var img = document.getElementById('imgfile');
            file.setAttribute('href', url);
            //file.setAttribute('target', '_blank');
            file.setAttribute('download', url);
            //img.setAttribute('src', url);
            //file.innerText = q[0].question.file_name;
            console.log(file);
        })
        .catch((error) => {
            // Handle any errors
        });
    // [END storage_download_via_url]
}
//הוספתי את זה לא עובד טוב צריך לסדר שיעדכן את השאלה
function SaveChanges() {
    let inst = document.getElementById("instTB").value;
    let dep = document.getElementById("depTB").value;
    let course = document.getElementById("CourseTB").value;
    let subject = document.getElementById("SubjectTB").value;
    let quesName = document.getElementById("quesTB").value;
    let quesType = document.getElementById("quesTypeTB").value;
    let quesContent = document.getElementById("quesContentTB").value;
    let difficulty = document.getElementById("diffTB").value;
    let tags = document.getElementById("tagTB").value;
    let isPublished = document.getElementById("isPublishedTB").value;
    let publishType = document.getElementById("pubTypeTB").value;
    let publishYear = document.getElementById("pubYearTB").value;
    let publishAttempt = document.getElementById("pubAttemptTB").value;
    let creatorID = user.id;
    let creatorName = userName;
    console.log(creatorName);
    let created_at = new Date();
    let dd = String(created_at.getDate()).padStart(2, '0');
    let mm = String(created_at.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = created_at.getFullYear();
    created_at = dd + '/' + mm + '/' + yyyy;
    //console.log(document.getElementById('files').files[0]);
    //selectedFile = document.getElementById('files').files[0];
    //var storageRef = firebase.storage().ref();
    //var fileRef = storageRef.child(selectedFile.name);
    //fileRef.put(selectedFile).then((snapshot) => {
    //    console.log('Uploaded a file!');
    //});
    console.log(filename);
    //console.log(selectedFile);
    //console.log(selectedFile.name);
    // [END storage_upload_blob]

    if (isPublished == 'לא') {
        publishType = -1;
        publishYear = -1;
        publishAttempt = -1;
        document.getElementById("pubTypeTB").disabled = true;
        document.getElementById("pubYearTB").disabled = true;
        document.getElementById("pubAttemptTB").disabled = true;
    }
    firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject).child("Questions").child(quesName).set({ "type": quesType, "content": quesContent, "difficulty": difficulty, "tags": tags, "is_published": isPublished, "publish_type": publishType, "publish_year": publishYear, "publish_attempt": publishAttempt, "creator_id": creatorID, "creator_name": creatorName, "created_at": created_at, "file_name": filename });
    idQuesName = { // create a new JSON object
        Qname: document.getElementById("quesTB").value
    }
    // stringify before storing in localstorage
    localStorage["idQuesName"] = JSON.stringify(idQuesName);
    swal({
        icon: 'success',
        title: 'השאלה נשמרה בהצלחה!'
    });
}




//Auto Complete

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
// Get all users to auto-complete sharing options
function setUsersList() {

    refUsers = firebase.database().ref("users");
    refUsers.get().then(function (snapshot) {
        if (snapshot.exists()) {
            userData = snapshot.val();
            for (var i = 0; i < Object.keys(userData).length; i++) {
                userList.push(userData[Object.keys(userData)[i]].firstname + " " + userData[Object.keys(userData)[i]].lastname);
            }
        
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });
}