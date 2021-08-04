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

// ------ search E-Book ------

function searcheBook(form){

    /*------ Clear list before load ------ */

    $('ul').children('#lineTest').remove();
    document.getElementById("staticEmail2").value = "Number of Records: 0";

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
                // let printStr2 = '<tr><td></td><td scope="row">'+(i+1)+'</td><td>'+result[i].bookID+'</td><td>'+result[i].isbn+'</td><td>'+result[i].title+'</td><td>'+result[i].author+'</td><td>'+result[i].category+'</td><td>'+result[i].addedBy+'</td><td>'+result[i].addedDate+'</td><td>'+result[i].availability+'</td><td></td></tr>';
                let printStr = '<li class="media shadow-lg p-3 mb-5 bg-white rounded" id="lineTest">' +
                    '                <img class="mr-3" src="http://localhost:8080/' + result[i].imagePath + '" alt="Generic placeholder image" width="80px" height="110px">' +
                    '                <div class="media-body">' +
                    '                    <input class="bglabelbold" type="lable" readonly value="' + result[i].title + '" style="width: 100%">' +
                    '                    <input class="bglabel" type="lable" readonly value="' + author + '"><br>' +
                    '                    <input class="bglabel" type="lable" readonly value="Rating: ' + result[i].avgRate + '"">' +
                    '                    <input class="bglabel" type="hidden" name="bookID" value="' + bookID + '"><br>' +
                    '                    <input class="bglabel" type="lable" readonly value="Published Date: ' + result[i].publishedDate + '" style="width: 100%"><br>' +
                    '                    <input class="bglabelbold" type="lable" readonly value="Readers: ' + result[i].views + '">' +
                    '                </div>' +
                    '                <div style="padding:35px" >' +
                    '                    <input type="button" class="btn btn-primary" data-toggle="modal" data-target="#view" value="Read" onclick="clearData(\'' + bookID + '\')">' +
                    '                </div>' +
                    '' +
                    '            </li>';
                i++;
                document.getElementById("staticEmail2").value = "Number of Records: " + i;

                $('#ebook_search_result_list li:last').after(printStr);
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert(jqXhr);
            ajaxErrorHandle(jqXhr);
        }
    });
}

let pdfUrl = "";
let pageCount = 0;
let pageNo = 1;
let bookId = "";
let startPageTime = 0;
let startTotalTime = 0;
let pageSeconds = 0;
let totalTimeDifference = 0;

function clearData(bookID){
    pdfUrl = "";
    pageCount = 0;
    pageNo = 1;
    bookId = "";
    startPageTime = 0;
    startTotalTime = 0;
    pageSeconds = 0;
    totalTimeDifference = 0;
    bookId = bookID;
    getPdfLocation(bookId);

}

function getPdfLocation(bookID){
    bookId = bookID;

    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/member',
        data: {'type': "readBook",'bookID': bookID},
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            console.log(result[0].state +"\n" + result[0].pdfLink);
            pdfUrl = "http://localhost:8080/" + result[0].pdfLink + "/";
            pageCount = result[0].pageCount;
            let pagePath = pdfUrl + pageNo + ".pdf";
            console.log(pagePath);
            document.getElementById('pdfViewer').setAttribute('data', pagePath);
            document.getElementById('pageNoViewer').setAttribute('placeholder', "Page " + pageNo + " From " + pageCount);
            startTimer();
            startTotalTime = new Date().getTime();

        },
        error: function (jqXhr, textStatus, errorMessage){
            console.log(jqXhr);
            ajaxErrorHandle(jqXhr);
        }

    });

}

function startTimer(){

    startPageTime = new Date().getTime();
    // document.getElementById('timeViewer').innerHTML = "Timer Started.";

}

function stopTimer(buttonType){
    console.log("start stopTimer fun");
    if(buttonType == "next"){
        pageNo++;

        if(pageNo > pageCount){
            pageNo = 1;
        }

    }else {
        pageNo--;
        if(pageNo == 0) {
            pageNo = pageCount;
        }
    }

    let pagePath = pdfUrl + pageNo + ".pdf";
    console.log(pagePath);
    document.getElementById('pdfViewer').setAttribute('data', pagePath);
    document.getElementById('pageNoViewer').setAttribute('placeholder', "Page " + pageNo + " From " + pageCount);


    if (startPageTime && startTotalTime){
        let endTime = new Date().getTime();
        let difference = endTime - startPageTime;
        pageSeconds = Math.floor(difference / 1000);

        if(buttonType == "cancel"){
            totalTimeDifference = Math.floor((endTime - startTotalTime) / 1000);
            setPageTime("cancel");
            startPageTime = 0;
            startTotalTime = 0;
            // bookId = "";
            pageNo = 1;
            pageCount = 0;
            pdfUrl = "";
            pageSeconds = 0;
            totalTimeDifference = 0;

        }else {
            setPageTime("next");
            startTime = 0;
            startTimer();

        }

        console.log(pageSeconds);
        console.log(totalTimeDifference);

    }else {
        alert("Error \nTimer didn't Start");
    }
}

function setPageTime(actionType){
    let memberID = "M1";
    let totalViewTime = 0;
    if(actionType == "cancel"){
        totalViewTime = totalTimeDifference;
        console.log("clicked Cancel read page");
    }

    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/member',
        data: {'type': "readPage",'bookID': bookId,'memberID': memberID,'pageNo': pageNo,'pageTime': pageSeconds,'totalTime': totalViewTime},
        success: function (data){
           console.log(data);

        },
        error: function (jqXhr, textStatus, errorMessage){
            console.log(jqXhr);
            ajaxErrorHandle(jqXhr);
        }

    });

}

function rateBook(rate){
    // alert(rate);
    let memberID = "M1";

    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/member',
        data: {'type': "rateBook",'bookID': bookId,'memberID': memberID,'rate': rate},
        success: function (data){
            console.log(data);
            bookId = "";

        },
        error: function (jqXhr, textStatus, errorMessage){
            console.log(jqXhr);
            bookId = "";
            ajaxErrorHandle(jqXhr);
        }

    });

}

/* ------ Get Search Result ------*/

function searchBookMember(form){

    /*------ Clear table before load ------ */
    let tbodayRef = document.getElementById('member_book_search_result_table');
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
                let printStr = '<tr><td></td><td scope="row">'+(i+1)+'</td><td>'+result[i].bookID+'</td><td>'+result[i].isbn+'</td><td>'+result[i].title+'</td><td>'+result[i].author+'</td><td>'+result[i].category+'</td>><td>'+result[i].addedDate+'</td><td></td></tr>';
                i++;
                document.getElementById("staticEmail2").value = "Number of Records: " + i;
                $('#member_book_search_result_table tr:last').after(printStr);
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            // alert("Error");
            ajaxErrorHandle(jqXhr);
        }
    });
}
