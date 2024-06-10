import { Component } from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";
import {ActivatedRoute} from "@angular/router";

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
  selector: 'app-admin-wallet-topup',
  templateUrl: './admin-wallet-topup.component.html',
  styleUrls: ['./admin-wallet-topup.component.scss']
})
export class AdminWalletTopupComponent {
  breadCrumbItems!: Array<{}>;
  //table
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
      {label: 'Wallet Transaction'},
      {label: 'Wallet TopUp', active: true}
    ];
      this.getWallets();
      this.getProducts();
  }
  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }

    getWallets(){
        this.apiService.post('wallet/rucards-wallet-list',{"user_id":this.userId}).subscribe({
            next: (res) => {
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

    sort(column: string) {
        this.sortService.sort(column, this.wallets);
    }


    export_to_excel() {
        this.excelFields();
        const sortByField = null;
        const excludeFields = [];
        const columnOrder = ['serial_no', 'name', 'product_name', 'status', 'created_at', 'updated_at']
        this.excelService.exportAsExcelFile(this.tempExcelData, 'WalletData', sortByField, excludeFields, columnOrder);
    }

    private excelFields() {
        let tempExcelData: any[] = [];
        for (let i = 0; i < this.wallets.length; i++) {
            const row = {
                'serial_no': i + 1,
                'name': this.wallets[i].name,
                'status': this.wallets[i].wallet_status ? 'Active' : 'Inactive'
            }
            tempExcelData.push(row);
        }
        this.tempExcelData = tempExcelData;
    }

    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredMiscs = this.tempWalletsData.filter(x => x.name.toLowerCase().includes(searchTextLower));

        if (searchTextLower == '') {
            this.wallets = this.tempWalletsData;
        } else
            this.wallets = filteredMiscs;
    }



}
