import {Component, DoCheck, OnInit} from '@angular/core';
import {ToWords} from "to-words";
import {FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import {ImageConverterService} from "../../../shared/services/image-converter.service";
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {WalletService} from "../../../shared/services/wallet.service";
import {User} from "../../../shared/interfaces/user";
import {SessionStorageService} from "../../../shared/services/session-storage.service";

interface ProductList {
    id: number;
    product_image: string;
    product_name: string;
    product_code: string;
    product_type: string;
    branding_category: string;
    service_provider: string;
    product_description: string;
    created_user: { username: string }
    product_series: string;
    active: boolean;
    created_at: string;
    wallet_id: number;
    enable: boolean;
}

interface BankList {
    id: number;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface RucardsWallet {
    id: string;
    name: string;
    wallet_status: string;
    product_id: string;
    balance: string;
}

export interface TransactionList {
    id: string,
    transaction_type: string,
    transaction_status: string,
    ref_no: string,
    remark: string,
    amount: string,
    old_balance: string,
    new_balance: string,
    wallet_id: string,
    wallet_name: string,
    receiver_id: string,
    sender_id: string,
    created_date: string,
    updated_at: string
}

@Component({
    selector: 'app-pool-balance-request',
    templateUrl: './pool-balance-request.component.html',
    styleUrls: ['./pool-balance-request.component.scss']
})
export class PoolBalanceRequestComponent implements OnInit, DoCheck {
    walletId:any=0

    breadCrumbItems!: Array<{}>;
    fundForm: FormGroup;
    services: FormArray;
    user: User;
    select_wallet: string = null;
    transactions: TransactionList[] = [];
    products: ProductList[] = [];
    page: number = 1;
    pageSize: number = 10;
    banks: BankList[] = [];
    Wallets: RucardsWallet[] = [];
    avatar = '';
    filePath = 'assets/images/receipt.svg';
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
    isFundSubmit: boolean = false;


    constructor(
        private fb: FormBuilder,
        private imageConverterService: ImageConverterService,
        private apiService: ApiService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private wallet: WalletService,
        private sessionStorage: SessionStorageService
    ) {
        this.wallet.getRucardsWalletList().subscribe(res => {
            this.Wallets = res.data.result;
        });
        this.fundForm = this.fb.group({
            bank_id: new FormControl(null, [Validators.required]),
            bank_name: new FormControl(null, [Validators.required]),
            wallet_name: new FormControl(null, [Validators.required]),
            transaction_date: new FormControl(null, [Validators.required]),
            amount: new FormControl(null, [Validators.required, Validators.min(100)]),
            ref_no: new FormControl(null, [Validators.required]),
            receipt: new FormControl(null),
            remark: new FormControl(null),
            services: this.fb.array([]),
        });
        this.services = this.fundForm.get('services') as FormArray;
        this.services.valueChanges.subscribe(() => {
            this.updateTotalAmount();
        });

    }

    updateTotalAmount() {
        const totalAmount = this.services.controls.reduce((total, serviceGroup) => {
            const amountValue = parseFloat(serviceGroup.get('amount').value);

            if (!isNaN(amountValue)) {
                return total + amountValue;
            }

            return total;
        }, 0);

        if (!isNaN(totalAmount)) {
            this.fundForm.get('amount').setValue(totalAmount);
        } else {
            this.fundForm.get('amount').setValue(0);
        }
    }

    addService(product: ProductList) {
        const serviceGroup = this.fb.group({
            service_id: [product.id],
            service_name: [product.product_name],
            service_wallet_id: [product.wallet_id],
            amount: [0, [Validators.pattern('^[0-9]*$'), Validators.min(0)]]
        });

        this.services.push(serviceGroup);
    }


    ngDoCheck() {
        this.breadCrumbItems = [
            {label: 'Manage Balance'},
            {label: 'Pool Balance', active: true}
        ];
    }

    ngOnInit(): void {
        this.GetMyFundRequests()
        this.getBanks()
        this.getProducts();
    }

    get ff() {
        return this.fundForm.controls;
    }

    convertNumber(amount: number) {
        return this.toWords.convert(amount);
    }


    uploadReceipt(event: any) {
        this.imageConverterService.convertBlobToBase64(event.target.files[0]).then(value => {
            this.filePath = value;
            this.avatar = value;
        });
    }

    onSubmit() {
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });

        this.apiService.post('wallet/add-pool-balance', {
            "wallet_id": this.ff['wallet_name'].value.id,
            "request_amount": +this.ff['amount'].value,
            "transaction_type": "ADD",
            'ref_no': this.ff['ref_no'].value,
            'remark': this.ff['remark'].value,
            'current_balance': this.ff['wallet_name'].value.balance,
            'product_wise_balance': this.fundForm.value.services
        }).subscribe({
            next: () => {
                this.toastr.success('Add Pool Balance Successfully!!');
                this.loadBalance();
                this.GetMyFundRequests();
                this.fundForm.reset();
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    loadBalance() {

        this.apiService.get('wallet/get-user-wallet-balance').subscribe({
            next: (res) => {
                let total_balance = 0;
                this.user = this.sessionStorage.getCurrentUser();
                this.user.wallets = res.data.wallets;
                this.sessionStorage.changeCurrentUserDetail(this.sessionStorage.getCurrentUser());
            },
            error: (error) => {
                this.toastr.error(error.error.error);
            }, complete: () => {

            }
        });
    }

    getBanks() {
        this.apiService.get('manage-banks/banks-list').subscribe(res => {
            this.banks = res.data.result;
        });
    }

    GetMyFundRequests() {
        const payload = {
            "page" : this.page,
            "page_size" : this.pageSize
        }
        this.apiService.post('wallet/get-pool-transactions',payload).subscribe({
            next: (res) => {
                this.transactions = res.data.result;
            },
            error: (error) => {
                this.toastr.error(error.error.error);
            }
        });
    }

    getProducts() {
        this.apiService.get('product/list').subscribe({
            next: (res) => {
                this.products = res.data;
                console.log(this.products)
                this.products.forEach(product => {
                    this.addService(product);
                });
            }
        });
    }

    getWalletProduct(walletId){
        console.log(walletId)
        
    }


}
