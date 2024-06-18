import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {Clipboard} from "@angular/cdk/clipboard";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";
import {DatePipe} from "@angular/common";
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

interface CustomerList {
    id: string;
    username: string;
    full_name: string;
    father_name: string;
    gender: string;
    mobile: string;
    pincode: string;
    email: string;
    dob: string;
    pan: string;
    state: string;
    district: string;
    balance: string;
    retailer: string;
    distributor: string;
    super_distributor: string;
    active: boolean;
    created_at: string;
    role: string;
    parent_username: string;
    parent_full_name: string;
    kyc_type: string;
    address: string;
    user_type:string;
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
    address:string;
}

@Component({
    selector: 'app-manage-customer',
    templateUrl: './manage-customer.component.html'
})

export class ManageCustomerComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    page: number = 1;
    pageSize: number = 10;
    totalRecords: number = 0;
    totalCustomers: number = 0;
    showDetails = false;
    cardNo = '5452 5642 8875 9642';
    customers: CustomerList[] = [];
    offCanvasData: any;
    offCanvasGiftData: any;
    wallet_found: boolean = false;
    wallet_otp_received: boolean = false;
    products: ProductList[]=[];
    // Define error message variables
    amountError: string = '';
    quantityError: string = '';

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

    customer_data = {
        id: "",
        username: "",
        full_name: "",
        father_name: "",
        gender: "",
        mobile: "",
        pincode: "",
        email: "",
        dob: "",
        pan: "",
        state: "",
        district: "",
        balance: "",
        retailer: "",
        distributor: "",
        super_distributor: "",
        active: true,
        created_at: "",
        role: "",
        parent_username: "",
        parent_full_name: "",
        kyc_type: "",
        address: "",
        user_type: ""
    }

    gc_data = {
        owner_id : null,
        bin_no : null,
        mobile_no : null,
        issue_card :"2", //1 - For My Self 2 - For Resale
        amount : null,
        quantity:1,
        remarks:"Test Api",
        first_name : null,
        last_name : null,
        pan_number : null,
        date_of_birth:null,
        email_id :null,
        card_category:"virtual",
        product_id:null
    }

    filterUserForm = new UntypedFormGroup({
        start_date: new UntypedFormControl('', [Validators.required]),
        end_date: new UntypedFormControl('', [Validators.required]),
    });

    constructor(
        private offCanvas: NgbOffcanvas,
        private toaster: ToastrService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
        private excelService: ExcelService,
        private sortService: SortService,
        private dt: DatePipe,
        private copyToClipboard: Clipboard,
        private toastr: ToastrService,
    ) {}

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Manage Users'},
            {label: 'Customers', active: true}
        ];
        this.getAllCustomers(this.page, this.pageSize);
    }

    onFilterUser(filter_user: any) {
        this.offCanvas.open(filter_user, {position: 'end', animation: true});
      }

    openDetails(customerDetails: TemplateRef<any>, customer:CustomerList) {
        this.customer_data =customer
        this.offCanvas.open(customerDetails, {position: 'end'});
    }

    copyCardNo() {
        this.copyToClipboard.copy(this.cardNo);
        this.toastr.success('Copied to Clipboard');
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

    onConvertToFullEKYC(convert_to_full_kyc: TemplateRef<any>, data: any) {
        this.offCanvas.open(convert_to_full_kyc, {position: 'end', animation: true});
    }
    
    protected readonly Math = Math;
    onGenerateNewGPRCard(generate_new_gpr_card: any, data: any) {
        this.onGetProductsList();
        this.wallet_found = false;
        this.wallet_otp_received = false;
        this.offCanvasData = data;
        this.data.customer_id = data.id;
        this.data.pan_no = data.pan;
        this.data.customer_mobile = data.mobile;
        this.offCanvas.open(generate_new_gpr_card, {position: 'end', animation: true});
    }

    onGenerateGiftCard(generate_new_gift_card: any, data: any) {
        this.onGetProductsList();
        this.offCanvasGiftData = data;
        this.gc_data.owner_id = data.id
        this.gc_data.pan_number = data.pan

        const fullName = data.full_name;
        const fullNameParts = fullName.split(' '); // Split the full name by space

        // Check if there are at least two parts (first name and last name)
        if (fullNameParts.length >= 2) {
            const firstName = fullNameParts[0]; // Get the first part (first name)
            const lastName = fullNameParts[fullNameParts.length - 1]; // Get the second part (last name)
            this.gc_data.first_name = firstName; // Save the first name
            this.gc_data.last_name = lastName; // Save the first name
        } else {
            // Handle the case where there is no last name
            this.gc_data.first_name = fullName; // Save the entire name as the first name
        }

        this.gc_data.date_of_birth = this.offCanvasGiftData.dob
        this.gc_data.email_id = data.email
        this.gc_data.mobile_no = data.mobile
        this.offCanvas.open(generate_new_gift_card, {position: 'end', animation: true});
    }

    validateGiftCardDetails() {
        // Reset error messages
        this.amountError = '';
        this.quantityError = '';

        // Check if the amount is greater than 0 and less than 10000
        if (this.gc_data.amount < 100 || this.gc_data.amount >= 10000) {
            this.amountError = '*Amount should be between than  and less than 10000';
            return;
        }

        // Check if the quantity is between 0 and less than 50
        if (this.gc_data.quantity < 1 || this.gc_data.quantity > 50) {
            this.quantityError = '*Quantity should be greater than 1 and less than 50';
            return;
        }
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r =>
            {
                return null;
            }
        );
        this.gc_data.product_id = this.data.product_id
        this.apiService.post('paypoint_gift_card/gift-manage-generate',this.gc_data).subscribe({
            next: (res) => {
                this.toaster.success('Congratulations! card created Successfully.');
                // success
                this.spinner.hide().then(r => null);
                this.offCanvas.dismiss();
                this.spinner.hide().then(r => {
                    return null;
                });

            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => null);
                // this.offCanvas.dismiss();
            }, complete: () => {
                // this.offCanvas.dismiss();
                this.spinner.hide().then(r => {
                    return null;
                });

            }
        });
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
            this.gc_data.bin_no = this.data.product_bin;
            return bin_records[0]['product_bin'];
        }
        return null;
    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.totalRecords);
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

    onPageChange(event: any){
        this.page = event
        this.getAllCustomers(this.page, this.pageSize)
    }

    onPageSizeChange(){
        this.getAllCustomers(this.page, this.pageSize)
    }

    onSubmitFilterUser(){
        const {start_date, end_date} = this.filterUserForm.value
        console.log(start_date, end_date)
        this.getAllCustomers(this.page, this.pageSize, start_date, end_date);
        this.offCanvas.dismiss();
    }

    getAllCustomers(page:number, page_size:number, start_date:Date=null, end_date:Date=null) {
        const data ={
            'page_no': page, 
            'page_size': page_size, 
            'start_date': start_date,
            'end_date': end_date
        }
        console.log("in getAllCustomer", data)
        this.apiService.post('user/customers_list',data).subscribe(res => {
            this.customers = res.data.result;
            this.totalCustomers=res.data.total;
            this.filterUserForm.reset();
        },(error) => {
            this.toaster.error(error.error.error);
        }
    );
    }

}
