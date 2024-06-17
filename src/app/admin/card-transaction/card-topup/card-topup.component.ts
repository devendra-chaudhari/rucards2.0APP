import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ImageConverterService} from "../../../shared/services/image-converter.service";
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {WalletService} from "../../../shared/services/wallet.service";
import {SortService} from "../../../shared/services/sort.service";
import {ExcelService} from "../../../shared/services/excel.service";

export interface Cards{
  id :string;
  first_name :string;
  last_name :string;
  mobile_number :string;
  dob :string;
  email :string;
  tsp_id :string;
  bin_no :string;
  bin_type :string;
  issued_card :string;
  amount :string;
  transaction_id :string;
  card_type :string;
  pan_number :string;
  kit_number :string;
  expiry_date :string;
  card_ending_digits :string;
  card_current_balance :string;
  card_status :string;
  activated_on :string;
  gc_owner_users_id :string;
  gc_creator_users_id :string;
  res_status :string;
  flag :string;
  gc_preferences_pos :string;
  gc_preferences_ecom :string;
  gc_preferences_contactless :string;
  created_at :string;
  updated_at :string;
  creator:string;
  creator_name:string;
}

@Component({
  selector: 'app-card-topup',
  templateUrl: './card-topup.component.html',
  styleUrls: ['./card-topup.component.scss']
})


export class CardTopupComponent {
  breadCrumbItems!: Array<{}>;
  gc_cards:Cards[]=[];
  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;
  tempExcelData = [];
  data = {
    "page_no": 1,
    "page_size":10
  }

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private imageConverterService: ImageConverterService,
      private apiService: ApiService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private wallet:WalletService,
      private sortService: SortService,
      private excelService: ExcelService,
  ) {}

  ngOnInit(): void {
    this.get_gc_list();
  }

  get_gc_list(){
    this.spinner.show();
    this.apiService.post('paypoint_gift_card/customer-gc-list',{
      "page_no": +this.data.page_no,
      "page_size":+this.data.page_size
    }).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.gc_cards=res.data.result;
        this.total=res.data.total;
        this.totalRecords=res.data.total;
      },
      error: (error) => {
        this.toastr.error(error.error.error);
        this.spinner.hide();
      }
    });
  }
  
  onPageSizeChange() {
    this.data.page_size=+this.pageSize;
    this.get_gc_list()
  }

  onPageChange(event: any){
    this.page_no = event
    this.get_gc_list()
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }

}
