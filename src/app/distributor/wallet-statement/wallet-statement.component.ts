import { Component } from '@angular/core';
import {NgbOffcanvas, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, RouterModule} from "@angular/router";
import { ApiService } from 'src/app/shared/services/api.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';


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
  selector: 'app-wallet-statement',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    NgbPagination,
    ReactiveFormsModule,
    SimplebarAngularModule,
    UiSwitchModule,
    RouterModule],
  templateUrl: './wallet-statement.component.html',
  styleUrl: './wallet-statement.component.scss'
})
export class WalletStatementComponent {
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
      private sortService: SortService,
      private sessionStorage: SessionStorageService
  ) {
  }


  ngOnInit(): void {
    this.breadCrumbItems = [
      {label: 'Wallet Transaction'},
      {label: 'Wallet TopUp', active: true}
    ];
      this.getWallets();
  }
  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }
  
    getWallets(){
        const user_id = this.sessionStorage.getCurrentUser()
        this.apiService.post('wallet/rucards-wallet-list',{"user_id":user_id.id}).subscribe({
            next: (res) => {
                this.wallets = res.data.result
                this.total = res.data.total
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }, complete: () => {}
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
