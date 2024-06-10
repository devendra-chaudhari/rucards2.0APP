import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import { ApiService } from 'src/app/shared/services/api.service';
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {
  breadCrumbItems!: Array<{}>;
  protected readonly Math = Math;
  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;
  tempExcelData = [];

  card_data = {
    from_date: null,
    to_date: null,
    card_status: -1,
    kit_number: null,	
    card_ending_digits: null,	
    page_no: 1, 
    pagesize: 10,
  }

  txn_list:{
    Pk_Id: string,
    TSP_id: string,
    GVB_id: string,
    ProgramType: string,
    CardType: string,
    KitNumber: string,
    CardEndingDigits: string,
    CardCurrentBalance: string,
    CardStatus: string,
    ActivatedOn: string,
    ExpiryDate: string,
    CancelledOn: null,
    CancelledReason: null,
    BlockedOn: null,
    BlockReason: null,
    LastUsedOn: string,
    BalanceLastUpdatedOn: string,
    CardNo: string,
    TSPName: null,
    ProgramName: string
}[] = []

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private sortService: SortService,
    ) {
    
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
        {label: 'Admin'},
        {label: 'Gift Cards', active: true}
    ];

    this.get_gc_customer();
  }

  get_gc_customer(){
    this.apiService.post('paypoint_gift_card/cards',this.card_data).subscribe({
      next: (res) => {
          this.txn_list=res.data.TxnList
          this.total = res.data.rowscount;
          this.totalRecords = res.data.rowscount;
          this.spinner.hide();
      },
      error: (error) => {
          this.toastr.error(error.error.error);
          this.spinner.hide();
      }, complete: () => {
          this.spinner.hide(); // Re-enable the button after completion
      }
  });
  }

  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = ['Pk_Id',
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
      'ProgramName',]
    this.excelService.exportAsExcelFile(this.tempExcelData, 'CustomerList', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.txn_list.length; i++) {
      const row = {
        'serial_no': i + 1,
        'Pk_Id': this.txn_list[i].Pk_Id,
        'TSP_id': this.txn_list[i].TSP_id,
        'GVB_id': this.txn_list[i].GVB_id,
        'ProgramType': this.txn_list[i].ProgramType,
        'CardType': this.txn_list[i].CardType,
        'CardEndingDigits': this.txn_list[i].CardEndingDigits,
        'KitNumber': this.txn_list[i].KitNumber,
        'CardCurrentBalance': this.txn_list[i].CardCurrentBalance,
        'CardStatus': this.txn_list[i].CardStatus,
        'ActivatedOn': this.txn_list[i].ActivatedOn,
        'CardNo': this.txn_list[i].CardNo
      }
      tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
  }

  onPageSizeChange() {
    this.card_data.pagesize=this.pageSize
    this.get_gc_customer()
  }

  sort(column: string) {
    this.sortService.sort(column, this.txn_list);
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }

  onPageChange(event: any){
    this.card_data.page_no = event
    this.get_gc_customer()
  }

}

