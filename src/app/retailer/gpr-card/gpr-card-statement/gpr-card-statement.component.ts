import { Component } from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-gpr-card-statement',
  templateUrl: './gpr-card-statement.component.html',
  styleUrls: ['./gpr-card-statement.component.scss']
})
export class GprCardStatementComponent {
  breadCrumbItems!: Array<{}>;
  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;

  data={
    "kit_no": null,
    "from_date": "",
    "to_date": "",
    "transaction_id": "",
    "amount": 0,
    "page_no": 1,
    "page_size": 10,
    "mobile_no":null
  }
  gpr_card_statement=[]

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      // Retrieve the parameters from the route
      this.data.kit_no = params.get('kit_no');
      this.data.mobile_no = params.get('mobile_no');

      // Now you can use this.roleId and this.roleName in your component
    });
    this.breadCrumbItems = [
      {label: 'GPR Card'},
      {label: 'GPR Card Statement', active: true}
    ];
    this.getGPRCardStatement(this.data)
  }

  constructor(
      private route: ActivatedRoute,
      private toaster: ToastrService,
      private apiService: ApiService,
      private sortService: SortService,
      // private dt: DatePipe
  ) {}

  getGPRCardStatement(data:any){
    this.apiService.post('paypoint/gpr_card_statement',data).subscribe({
      next: (res) => {
        this.gpr_card_statement = res.data.TxnList;
      },
      error: (error) => {
        this.toaster.error(error.error.error);
      }
    });
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }

  onPageSizeChange() {
    this.data.page_size = +this.pageSize
    this.getGPRCardStatement(this.data)
  }

  onPageChange(event: any){
    this.data.page_no = event
    this.getGPRCardStatement(this.data)
  }

  sort(column: string) {
    this.sortService.sort(column, this.gpr_card_statement);
  }


}
