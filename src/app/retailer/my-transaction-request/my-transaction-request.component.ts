import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../shared/services/api.service";

export interface MyTransactions{
    id: string;
    transaction_type: string;
    transaction_status: string;
    transaction_id: string;
    remark: string;
    amount: string;
    old_balance: string;
    new_balance: string;
    wallet_id: string;
    user_id: string;
    created_at: string;
    bin_no:string;
    product_id:string;
    ending4Digits:string;
}
@Component({
    selector: 'app-my-transaction-request',
    templateUrl: './my-transaction-request.component.html'
})
export class MyTransactionRequestComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    my_transactions:MyTransactions[]=[]
    //table
    page_no : number = 1;
    page:number = 1;
    page_size:number = 10;
    total:number = 0;
    totalRecords: number = 0;
    constructor(
        private spinner: NgxSpinnerService,
        private toaster: ToastrService,
        private apiService: ApiService,
    ) {
        this.getMyTransactions();
    }

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Retailer'},
            {label: 'My Transaction', active: true}
        ];
    }

    getMyTransactions(){
        this.apiService.post('transaction/retailer-all-transactions-list',{
            "page_no":this.page_no,
            "page_size":this.page_size,
        }).subscribe({
            next: (res) => {
                this.my_transactions = res.data.result;
                this.total = res.data.total;
                this.totalRecords = res.data.total;
                this.spinner.hide().then(r => {
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => null);
            }, complete: () => {
                this.spinner.hide().then(r => {
                    return null;
                });
            }
        });
    }

    onPageSizeChange() {
        this.getMyTransactions();
    }

    onPageChange(event: any){
        this.page_no = event
        this.getMyTransactions();
    }

    getMax() {
        return Math.min(this.page * this.page_size, this.totalRecords);
    }


}
