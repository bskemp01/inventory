import * as Highcharts from 'highcharts';

export const columnChartOptions: Highcharts.Options = {
  chart: {
    type: 'column',
    animation: true,
  },
  exporting: {
    fallbackToExportServer: false,
  },
  title: {
    text: 'Completion Reports',
  },
  accessibility: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    type: 'category',
  },
  yAxis: [
    {
      title: {
        text: '<span style="font-weight: bold;font-size: 15px;font-family: arial;"><b>Count Completed (Percentage %)</b></span>',
      },
    },
    {
      opposite: true,
      title: {
        text: '',
      },
    },
  ],
  legend: {
    align: 'left',
    enabled: true,
    layout: 'vertical',
    squareSymbol: true,
    symbolRadius: 0,
    verticalAlign: 'top',
    x: 0,
    y: 100,
  },
  plotOptions: {
    column: {
      shadow: false,
      borderWidth: 0,
      point: {
        events: {},
      },
    },
    series: {
      states: {
        inactive: {
          opacity: 1,
        },
        hover: {
          enabled: false,
          lineWidthPlus: 0,
        },
      },
    },
  },
  tooltip: {
    enabled: true,
    shared: true,
    useHTML: true,
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
    footerFormat: '</table>',
  },
  series: [
    {
      name: 'SOS Current Count',
      data: [],
      type: 'column',
      color: 'blue',
      visible: true,
    },
    {
      name: 'UR Current Count',
      data: [],
      type: 'column',
      color: 'red',
      visible: true,
    },
  ],
};
