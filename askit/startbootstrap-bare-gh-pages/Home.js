var questionList = [];

function init() {
    var userInst = "";
    var database = firebase.database();
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
                userEmail = userP.email;
                showUserQuestions();
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
        RedirectToLogin();
        
    }
    //הורדת העפרון ברגע שעולה הדף


}
function Logout() {
    localStorage.clear();
    RedirectToLogin();
 
}
//////
function RedirectToLogin() {
    location.replace("Login.html");
}



function showUserQuestions() {

    let inst = userP.institute;
    let userName = userP.firstname + " " + userP.lastname;
    let userID = userP.id;
    let courses = "";
    let subjects = "";
    let questions = "";
    let question = "";
    let questionData = '';
    let depData = '';
    let thisDep = "";
    let thisCourse = "";
    let thisSubject = "";

    questionList = [];

    refD = firebase.database().ref("Institutes").child(inst).child("Departments");
    console.log(refD);
    refD.get().then(function (snapshot) {
        debugger;
        if (snapshot.exists()) {
            console.log("test");
            depData = snapshot.val();
            console.log(depData);
            for (var i = 0; i < Object.keys(depData).length; i++) {  // Running over all of the Departments
                console.log("**");
                console.log(Object.keys(depData)[i]);
                console.log(depData[Object.keys(depData)[i]]);
                console.log(depData[Object.keys(depData)[i]].Courses);
                thisDep = Object.keys(depData)[i];
                courses = depData[Object.keys(depData)[i]].Courses;

                for (var j = 0; j < Object.keys(courses).length; j++) { // Running over all of the Courses
                    console.log("***");
                    console.log(Object.keys(courses)[j]);
                    console.log(courses[Object.keys(courses)[j]]);
                    console.log(courses[Object.keys(courses)[j]].Subjects);
                    thisCourse = Object.keys(courses)[j];
                    subjects = courses[Object.keys(courses)[j]].Subjects;

                    for (var k = 0; k < Object.keys(subjects).length; k++) { // Running over all of the Subjects
                        console.log("****");
                        console.log(Object.keys(subjects)[k]);
                        console.log(subjects[Object.keys(subjects)[k]]);
                        console.log(subjects[Object.keys(subjects)[k]].Questions);
                        thisSubject = Object.keys(subjects)[k];
                        if (subjects[Object.keys(subjects)[k]].Questions != null) {
                            questions = subjects[Object.keys(subjects)[k]].Questions;
                            for (var m = 0; m < Object.keys(questions).length; m++) { // Running over all of the Questions
                                console.log("*****");
                                console.log(Object.keys(questions)[m]);
                                console.log(questions[Object.keys(questions)[m]]);
                                ques = questions[Object.keys(questions)[m]];
                                if (ques.creator_id != null && ques.creator_id == userID) {
                                    questionList.push({
                                        questionTitle: Object.keys(questions)[m],
                                        question: ques,
                                        department: thisDep,
                                        course: thisCourse,
                                        subject: thisSubject
                                    });
                                }
                                else {
                                    if (ques.Viewers != null) {
                                        viewers = ques.Viewers;
                                        for (var p = 0; p < Object.keys(viewers).length; p++) {
                                            if (Object.keys(viewers)[p] == userName) {
                                                questionList.push({
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
                        }
                    }
                }

            }
            console.log(questionList);
            ShowQuestionsHTML(questionList);
        }

        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });



}

function ShowQuestionsHTML(questionList) {
    debugger;

    if (questionList.length > 0) {
        var str = "<div class='row'>";
        for (var i = 0; i < questionList.length; i++) {
            str +=  "<div class='col-md-4 card'>"
                + "<h3>" + questionList[i].questionTitle + "</h3>"
                + "<p>" + "מחלקה: " + questionList[i].department + "</p>"
                + "<p>" + "יוצר השאלה: " + questionList[i].question.creator_name + "</p>"
                + "<p>" + "קורס: " + questionList[i].course + "</p>"
                + "<p>" + "נושא: " + questionList[i].subject + "</p>"
                + "<p>" + "רמת קושי: " + questionList[i].question.difficulty + "</p>"
                + "<p id='Content'>" + questionList[i].question.content + "</p>"
                + "<button class='btn-card dropdown' id='" + questionList[i].questionTitle + "' onclick='ShowQuestionDetails(this)'>הצג פרטי שאלה מלאים</button>"
                + "</div>"
                
                

        }

        str += "</div><br>";
        document.getElementById("placeholder").innerHTML = str;
    }

}

function ShowQuestionDetails(quesButton) {
    console.log(quesButton.id); // Question Title
    window.location.href = "QuestionDetails.html?questionTitle=" + quesButton.id;
}