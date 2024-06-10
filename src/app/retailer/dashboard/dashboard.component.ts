import {Component, OnInit, TemplateRef} from '@angular/core';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';
import {OwlOptions} from "ngx-owl-carousel-o";
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../shared/interfaces/user";
import {SessionStorageService} from "../../shared/services/session-storage.service";
import {WalletService} from "../../shared/services/wallet.service";
import {ApiService} from "../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";

const statData = [
    {
        icon: 'bx-wallet',
        title: 'Gift Card Balance',
        value: 5595,
        persantage: '3.96',
        profit: 'down',
        bg_color: "danger"
    },
    {
        icon: 'bx-wallet',
        title: 'GPR Card Balance',
        value: 6245.564,
        persantage: '16.24',
        profit: 'up',
        bg_color: "success"
    }
];

export interface Wallets {
    id: string;
    name: string;
    wallet_status: string;
    created_at: string;
    updated_at: string;
    active:boolean;
    balance:number;
    user_id:string;
    parent_wallet_id:string;
}
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    customersDetails={
        total_customers:null,
        full_kyc_customers:null,
        min_kyc_customers:null
    }
    statData!: any;
    user: User;
    MarketplaceChart: any;
    total_balance:number=0;
    // set the current year
    year: number = new Date().getFullYear();
    private _trialEndsAt: any;
    private _diff?: any;
    _days?: number;
    _hours?: number;
    _minutes?: number;
    _seconds?: number;
    wallets:Wallets[]=[]
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        autoplay: true,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 4
            },
            940: {
                items: 4
            }
        },
        nav: false
    }

    constructor(
        private offCanvas: NgbOffcanvas,
        private modalService: NgbModal,
        private sessionStorage: SessionStorageService,
        private wallet:WalletService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
    ) {
        this.getTotalCustomersDetails();
    }

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Retailer'},
            {label: 'Dashboard', active: true}
        ];
        this.getTotalWalletbalance()
        this.getAllWalletBalance()
        this.user = this.sessionStorage.getCurrentUser();

        this.fetchData();

        this._marketplaceChart('["--vz-primary","--vz-success", "--vz-secondary"]');

        // Date Set
        this._trialEndsAt = "2022-12-31";

        interval(1000).pipe(map((x) => {
            this._diff = Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
        })).subscribe((x) => {
            this._days = this.getDays(this._diff);
            this._hours = this.getHours(this._diff);
            this._minutes = this.getMinutes(this._diff);
            this._seconds = this.getSeconds(this._diff);
        });
    }

    private fetchData() {
        this.statData = statData;
    }

    getDays(t: number) {
        return Math.floor(t / (1000 * 60 * 60 * 24));
    }

    getHours(t: number) {
        return Math.floor((t / (1000 * 60 * 60)) % 24);
    }

    getMinutes(t: number) {
        return Math.floor((t / 1000 / 60) % 60);
    }

    getSeconds(t: number) {
        return Math.floor((t / 1000) % 60);
    }

    getTotalCustomersDetails(){
        this.apiService.get('paypoint_gift_card/dashboard-panel').subscribe({
            next: (res) => {
                this.customersDetails.total_customers=res.data
                this.customersDetails.min_kyc_customers=res.data.min_kyc_customers;
                this.customersDetails.full_kyc_customers=res.data.full_kyc_customers;
            }});
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


    setmarketplacevalue(value: any) {
        if (value == 'all') {
            this.MarketplaceChart.series = [{
                name: "Artwork",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            },
                {
                    name: "Auction",
                    data: [40, 120, 83, 45, 31, 74, 35, 34, 78]
                },
                {
                    name: "Creators",
                    data: [95, 35, 20, 130, 64, 22, 43, 45, 31]
                }]
        }
        if (value == '1M') {
            this.MarketplaceChart.series = [{
                name: "Artwork",
                data: [20, 31, 25, 41, 59, 72, 69, 91, 148]
            },
                {
                    name: "Auction",
                    data: [50, 60, 103, 35, 41, 104, 35, 34, 58]
                },
                {
                    name: "Creators",
                    data: [95, 35, 20, 130, 64, 22, 43, 45, 31]
                }]
        }
        if (value == '6M') {
            this.MarketplaceChart.series = [{
                name: "Artwork",
                data: [50, 21, 15, 61, 59, 62, 69, 91, 148]
            },
                {
                    name: "Auction",
                    data: [50, 12, 83, 45, 91, 54, 35, 34, 88]
                },
                {
                    name: "Creators",
                    data: [85, 45, 70, 130, 94, 12, 23, 45, 31]
                }]
        }
        if (value == '1Y') {
            this.MarketplaceChart.series = [{
                name: "Gift Card",
                data: [70, 21, 35, 21, 49, 62, 69, 31, 148]
            },
                {
                    name: "GPR Card",
                    data: [90, 120, 23, 45, 71, 74, 35, 24, 88]
                },
                {
                    name: "BBPS",
                    data: [95, 35, 20, 130, 64, 22, 43, 45, 31]
                }]
        }
    }

    private _marketplaceChart(colors: any) {
        colors = this.getChartColorsArray(colors);
        this.MarketplaceChart = {
            series: [{
                name: "Gift Card",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            },
                {
                    name: "GPR Card",
                    data: [40, 120, 83, 45, 31, 74, 35, 34, 78]
                },
                {
                    name: "BBPS",
                    data: [95, 35, 20, 130, 64, 22, 43, 45, 31]
                }],
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            colors: colors,
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            }
        };
    }

    mySeries = [
        {
            title: 'Total Customers',
            icon: 'https://cdn.lordicon.com/dxjqoygy.json',
            count: this.customersDetails.total_customers
        },
        {
            title: 'Non KYC Customer',
            icon: 'https://cdn.lordicon.com/rqqkvjqf.json',
            count: this.customersDetails.min_kyc_customers
        },
        {
            title: 'Full KYC Customer',
            icon: 'https://cdn.lordicon.com/rqqkvjqf.json',
            count: this.customersDetails.full_kyc_customers
        },
        {
            title: 'Total Virtual Cards',
            icon: 'https://cdn.lordicon.com/jvucoldz.json',
            count: 11
        },
    ]

    openWallet(walletDetails: TemplateRef<any>) {
        this.offCanvas.open(walletDetails, {position: 'end'});
    }

    openCardModal(content: any) {
        this.modalService.open(content, {centered: true, size: 'md', backdrop: 'static', keyboard: false});
    }

    getTotalWalletbalance(){
        this.wallet.getTotalWalletsBalance().subscribe(res => {
            res.data.wallets.forEach(wallet => {
                this.total_balance += wallet.balance;
            });
        });
    }

    getAllWalletBalance(){
        this.wallet.getUserWallets().subscribe(res => {
            this.wallets = res.data.result;
        });
    }

}
