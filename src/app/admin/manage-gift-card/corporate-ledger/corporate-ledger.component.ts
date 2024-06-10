import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-corporate-ledger',
  templateUrl: './corporate-ledger.component.html',
  styleUrls: ['./corporate-ledger.component.scss']
})
export class CorporateLedgerComponent {

  breadCrumbItems!: Array<{}>;
  protected readonly Math = Math;

  pageSize: number = 10;
  page: number = 1;
  totalRecords: number = 0;

  card_data = {
    from_date: null,
    to_date: null,
    transaction_id: -1,
    amount: null,	
    page_no: 1, 
    pagesize: 10,
  }

  txn_list:{
          row_no: string,
          TxnDateTime: string,
          TransactionId: string,
          TxnRefId: string,
          TxnType: string,
          OpeningBalance: string,
          Amount: string,
          ClosingBalance: string,
          TxnRemarks: string,
          TxnCategory: string,
          CBusinessName: string,
          WBusinessName: string,
          CUsername: null,
          AUsername: null
  }[]=[]

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    ) {
    
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
        {label: 'Admin'},
        {label: 'Corporate Ledger', active: true}
    ];
    this.get_corporate_ledger();
  }

  get_corporate_ledger(){
    this.apiService.post('paypoint_gift_card/corporate-ledger',this.card_data).subscribe({
      next: (res) => {
          this.txn_list = res.data.TxnList
          this.totalRecords = res.data.rowscount
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

  onChange(){
    this.get_corporate_ledger()
  }

  onPageChange(event: any){
    this.card_data.page_no = event
    this.get_corporate_ledger()
  }
  
}
