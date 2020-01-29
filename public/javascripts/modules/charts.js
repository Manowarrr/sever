
function initChart(pieChartDiv) {
  if(!pieChartDiv) return;

  let data = {
    labels: ['62%', '32%', '6%'],
    series: [62, 32, 6]
  };

  Chartist.Pie(pieChartDiv, data);
}

export default initChart;