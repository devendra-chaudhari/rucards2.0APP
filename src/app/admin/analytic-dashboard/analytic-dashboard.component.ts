import {Component, OnInit} from '@angular/core';
import {SessionStorageService} from "../../shared/services/session-storage.service";
import {User} from "../../shared/interfaces/user";
import {ApiService} from "../../shared/services/api.service";


export interface Transactions{
    closing_balance_sum: number;
    date: string;
    opening_balance_sum: number;
    wallet_id: number;
}

const TopPages = [
    {
        page: "/themesbrand/skote-25867",
        active: '99',
        users: '25.3',
    },
    {
        page: "/dashonic/chat-24518",
        active: '86',
        users: '22.7',
    },
    {
        page: "/skote/timeline-27391",
        active: '64',
        users: '18.7',
    },
    {
        page: "/themesbrand/minia-26441",
        active: '53',
        users: '14.2',
    },
    {
        page: "/dashon/dashboard-29873",
        active: '33',
        users: '12.6',
    },
    {
        page: "/doot/chats-29964",
        active: '20',
        users: '10.9',
    },
    {
        page: "/minton/pages-29739",
        active: '10',
        users: '07.3',
    }
];

@Component({
    selector: 'app-analytic-dashboard',
    templateUrl: './analytic-dashboard.component.html'
})
export class AnalyticDashboardComponent implements OnInit {
    // statData!: any;
    basicBarChart: any;
    basicColumnChart: any;
    basicHeatmapChart: any;
    simpleDonutChart: any;
    TopPages: any;
    user: User;
    totalNetworkBalance:number=0;
    transactions:Transactions[]=[]

    constructor(
        private sessionStorage: SessionStorageService,
        private apiService: ApiService,
    ) {

    }

     statData = [{
        title: 'Users',
        value: 28.05,
        icon: 'users',
        percentage: '16.24',
        profit: 'up',
        link:''
    }, {
        title: 'Total Network Balance',
        value: this.totalNetworkBalance,
        icon: 'activity',
        percentage: '3.96',
        profit: 'down',
         link:''
     },
          {
             title: 'QPS Gift Pool',
             value: this.totalNetworkBalance,
             icon: 'activity',
             percentage: '3.96',
             profit: 'down',
             link:''
         },
          {
             title: 'QPS GPR Pool',
             value: 1000000,
             icon: 'activity',
             percentage: '3.96',
             profit: 'down',
             link:''
         }, {
        title: 'GC Orders',
        value: 3.40,
        icon: 'clock',
        percentage: '0.24',
        profit: 'down',
         link:''
    }, {
        title: 'GPR Orders',
        value: 33.48,
        icon: 'external-link',
        percentage: '7.05',
        profit: 'up',
         link:''
    }
    ];


    ngOnInit(): void {
        this.fetchData();
        this.user = this.sessionStorage.getCurrentUser();
        this.getDashboardData();

        // Chart Color Data Get Function
        this._basicBarChart('["--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4", "--vz-primary-rgb, 0.4"]');
        this._basicColumnChart('["--vz-primary", "--vz-gray-300"]');
        this._basicHeatmapChart('["--vz-primary", "--vz-info",  "--vz-card-bg"]');
        this._simpleDonutChart('["--vz-primary", "--vz-primary-rgb, .75", "--vz-primary-rgb, 0.60"]');
    }


    // Chart Colors Set
    private getChartColorsArray(colors: any) {
        colors = JSON.parse(colors);
        return colors.map(function (value: any) {
            const newValue = value.replace(" ", "");
            if (newValue.indexOf(",") === -1) {
                let color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
                if (color) {
                    color = color.replace(" ", "");
                    return color;
                } else return newValue;
            } else {
                const val = value.split(',');
                if (val.length == 2) {
                    let rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                    rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                    return rgbaColor;
                } else {
                    return newValue;
                }
            }
        });
    }

    /**
     * Series Data
     */
    private generateData(count: number, yrange: { max: number; min: number; }) {
        let i = 0;
        const series = [];
        while (i < count) {
            const x = "w" + (i + 1).toString();
            const y =
                Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push({
                x: x,
                y: y
            });
            i++;
        }
        return series;
    }

    /**
     * Basic Bar Chart
     */
    selectvalue(x: any) {
        if (x == 'all') {
            this.basicBarChart.series = [{
                data: [1010, 1640, 490, 1255, 1050, 689, 800, 420, 1085, 589],
                name: 'Sessions',
            }]
        }
        if (x == '1M') {
            this.basicBarChart.series = [{
                data: [200, 640, 490, 255, 50, 689, 800, 420, 85, 589],
                name: 'Sessions',
            }]
        }
        if (x == '6M') {
            this.basicBarChart.series = [{
                data: [1010, 1640, 490, 1255, 1050, 689, 800, 420, 1085, 589],
                name: 'Sessions',
            }]
        }
    }

