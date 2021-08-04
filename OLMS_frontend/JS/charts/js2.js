google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  
  // Draw the chart and set the chart values
  // function drawChart() {
  //   var data = google.visualization.arrayToDataTable([
  //   ['Category', 'Count'],
  //   ['IT', 3],
  //   ['Science', 2],
  //   ['Story', 6],
  //   ['Fiction', 1],
  //
  // ]);
  //
  //   // Optional; add a title and set the width and height of the chart
  //   var options = {'title':'Category', 'width':550, 'height':400};
  //
  //   // Display the chart inside the <div> element with id="piechart"
  //   var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
  //   chart.draw(data, options);
  // }

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
function drawChart() {
  let it = 0;
  let science = 0;
  let story = 0;
  let fiction = 0;

  $.ajax({
    type: "GET",
    url: 'http://localhost:8080/staff',
    data: {'type': "categoryStat"},
    success: function (data){
      let result = data;
      console.log(result);

      if(result[0] == "Error"){
        console.log("Error while Loading Gender Stat");
      }else{
        it = parseInt(result[0]);
        science = parseInt(result[1]);
        story = parseInt(result[2]);
        fiction = parseInt(result[3]);

        var data = google.visualization.arrayToDataTable([
          ['Category', 'Count'],
          ['IT', it],
          ['Science', science],
          ['Story', story],
          ['Fiction', fiction],

        ]);

        // Optional; add a title and set the width and height of the chart
        var options = {'title':'Category', 'width':550, 'height':400};

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('piechart2'));
        chart.draw(data, options);
      }
      // console.log(male);

    },
    error: function (jqXhr, textStatus, errorMessage){
      console.log(jqXhr);
      ajaxErrorHandle(jqXhr);
    }

  });

}
