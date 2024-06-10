import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {ExcelService} from "../../../shared/services/excel.service";
import {NgxSpinnerService} from "ngx-spinner";
import {random} from "lodash";
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../../shared/interfaces/user";
import {SessionStorageService} from "../../../shared/services/session-storage.service";

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
}
@Component({
    selector: 'app-downline-fund-request',
    templateUrl: './downline-fund-request.component.html',
    styleUrls: ['./downline-fund-request.component.scss']
})
export class DownlineFundRequestComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    user:User;
    transactions: TransactionDetails[] = [];
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
        this.getDownlineFundRequest();
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


    onSearch(value: string) {

    }

    export_to_excel() {
        this.spinner.show();
        this.excelService.exportAsExcelFile(this.transactions, 'Fund-request-' + random() * 56413216544 + '.xlsx', 'request_date', ['receipt', 'user_id', 'receiver_id'], ['request_date', 'amount', 'deposit_date', 'ref_no', 'status', 'wallet_name', 'response_at', 'response_remark', 'remark']);
        this.spinner.hide();
    }

    getDownlineFundRequest() {
        this.spinner.show();
        this.apiService.get('fund_request/downline_fund_request').subscribe({
            next: (res) => {
                this.transactions = res.data;
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
                this.getDownlineFundRequest();
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
                this.getDownlineFundRequest();
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

}
