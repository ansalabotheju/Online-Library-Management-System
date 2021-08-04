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

/* ------ User Login ------*/

$(document).ready(function (){
    $('#user_login_form').submit(function (event){
        let formData=$(this);

        $.ajax({
            type: "POST",
            // url: '127.0.0.1:8080//user?' + form.serialize(),
            url: 'http://localhost:8080//user',
            // url:'http://localhost:8080//user?type=login&username=123&password=123',
            data:formData.serialize(),
            // processData:false,
            success: function (data){

                // alert(JSON.stringify(JSON.parse(data)[0]));
                let result = JSON.parse(JSON.stringify(data))[0];
                console.log(result);
                console.log(result['name']);
                let userID = result['id'];
                let name = result['name'];
                let state = result['state'];




                if(state == 'active member'){
                    Cookies.set('userID', userID);


                    console.log('login successfully');
                    toastr.success('Login successfully', 'Login Complete');

                    console.log("member login");
                    alert("Hello " + name + "\nLogin Successful");
                    // alert(userID + " - " + name);

                    window.location.replace("./member/Member_dashboard.html");

                }else if(state == 'active publisher') {
                    Cookies.set('userID', userID);


                    console.log('login successfully');
                    toastr.success('Login successfully', 'Login Complete');

                    console.log("member login");
                    alert("Hello " + name + "\nLogin Successful");
                    // alert(userID + " - " + name);

                    window.location.replace("../publisher/Publisher_Home.html");


                } else if(state == 'pending'){
                    alert("Hello " + name + "\nYour Membership request is still Pending \nPlease wait few hours \nYour Membership ID is: " + userID);
                    window.location.replace("Home.html");

                }else if(state == 'inactive'){
                    alert("Hello " + name + "\nYour Membership  is expired \n ou can not access the account");

                }else {
                    console.log("member login fail");
                    alert(result);
                }
            },
            error: function (jqXhr, textStatus, errorMessage){
                ajaxErrorHandle(jqXhr);
            }

        });
        event.preventDefault();
    });
});

/* ------ User Register ------*/

function register(form){
    console.log(form.serialize());
    $.ajax({
        type: "POST",
        url: 'http://localhost:8080//user',
        data:form.serialize(),
        success: function (data) {
            let result = data['Response'];
            console.log(data['Response']);

            if(result == "success"){
                alert("Registration Successful");
                window.location.replace("Home.html");

            }else {
                alert(result);
            }
        },
        error: function (jqXhr, textStatus, errorMessage){
            ajaxErrorHandle(jqXhr);
        }
    });

}