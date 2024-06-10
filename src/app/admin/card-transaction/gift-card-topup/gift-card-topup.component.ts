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
  MobileNumber: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  PanNumber: string;
  Pk_Id: string;
  TSP_id: string;
  GVB_id: string;
  ProgramType: string;
  CardType: string;
  KitNumber: string;
  CardEndingDigits: string;
  CardCurrentBalance: string;
  CardStatus: string;
  ActivatedOn: string;
  ExpiryDate: string;
  CancelledOn: string;
  CancelledReason: string;
  BlockedOn: string;
  BlockReason: string;
  LastUsedOn: string;
  BalanceLastUpdatedOn: string;
  CardNo: string;
  TSPName: string;
  ProgramName: string;
}
@Component({
  selector: 'app-gift-card-topup',
  templateUrl: './gift-card-topup.component.html',
  styleUrls: ['./gift-card-topup.component.scss']
})
export class GiftCardTopupComponent {
  breadCrumbItems!: Array<{}>;
  //table
  gc_cards:Cards[]=[]
  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;
  tempExcelData = [];

  data = {
    "from_date": null,
    "to_date": null,
    "card_status": -1,
    "kit_number":"",
    "card_ending_digits": null,
    "page_no": 1,
    "pagesize":10
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
  ) {
    this.get_gc_topup();
  }

  ngOnInit(): void {

  }

  get_gc_topup(){
    this.spinner.show();
    this.apiService.post('paypoint_gift_card/cards',this.data).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.gc_cards=res.data.TxnList;
        this.total=res.data.rowscount;
        this.totalRecords=res.data.rowscount;
      },
      error: (error) => {
        this.toastr.error(error.error.error);
        this.spinner.hide();
      }
    });
  }

  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = ['MobileNumber',
      'FirstName',
      'LastName',
      'DateOfBirth',
      'PanNumber',
      'Pk_Id',
      'TSP_id',
      'GVB_id',
      'ProgramType',
      'CardType',
      'KitNumber',
      'CardEndingDigits',
      'CardCurrentBalance',
      'CardStatus',
      'ActivatedOn',
      'ExpiryDate',
      'CancelledOn',
      'CancelledReason',
      'BlockedOn',
      'BlockReason',
      'LastUsedOn',
      'BalanceLastUpdatedOn',
      'CardNo',
      'TSPName',
      'ProgramName']
    this.excelService.exportAsExcelFile(this.tempExcelData, 'CustomerList', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.gc_cards.length; i++) {
      const row = {
        'serial_no': i + 1,
        'MobileNumber': this.gc_cards[i].MobileNumber,
        'FirstName': this.gc_cards[i].FirstName,
        'LastName': this.gc_cards[i].LastName,
        'DateOfBirth': this.gc_cards[i].DateOfBirth,
        'PanNumber': this.gc_cards[i].PanNumber,
        'Pk_Id': this.gc_cards[i].Pk_Id,
        'TSP_id': this.gc_cards[i].TSP_id,
        'GVB_id': this.gc_cards[i].GVB_id,
        'ProgramType': this.gc_cards[i].ProgramType,
        'CardType': this.gc_cards[i].CardType,
        'KitNumber': this.gc_cards[i].KitNumber,
        'CardEndingDigits': this.gc_cards[i].CardEndingDigits,
        'CardCurrentBalance': this.gc_cards[i].CardCurrentBalance,
        'CardStatus': this.gc_cards[i].CardStatus,
        'ActivatedOn': this.gc_cards[i].ActivatedOn,
        'ExpiryDate': this.gc_cards[i].ExpiryDate,
        'CancelledOn': this.gc_cards[i].CancelledOn,
        'CancelledReason': this.gc_cards[i].CancelledReason,
        'BlockedOn': this.gc_cards[i].BlockedOn,
        'BlockReason': this.gc_cards[i].BlockReason,
        'LastUsedOn': this.gc_cards[i].LastUsedOn,
        'BalanceLastUpdatedOn': this.gc_cards[i].BalanceLastUpdatedOn,
        'CardNo': this.gc_cards[i].CardNo,
        'TSPName': this.gc_cards[i].TSPName,
        'ProgramName': this.gc_cards[i].ProgramName,
      }
      tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
  }

  protected readonly Math = Math;

  //sort
  sort(column: string) {
    this.sortService.sort(column, this.gc_cards);
  }

  // for table page-size and pagination
  onPageSizeChange() {
    this.data.pagesize=this.pageSize;
    this.get_gc_topup()
  }

  onPageChange(event: any){
    this.page_no = event
    this.get_gc_topup()
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }



}
