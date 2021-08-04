/* ------ Display Errors ------*/

function ajaxErrorHandle(jqXhr, redirect = false) {
    if (jqXhr.responseJSON != null) {
        let errors = '';
        $.each(jqXhr.responseJSON.errors, function (key, error) {
            errors = errors + '<li>' + error + '</li>';
        });
        let printStr = '<div class="alert alert-danger alert-dismissible mt-3 mx-3 fade show errorMessage" role="alert"><strong>Error!</strong> Operation failed. Please check the errors and retry.<ul>' + errors + '</ul><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        $('#title').after(printStr);
    } else {
        toastr.error('Something went wrong!', 'Error');
    }

    if (redirect) {
        window.location.replace("../home1.html");
    }
}


/* ------ Get Search Result ------*/

function searchBook(form){

    /*------ Clear table before load ------ */
    let tbodayRef = document.getElementById('book_search_result_table');
    while(tbodayRef.rows.length > 1){
        tbodayRef.deleteRow(1);
    }
    tbodayRef.createTBody();
    document.getElementById("staticEmail2").value = "Number of Records: 0";


    let i = 0;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080//staff',
        data:form.serialize(),
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            console.log(result);
            $.each(result[i], function (key, book){
                // console.log(result[i]['availability']);
                // console.log(book);
                let printStr = '<tr><td></td><td scope="row">'+(i+1)+'</td><td>'+result[i].bookID+'</td><td>'+result[i].isbn+'</td><td>'+result[i].title+'</td><td>'+result[i].author+'</td><td>'+result[i].category+'</td>><td>'+result[i].addedDate+'</td><td>'+result[i].availability+'</td><td></td></tr>';
                i++;
                document.getElementById("staticEmail2").value = "Number of Records: " + i;
                $('#book_search_result_table tr:last').after(printStr);
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
}

// ------ Book Issue ------

$(document).ready(function (){
    $('#book_issue_form').submit(function (event){
        let formData=$(this);
        // alert(JSON.stringify(formData.serialize()));

        $.ajax({
            type: "POST",
            url: 'http://localhost:8080/staff',
            data:formData.serialize(),
            success: function (data){

                let id = Cookies.get("userID");
                if(data == "success"){
                    alert("Book Issued Successfully");
                    // window.location.replace("../staff_dashboard.html");
                    window.location.href = "./staff_dashboard.html";

                }else{
                    alert(data);
                    window.location.href = "./staff_dashboard.html";
                }

            },
            error: function (jqXhr, textStatus, errorMessage){
                ajaxErrorHandle(jqXhr);
            }

        });
        event.preventDefault();
    });
});

// ------ Book Return ------

$(document).ready(function (){
    $('#book_return_form').submit(function (event){
        let formData=$(this);

        $.ajax({
            type: "POST",
            url: 'http://localhost:8080/staff',
            data:formData.serialize(),
            success: function (data){
                console.log(data);
                let result = JSON.parse(JSON.stringify(data))[0];
                let state = JSON.parse(JSON.stringify(data))[1];
                console.log(result);
                console.log(state);

                // let id = Cookies.get("userID");
                if(result == "success"){
                    if(state == "0"){
                        alert("Book returned Successfully");
                    }else{
                        alert("Fine is: " + state + "\nBook returned Successfully");
                    }

                    window.location.href = "./staff_dashboard.html";

                }else{
                    alert(result + "\n" + state);
                    window.location.href = "./staff_dashboard.html";
                }

            },
            error: function (jqXhr, textStatus, errorMessage){
                console.log(jqXhr);
                ajaxErrorHandle(jqXhr);
            }

        });
        event.preventDefault();
    });
});

// ------  Dashboard OnLoad  ------

function dashboardOnload(){

    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/staff',
        data: {'type': "dashboardOnLoad"},
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            console.log(result[0]);

            // ------  Set Numbers to Dashboard Buttons ------

            document.getElementById('ebooksPendingButton').setAttribute('value', result[0] + " Books Pending to Approve");
            document.getElementById('membersPendingButton').setAttribute('value', result[1] + " Members Pending to Approve");
            document.getElementById('publishersPendingButton').setAttribute('value', result[2] + " Publishers Pending to Approve");
            document.getElementById('dueTodayButton').setAttribute('value', result[3] + " Books Due Today");
            document.getElementById('dueBooksButton').setAttribute('value', result[4] + " Books Not Returned");

            // ------  Set Colour to Dashboard Buttons ------

            if(result[0] > 0){
                document.getElementById('ebooksPendingButton').setAttribute('class', "btn btn-danger");
            }else {
                document.getElementById('ebooksPendingButton').setAttribute('class', "btn btn-success");
            }
            if(result[1] > 0){
                document.getElementById('membersPendingButton').setAttribute('class', "btn btn-danger");
            }else {
                document.getElementById('membersPendingButton').setAttribute('class', "btn btn-success");
            }
            if(result[2] > 0){
                document.getElementById('publishersPendingButton').setAttribute('class', "btn btn-danger");
            }else {
                document.getElementById('publishersPendingButton').setAttribute('class', "btn btn-success");
            }
            if(result[3] > 0){
                document.getElementById('dueTodayButton').setAttribute('class', "btn btn-danger");
            }else {
                document.getElementById('dueTodayButton').setAttribute('class', "btn btn-success");
            }
            if(result[4] > 0){
                document.getElementById('dueBooksButton').setAttribute('class', "btn btn-danger");
            }else {
                document.getElementById('dueBooksButton').setAttribute('class', "btn btn-success");
            }

        },
        error: function (jqXhr, textStatus, errorMessage){
            console.log(jqXhr);
            ajaxErrorHandle(jqXhr);
        }

    });
}

