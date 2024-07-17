import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";

import {NgxSpinnerService} from "ngx-spinner";
import {random} from "lodash";
import {NgbModal, NgbOffcanvas, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import { User } from 'src/app/shared/interfaces/user';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SimplebarAngularModule } from 'simplebar-angular';


export interface RucardsWallet {
    id: string;
    name: string;
    wallet_status: string;
    product_id: string;
    balance:string;
}

export interface TransactionDetails{
    amount:number;
    current_balance:number;
    deposit_date:string;
    id:number;
    payment_mode:string;
    receipt:string;
    receiver_id:string;
    ref_no:string;
    remark:string;
    request_date:string;
    response_at:string;
    response_remark:string;
    status:string;
    user_id:string;
    product_name:string;
    name:string;
    mobile:number;
    email:string;
    wallet_id:string;
    wallet_name:string;
    fund_request_id:string;
    admin_wallet_balance:number;
}

@Component({
  selector: 'app-downline-fund-request',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbPagination,
    UiSwitchModule,
    SimplebarAngularModule],
  templateUrl: './downline-fund-request.component.html',
  styleUrl: './downline-fund-request.component.scss'
})
export class DownlineFundRequestComponent {

    breadCrumbItems!: Array<{}>;
    user:User;
    transactions: TransactionDetails[] = [];
    tempTransactions: TransactionDetails[] = [];
    temp_transactions={
        amount:null,
        current_balance:null,
        deposit_date:null,
        id:null,
        payment_mode:null,
        receipt:null,
        receiver_id:null,
        ref_no:null,
        remark:null,
        request_date:null,
        response_at:null,
        response_remark:null,
        status:null,
        user_id:null,
        product_name:null,
        name:null,
        mobile:null,
        email:null,
        wallet_id:null,
        fund_request_id:null,

    }
    page: number = 1;
    pageSize: number = 10;
    Wallets :RucardsWallet[] = [];
    total :number;
    addWalletFund = {
        "wallet_id":null,
        "request_amount":null,
        "ref_no":null,
        "remark":null,
        "current_balance":null,
    }
    acceptWalletFund={
        "parent_wallet_id":null,
        "request_amount":null,
        "user_id":null,
        "ref_no":null,
        "remark":null,
        "current_balance":null,
        "wallet_id":null,
        "sender_current_balance":null,
        "fundRequest_id":null
    }
    current_balance:string;

    filterUserForm = new UntypedFormGroup({
        start_date: new UntypedFormControl('', [Validators.required]),
        end_date: new UntypedFormControl('', [Validators.required]),
      });
      
    constructor(
        private modalService: NgbModal,
        private offCanvas: NgbOffcanvas,
        private apiService: ApiService,
        private toaster: ToastrService,
        private excelService: ExcelService,
        private spinner: NgxSpinnerService,
        private sessionStorage:SessionStorageService
    ) {
        this.wallet_list();
        this.getDownlineFundRequest(this.page,this.pageSize);
    }

    ngOnInit() {
        this.sessionStorage.currentUser.subscribe(user => {
            if (user == null) {
                this.sessionStorage.changeCurrentUserDetail(this.sessionStorage.getCurrentUser());
            } else {
                this.user = user;
            }
        });
        this.breadCrumbItems = [
            {label: 'Manage Balance'},
            {label: 'Downline Fund Request', active: true}
        ];

    }



    export_to_excel() {
        this.spinner.show();
        this.excelService.exportAsExcelFile(this.transactions, 'Downloading-fund-request-' + random() * 56413216544 + '.xlsx', 'request_date', ['receipt', 'user_id', 'receiver_id'], ['name', 'fund_request_id', 'wallet_name', 'request_date', 'current_balance', 'amount','status', 'remark']);
        this.spinner.hide();
    }

