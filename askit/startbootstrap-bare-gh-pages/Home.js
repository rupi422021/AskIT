var questionList = [];
var favouriteList = [];
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
                getUserFavourites();
                showUserQuestions();
                setFilterOptions();
                setFilterCreators();
                //הוספת שם בצד ימין
                var ProfileName = document.getElementById("dropdownMenuLink");
                ProfileName.innerHTML = userP.firstname + " " + userP.lastname;
                var InstName = document.getElementById("userInst");
                InstName.innerHTML = userInst;

                var input = document.getElementById("searchFilter");
                console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
                console.log(input);

                input.addEventListener("keyup", function (event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        document.getElementById("searchBTN").click();
                    }
                });
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
//פונקציה שמביאה לי את המועדפים
function getUserFavourites() {
    refUF = firebase.database().ref("users").child(userP.id).child("Favourites");
    refUF.get().then(function (snapshot) {
        if (snapshot.exists()) {
            favouriteQuestions = snapshot.val();
            for (var i = 0; i < Object.values(favouriteQuestions).length; i++) {
                favouriteList.push(Object.values(favouriteQuestions)[i]);
            }
            console.log(favouriteList);
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });
}
//התנתקות
function Logout() {
    localStorage.clear();
    RedirectToLogin();
 
}
//////
function RedirectToLogin() {
    location.replace("Login.html");
}
function f1() {
    return false;

}

function setFilterOptions() {

    let inst = userP.institute;
    let depList = [];

    refInst = firebase.database().ref("Institutes");
    refInst.child(inst).get().then(function (snapshot) {
        if (snapshot.exists()) {
            instData = snapshot.val();

            for (var i = 0; i < Object.keys(instData.Departments).length; i++) {         
                depList.push(Object.keys(instData.Departments)[i]);
            }

            var str = "<option value = '-1'>בחר מחלקה</option>";
            for (k in depList) {
                str += "<option value = '" + depList[k] + "'>" + depList[k] + "</option>";
            }
            document.getElementById("depTBFilter").innerHTML = str;
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function SetFilterCourses() {
    //פונקציה זהה למחלקות
    let inst = userP.institute;
    let dep = document.getElementById("depTBFilter").value;
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
            document.getElementById("CourseTBFilter").innerHTML = str;
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });

}

function SetFilterSubjects() {
    let inst = userP.institute;
    let dep = document.getElementById("depTBFilter").value;
    let course = document.getElementById("CourseTBFilter").value;
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

            document.getElementById("SubjectTBFilter").innerHTML = str;
        }
        else {
            console.log("No data available");
        }
    }).catch(function (error) {
        console.error(error);
    });

}

