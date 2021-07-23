var questionList = [];
var userName = "";
var allQuestions = [];

function init() {
    var storage = firebase.storage();
    
    //var storage = firebase.app().storage("gs://askit-35d7a.appspot.com");
    document.getElementById("published").style.display = "none";
    document.getElementById("pubAttempt").style.display = "none";
    ref = firebase.database().ref("users");

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
                SelectUserInstitute(userP);
                GetAllQuestionsList();
                //הוספת שם בצד ימין
                var ProfileName = document.getElementById("dropdownMenuLink");
                ProfileName.innerHTML = userP.firstname + " " + userP.lastname;
                var InstName = document.getElementById("userInst");
                InstName.innerHTML = userInst;
                ShowDuplicatedQuestion();
                
                console.log("TTTTTTTTTT");
                console.log(allQuestions);
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
    //הורדת העפרון ברגע שעולה הדף
    document.getElementById("PencilIcon").style.display = "none";

}
function Logout() {
    localStorage.clear();
    RedirectToLogin();

}
//////
function RedirectToLogin() {
    location.replace("Login.html");
}

function AddQuestion() {
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
    let created_at = new Date();
    let dd = String(created_at.getDate()).padStart(2, '0');
    let mm = String(created_at.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = created_at.getFullYear();
    let fileName = '';
    created_at = dd + '/' + mm + '/' + yyyy;
    selectedFile = document.getElementById('files').files[0];
    if (selectedFile != null) {
        fileName = selectedFile.name;
        var storageRef = firebase.storage().ref();
        var fileRef = storageRef.child(selectedFile.name);
        fileRef.put(selectedFile).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    }
    else {
        fileName = "-1";
    }

    
    let flag = 1;
    for (var i = 0; i < allQuestions.length; i++) {
        if (allQuestions[i] == quesName) {
            flag = 0;
        }
    }
    
    if (flag == 1) {
        firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject).child("Questions").child(quesName).set({ "type": quesType, "content": quesContent, "difficulty": difficulty, "tags": tags, "is_published": isPublished, "publish_type": publishType, "publish_year": publishYear, "publish_attempt": publishAttempt, "creator_id": creatorID, "creator_name": creatorName, "created_at": created_at, "is_public": 0, "file_name": fileName });
        idQuesName = { // create a new JSON object
            Qname: document.getElementById("quesTB").value
        }
        // stringify before storing in localstorage
        localStorage["idQuesName"] = JSON.stringify(idQuesName);
        swal({
            icon: 'success',
            title: 'השאלה נוצרה בהצלחה!'
        }); 
        window.location.href = "fullQuestion.html?questionTitle=" + quesName;
    }
    else {
        swal({
            icon: 'error',
            title: 'אנא בחר שם אחר לשאלה',
            text: 'קיימת שאלה עם שם זהה במערכת'
        });   
    }

}

//function storeToLS(quesName) {
//    qname = quesName;
//    idQuesName = { // create a new JSON object
//        Qname: qname
//    }
//    // stringify before storing in localstorage
//    //הערה
//    localStorage["idQuesName"] = JSON.stringify(idQuesName);
//}

