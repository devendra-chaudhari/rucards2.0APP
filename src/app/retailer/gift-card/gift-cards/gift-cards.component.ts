import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss']
})
export class GiftCardsComponent {
  breadCrumbItems!: Array<{}>;
  protected readonly Math = Math;
  
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

  pageSize: number = 10;
  page: number = 1;
  totalRecords: number = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    ) {
    // Access the query parameters in the constructor or ngOnInit
    this.route.queryParams.subscribe(params => {
      this.card_data.kit_number = params['kit_no']; // Access the kit_no query parameter
    });
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
        {label: 'Retailer'},
        {label: 'Gift Cards', active: true}
    ];
    this.get_gc_customer();
  }

  get_gc_customer(){
    this.apiService.post('paypoint_gift_card/cards',this.card_data).subscribe({
      next: (res) => {
          this.txn_list=res.data.TxnList
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
}
