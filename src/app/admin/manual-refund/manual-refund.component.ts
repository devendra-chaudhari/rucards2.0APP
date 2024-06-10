import { Component } from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../shared/services/api.service";
import {MessageService} from "../../shared/services/message.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../shared/services/excel.service";
import {SortService} from "../../shared/services/sort.service";


interface TransactionList {
  id: string;
  transaction_type: string;
  transaction_status: string;
  transaction_id: string;
  fund_transaction_id: string;
  remark: string;
  amount: number;
  old_balance: number;
  current_balance: number;
  wallet_id: number;
  bin_no: number;
  product_id: number;
  user: string;
  created_date: string;
  wallet_name: string;
  wallet_is_secure: boolean;
  pcode: string;
  pname: string;
  ptype: string;
  username: string;
  full_name: string;
  email: string;
  mobile: string;
  aadhar_no: string;
  pan: string;
  role_name: string;
  table: string;
}

@Component({
  selector: 'app-manual-refund',
  templateUrl: './manual-refund.component.html',
  styleUrls: ['./manual-refund.component.scss']
})
export class ManualRefundComponent {
  breadCrumbItems!: Array<{}>;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  transactions:TransactionList[]=[];
  tempTransactions:TransactionList[]=[];

  constructor(
      private offCanvas: NgbOffcanvas,
      private toaster: ToastrService,
      private apiService: ApiService,
      private messageService: MessageService,
      private spinner: NgxSpinnerService,
      private exportService: ExcelService,
      private modalService: NgbModal,
      private excelService: ExcelService,
      private sortService: SortService,
  ) {
  }

  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Admin'},
      {label: 'Manual Refund', active: true}
    ];
    this.getAllTransactions();
  }

  getAllTransactions(){
    this.apiService.post('wallet/all_transactions',{'page_no':+this.page,'page_size':+this.pageSize}).subscribe(res => {
      this.transactions = res.data.result;
      this.total=res.data.total;
      this.tempTransactions = res.data.result;
    });
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.transactions.length);
  }

  sort(column: string) {
    this.sortService.sort(column, this.transactions);
  }

  onPageSizeChange() {
    this.getAllTransactions();
  }

  onPageChange(event: any){
    this.page = event
    this.getAllTransactions()
  }

  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = ['serial_no', 'full_name', 'father_name', 'dob', 'active', 'city', 'gender', 'email', 'city', 'pincode', 'address', 'balance', 'mobile', 'pan', 'state', 'district','created_at']
    this.excelService.exportAsExcelFile(this.tempTransactions, 'CustomerList', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.transactions.length; i++) {
      const row = {
        'serial_no': i + 1,
        'full_name': this.transactions[i].full_name,

      }
      tempExcelData.push(row);
    }
    this.tempTransactions = tempExcelData;
  }

  protected readonly Math = Math;

  reject_manual_refund(transaction:TransactionList){
      this.spinner.show(undefined,
          {
              type: 'ball-scale-multiple',
              size: 'medium',
              bdColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              fullScreen: true
          }).then(r =>
          {
              return r;
          }
      );
      this.apiService.post('wallet/reject_manual_refund', {
          'table':transaction.table, 'id':transaction.id, 'amount':transaction.amount, 'user_id':transaction.user
      }).subscribe({
          next: (res) => {
              this.toaster.success(res.message);
              this.spinner.hide().then(r => {
                  return r;
              });
          },
          error: (error) => {
              this.toaster.error(error.error.error);
              this.spinner.hide().then(r => r);
          }, complete: () => {

              this.spinner.hide().then(r => {
                  return r;
              });
          }
      });
  }

  accept_manual_refund(transaction:TransactionList){
    this.spinner.show(undefined,
        {
          type: 'ball-scale-multiple',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        }).then(r =>
        {
          return r;
        }
    );
    this.apiService.post('wallet/accept_manual_refund', {
      'table':transaction.table, 'id':transaction.id, 'amount':transaction.amount, 'user_id':transaction.user
    }).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.spinner.hide().then(r => {
          return r;
        });
      },
      error: (error) => {
        this.toaster.error(error.error.error);
        this.spinner.hide().then(r => r);
      }, complete: () => {

        this.spinner.hide().then(r => {
          return r;
        });
      }
    });
  }




}
