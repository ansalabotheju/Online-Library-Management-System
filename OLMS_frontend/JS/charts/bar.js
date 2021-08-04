google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  // Draw the chart and set the chart values
// function drawChart() {
//
// var data = google.visualization.arrayToDataTable([
//   ['Contry', 'Mhl'],
//   ['Italy', 55],
//   ['France', 49],
//   ['Spain', 44],
//   ['USA', 24],
//   ['Argentina', 15]
// ]);
//
// var options = {
//   title: 'World Wide Wine Production'
// };
//
// var chart = new google.visualization.BarChart(document.getElementById('myChart'));
// chart.draw(data, options);
//
// }

function drawChart() {
  let active = 0;
  let inactive = 0;
  let reject = 0;
  let pending = 0;

  $.ajax({
    type: "GET",
    url: 'http://localhost:8080/staff',
    data: {'type': "memberStateStat"},
    success: function (data){
      let result = data;
      console.log(result);

      if(result[0] == "Error"){
        console.log("Error while Loading Gender Stat");
      }else{
        active = parseInt(result[0]);
        inactive = parseInt(result[1]);
        reject = parseInt(result[2]);
        pending = parseInt(result[3]);

        var data = google.visualization.arrayToDataTable([
          ['State', 'Amount'],
          ['Active', active],
          ['Inactive', inactive],
          ['Rejected', reject],
          ['Pending', pending],
        ]);

        var options = {
          title: 'Member State Comparison', 'width':550, 'height':400
        };

        var chart = new google.visualization.BarChart(document.getElementById('myChart'));
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