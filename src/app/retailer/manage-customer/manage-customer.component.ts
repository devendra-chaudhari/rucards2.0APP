import {AfterContentInit, Component, inject, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../shared/services/api.service";
import {ExcelService} from "../../shared/services/excel.service";
import {DatePipe} from "@angular/common";
import {User} from "../../shared/interfaces/user";
import {ProductList} from "../../shared/interfaces/product_models";


export interface UserData {
    id: string;
    full_name: string;
    father_name: string;
    dob: string;
    gender: string;
    email: string;
    mobile: string;
    active: boolean;
    created_at: string;
    pan: string;
    state: string;
    district: string;
    city: string;
    pincode: string;
    address: string;
    kyc_type: string;
    balance: number;
    card_details: CardData | null;
}

export interface CardData {
    id: number;
    card_number: string;
    created_at: string;
    current_balance: number;
    expiry_date: string;
    product_bin: string;
    product_name: string;
    status: boolean;
    transaction_allowed: boolean;
}

@Component({
    selector: 'app-manage-customer',
    templateUrl: './manage-customer.component.html',
    providers: [DatePipe]
})
export class ManageCustomerComponent implements OnInit, AfterContentInit {
    breadCrumbItems!: Array<{}>;
    user: User;
    customers: UserData[] = [];
    products: ProductList[] = [];
    pageSize: Number = 10;
    totalCustomersCount: number = 0;
    loading: boolean = false;
    page_no: number = 1;
    isAssignGPRProcessing: boolean = false;


    private offcanvasService: NgbOffcanvas = inject(NgbOffcanvas);
    private toasterService: ToastrService = inject(ToastrService);
    private apiService: ApiService = inject(ApiService);
    private excelService: ExcelService = inject(ExcelService);
    private dt = inject(DatePipe);


    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Retailer'},
            {label: 'Manage Customer', active: true}
        ];
    }

    ngAfterContentInit(): void {
        // Loading Customer Details
        this.getCustomers();
    }


    getCustomers(): void {
        this.loading = true;
        this.apiService.post('user/customers_list', {'page_size': +this.pageSize, 'page_no': +this.page_no}).subscribe({
            next: (res) => {
                this.customers = res.data.result;
                this.totalCustomersCount = res.data.total;
            },
            complete: () => {
                this.loading = false;
            }
        });

    }

    getProducts(type: string): void {
        this.apiService.get('product/list', 'get', {'sort_list': true, 'product_type': type}).subscribe({
            next: (res) => {
                console.log(res);
                this.products = res.data;
            }
        });
    }

    openGprDrawer(content: TemplateRef<any>): void {
        this.getProducts('gpr')
        this.offcanvasService.open(content, {ariaLabelledBy: 'offcanvas-gpr', position: 'end'});
    }

    openGiftDrawer(content: TemplateRef<any>): void {
        this.getProducts('gift')
        this.offcanvasService.open(content, {ariaLabelledBy: 'offcanvas-gpr', position: 'end'});
    }


    assignGprCard() {
        this.isAssignGPRProcessing = true;
        // Checking Already Assigned or Not
        .0
    }


}


