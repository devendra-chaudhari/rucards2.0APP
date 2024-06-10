import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {User} from "../../shared/interfaces/user";
import {SessionStorageService} from "../../shared/services/session-storage.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

export interface GPRCard{
    Name: string;
    AccessTokenKey: string;
    KitNo: string;
    CardNumber: string;
    ExpiryDate: string;
    CreatedOn: string;
    IsVirtual: boolean;
    Status: string;
    CurrentBalance: string;
}

interface ProductList {
    id: string;
    product_image: string;
    product_name: string;
    product_code: string;
    product_type: string;
    branding_category: string;
    service_provider: string;
    product_description: null
    created_user: { username: string }
    product_series: string;
    active: boolean;
    created_at: string;
    wallet_id:number;
}


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    user: User | undefined;
    basicColumnChart: any;
    showDetails = true;
    @ViewChild('createWallet') createWallet!: TemplateRef<any>;
    gprCardsList: GPRCard[] = [];
    sanitizedUrl: SafeResourceUrl | undefined ;
    isGPRCardCreated: boolean | undefined;
    isGPRWalletCreated: boolean | undefined;
    products: ProductList[]=[];
    wallet_found: boolean = false;
    wallet_otp_received: boolean = false;
    data = {
        customer_id: '',
        product_id: '',
        product_bin: '',
        card_category: 'virtual',
        otp: '',
        kit_no: '',
        pan_no: '',
        customer_mobile: '',
        amount:'',
        quantity:'',
        pin:''
    };
    constructor(
        private modalService: NgbModal,
        private apiService: ApiService,
        private offCanvas: NgbOffcanvas,
        private toaster: ToastrService,
        private domSanitizer: DomSanitizer,
        private sessionStorage: SessionStorageService,
        private spinner: NgxSpinnerService,
    ) {
        this.sessionStorage.currentUser.subscribe(user => {
            if (this.user == null) {
                this.user = this.sessionStorage.getCurrentUser();
                this.sessionStorage.changeCurrentUserDetail(this.sessionStorage.getCurrentUser());
            } else {
                this.user = user;
            }
        });
        this.getVirtualCardDetails();
    }

    ngOnInit(): void {
        this._basicColumnChart('["--vz-primary", "--vz-gray-300"]');
    }

    getSplitCardNumber(cardNumber: string) {
        if (cardNumber.length > 0) {
            return cardNumber.slice(0, 4) + '-' +
                cardNumber.slice(4, 8) + '-' +
                cardNumber.slice(8, 12) + '-' +
                cardNumber.slice(12, 15);
        } else {
            return null;
        }
    }


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


    createNewVirtualCard() {
        this.apiService.post('paypoint/create_virtual_card', {"mobile_no": this.user.mobile}).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }
        });
    }
    getVirtualCardDetails() {
        this.apiService.post('paypoint/user_gpr_card_details', {"user_id": this.user.id}).subscribe({
            next: (res) => {
                this.isGPRCardCreated = res.data.PrePaidCardCollection[0].isGPRCARDCreated;
                this.isGPRWalletCreated =res.data.PrePaidCardCollection[0].isWalletCreated;
                if(this.isGPRCardCreated==true ){
                    this.gprCardsList = res.data.PrePaidCardCollection
                }
            },
            error: (error) => {
                this.isGPRCardCreated = error.error.data.isGPRCardCreated;
                this.isGPRWalletCreated =error.error.data.isGPRWalletCreated;
            }
        });
    }


    onCopyCardNo() {
        this.toaster.success("Card No Copied");
    }


    // mobile_no', 'access_token_key', 'kit_no
    card_view_details_iframe_widget() {
        this.apiService.post('paypoint/card_view_details_iframe_widget',
            {

                "mobile_no": this.user.mobile,
                "access_token_key": this.gprCardsList[0].AccessTokenKey,
                "kit_no": this.gprCardsList[0].KitNo,
            })
            .subscribe({
                next: (res) => {
                    window.open(res.data['Msg'], '_blank').focus();
                },
                error: (error) => {
                    this.toaster.error(error.error.error);
                }
            });
    }

    card_set_pin_iframe_widget() {

        this.apiService.post('paypoint/card_set_pin_iframe_widget', {"mobile_no": this.user.mobile,"access_token_key": this.gprCardsList[0].AccessTokenKey,
            "kit_no": this.gprCardsList[0].KitNo}).subscribe({
            next: (res) => {
                window.open(res.data['Msg'], '_blank').focus();

            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    openDialog(url) {
        this.spinner.show();
        window.open(url, '_blank');
        this.spinner.hide();
    }

    onGetProductsList() {
        this.spinner.show();
        this.apiService.get('product/list').subscribe({
            next: (res) => {
                this.products = res.data;
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();

            }
        });
    }

    CreateNewWallet() {
        this.apiService.post('paypoint/create_new_wallet', this.data).subscribe(
            (res) => {
                this.offCanvas.dismiss();
                this.toaster.success(res.message);
            },
            (error) => {
                this.toaster.error(error.error.error);
            }
        );
    }

    validateWalletDetails() {
        if (this.data.customer_id == null || this.data.customer_id == '') {
            this.toaster.error('Unable to Get Customer Details');
            return;
        } else if (this.data.product_id == null || this.data.product_id == '') {
            this.toaster.error('Please Select Product Name');
            return;
        } else if (this.data.customer_mobile == null || this.data.customer_mobile == '') {
            this.toaster.error('Customer Details not Found');
            return;
        } else if (this.data.card_category == null || this.data.card_category == '') {
            this.toaster.error('Choose Card Category');
            return;
        }else if (this.data.pan_no == null || this.data.pan_no == '') {
            this.toaster.error('Enter Pan Card No');
            return;
        }
        this.wallet_found = false;

        this.apiService.post('paypoint/is_registered', this.data).subscribe(
            (res) => {
                if (res.success) {
                    this.wallet_found = true;
                    this.offCanvas.dismiss();
                    this.toaster.success('Created Successfully');
                } else {
                    // Call another API endpoint if the customer is not registered
                    this.apiService.post('paypoint/generate_new_wallet_otp', {"mobile_no": this.data.customer_mobile}).subscribe(
                        (reg_otp) => {
                            this.wallet_found = false;
                            this.wallet_otp_received = true;
                            this.toaster.success(reg_otp.message);
                        },
                        (error) => {
                            this.toaster.error(error.error.error);
                        }
                    );
                }
            },
            (error) => {
                this.apiService.post('paypoint/generate_new_wallet_otp', {"mobile_no": this.data.customer_mobile}).subscribe(
                    (reg_otp) => {
                        this.wallet_found = false;
                        this.wallet_otp_received = true;
                        this.toaster.success(reg_otp.message);
                    },
                    (error) => {
                        this.toaster.error(error.error.error);
                    }
                );
            }
        );
    }

    onProductSelectionChange() {
        const bin_records = this.products.filter((x: { id: string; }) => x.id == this.data.product_id);
        if (bin_records.length > 0) {
            this.data.product_bin = bin_records[0]['product_series']

            return bin_records[0]['product_bin'];
        }
        return null;
    }


    onGenerateNewGPRCard(generate_new_gpr_card: any, data: any) {
        this.onGetProductsList();
        this.wallet_found = false;
        this.wallet_otp_received = false;
        // this.offCanvasData = data;
        this.data.customer_id = data.id;
        this.data.pan_no = data.pan;
        this.data.customer_mobile = data.mobile;
        this.offCanvas.open(generate_new_gpr_card, {position: 'end', animation: true});
    }


}