//  ------ Load Pending Ebook Table ------
function getPendingEbookList(availability){
    console.log(availability);

    /*------ Clear table before load ------ */
    let tbodayRef = document.getElementById('pending_books_result_table');
    while(tbodayRef.rows.length > 1){
        tbodayRef.deleteRow(1);
    }

    let i = 0;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/staff',
        data:{'type': "getPendingBookList", 'availability': "pending"},
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            console.log(result);

            if(result[0] != "Error"){
                $.each(result[i], function (key, book){
                    console.log(result[i]);
                    // console.log(book);
                    let printStr = '<tr><td scope="row">'+(i+1)+'</td><td>'+result[i].bookID+'</td><td>'+result[i].title+'</td><td>'+result[i].publisherID+'</td><td><div class="row">' +
                        '                                        <input type="submit" class="btn btn-primary" value="Approve" onclick="bookApprove(\'' + result[i].bookID + '\', \'approve\')">' +
                        '                                        <input type="submit" class="btn btn-primary" style="background-color: firebrick" value="Reject" onclick="bookApprove(\'' + result[i].bookID + '\', \'reject\')">' +
                        '                                    </div></td></tr>';
                    i++;

                    $('#pending_books_result_table tr:last').after(printStr);
                });

            }else{
                alert(result[0]);
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
    // preventDefault();

}

// ------ E Book Approve / Reject ------

function bookApprove(bookID,approvalType) {
    // alert(bookID + "\n" + approvalType);

    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/staff',
        data: {'type': "approveEbook", 'bookID': bookID, 'staffID': "s123", 'approvalType': approvalType},
        success: function (data) {

            let id = Cookies.get("userID");
            if (data == "success") {
                alert("Successfully " + approvalType);
                // window.location.replace("../staff_dashboard.html");
                window.location.href = "./staff_dashboard.html";

            } else {
                alert(data);
                window.location.href = "./staff_dashboard.html";
            }

        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }

    });
}

//  ------ Load Pending Members Table ------
function getPendingMemberList(availability){
    console.log("start");

    /*------ Clear table before load ------ */
    let tbodayRef = document.getElementById('pending_member_result_table');
    while(tbodayRef.rows.length > 1){
        tbodayRef.deleteRow(1);
    }

    let i = 0;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/staff',
        data:{'type': "getPendingMemberList", 'availability': availability},
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            console.log(result);
            if(result[0] != "Error"){
                $.each(result[i], function (key, book){
                    console.log(result[i]);
                    // console.log(book);
                    let printStr = '<tr><td scope="row">'+(i+1)+'</td><td>'+result[i].memberID+'</td><td>'+result[i].name+'</td><td><div class="row">' +
                        '                                        <input type="submit" class="btn btn-primary" value="Approve" onclick="memberApprove(\'' + result[i].memberID + '\', \'approve\')">' +
                        '                                        <input type="submit" class="btn btn-primary" style="background-color: firebrick" value="Reject" onclick="memberApprove(\'' + result[i].memberID + '\', \'reject\')">' +
                        '                                    </div></td></tr>';
                    i++;

                    $('#pending_member_result_table tr:last').after(printStr);
                });
            }else{
                alert(result[0]);
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert(jqXhr);
            ajaxErrorHandle(jqXhr);
        }
    });
    // preventDefault();

}

// ------ Member Approve / Reject ------

function memberApprove(memberID,approvalType) {
    // alert(memberID + "\n" + approvalType);

    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/staff',
        data: {'type': "approveMember", 'memberID': memberID, 'staffID': "s123", 'approvalType': approvalType},
        success: function (data) {

            if (data == "success") {
                alert("Successfully " + approvalType);
                // window.location.replace("../staff_dashboard.html");
                window.location.href = "./staff_dashboard.html";

            } else {
                alert(data);
                window.location.href = "./staff_dashboard.html";
            }

        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }

    });
}