function setFilterCreators() {

   
    let creatorList = [];
   
    refUsers = firebase.database().ref("users");
    refUsers.get().then(function (snapshot) {
        if (snapshot.exists()) {
            userData = snapshot.val();

            for (var i = 0; i < Object.keys(userData).length; i++) {
                creatorList.push(userData[Object.keys(userData)[i]].firstname + " " + userData[Object.keys(userData)[i]].lastname);
            }

            var str = "<option value = '-1'>בחר משתמש</option>";
            for (k in creatorList) {
                str += "<option value = '" + creatorList[k] + "'>" + creatorList[k] + "</option>";
            }
            document.getElementById("creatorTBFilter").innerHTML = str;
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
    document.location.href = "Login.html";
}

function DelayedSearch(){
    setTimeout(Search(), 5000);
}

function Search() {
    document.getElementById("noResultPH").innerHTML = "";
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

    refDep = firebase.database().ref("Institutes").child(inst).child("Departments");
    console.log(refDep);
    refDep.get().then(function (snapshot) {
   
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
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            console.log(questionList);
            FilterQuestions(questionList);         
        }
        else {
            console.log("No data available");           
        }
    }).catch(function (error) {
        console.error(error);
    });
}


function FilterQuestions(questionList) {
    console.log(questionList);
    let inst = userP.institute;
    let depFilter = document.getElementById("depTBFilter").value;
    let courseFilter = document.getElementById("CourseTBFilter").value;
    let subjectFilter = document.getElementById("SubjectTBFilter").value;
    let difficultyFilter = "";
    let isPublishedFilter = "";
    let startDateFilter = "";
    let endDateFilter = "";
    let creatorTBFilter = "";
    let searchFilter = document.getElementById("searchFilter").value;

    if (document.getElementById('easy').checked) {
        difficultyFilter = "קל";
    }
    if (document.getElementById('medium').checked) {
        difficultyFilter = "בינוני";
    }
    if (document.getElementById('hard').checked) {
        difficultyFilter = "קשה";
    }
    if (document.getElementById('nofilter').checked) {
        difficultyFilter = "";
    }

    if (document.getElementById('yesPublishedFilter').checked) {
        isPublishedFilter = "כן";
    }
    if (document.getElementById('notPublishedFilter').checked) {
        isPublishedFilter = "לא";
    }
    if (document.getElementById('nofilter2').checked) {
        isPublishedFilter = "";
    }

    creatorFilter = document.getElementById("creatorTBFilter").value;
    
    for (var i = 0; i < questionList.length; i++) {
        if (depFilter != null && depFilter != "" && depFilter != "-1" && questionList[i].department != depFilter) {
            questionList.splice(i, 1);
            i--;
        }
        else {
            if (courseFilter != null && courseFilter != "" && courseFilter != "-1" && questionList[i].course != courseFilter) {
                questionList.splice(i, 1);
                i--;
            }
            else {
                if (subjectFilter != null && subjectFilter != "" && subjectFilter != "-1" && questionList[i].subject != subjectFilter) {
                    questionList.splice(i, 1);
                    i--;
                }
                else {
                    if (difficultyFilter != null && difficultyFilter != "" && difficultyFilter != "-1" && questionList[i].question.difficulty != difficultyFilter) {
                        questionList.splice(i, 1);
                        i--;
                    }
                    else {
                        if (isPublishedFilter != null && isPublishedFilter != "" && isPublishedFilter != "-1" && questionList[i].question.is_published != isPublishedFilter) {
                            questionList.splice(i, 1);
                            i--;
                        }
                        else {
                            if (creatorFilter != null && creatorFilter != "" && creatorFilter != "-1" && questionList[i].question.creator_name != creatorFilter) {
                                questionList.splice(i, 1);
                                i--;
                            }

                        }
                    }
                }
            }
        }
    }

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(questionList);
    let filteredUserQuestions = questionList;
    RemoveDuplicates(filteredUserQuestions);
   // CalculateSearchScore(filteredUserQuestions);
}

function RemoveDuplicates(quesList) {
    let unique = [];
    let flag = 0;
    for (var i = 0; i < quesList.length; i++) {
        flag = 0;
        for (var j = 0; j < unique.length; j++) {
            if (quesList[i].questionTitle == unique[j].questionTitle) {
                flag = 1;
            }
        }
        if (flag==0) {
            unique.push(quesList[i])
        }
    }
    CalculateSearchScore(unique);
    console.log("BBBBBBBBBBBBBBB");
    console.log(unique);
}

function CalculateSearchScore(filteredUserQuestions) {
    var match = '';
    let strSplit = '';
    let score = 0;
    let quesTags = [];
    let questionsByScore = [];
    let totalScore = 0;
    

    let searchFilter = document.getElementById("searchFilter").value;
    searchTextSplit = searchFilter.split(" ");

    for (var i = 0; i < filteredUserQuestions.length; i++) {
        for (var j = 0; j < searchTextSplit.length; j++) {
            match = filteredUserQuestions[i].questionTitle.match(searchTextSplit[j]);
            if (match != null && searchTextSplit[j] != "") {
                score = score + match.length * 3;
            }
            match = '';
        }

        for (var k = 0; k < searchTextSplit.length; k++) {
            match = filteredUserQuestions[i].question.content.match(searchTextSplit[k]);
            if (match != null && searchTextSplit[k] != "") {
                score = score + match.length;
            }
            match = '';
        }
        quesTags = filteredUserQuestions[i].question.tags.split(",");
        if (quesTags !="") {
            for (var m = 0; m < quesTags.length; m++) {
                for (var n = 0; n < searchTextSplit.length; n++) {
                    if (quesTags[m] == searchTextSplit[n]) {
                        score = score + 2
                    }
                }
            }
        }

        if (searchFilter == "") {
            questionsByScore.push({
                score: score,
                questionTitle: filteredUserQuestions[i].questionTitle,
                question: filteredUserQuestions[i].question,
                department: filteredUserQuestions[i].department,
                course: filteredUserQuestions[i].course,
                subject: filteredUserQuestions[i].subject
            });
        }
        else {
            if (score>0) {
                questionsByScore.push({
                    score: score,
                    questionTitle: filteredUserQuestions[i].questionTitle,
                    question: filteredUserQuestions[i].question,
                    department: filteredUserQuestions[i].department,
                    course: filteredUserQuestions[i].course,
                    subject: filteredUserQuestions[i].subject
                });
            }
        }

        totalScore += score;
        score = 0;
    }
    console.log("----------------------------------------");
    console.log(questionsByScore);
    questionsByScore.sort((a, b) => (a.score > b.score) ? -1 : 1);
    filteredSortedSearchResults = questionsByScore;
    console.log(totalScore);
    if (totalScore == 0 && searchFilter != "") {
        let str = "<p>No results that match your search</p>" + "<img src='https://i.ibb.co/pJTmQz2/download.jpg' alt='download' border='0' width='600px' height='300px' />";
        document.getElementById("noResultPH").innerHTML = str;
        //alert("No Results found that match your search")
    }
    ShowQuestionsHTML(filteredSortedSearchResults);
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

function AddToFavourites(quesButton) {
    let ques_title = quesButton.id;
    let user_id = userP.id;
    refF = firebase.database().ref("users").child(user_id).child("Favourites");
    refF.child(ques_title).get().then(function (snapshot) {
        if (snapshot.exists()) {
            alert("This question already exists!");
            return;
        }

        else {
            firebase.database().ref("users").child(user_id).child("Favourites").child(ques_title).set({ "title": ques_title });
            alert("Question Added to Favourites!");
        }
    }).catch(function (error) {
        console.error(error);
    });


}



function ShowQuestionsHTML(questionList) {
 
    
    if (questionList.length > 0) {
        var str = "<div class='row'>";
        let btnfav = '';
        for (var i = 0; i < questionList.length; i++) {
            if (favouriteList.length) {
                let flag = false;
                for (var j = 0; j < favouriteList.length; j++) {
                    if (favouriteList[j].title == questionList[i].questionTitle) {
                        flag = true;
                        btnfav = "<button onclick='AddToFavourites(this)' class='favouritesBTNred' id='" + questionList[i].questionTitle + "'>";
                    }
                    else if (flag == false) {
                        btnfav = "<button onclick='AddToFavourites(this)' class='favouritesBTN' id='" + questionList[i].questionTitle + "'>";
                    }
                }
            } else {
                btnfav = "<button onclick='AddToFavourites(this)' class='favouritesBTN' id='" + questionList[i].questionTitle + "'>";
            }
            
            str += "<div class='col-md-4 card'>"
                + "<h3>" + questionList[i].questionTitle + "</h3>"
                + "<p>" + "מחלקה: " + questionList[i].department + "</p>"
                + "<p>" + "יוצר השאלה: " + questionList[i].question.creator_name + "</p>"
                + "<p>" + "קורס: " + questionList[i].course + "</p>"
                + "<p>" + "נושא: " + questionList[i].subject + "</p>"
                + "<p>" + "רמת קושי: " + questionList[i].question.difficulty + "</p>"
                + "<p id='Content'>" + questionList[i].question.content + "</p>"
                + "<div class='row'>" + "<div class='col-8-ml-auto'>" + "<button class='btn-card dropdown' id='" + questionList[i].questionTitle + "' onclick='ShowQuestionDetails(this)'>הצג פרטי שאלה מלאים</button></div>"
                + "<div class='col-4'>" + btnfav + "♡</button>"
                + "</div></div></div>"
        }
        //+ "<div class='col-4'>" + "<button onclick='AddToFavourites(this)' class='favouritesBTN' id='" + questionList[i].questionTitle + "'>♡</button>"
        str += "</div><br>";
        document.getElementById("placeholder").innerHTML = str;
    }
    else {
        document.getElementById("placeholder").innerHTML =""
    }

}

function ShowQuestionsHTMLcopy(questionList) {


    if (questionList.length > 0) {
        var str = "<div class='row'>";

        for (var i = 0; i < questionList.length; i++) {
            let btnfav = '';
            for (var j = 0; j < favouriteList.length; j++) {
                if (favouriteList[j].title == questionList[i].questionTitle)
                    btnfav = "<button onclick='AddToFavourites(this)' class='favouritesBTNred' id='";
                else
                    btnfav = "<button onclick='AddToFavourites(this)' class='favouritesBTN' id='";
            }
            str += "<div class='col-md-4 card'>"
                + "<h3>" + questionList[i].questionTitle + "</h3>"
                + "<p>" + "מחלקה: " + questionList[i].department + "</p>"
                + "<p>" + "יוצר השאלה: " + questionList[i].question.creator_name + "</p>"
                + "<p>" + "קורס: " + questionList[i].course + "</p>"
                + "<p>" + "נושא: " + questionList[i].subject + "</p>"
                + "<p>" + "רמת קושי: " + questionList[i].question.difficulty + "</p>"
                + "<p id='Content'>" + questionList[i].question.content + "</p>"
                + "<div class='row'>" + "<div class='col-8-ml-auto'>" + "<button class='btn-card dropdown' id='" + questionList[i].questionTitle + "' onclick='ShowQuestionDetails(this)'>הצג פרטי שאלה מלאים</button></div>"
                + "<div class='col-4'>" + btnfav + questionList[i].questionTitle + "'>♡</button>"
                + "</div></div></div>"



        }
        //+ "<div class='col-4'>" + "<button onclick='AddToFavourites(this)' class='favouritesBTN' id='" + questionList[i].questionTitle + "'>♡</button>"
        str += "</div><br>";
        document.getElementById("placeholder").innerHTML = str;
    }
    else {
        document.getElementById("placeholder").innerHTML = ""
    }

}

function ShowQuestionDetails(quesButton) {
    console.log(quesButton.id); // Question Title
    window.location.href = "fullQuestion.html?questionTitle=" + quesButton.id;
}


