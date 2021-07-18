 var uId = null;
        var today = new Date();
        $(document).ready(function () {
            mode = "";
            init();
            //$("#USERSForm").submit(onSubmitFunc);
             

        });

        function init() { 
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
            }
            usersList = [];
            var database = firebase.database();
            ref = firebase.database().ref("users");
            
            ref.get().then(function (snapshot) {
                if (snapshot.exists()) {
                    users = snapshot.val();
                    for (var i = 0; i < Object.values(users).length; i++) {
                        usersList.push(Object.values(users)[i]);
                    }
                    console.log(usersList);
                    SelectUserInstitute(usersList);
                    mode = "";
                    document.getElementById("editDiv").style.display = "none";
                    buttonEvents();
                    BuildSelectInstitute();
                }
                else {
                    console.log("No data available");
                }
            }).catch(function (error) {
                console.error(error);
            });


        }

        function cancelSaveFunc() {
            //בכל פעם שלוחצים על הכפתור זה קורא לפונקציה
            data = null;
            document.getElementById("editDiv").style.display = "none";
            if (mode == "new") {
                document.getElementById("pForm").style.display = "block";
            }
            mode = "";
        }

        function NewUserfunc() {
            data = null;
            mode = "new";
            document.getElementById("pForm").style.display = "none";
            document.getElementById("editDiv").style.display = "block";
            clearFields();
            document.getElementById("editDiv").disabled = false;
            document.getElementById("RegistrationDate").value = getDateString(today);
            document.getElementById("RegistrationDate").disabled = true;
            document.getElementById("FirstName").disabled = false;
            document.getElementById("LastName").disabled = false;
            document.getElementById('addnewU').style.display = "block";
        }
        
        function buttonEvents() {
            //כפתור של עריכה 
            $(document).on("click", ".editBtn", function () {
                mode = "edit";
                markSelected(this);
                $("#editDiv").show();
                $("#editDiv :input").prop("disabled", false);// edit mode: enable all controls in the form
                $("#RegistrationDate").prop("disabled", true);
                $("#FirstName").prop("disabled", true);
                $("#LastName").prop("disabled", true);
                $("#addnewU").hide();
                populateFields(this.getAttribute('data-Id'));

            });

            $(document).on("click", ".viewBtn", function () {
                mode = "view";
                markSelected(this);
                $("#editDiv").show();
                $("#addnewU").hide();
                $("#editDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
                populateFields(this.getAttribute('data-Id'));
            });

            $(document).on("click", ".deleteBtn", function () {
                mode = "delete";
                markSelected(this);
                var uId = this.getAttribute('data-Id');
                swal({ // this will open a dialouge
                    title: "Are you sure ??",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                })
                    .then(function (willDelete) {
                        if (willDelete) DeleteUser(uId);
                        else swal("Not Deleted!");
                    });
            });
        }

        function redrawTable(tbl, data) {
            tbl.clear();
            for (var i = 0; i < data.length; i++) {
                tbl.row.add(data[i]);
            }
            tbl.draw();
        }

        function DeleteUser(id) {
            //מחיקה משתמש
            ref.child(id).remove();
            deleteSuccess(dataU);
            location.reload();
        }

        // success callback function after delete
        function deleteSuccess(dataU)
        {
            tbl.clear();
            redrawTable(tbl, dataU);
            buttonEvents(); // after redrawing the table, we must wire the new buttons
            $("#editDiv").hide();
            swal("Deleted Successfuly!", "Great Job", "success");
            mode = "";
            init();
        }

        function clearFields() {
            document.getElementById("FirstName").value = "";
            document.getElementById("LastName").value = "";
            document.getElementById("RegistrationDate").value = "";
            document.getElementById("instTB").value = "";
            document.getElementById("statusTB").value = "";
        }

        function populateFields(Id) {
            data = getUser(Id);
            console.log(data.status);
            document.getElementById("FirstName").value = data.firstname;
            document.getElementById("LastName").value = data.lastname;
            document.getElementById("RegistrationDate").value = data.dateReg;
            document.getElementById("instTB").value = data.institute;           
            document.getElementById("statusTB").value = data.status;
        }
        // get a user according to its Id
        function getUser(id) {
      
            for (i in dataU) {
                if (dataU[i].id == id)
                    return dataU[i];
            }
            return null;
        }

        function markSelected(btn) {
            $("#UsersTable tr").removeClass("selected"); // remove seleced class from rows that were selected before
            row = (btn.parentNode).parentNode; // button is in TD which is in Row
            row.className = 'selected'; // mark as selected
        }

        function getDateString(date) {
            return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        }

        //function onSubmitFunc() {

        //    var Id = -1;
        //    if (mode == "edit") {
        //        Id = dataU.id;
        //    }

        //    let UsertoSave = {
        //        Id: Id,
        //        inst: document.getElementById("instTB").value,
        //        status: document.getElementById("statusTB").value
        //    }
        //    if (mode == "edit") {
        //        firebase.database().ref("users").child(Id).child("institute").update(UsertoSave);
        //        updateSuccess();

        //    }
        //}
            function savefunction() {
            var Id = -1;
            if (mode == "edit") {
                Id = data.id;
            }
                let UsertoSave = {
                    "id": data.id,
                    "institute": document.getElementById("instTB").value,
                    "status": document.getElementById("statusTB").value
                }

                let idu = document.getElementById("idTB").value;
                let usertoInsert = {
                id: idu,
                firstname: document.getElementById("FirstName").value,
                lastname: document.getElementById("LastName").value,
                email: document.getElementById("emailTB").value,
                password: document.getElementById("passwordTB").value,
                institute: document.getElementById("instTB").value,
                dateReg: getDateString(today),
                status: document.getElementById("statusTB").value
                }
                console.log(idu);
                if (mode == "edit") {
                    firebase.database().ref("users").child(data.id).update(UsertoSave);
                    updateSuccess(dataU);
                }
                else if (mode == "new") {
                    firebase.database().ref("users").child(idu).set(usertoInsert);
                    insertSuccess(dataU);
                }
                location.reload();
                //return false;
            
            }
            // success callback function after update
            function updateSuccess(dataU) {
                tbl.clear();
                redrawTable(tbl, dataU);
                buttonEvents();
                $("#editDiv").hide();
                swal("Updated Successfuly!", "Great Job", "success");
                mode = "";
        }

        function insertSuccess(dataU) {
            $("#pForm").show();
            tbl.clear();
            redrawTable(tbl, dataU);
            buttonEvents();
            $("#editDiv").hide();
            swal("Inserted Successfuly!", "Great Job", "success");
            mode = "";
        }

        function BuildSelectInstitute() {
            InstitutesList = [];
            var database = firebase.database();
            //הבאת ערכים מהפיירבייס
            refInst = firebase.database().ref("Institutes");
          
            refInst.get().then(function (snapshot) {
                if (snapshot.exists()) {
                    ObjectInstitute = snapshot.val();
                    //פונקציה שמביאה אובייקט מהפייר בייס
                    for (var i = 0; i < Object.keys(ObjectInstitute).length; i++) {
                        InstitutesList.push(Object.keys(ObjectInstitute)[i]);
                    }
                    console.log(InstitutesList);
                    //רינדור למסך
                    var str = "<option value = '-1'>בחר מוסד</option>";
                    for (k in InstitutesList) {
                        str += "<option value = '" + InstitutesList[k] + "'>" + InstitutesList[k] + "</option>";
                    }
                    document.getElementById("instTB").innerHTML = str;
                }
                else {
                    console.log("No data available");
                }
            }).catch(function (error) {
                console.error(error);
            });

        }

        function SelectUserInstitute(usersList) {
            dataU = usersList;
            try {
                tbl = $('#UsersTable').DataTable({
                    data: usersList,
                    pageLength: 5,
                    columns: [
                        {
                            render: function (data, type, row, meta) {
                                let dataUser = "data-Id='" + row.id + "'";
                                console.log(dataUser);
                                editBtn = "<button type='button' class = 'editBtn btn btn-success' " + dataUser + "> Edit </button>";
                                viewBtn = "<button type='button' class = 'viewBtn btn btn-info' " + dataUser + "> View </button>";
                                deleteBtn = "<button type='button' class = 'deleteBtn btn btn-danger' " + dataUser + "> Delete </button>";
                                return editBtn + viewBtn + deleteBtn;
                            }
                        },
                        { data: "id" },
                        { data: "firstname" },
                        { data: "lastname" },
                        { data: "dateReg" },
                        { data: "institute" },
                        { data: "status" }
                    ],
                });
                // redrawTable(tbl, usersList);
            }
            catch (err) {

                alert(err);
            }
        }