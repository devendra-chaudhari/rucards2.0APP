import { Component } from '@angular/core';
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {ExcelService} from "../../../shared/services/excel.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {CommonModule, DatePipe} from "@angular/common";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDatepickerModule, NgbModule, NgbOffcanvas, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SimplebarAngularModule } from 'simplebar-angular';
import { random } from 'lodash';

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
  selector: 'app-wallet-transaction',
  standalone: true,
  imports: [SharedModule, CommonModule, NgbModule, RouterModule, FormsModule, ReactiveFormsModule, DatePipe, NgbDatepickerModule,SimplebarAngularModule
],
providers:[DatePipe],
  templateUrl: './wallet-transaction.component.html',
  styleUrl: './wallet-transaction.component.scss'
})
export class WalletTransactionComponent {
    breadCrumbItems!: Array<{}>;
    transactions: Transactions[] = [];
    tempTransaction: Transactions[] = [];
    total:number=0;
    page: number = 1;
    pageSize: number = 10;
    totalRecords: number = 0;
    const_wallet_id = null;
    role:string=null;
    tempExcelData = [];


    filterUserForm = new UntypedFormGroup({
      start_date: new UntypedFormControl('', [Validators.required]),
      end_date: new UntypedFormControl('', [Validators.required]),
    });
  
    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private toaster: ToastrService,
        private excelService: ExcelService,
        private spinner: NgxSpinnerService,
        private dt: DatePipe,
        private offCanvas:NgbOffcanvas,
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
      this.getTransactions(this.page,this.pageSize);
    }
  
    getTransactions(page:number, page_size:number, start_date:Date=null, end_date:Date=null){
      const data ={
        'page_no': page, 
        'page_size': page_size, 
        'start_date': start_date,
        'end_date': end_date
    }
      this.apiService.post('transaction/distributor_pool_transaction',{'wallet_id':this.const_wallet_id,'page_size':this.pageSize,'page_no':this.page}).subscribe({
        next: (res) => {
          this.transactions = res.data.result;
          this.tempTransaction = res.data.result;
          this.total=res.data.total;
          this.totalRecords=res.data.total;
          this.role= res.data.role;
        }
      });
    }
  
    getMax() {
      return Math.min(this.page * this.pageSize, this.totalRecords);
    }
  
 
    onSearch(searchText: string): void {
      const searchTextLower = searchText.toLowerCase();
      const filteredMiscs = this.tempTransaction.filter(x => x.fund_transaction_id.toLowerCase().includes(searchTextLower) || x.receiver_profile_id.toLowerCase().includes(searchTextLower));
    
      if (searchTextLower == '') {
        this.transactions = this.tempTransaction;
      } else
        this.transactions = filteredMiscs;
    }


    export_to_excel() {
        this.spinner.show();
        this.excelService.exportAsExcelFile(this.transactions, 'Fund-request-' + random() * 56413216544 + '.xlsx', 'request_date', ['receipt', 'user_id', 'receiver_id'], ['fund_transaction_id', 'transaction_type', 'created_at', 'current_balance', 'ref_no', 'receiver_profile_id']);
        this.spinner.hide();
    }

    onChange() {
      this.getTransactions(this.page,this.pageSize);
    }
  
    onPageChange(event: any){
      this.page = event
      this.getTransactions(this.page,this.pageSize)
    }
    onSubmitFilterUser(){
      const {start_date, end_date} = this.filterUserForm.value
      console.log(start_date, end_date)
      this.getTransactions(this.page,this.pageSize, start_date, end_date);
      this.offCanvas.dismiss();
    }
    
    onFilterUser(filter_user: any) {
      this.offCanvas.open(filter_user, {position: 'end', animation: true});
    }
  
}

  