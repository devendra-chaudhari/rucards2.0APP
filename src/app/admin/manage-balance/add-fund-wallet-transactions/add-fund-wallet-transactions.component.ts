import { Component } from '@angular/core';
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {ExcelService} from "../../../shared/services/excel.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";

export interface Transactions{
  receiver_profile_id: string;
  receiver_name: string;
  name:string;
  mobile:string;
  email: string;
  user_id: string;
  deposit_date: string;
  request_date: string;
  payment_mode: string;
  amount: string;
  old_balance: string;
  balance: string;
  ref_no: string;
  wallet_name: string;
  wallet_id: string;
  current_balance: string;
  remark: string;
  receiver_id: string;
  response_at: string;
  response_remark: string;
  receipt: string;
  status: string;
  created_at: string;
  updated_at: string;
  id: string;
  transaction_type: string;
  transaction_status: string;
  transaction_id: string;
  gc_ending4Digits: string;
  bin_no: string;
  product_id: string;
  fund_transaction_id: string;
  fund_request_id: string;
  role:string;
}
@Component({
  selector: 'app-add-fund-wallet-transactions',
  templateUrl: './add-fund-wallet-transactions.component.html',
  styleUrls: ['./add-fund-wallet-transactions.component.scss']
})
export class AddFundWalletTransactionsComponent {
  breadCrumbItems!: Array<{}>;
  transactions: Transactions[] = [];
  total:number=1;
  page: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  const_wallet_id = null;
  role:string=null;
  tempExcelData = [];

  constructor(
      private route: ActivatedRoute,
      private apiService: ApiService,
      private toaster: ToastrService,
      private excelService: ExcelService,
      private spinner: NgxSpinnerService,
      private dt: DatePipe
  ) {
    this.route.queryParams.subscribe(params => {
      this.const_wallet_id = params['wallet_id'];
    });

  }

  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Manage Balance'},
      {label: 'My Fund Request', active: true}
    ];
    this.getTransactions();

  }

  getTransactions(){
    this.apiService.post('transaction/add-fund-wallet-transactions',{'wallet_id':this.const_wallet_id,'page_size':this.pageSize,'page_no':this.page}).subscribe({
      next: (res) => {
        this.transactions = res.data.result;
        this.total=res.data.total;
        this.totalRecords=res.data.total;
        this.role= res.data.role;
      }
    });
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }

  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = [
      'serial_no',
        // 'activated_on':this.dt.transform(this.giftCardList[i].activated_on, 'dd/MM/yyyy H:m:s'),
        'receiver_profile_id',
        'receiver_name',
        // 'name':this.transactions[i].name,
        // // 'expiry_date':this.giftCardList[i].expiry_date,
        // 'mobile':this.transactions[i].mobile,
        // 'email':this.transactions[i].email,
        'user_id',
        'request_date',
        'payment_mode',
        'amount',
        'old_balance',
        'current_balance',
        'transaction_type',
        'ref_no',
        'wallet_name',
        'wallet_id',
        'remark',
        'receiver_id',
        'response_at',
        // 'receipt':this.transactions[i].receipt,
        'status'
    ]
    this.excelService.exportAsExcelFile(this.tempExcelData, 'walletList', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.transactions.length; i++) {
      const row = {
        'serial_no': i + 1,
        // 'activated_on':this.dt.transform(this.giftCardList[i].activated_on, 'dd/MM/yyyy H:m:s'),
        'receiver_profile_id':this.transactions[i].receiver_profile_id,
        'receiver_name':this.transactions[i].receiver_name,
        // 'name':this.transactions[i].name,
        // 'expiry_date':this.giftCardList[i].expiry_date,
        // 'mobile':this.transactions[i].mobile,
        // 'email':this.transactions[i].email,
        // 'user_id':this.transactions[i].user_id,
        'request_date' :this.transactions[i].request_date,
        // 'payment_mode' :this.transactions[i].payment_mode,
        'amount' :this.transactions[i].amount,
        'opening_balance' :this.transactions[i].old_balance,
        'closing_balance' :this.transactions[i].balance,
        'transaction_type':this.transactions[i].receipt,
        'ref_no':this.transactions[i].ref_no,
        'wallet_name':this.transactions[i].wallet_name,
        'wallet_id':this.transactions[i].wallet_id,
        'remark':this.transactions[i].remark,
        'receiver_id':this.transactions[i].receiver_id,
        'response_at':this.dt.transform(this.transactions[i].response_at, 'dd/MM/yyyy H:m:s'),
        // 'receipt':this.transactions[i].receipt,
        'status':this.transactions[i].status
      }
      tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
  }

  onChange() {
    this.getTransactions();
  }

  onPageChange(event: any){
    this.page = event
    this.getTransactions()
  }

}
