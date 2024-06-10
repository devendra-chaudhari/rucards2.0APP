import { Component } from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";
import {ActivatedRoute} from "@angular/router";

export interface Transactions{
  closing_balance: number;
  date: string;
  opening_balance: number;
  wallet_id: number;
}
@Component({
  selector: 'app-daily-transactions',
  templateUrl: './daily-transactions.component.html',
  styleUrls: ['./daily-transactions.component.scss']
})
export class DailyTransactionsComponent {
  breadCrumbItems!: Array <{}>;
  userData={
    page_no:1,
    page_size:10,
    from_date: "",
    to_date :"",
    role_id: "",
    wallet_id:"4"
  }
  transactions:Transactions[]=[]

  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;
  total_balance:number=0;
  total_network_balance:number=0;

  constructor(
      private route: ActivatedRoute,
      private offCanvas: NgbOffcanvas,
      private toaster: ToastrService,
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private excelService: ExcelService,
      private sortService: SortService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.userData.wallet_id=params['wallet_id']
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      {label: 'Daily Wallet Transactions'},
      {label: 'Admin Wallet Daily Topup', active: true}
    ];
    this.getDailyTransactions();
  }

  getMax() {
    return Math.min(this.page * this.userData.page_size, this.totalRecords);
  }


  onChange() {
    this.getDailyTransactions();
  }

  onPageChange(event: any){
    this.userData.page_no = event
    this.getDailyTransactions();
  }

  getDailyTransactions(){
    this.apiService.post('transaction/daily-balance-ledger',this.userData).subscribe({
      next: (res) => {
        this.transactions=res.data.result;
        this.total = res.data.total;
        this.totalRecords = res.data.total;
      },
      error: (error) => {
        this.toaster.error(error.error.error);
      }, complete: () => {

      }
    });
  }

}
