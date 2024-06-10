import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";

export interface Wallets {
  id: string;
  name: string;
  wallet_status: string;
  created_at: string;
  updated_at: string;
  active:boolean;
  balance:number;
}

interface ProductList {
  id: number;
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
  wallet_id:string;
}

@Component({
  selector: 'app-wallet-daily-topup',
  templateUrl: './wallet-daily-topup.component.html',
  styleUrls: ['./wallet-daily-topup.component.scss']
})
export class WalletDailyTopupComponent {
  breadCrumbItems!: Array<{}>;

  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;
  wallets:Wallets[]=[];
  tempExcelData = [];
  tempWalletsData:Wallets[]=[];
  products: ProductList[] = [];
  userId:string="";

  constructor(
      private route: ActivatedRoute,
      private offCanvas: NgbOffcanvas,
      private toaster: ToastrService,
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private excelService: ExcelService,
      private sortService: SortService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId=params['id']
    });
    this.breadCrumbItems = [
      {label: 'Pool Management'},
      {label: 'Admin Wallet Daily Topup', active: true}
    ];
    this.getWallets();
    this.getProducts();
  }

  getWallets(){
    this.apiService.post('wallet/rucards-wallet-list',{"user_id":this.userId}).subscribe({
      next: (res) => {
        console.log(res)
        this.wallets = res.data.result
        this.total = res.data.total
      },
      error: (error) => {
        this.toaster.error(error.error.error);
      }, complete: () => {}
    });
  }

  getProducts(){
    this.apiService.get('product/list').subscribe({
      next: (res) => {
        this.products = res.data
      },
      error: (error) => {
        this.toaster.error(error.error.error);
      }, complete: () => {
        this.spinner.hide().then(r => {
          return r;
        });
      }
    });
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.total);
  }

  sort(column: string) {
    this.sortService.sort(column, this.wallets);
  }
}

