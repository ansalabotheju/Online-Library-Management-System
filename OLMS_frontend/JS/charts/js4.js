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
  let bookID = [];
  let rate = [];
  let i = 0;

  $.ajax({
    type: "GET",
    url: 'http://localhost:8080/staff',
    data: {'type': "top10Stat"},
    success: function (data){
      let result = JSON.parse(JSON.stringify(data));
      console.log(result);

      if(result[0] == "Error"){
        console.log("Error while Loading Gender Stat");
      }else{

        $.each(result[i], function (key, book){
          console.log(result[i]);
          bookID[i] = result[i].bookID;
          rate[i] = result[i].avgRate;

          i++;
        });
        console.log(bookID);

        var data = google.visualization.arrayToDataTable([
          ['Book ID', 'Rate'],
          [bookID[0], rate[0]],
          [bookID[1], rate[1]],
          [bookID[2], rate[2]],
          [bookID[3], rate[3]],
        ]);

        var options = {
          title: 'Top 10 Rated Ebooks', 'width':550, 'height':400
        };

        var chart = new google.visualization.BarChart(document.getElementById('myChart2'));
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