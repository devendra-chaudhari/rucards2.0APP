import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ImageConverterService} from "../../../shared/services/image-converter.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ToWords} from "to-words";

interface ProductList {
    id: number;
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
    wallet_id:string;
}
export interface RucardsWallet {
    id: string;
    name: string;
    wallet_status: string;
    product_id: string;
}
export interface UserDetails {
    email:string;
    full_name:string;
    mobile:string;
    parent_id:string;
    parent_type:string;
    user_type:string;
}

@Component({
    selector: 'app-add-fund-request',
    templateUrl: './add-fund-request.component.html',
    styleUrls: ['./add-fund-request.component.scss']
})

export class AddFundRequestComponent implements OnInit, DoCheck {

    breadCrumbItems!: Array<{}>;
    roleName = '';
    user_details = {
        "email":null,
        "full_name":null,
        "mobile":null,
        "parent_id":null,
        "parent_type":null,
        "user_type":null
    }
    products: ProductList[] = [];
    tempProducts: ProductList[] = [];
    convertedAmount = '';
    avatar = '';
    isFundSubmit = false;
    Wallets :RucardsWallet[] = [];
    filePath = 'assets/images/receipt.svg';
    payment_modes = [];
    max_date = new Date();
    toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: true,
            doNotAddOnly: false,
            currencyOptions: {
                name: 'Rupee',
                plural: 'Rupees',
                symbol: '₹',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paise',
                    symbol: '',
                },
            }
        }
    });


    fundForm: FormGroup = new FormGroup({
        receiver: new FormControl('company', [Validators.required]),
        wallet_name: new FormControl(null, [Validators.required]),
        deposit_date: new FormControl(null, [Validators.required]),
        payment_mode: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [Validators.required, Validators.min(100)]),
        ref_no: new FormControl(null, [Validators.required]),
        receipt: new FormControl(null),
        remark: new FormControl(null),
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private imageConverterService: ImageConverterService,
        private apiService: ApiService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
    ) {
        this.getUserDetails();
    }

    ngDoCheck() {
        this.route.paramMap.subscribe(param => this.roleName = param.get('role_name'));

        this.breadCrumbItems = [
            {label: this.roleName},
            {label: 'Add Fund', active: true}
        ];
    }

    ngOnInit(): void {
        this.wallet_list();
        this.payment_mode();
        this.product_list()
    }

    convertNumber() {
        return this.toWords.convert(this.ff['amount'].value);
    }

    numtoword() {
        if (this.ff['amount'].value == '') {
            this.convertedAmount = '';
        } else {
            this.convertedAmount = this.convertNumber();
        }
    }

    get ff() {
        return this.fundForm.controls;
    }

    uploadReceipt(event) {
        this.imageConverterService.convertBlobToBase64(event.target.files[0]).then(value => {
            this.filePath = value;
            this.avatar = value;
        });
    }

    onSubmit() {
        this.isFundSubmit = true;
        if (this.fundForm.invalid) {
            return;
        } else {
            this.spinner.show();
            const data = {
                "receiver": this.ff['receiver'].value,
                "wallet_name": this.ff['wallet_name'].value.name,
                "deposit_date": this.ff['deposit_date'].value,
                "payment_mode": this.ff['payment_mode'].value,
                "amount": +this.ff['amount'].value,
                "ref_no": this.ff['ref_no'].value,
                "receipt": this.avatar,
                "remark": this.ff['remark'].value,
                "product_id":this.ff['wallet_name'].value.id,
                "wallet_id":this.ff['wallet_name'].value.wallet_id
            }

            this.apiService.post('fund_request/create', data).subscribe({
                next: (res) => {
                    this.router.navigateByUrl('/manage-balance/my-fund-request')
                    this.toastr.success('Fund Request Sent.')
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            })
        }
    }

    wallet_list() {
        this.apiService.post('wallet/rucards-wallet-list',{'user_id':''}).subscribe({
            next: (res) => {
                this.Wallets = res.data.result;
            },
            error: (error) => {
                this.toastr.warning(error.error.error);
            }, complete: () => {
            }
        });
    }

    product_list(){
        this.apiService.get('product/list').subscribe(res => {
            this.products = res.data;
            this.tempProducts = res.data;
        });
    }

    payment_mode() {
        const payload={
            "page":1,
            "page_size":10,
            "category_id":1
        }
        this.apiService.post('misc/misc_list_by_category', payload).subscribe({
            next: (res) => {
                this.payment_modes = res.data.result;
            },
            error: (error) => {
                this.toastr.warning(error.error.error);
            }, complete: () => {
            }
        });
    }

    changeRemark() {
        if (this.ff['remark'].value == '' || this.ff['remark'].value == null) {
            this.ff['remark'].setValue(this.ff['wallet_name'].value.name + " Wallet Loading")
        }
    }

    getUserDetails(){
        this.apiService.get('user/current-user-details').subscribe({
            next: (res) => {
                this.user_details = res.data;
            },
            error: (error) => {
                this.toastr.warning(error.error.error);
            }, complete: () => {
            }
        });
    }


}
