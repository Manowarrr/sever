function createPieChart(pieChartDiv, link) {
   
  if(!pieChartDiv) {
    return;
  }

axios.get(link)
	.then(function (res) {
    const result = res.data;
    const count = result.reduce((sum, current) => sum + current.count, 0);

    let data = {};

    data.labels = result.map(item => Math.round((item.count/count*100)*100)/100 + '%');
    data.series = result.map(item => item.count/count*100);

    let options = {
      height: '350px'
    };

    Chartist.Pie(pieChartDiv, data, options);
	})
	.catch(function (error) {
		console.log(error);
	});

}

function createPieChartPlace(lenDiv, octDiv, pervDiv, link) {
   
  if(!lenDiv) {
    return;
  }

axios.get(link)
	.then(function (res) {
    const result = res.data[0];
    console.dir(result);

    let lenData = { series: [] };
    let pervData = { series: [] };
    let octData = { series: [] };

    lenData.series.push(result.totalSpace.find(item => item._id == 'Ленинский р-н').totalSpace);
    if(result.occupiedSpace.find(item => item._id == 'Ленинский р-н'))
      lenData.series.push(result.occupiedSpace.find(item => item._id == 'Ленинский р-н').occupiedSpace);
    pervData.series.push(result.totalSpace.find(item => item._id == 'Первомайский р-н').totalSpace);
    if(result.occupiedSpace.find(item => item._id == 'Первомайский р-н'))
      pervData.series.push(result.occupiedSpace.find(item => item._id == 'Первомайский р-н').occupiedSpace);
    octData.series.push(result.totalSpace.find(item => item._id == 'Октябрьский р-н').totalSpace);
    if(result.occupiedSpace.find(item => item._id == 'Октябрьский р-н'))
      octData.series.push(result.occupiedSpace.find(item => item._id == 'Октябрьский р-н').occupiedSpace);

    lenData.series[0] = lenData.series[0] - lenData.series[1];
    pervData.series[0] = pervData.series[0] - pervData.series[1];
    octData.series[0] = octData.series[0] - octData.series[1];

    let sum = function(a, b) { return a + b };

    let lenOptions = {
      height: '350px',
      labelInterpolationFnc: function(value) {
        return Math.round(value / lenData.series.reduce(sum) * 100) + '%';
      }
    };
    let pervOptions = {
      height: '350px',
      labelInterpolationFnc: function(value) {
        return Math.round(value / pervData.series.reduce(sum) * 100) + '%';
      }
    };
    let octOptions = {
      height: '350px',
      labelInterpolationFnc: function(value) {
        return Math.round(value / octData.series.reduce(sum) * 100) + '%';
      }
    };

    console.dir(lenData);
    Chartist.Pie(lenDiv, lenData, lenOptions);
    Chartist.Pie(pervDiv, pervData, pervOptions);
    Chartist.Pie(octDiv, octData, octOptions);

	})
	.catch(function (error) {
		console.log(error);
	});

}

createPieChart(document.querySelector('#districtCountChart'), '/api/chartDistricts');
createPieChart(document.querySelector('#districtContractCountChart'), '/api/chartContractDistricts');

createPieChartPlace(document.querySelector('#lenCountChart'),
                    document.querySelector('#octCountChart'),
                    document.querySelector('#pervCountChart'),
                    '/api/placeDistricts');


$('#buildingTable').DataTable({
  "pagingType": "full_numbers",
  "lengthMenu": [
    [10, 25, 50, -1],
    [10, 25, 50, "All"]
  ],
  responsive: true,
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Russian.json"
  },
  dom: 'Bfrtip',
  buttons: [
    'excel', 'pdf'
  ]
});

$('#tenantTable').DataTable({
  "pagingType": "full_numbers",
  "lengthMenu": [
    [10, 25, 50, -1],
    [10, 25, 50, "All"]
  ],
  responsive: true,
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Russian.json"
  },
  dom: 'Bfrtip',
  buttons: [
    'excel', 'pdf'
  ]
});

$('#contractTable').DataTable({
  "pagingType": "full_numbers",
  "lengthMenu": [
    [10, 25, 50, -1],
    [10, 25, 50, "All"]
  ],
  responsive: true,
  language: {
    url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Russian.json"
  },
  dom: 'Bfrtip',
  buttons: [
    'excel', 'pdf'
  ]
});

$('.datepicker').datetimepicker({
  format: 'MM/DD/YYYY',
  icons: {
    time: "fa fa-clock-o",
    date: "fa fa-calendar",
    up: "fa fa-chevron-up",
    down: "fa fa-chevron-down",
    previous: 'fa fa-chevron-left',
    next: 'fa fa-chevron-right',
    today: 'fa fa-screenshot',
    clear: 'fa fa-trash',
    close: 'fa fa-remove'
  }
});