//  ------ Load Pending Publisher Table ------
function getPendingPublisherList(availability){
    console.log("start");

    /*------ Clear table before load ------ */
    let tbodayRef = document.getElementById('pending_publisher_result_table');
    while(tbodayRef.rows.length > 1){
        tbodayRef.deleteRow(1);
    }

    let i = 0;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080//staff',
        data:{'type': "getPendingPublisherList", 'availability': availability},
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            console.log(result);
            if(result[0] != "Error"){
                $.each(result[i], function (key, book){
                    console.log(result[i]);
                    // console.log(book);
                    let printStr = '<tr><td scope="row">'+(i+1)+'</td><td>'+result[i].publisherID+'</td><td>'+result[i].name+'</td><td><div class="row">' +
                        '                                        <input type="submit" class="btn btn-primary" value="Approve" onclick="publisherApprove(\'' + result[i].publisherID + '\', \'approve\')">' +
                        '                                        <input type="submit" class="btn btn-primary" style="background-color: firebrick" value="Reject" onclick="publisherApprove(\'' + result[i].publisherID + '\', \'reject\')">' +
                        '                                    </div></td></tr>';
                    i++;

                    $('#pending_publisher_result_table tr:last').after(printStr);
                });
            }else{
                alert(result[0]);
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
    // preventDefault();

}

// ------ Member Approve / Reject ------

function publisherApprove(publisherID,approvalType) {
    // alert(memberID + "\n" + approvalType);

    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/staff',
        data: {'type': "approvePublisher", 'publisherID': publisherID, 'staffID': "s123", 'approvalType': approvalType},
        success: function (data) {

            if (data == "success") {
                alert("Successfully " + approvalType);
                // window.location.replace("../staff_dashboard.html");
                window.location.href = "./staff_dashboard.html";

            } else {
                alert(data);
                window.location.href = "./staff_dashboard.html";
            }

        },
        error: function (jqXhr, textStatus, errorMessage) {
            ajaxErrorHandle(jqXhr);
        }

    });
}

$(document).ready(function (){
    $('#staff_memberStat_search_form').submit(function (event){
        // alert("start");
        let formData=$(this);

        /*------ Clear table before load ------ */
        let tbodayRef = document.getElementById('memberStat_search_result_table');
        while(tbodayRef.rows.length > 1){
            tbodayRef.deleteRow(1);
        }

        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/staff',
            data:formData.serialize(),
            success: function (data){
                let result = JSON.parse(JSON.stringify(data));
                // alert(result);
                if(result[0] != "Error"){
                        console.log(result[0]);
                        // console.log(book);
                        let printStr = '<tr><td scope="row"></td><td>'+result[0]+ '</td><td>'+result[1]+'</td><td>'+result[2]+'</td></tr>';


                        $('#memberStat_search_result_table tr:last').after(printStr);
                }else{
                    alert(result[0]);
                }

            },
            error: function (jqXhr, textStatus, errorMessage){
                // alert(jqXhr);
                ajaxErrorHandle(jqXhr);
            }

        });
        event.preventDefault();
    });
});

function searchEBook(form){

    /*------ Clear list before load ------ */

    $('ul').children('#lineTest').remove();
    // document.getElementById("staticEmail2").value = "Number of Records: 0";

    let i = 0;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/member',
        data:form.serialize(),
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            console.log(result[i].imagePath);
            $.each(result[i], function (key, book){
                // console.log(result[i]['availability']);
                // console.log(book);
                let bookID = result[i].bookID;
                let author = result[i].author;
                let time = result[i].maxTime;
                let minutes = Math.floor(time / 60);
                // let printStr2 = '<tr><td></td><td scope="row">'+(i+1)+'</td><td>'+result[i].bookID+'</td><td>'+result[i].isbn+'</td><td>'+result[i].title+'</td><td>'+result[i].author+'</td><td>'+result[i].category+'</td><td>'+result[i].addedBy+'</td><td>'+result[i].addedDate+'</td><td>'+result[i].availability+'</td><td></td></tr>';
                let printStr = '<li class="media shadow-lg p-3 mb-5 bg-white rounded" id="lineTest">' +
                    '                <img class="mr-3" src="http://localhost:8080/' + result[i].imagePath + '" alt="Generic placeholder image" width="80px" height="110px">' +
                    '                <div class="media-body">' +
                    '                    <input class="bglabelbold" type="lable" readonly value="' + result[i].title + '" style="width: 100%">' +
                    '                    <input class="bglabel" type="lable" readonly value="' + author + '"><br>' +
                    '                    <input class="bglabel" type="lable" readonly value="Rating: ' + result[i].avgRate + '"">' +
                    '                    <input class="bglabel" type="hidden" name="bookID" value="' + bookID + '"><br>' +
                    '                    <input class="bglabel" type="lable" readonly value="Published Date: ' + result[i].publishedDate + '" style="width: 100%"><br>' +
                    '                    <input class="bglabelbold" type="lable" readonly value="Readers: ' + result[i].views + '"><br>' +
                    '<input class="bglabelbold" type="lable" readonly value="The Page with the Most Time to Read is: ' + result[i].maxPage + '" style="width: 100%"><br>' +
                    '<input class="bglabelbold" type="lable" readonly value="The Time is: ' + minutes + ' Minutes">' +
                    '                </div>' +
                    '            </li>';
                i++;
                // document.getElementById("staticEmail2").value = "Number of Records: " + i;

                $('#ebook_search_result_list li:last').after(printStr);
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert(jqXhr);
            ajaxErrorHandle(jqXhr);
        }
    });
}