function SelectUserInstitute(userP) {
    //לוקח את המוסד של המשתמש
    let inst = userP.institute;
    //רשימת מחלקות
    let depList = [];
    //תכתוב את הערך של המשתמש בתוך תיבת הטקסט של המוסד
    document.getElementById("instTB").value = inst;

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


function SetCourses() {
    //פונקציה זהה למחלקות
    let inst = document.getElementById("instTB").value;
    let dep = document.getElementById("depTB").value;
    let courseList = [];

    refD = firebase.database().ref("Institutes").child(inst).child("Departments");
    refD.child(dep).get().then(function (snapshot) {
        if (snapshot.exists()) {
            depData = snapshot.val();
            console.log(depData);
            for (var i = 0; i < Object.keys(depData.Courses).length; i++) {
                courseList.push(Object.keys(depData.Courses)[i]);
            }

            var str = "<option value = '-1'>בחר קורס</option>";
            for (k in courseList) {
                str += "<option value = '" + courseList[k] + "'>" + courseList[k] + "</option>";
            }
            document.getElementById("CourseTB").innerHTML = str;
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });

}

function SetSubjects() {
    let inst = document.getElementById("instTB").value;
    let dep = document.getElementById("depTB").value;
    let course = document.getElementById("CourseTB").value;
    let subjectList = [];

    refC = firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses");
    refC.child(course).get().then(function (snapshot) {
        if (snapshot.exists()) {
            courseData = snapshot.val();

            for (var i = 0; i < Object.keys(courseData.Subjects).length; i++) {
                subjectList.push(Object.keys(courseData.Subjects)[i]);
            }
            subjectList.push("אחר");

            var str = "<option value = '-1'>בחר נושא</option>";

            for (k in subjectList) {
                str += "<option value = '" + subjectList[k] + "'>" + subjectList[k] + "</option>";

            }

            document.getElementById("SubjectTB").innerHTML = str;
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });

}
function Logout() {
    localStorage.clear();
    document.getElementById("logout").style.display = "none";
    document.location.href = "Login-New.html";

}

function GetAllQuestionsList(){
    let inst = userP.institute;
    allQuestionsList = [];

    refD = firebase.database().ref("Institutes").child(inst).child("Departments");
    console.log(refD);
    refD.get().then(function (snapshot) {

        if (snapshot.exists()) {
            console.log("test");
            depData = snapshot.val();
            console.log(depData);
            for (var i = 0; i < Object.keys(depData).length; i++) {  // Running over all of the Departments             
                courses = depData[Object.keys(depData)[i]].Courses;

                for (var j = 0; j < Object.keys(courses).length; j++) { // Running over all of the Courses
                    subjects = courses[Object.keys(courses)[j]].Subjects;

                    for (var k = 0; k < Object.keys(subjects).length; k++) { // Running over all of the Subjects

                        if (subjects[Object.keys(subjects)[k]].Questions != null) {
                            questions = subjects[Object.keys(subjects)[k]].Questions;
                            for (var m = 0; m < Object.keys(questions).length; m++) { // Running over all of the Questions

                                ques = questions[Object.keys(questions)[m]];
                                allQuestionsList.push(Object.keys(questions)[m]);
                            }
                        }
                    }
                }

            }
            console.log("***BANANA***");
            console.log(allQuestionsList);
            allQuestions= allQuestionsList;
        }

        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });
}


function showSimilarQuestions() {

    let inst = document.getElementById("instTB").value;
    let dep = document.getElementById("depTB").value;
    let course = document.getElementById("CourseTB").value;
    let subject = document.getElementById("SubjectTB").value;
    let quesName = document.getElementById("quesTB").value;
    let quesType = document.getElementById("quesTypeTB").value;
    let questionData = '';
    questionList = [];




    refQ = firebase.database().ref("Institutes").child(inst).child("Departments").child(dep).child("Courses").child(course).child("Subjects").child(subject);
    refQ.child("Questions").get().then(function (snapshot) {
        if (snapshot.exists()) {
            questionData = snapshot.val();

            for (var i = 0; i < Object.keys(questionData).length; i++) {
                questionList.push(Object.keys(questionData)[i]);
            }

            score = CalculateScore(questionData);
        }

        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });

}


function CalculateScore(quesData) {

    var match = '';
    let strSplit = '';
    let score = 0;
    let quesName = document.getElementById("quesTB").value;
    let quesType = document.getElementById("quesTypeTB").value;
    let quesContent = document.getElementById("quesContentTB").value.trim(); // Using the trim function to avoid counting matching value of " "
    let difficulty = document.getElementById("diffTB").value;
    let tags = document.getElementById("tagTB").value.split(",");
    let quesTags = [];
    quesNameSplit = quesName.split(" ");
    quesContentSplit = quesContent.split(" ");
    let questionsByScore = [];
    // quesData[Object.keys(quesData)].publish_type
    for (var i = 0; i < Object.keys(quesData).length; i++) {
        for (var j = 0; j < quesNameSplit.length; j++) {
            match = Object.keys(quesData)[i].match(quesNameSplit[j]);
            if (match != null && quesNameSplit[j] != "") {
                score = score + match.length * 2;
            }
            match = '';
        }
        if (quesType == quesData[Object.keys(quesData)[i]].type) {
            score = score + 1
        }
        if (difficulty == quesData[Object.keys(quesData)[i]].difficulty) {
            score = score + 1
        }

        for (var k = 0; k < quesContentSplit.length; k++) {
            match = quesData[Object.keys(quesData)[i]].content.match(quesContentSplit[k]);
            if (match != null && quesContentSplit[k] != "") {
                score = score + match.length;
            }
            match = '';
        }
        quesTags = quesData[Object.keys(quesData)[i]].tags.split(",");
        for (var m = 0; m < quesTags.length; m++) {
            for (var n = 0; n < tags.length; n++) {
                if (quesTags[m] == tags[n]) {
                    score = score + 2
                }
            }

        }

        if (score > 2) {
            questionsByScore.push({
                score: score,
                questionTitle: Object.keys(quesData)[i],
                question: quesData[Object.keys(quesData)[i]]
            });
        }

        score = 0;
    }
    console.log(questionsByScore);
    ShowRelatedQuestions(questionsByScore);

}

function ShowRelatedQuestions(questionsByScore) {
    questionsByScore.sort((a, b) => (a.score > b.score) ? -1 : 1);
    if (questionsByScore.length > 0) {
        document.getElementById("middmainid").style.display = "block";
        var str = "<h3>" + ":אולי יעניין אותך גם" + "</h3>"+ "<div class='row'>";
        for (var i = 0; i < questionsByScore.length; i++) {
            str += "<div class='col-md-8 card'>"
                + "<h3>" + questionsByScore[i].questionTitle + "</h3>"
                + "<p>" + "רמת קושי: " + questionsByScore[i].question.difficulty + "</p>"
                + "<p>" + questionsByScore[i].question.content + "</p>"
                + "<p>" + "ציון התאמה: " + questionsByScore[i].score + "</p>"
                + "<button class='btn-card dropdown' id='" + questionsByScore[i].questionTitle + "' onclick='ShowQuestion(this)'>הצג שאלה</button>"
                + "</div>"

        }

        str += "</div><br>"
        document.getElementById("placeholder").innerHTML = str;
    }


}
function ShowQuestion(quesButton) {
    console.log(quesButton.id); // Question Title
    window.location.href = "fullQuestion.html?questionTitle=" + quesButton.id;
}

function showpublish() {
    let p = document.getElementById("isPublishedTB").value;
    if (p == "כן") {
        document.getElementById("published").style.display = "block";
    }
    else
        document.getElementById("published").style.display = "none";
}
function showwherepublish() {
    let w = document.getElementById("pubTypeTB").value;
    if (w == "מבחן") {
        document.getElementById("pubAttempt").style.display = "block";
    }
    else {
            document.getElementById("pubAttempt").style.display = "none";
    }
}

function ShowDuplicatedQuestion() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    console.log(url_string);
    questionTitle = url.searchParams.get("questionTitle");
    console.log(questionTitle);

    if (questionTitle != null) {

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
                ShowQuestionDetails(question);
            }

            else {
                console.log("No data available");
            }
        }).catch(function (error) {
            console.error(error);
        });

    }



}


