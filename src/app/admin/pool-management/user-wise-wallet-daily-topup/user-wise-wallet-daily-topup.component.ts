import { Component } from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";

interface User{
  id: string;
  name: string;
  father_name: string;
  email: string;
  mobile: number;
  status: boolean;
  username: string;
  role_id: number;
  created_at: string;
  total_balance: number;
}
@Component({
  selector: 'app-user-wise-wallet-daily-topup',
  templateUrl: './user-wise-wallet-daily-topup.component.html',
  styleUrls: ['./user-wise-wallet-daily-topup.component.scss']
})
export class UserWiseWalletDailyTopupComponent {
  breadCrumbItems!: Array <{}>;
  users:User[]=[]
  userData={
    page_no:1,
    page_size:10,
    from_date: "",
    to_date :"",
    role_id: "",
    user_id: ""
  }

  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;
  total_balance:number=0;
  total_network_balance:number=0;

  constructor(
      private offCanvas: NgbOffcanvas,
      private toaster: ToastrService,
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private excelService: ExcelService,
      private sortService: SortService,
  ) {}
  ngOnInit(): void {
    this.breadCrumbItems = [
      {label: 'Pool Management'},
      {label: 'User Wise Wallet Daily Transactions', active: true}
    ];
    this.getUsers();
  }
  getUsers(){
    this.apiService.post('user/user-details',this.userData).subscribe({
      next: (res) => {
        this.users=res.data.result;
        this.total = res.data.total;
        this.totalRecords = res.data.total;
        this.total_balance = res.data.total_balance;
        this.total_network_balance = res.data.total_network_balance
      },
      error: (error) => {
        this.toaster.error(error.error.error);
      }, complete: () => {

      }
    });
  }

  getMax() {
    return Math.min(this.page * this.userData.page_size, this.totalRecords);
  }

  sort(column: string) {
    this.sortService.sort(column, this.users);
  }
  onChange() {
    this.getUsers();
  }

  onPageChange(event: any){
    this.userData.page_no = event
    this.getUsers()
  }
}
