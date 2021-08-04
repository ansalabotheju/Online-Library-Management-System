google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChartGender);

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

  // Draw the chart and set the chart values
  function drawChartGender() {
    let male = 0;
    let female = 0;

    $.ajax({
      type: "GET",
      url: 'http://localhost:8080/staff',
      data: {'type': "genderStat"},
      success: function (data){
        let result = data;
        console.log(result);

        if(result[0] == "Error"){
          console.log("Error while Loading Gender Stat");
        }else{
          male = parseInt(result[0]);
          female = parseInt(result[1]);

          var data = google.visualization.arrayToDataTable([
            ['Gender', 'Count'],
            ['Male', male],
            ['Female', female],

          ]);

          // Optional; add a title and set the width and height of the chart
          var options = {'title':'Gender', 'width':480, 'height':400};

          // Display the chart inside the <div> element with id="piechart"
          var chart = new google.visualization.PieChart(document.getElementById('piechart'));
          chart.draw(data, options);

        }
        console.log(male);

      },
      error: function (jqXhr, textStatus, errorMessage){
        console.log(jqXhr);
        ajaxErrorHandle(jqXhr);
      }

    });

  }