    getDownlineFundRequest(page:number, page_size:number, start_date:Date=null, end_date:Date=null) {
        this.spinner.show();
        const data ={
            'page_no': page, 
            'page_size': page_size, 
            'start_date': start_date,
            'end_date': end_date
        }
        this.apiService.post('fund_request/downline_fund_request',data).subscribe({
            next: (res) => {
                console.log(res.data.result)
                this.transactions = res.data.result;
                this.tempTransactions = res.data.result;
                this.total = res.data.total
                for (let i = 0; i < this.transactions.length; i++) {
                    for (const wallet of this.Wallets) {
                        if (wallet.id === this.transactions[i].wallet_id){
                            this.transactions[i].wallet_name = wallet.name
                        }
                    }
                }
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    onViewBalanceRequest(viewBalanceRequest: any, transaction: any) {
        this.acceptWalletFund.user_id = transaction.user_id;
        this.acceptWalletFund.request_amount = +transaction.amount;
        this.acceptWalletFund.parent_wallet_id = transaction.wallet_id;
        this.acceptWalletFund.sender_current_balance = +transaction.current_balance;
        this.acceptWalletFund.wallet_id = transaction.wallet_id;
        this.acceptWalletFund.ref_no = transaction.ref_no;
        this.acceptWalletFund.remark = transaction.remark;
        this.acceptWalletFund.fundRequest_id = transaction.id;
        this.temp_transactions=transaction;
        this.offCanvas.open(viewBalanceRequest, {position: 'end', animation: true});
    }

    onAcceptSubmit(){
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r => {
            return null;
        });

        this.apiService.post('wallet/accept-request',this.acceptWalletFund).subscribe({
            next: (res) => {
                // success
                this.toaster.success('Request Accept Successfully');
                this.spinner.hide().then(r => {
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return null;
                });
            }, complete: () => {
                this.offCanvas.dismiss()
                this.acceptWalletFund.user_id = null;
                this.acceptWalletFund.request_amount = null;
                this.acceptWalletFund.parent_wallet_id = null;
                this.acceptWalletFund.sender_current_balance = null;
                this.acceptWalletFund.wallet_id = null;
                this.acceptWalletFund.ref_no = null;
                this.acceptWalletFund.remark = null;
                this.acceptWalletFund.fundRequest_id = null;
                this.spinner.hide().then(r => {
                    return null;
                });// Re-enable the button after completion
                this.getDownlineFundRequest(this.page,this.pageSize);
            }

        });
        this.apiService.get('wallet/get-user-wallet-balance').subscribe({
            next: (res1) => {
                let total_balance:number = 0
                this.user.wallets = res1.data.wallets;
                res1.data.wallets.forEach((item) => {
                    // You can access the current item inside this function
                    total_balance += item['balance']
                });

                this.sessionStorage.changeCurrentUserDetail(this.sessionStorage.getCurrentUser());
            }
        });
    }

    onRejectSubmit(){
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r => {
            return null;
        });

        this.apiService.post('wallet/reject-request',this.acceptWalletFund).subscribe({
            next: (res) => {
                this.toaster.success('Request Rejected Successfully');
                this.spinner.hide().then(r => {
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return null;
                });
            }, complete: () => {
                this.offCanvas.dismiss()
                this.spinner.hide().then(r => {
                    return null;
                });// Re-enable the button after completion
                this.getDownlineFundRequest(this.page,this.pageSize);
            }
        });
    }

    onSubmitAddWalletFund(){
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r => {
            return null;
        });

        this.apiService.post('wallet/add-pool-balance',{
                                                        "wallet_id":this.addWalletFund.wallet_id,
                                                        "request_amount":+this.addWalletFund.request_amount,
                                                        "transaction_type":"ADD",
                                                        'ref_no':this.addWalletFund.ref_no,
                                                        'remark':this.addWalletFund.remark,
                                                        'current_balance':+this.addWalletFund.current_balance,
                                                                }).subscribe({
            next: (res) => {
                this.toaster.success('Search Successfully!!');
                // success
                // Refresh Card List to show newly Created cards
                this.spinner.hide().then(r => {
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return null;
                });
            }, complete: () => {
                this.modalService.dismissAll()
                this.addWalletFund.wallet_id = null;
                this.addWalletFund.request_amount = null;
                this.addWalletFund.ref_no = null;
                this.addWalletFund.remark = null;
                this.addWalletFund.current_balance = null;
                this.spinner.hide().then(r => {
                    return null;
                });// Re-enable the button after completion
            }
        });
    }

    openAddWalletBalanceModal(content: any) {
        this.modalService.open(content, {centered: true, keyboard: false});
    }

    wallet_list() {
        this.apiService.post('wallet/rucards-wallet-list',{'user_id':''}).subscribe({
            next: (res) => {
                this.Wallets = res.data.result;
            },
            error: (error) => {
                this.toaster.warning(error.error.error);
            }, complete: () => {
            }
        });
    }

    onWalletSelectionChange() {
        const bin_records = this.Wallets.filter((x: { id: string; }) => x.id == this.addWalletFund.wallet_id);
        this.current_balance = bin_records[0].balance
    }

    onSubmitFilterUser(){
        const {start_date, end_date} = this.filterUserForm.value
        console.log(start_date, end_date)
        this.getDownlineFundRequest(this.page,this.pageSize, start_date, end_date);
        this.offCanvas.dismiss();
      }
      
      onFilterUser(filter_user: any) {
        this.offCanvas.open(filter_user, {position: 'end', animation: true});
      }
      
    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredMiscs = this.tempTransactions.filter(x => x.name.toLowerCase().includes(searchTextLower) || x.fund_request_id.toLowerCase().includes(searchTextLower));
      
        if (searchTextLower == '') {
          this.transactions = this.tempTransactions;
        } else
          this.transactions = filteredMiscs;
      }
}