    private _basicBarChart(colors: any) {
        colors = this.getChartColorsArray(colors);
        this.basicBarChart = {
            series: [{
                data: [1010, 1640, 490, 1255, 1050, 689, 800, 420, 1085, 589],
                name: 'Sessions',
            }],
            chart: {
                type: 'bar',
                height: 436,
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                    distributed: true,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                offsetX: 32,
                style: {
                    fontSize: '12px',
                    fontWeight: 400,
                    colors: ['#adb5bd']
                }
            },
            colors: colors,
            legend: {
                show: false,
            },
            grid: {
                show: false,
            },
            xaxis: {
                categories: ['Rajasthan', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Bihar', 'Andra Pradesh', 'Delhi', 'Gujarat'],
            },
        };
    }

    /**
     * Basic Column Charts
     */
    setcolumnchartvalue(x: any) {
        if (x == 'all') {
            this.basicColumnChart.series = [{
                name: 'Last Year',
                data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2]
            }, {
                name: 'Current Year',
                data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2]
            }]
        }
        if (x == '1M') {
            this.basicColumnChart.series = [{
                name: 'Last Year',
                data: [25.3, 12.5, 20.2, 18.5, 40.4, 25.4, 15.8, 22.3, 19.2, 25.3, 12.5, 20.2]
            }, {
                name: 'Current Year',
                data: [25.3, 12.5, 20.2, 18.5, 40.4, 25.4, 15.8, 22.3, 19.2, 25.3, 12.5, 20.2]
            }]
        }
        if (x == '6M') {
            this.basicColumnChart.series = [{
                name: 'Last Year',
                data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2]
            }, {
                name: 'Current Year',
                data: [25.3, 12.5, 20.2, 18.5, 40.4, 25.4, 15.8, 22.3, 19.2, 25.3, 12.5, 20.2]
            }]
        }
        if (x == '1Y') {
            this.basicColumnChart.series = [{
                name: 'Last Year',
                data: [25.3, 12.5, 20.2, 18.5, 40.4, 25.4, 15.8, 22.3, 19.2, 25.3, 12.5, 20.2]
            }, {
                name: 'Current Year',
                data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2]
            }]
        }
    }

    private _basicColumnChart(colors: any) {
        colors = this.getChartColorsArray(colors);
        this.basicColumnChart = {
            series: [{
                name: 'Last Year',
                data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2]
            }, {
                name: 'Current Year',
                data: [36.2, 22.4, 38.2, 30.5, 26.4, 30.4, 20.2, 29.6, 10.9, 36.2, 22.4, 38.2]
            }],
            chart: {
                type: 'bar',
                height: 306,
                stacked: true,
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '20%',
                    borderRadius: 6,
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
                fontWeight: 400,
                fontSize: '8px',
                offsetX: 0,
                offsetY: 0,
                markers: {
                    width: 9,
                    height: 9,
                    radius: 4,
                },
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            grid: {
                show: false,
            },
            colors: colors,
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                title: {
                    text: '$ (thousands)'
                },
            },
            fill: {
                opacity: 1

            },
            tooltip: {
                y: {
                    formatter: function (val: any) {
                        return "$ " + val + " thousands"
                    }
                }
            }
        };
    }

    /**
     * Basic Heatmap Chart
     */
    private _basicHeatmapChart(colors: any) {
        colors = this.getChartColorsArray(colors);
        this.basicHeatmapChart = {
            series: [{
                name: 'Sat',
                data: this.generateData(18, {
                    min: 0,
                    max: 90
                })
            },
                {
                    name: 'Fri',
                    data: this.generateData(18, {
                        min: 0,
                        max: 90
                    })
                },
                {
                    name: 'Thu',
                    data: this.generateData(18, {
                        min: 0,
                        max: 90
                    })
                },
                {
                    name: 'Wed',
                    data: this.generateData(18, {
                        min: 0,
                        max: 90
                    })
                },
                {
                    name: 'Tue',
                    data: this.generateData(18, {
                        min: 0,
                        max: 90
                    })
                },
                {
                    name: 'Mon',
                    data: this.generateData(18, {
                        min: 0,
                        max: 90
                    })
                },
                {
                    name: 'Sun',
                    data: this.generateData(18, {
                        min: 0,
                        max: 90
                    })
                }
            ],
            chart: {
                height: 400,
                type: 'heatmap',
                offsetX: 0,
                offsetY: -8,
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: true,
                horizontalAlign: 'center',
                offsetX: 0,
                offsetY: 20,
                markers: {
                    width: 20,
                    height: 6,
                    radius: 2,
                },
                itemMargin: {
                    horizontal: 12,
                    vertical: 0
                },
            },
            colors: colors,
            plotOptions: {
                heatmap: {
                    colorScale: {
                        ranges: [{
                            from: 0,
                            to: 50,
                            name: '0-50',
                            color: colors[0]
                        },
                            {
                                from: 51,
                                to: 100,
                                name: '51-00',
                                color: colors[1]
                            },
                        ]
                    }
                }
            },
            tooltip: {
                y: [{
                    formatter: function (y: any) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0) + "k";
                        }
                        return y;
                    }
                }]
            },
        };
    }



    private _simpleDonutChart(colors: any) {
        colors = this.getChartColorsArray(colors);
        this.simpleDonutChart = {
            series: [78.56, 105.02, 42.89],
            labels: ["Desktop", "Mobile", "Tablet"],
            chart: {
                type: "donut",
                height: 219,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "76%",
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
                position: 'bottom',
                horizontalAlign: 'center',
                offsetX: 0,
                offsetY: 0,
                markers: {
                    width: 20,
                    height: 6,
                    radius: 2,
                },
                itemMargin: {
                    horizontal: 12,
                    vertical: 0
                },
            },
            stroke: {
                width: 0
            },
            yaxis: {
                labels: {
                    formatter: function (value: any) {
                        return value + "k" + " Users";
                    }
                },
                tickAmount: 4,
                min: 0
            },
            colors: colors
        };
    }

    private fetchData() {
        // this.statData = statData;
        this.TopPages = TopPages;
    }
    getDashboardData(){
        this.apiService.get('paypoint_gift_card/dashboard-panel').subscribe({
            next: (res) => {
                this.totalNetworkBalance = res.data.total_network_balance;
                this.transactions=res.data.daily_transaction
            }});
    }

}