function ShowQuestionDetails(question) {

    // NOT WORKING
  
    if (question[0].question.tags.length > 0) {
        var splitTags = question[0].question.tags.split(",");
        console.log(question[0].question.tags);
        console.log(splitTags);
        console.log(splitTags[0]);
        console.log(splitTags[1]);
        var tagInput = $("#tagTB");
        tagInput.tagsinput();
        for (var i = 0; i < splitTags.length; i++) {
            tagInput.tagsinput('add', splitTags[i]);
        }
    }

   // $input[2].__proto__.constructor('input', "banana");
        //.itemsArray.push(question[0].question.tags);


    //document.getElementById("tagTB").TagsInput('input', question[0].question.tags);
    //document.getElementById("tagTB").itemsArray.push(question[0].question.tags);
    //console.log(document.getElementById("tagTB").itemsArray);
    document.getElementById("quesTypeTB").value = question[0].question.type;
    document.getElementById("quesContentTB").value = question[0].question.content;
    document.getElementById("diffTB").value = question[0].question.difficulty;
    document.getElementById("isPublishedTB").value = question[0].question.is_published;
    document.getElementById("pubTypeTB").value = question[0].question.publish_type;
    document.getElementById("pubYearTB").value = question[0].question.publish_year;
    document.getElementById("pubAttemptTB").value = question[0].question.publish_attempt;
    
}



