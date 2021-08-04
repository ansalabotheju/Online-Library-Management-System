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

// ------ Upload Ebook ------

$(document).ready(function (){
    $('#publisher_upload_ebook_form').submit(function (event){

        const  formData = new FormData(this);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: 'http://localhost:8080/publisher',
            data: formData,
            // contentType: 'multipart/form-data',
            contentType : false,
            processData : false,
            success: function (data){

                // let id = Cookies.get("userID");
                console.log(data);
                if(data == "success"){
                    alert("E-Book Entered Successfully");
                    // window.location.replace("../staff_dashboard.html");
                    window.location.href = "../publisher/Publisher_Home.html";

                }else{
                    alert(data);
                    window.location.href = "../publisher/Publisher_Home.html";
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

function pageLoad(publisherID){

    /*------ Clear table before load ------ */
    let tbodayRef = document.getElementById('publisher_book_table');
    while(tbodayRef.rows.length > 1){
        tbodayRef.deleteRow(1);
    }

    let i = 0;
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/publisher',
        data:{'type':"searchEbook", 'publisherID': publisherID,},
        success: function (data){
            let result = JSON.parse(JSON.stringify(data));
            // console.log(result[i].imagePath);
            $.each(result[i], function (key, book){
                // console.log(result[i]['availability']);
                // console.log(book);
                let bookID = result[i].bookID;
                let author = result[i].author;
                let printStr2 = '<tr><td scope="row">'+(i+1)+'</td><td>'+result[i].bookID+'</td><td>'+result[i].title+'</td><td>'+result[i].author+'</td><td>'+result[i].availability+'</td></tr>';
                // let printStr = '<li class="media shadow-lg p-3 mb-5 bg-white rounded" id="lineTest">' +
                //     '                <img class="mr-3" src="http://localhost:8080/' + result[i].imagePath + '" alt="Generic placeholder image" width="80px" height="110px">' +
                //     '                <div class="media-body">' +
                //     '                    <input class="bglabelbold" type="lable" readonly value="' + result[i].title + '" style="width: 100%">' +
                //     '                    <input class="bglabel" type="lable" readonly value="' + author + '"><br>' +
                //     '                    <input class="bglabel" type="lable" readonly value="Rating: ' + result[i].avgRate + '"">' +
                //     '                    <input class="bglabel" type="hidden" name="bookID" value="' + bookID + '"><br>' +
                //     '                    <input class="bglabel" type="lable" readonly value="Published Date: ' + result[i].publishedDate + '" style="width: 100%"><br>' +
                //     '                    <input class="bglabelbold" type="lable" readonly value="Readers: ' + result[i].views + '">' +
                //     '                </div>' +
                //     '                <div style="padding:35px" >' +
                //     '                    <input type="button" class="btn btn-primary" data-toggle="modal" data-target="#view" value="Read" onclick="clearData(\'' + bookID + '\')">' +
                //     '                </div>' +
                //     '' +
                //     '            </li>';
                i++;
                document.getElementById("staticEmail2").value = "Number of Records: " + i;

                $('#publisher_book_table tr:last').after(printStr2);
            });
        },
        error: function (jqXhr, textStatus, errorMessage) {
            alert(jqXhr);
            ajaxErrorHandle(jqXhr);
        }
    });
}