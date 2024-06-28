import { Component } from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "src/app/shared/services/api.service";
import { CarouselModule } from "ngx-owl-carousel-o";
import { CommonModule, DatePipe } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { RouterModule } from "@angular/router";



const statData = [
  {
    icon: "bx-wallet",
    title: "Gift Card Balance",
    value: 5595,
    persantage: "3.96",
    profit: "down",
    bg_color: "danger",
  },
  {
    icon: "bx-wallet",
    title: "GPR Card Balance",
    value: 6245.564,
    persantage: "16.24",
    profit: "up",
    bg_color: "success",
  },
];

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    SharedModule,
    NgApexchartsModule,
    RouterModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  breadCrumbItems!: Array<{}>;
  customersDetails = {
    total_customers: null,
    full_kyc_customers: null,
    min_kyc_customers: null,
  };
  statData!: any;
  MarketplaceChart: any;
  total_balance: number = 0;
  splineAreaChart: any;
  // set the current year
  year: number = new Date().getFullYear();
  private _trialEndsAt: any;
  private _diff?: any;
  _days?: number;
  _hours?: number;
  _minutes?: number;
  _seconds?: number;

  public chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    colors: string[];
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
    stroke?: ApexStroke;
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis;
  };

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    navText: ["", ""],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 4,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
  };

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {
    this.chartOptions = {
        series: [
          {
            name: 'Fund',
            data: [
              {
                x: 'Monday',
                y: 1292,
                goals: [
                  {
                    name: 'Spend',
                    value: 1000,
                    strokeHeight: 5,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: 'Tuesday',
                y: 4432,
                goals: [
                  {
                    name: 'Spend',
                    value: 4432,
                    strokeHeight: 5,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: 'Wednesday',
                y: 5423,
                goals: [
                  {
                    name: 'Spend',
                    value: 5000,
                    strokeHeight: 5,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: 'Thursday',
                y: 6653,
                goals: [
                  {
                    name: 'Spend',
                    value: 6500,
                    strokeHeight: 5,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: 'Friday',
                y: 8133,
                goals: [
                  {
                    name: 'Spend',
                    value: 6600,
                    strokeHeight: 13,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: 'Saturday',
                y: 7132,
                goals: [
                  {
                    name: 'Spend',
                    value: 7132,
                    strokeHeight: 5,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: 'Sunday',
                y: 7332,
                goals: [
                  {
                    name: 'Spend',
                    value: 2700,
                    strokeHeight: 5,
                    strokeColor: '#775DD0'
                  }
                ]
              },
            ]
          }
        ],
        chart: {
          height: 400,
          type: 'bar'
        },
        plotOptions: {
          bar: {
            columnWidth: '30%'
          }
        },
        colors: ['#00E396'],
        dataLabels: {
          enabled: false
        },
        legend: {
          show: true,
          showForSingleSeries: true,
          customLegendItems: ['Fund', 'Spend'],
          markers: {
            fillColors: ['#00E396', '#775DD0']
          }
        },
        title: {
          text: 'Grouped Labels on the X-axis',
      },
      };
    }
  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Distributor" },
      { label: " dashboard", active: true },
    ];
    this._splineAreaChart('["--vz-success", "--vz-danger"]');
  }

  mySeries = [
    {
      title: "Total GPR Card",
      icon: "ri-gift-fill",
      count: this.customersDetails.min_kyc_customers,
    },
    {
      title: "Total GIFT Card",
      icon: "ri-gift-fill",
      count: this.customersDetails.full_kyc_customers,
    },
    {
      title: "Total Aproved Fund Request",
      icon: "ri-funds-fill",
      count: 11,
    },
    {
      title: "Total Retailer",
      icon: "ri-group-fill",
      count: 20,
    },
  ];

      /**
   * Splie-Area Chart
   */
      setbalancevalue(value: any) {
        if (value == 'today') {
            this.splineAreaChart.series = [{
                name: 'Revenue',
                data: [20, 25, 30, 35, 40, 55, 70, 110, 150, 180, 210, 250]
            }, {
                name: 'Expenses',
                data: [12, 17, 45, 42, 24, 35, 42, 75, 102, 108, 156, 199]
            }]
        }
        if (value == 'last_week') {
            this.splineAreaChart.series = [{
                name: 'Revenue',
                data: [30, 35, 40, 45, 20, 45, 20, 100, 120, 150, 190, 220]
            }, {
                name: 'Expenses',
                data: [12, 17, 45, 52, 24, 35, 42, 75, 92, 108, 146, 199]
            }]
        }
        if (value == 'last_month') {
            this.splineAreaChart.series = [{
                name: 'Revenue',
                data: [20, 45, 30, 35, 40, 55, 20, 110, 100, 190, 210, 250]
            }, {
                name: 'Expenses',
                data: [62, 25, 45, 45, 24, 35, 42, 75, 102, 108, 150, 299]
            }]
        }
        if (value == 'current_year') {
            this.splineAreaChart.series = [{
                name: 'Revenue',
                data: [27, 25, 30, 75, 70, 55, 50, 120, 250, 180, 210, 250]
            }, {
                name: 'Expenses',
                data: [12, 17, 45, 42, 24, 35, 42, 75, 102, 108, 156, 199]
            }]
        }
    }

    private _splineAreaChart(colors: any) {
        colors = this.getChartColorsArray(colors);
        this.splineAreaChart = {
            series: [{
                name: 'GPR',
                data: [20, 25, 30, 35, 40, 55, 70, 110, 150, 180, 210, 250]
            }, {
                name: 'GIFT',
                data: [12, 17, 45, 42, 24, 35, 42, 75, 102, 108, 156, 199]
            }],
            chart: {
                height: 365,
                type: 'area',
                toolbar: 'false',
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yaxis: {
                tickAmount: 5,
                min: 0,
                max: 260
            },
            colors: colors,
            fill: {
                opacity: 0.06,
                type: 'solid'
            }
        };
    }
     // Chart Colors Set
     private getChartColorsArray(colors: any) {
      colors = JSON.parse(colors);
      return colors.map(function (value: any) {
          var newValue = value.replace(" ", "");
          if (newValue.indexOf(",") === -1) {
              var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
              if (color) {
                  color = color.replace(" ", "");
                  return color;
              }
              else return newValue;;
          } else {
              var val = value.split(',');
              if (val.length == 2) {
                  var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                  rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                  return rgbaColor;
              } else {
                  return newValue;
              }
          }
      });
  }
}
