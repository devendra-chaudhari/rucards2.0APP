import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-gift-card-statement',
  templateUrl: './gift-card-statement.component.html',
  styleUrls: ['./gift-card-statement.component.scss']
})


export class GiftCardStatementComponent {
  breadCrumbItems!: Array<{}>;

  pageSize: number = 10;
  page: number = 1;
  totalRecords: number = 0;

  // customer data for api fetch
  customer_gc_data_passbook={
      "from_date": null,
      "transaction_id": null,
      "kit_number": null,
      "mobile_number": null,
      "txn_type": null,
      "txn_category": null,
      "amount": null,
      "pageno": null, 
      "pagesize": null
    }

  gc_txn_lists:{
    "mobile_number": string,
    "first_name": string,
    "last_name": string,
    "kit_number": string,
    "txn_date_time": string,
    "txn_ref_d": string,
    "transaction_id": string,
    "card_type": string,
    "card_ending_digits": string,
    "txn_type": string,
    "opening_balance": string,
    "amount": string,
    "closing_balance": string,
    "txn_remarks": string,
    "mccode_name": string
  }[]=[]

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    ) {
    // Access the query parameters in the constructor or ngOnInit
    this.route.queryParams.subscribe(params => {
      this.customer_gc_data_passbook.kit_number = params['kit_no']; // Access the kit_no query parameter
    });
  }


  ngOnInit(): void {
  this.breadCrumbItems = [
    {label: 'Gift Cards'},
    {label: 'Gift Card Statement', active: true}
  ];
  this.gc_txn_list()
}

// function for api fetch
gc_txn_list(){
    this.spinner.show(undefined,
        {
            type: 'ball-scale-multiple',
            size: 'medium',
            bdColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fullScreen: true
        });
        
        this.apiService.post('paypoint_gift_card/gift-card-statement',this.customer_gc_data_passbook).subscribe({
        next: (res) => {
            this.gc_txn_lists = res.data
            // success
            // Refresh Card List to show newly Created cards
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