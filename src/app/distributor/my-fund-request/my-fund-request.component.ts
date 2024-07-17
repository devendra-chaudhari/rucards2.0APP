import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule, NgbOffcanvas, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { random } from 'lodash';
import { Spinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SharedModule } from 'src/app/shared/shared.module';


@Component({
  selector: 'app-my-fund-request',
  standalone: true,
  imports: [SharedModule, CommonModule, NgbModule, RouterModule, FormsModule, ReactiveFormsModule, DatePipe, NgbDatepickerModule,NgbPagination],
  templateUrl: './my-fund-request.component.html',
  styleUrl: './my-fund-request.component.scss'
})
export class MyFundRequestComponent {  
  breadCrumbItems!: Array<{}>;
  myFundRequests= [];
  page:number= 1;
  pageSize:number = 10;
  tempExcelData:[];
  tempMyFundRequests= [];
  
  filterUserForm = new UntypedFormGroup({
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
  });
  
  constructor(
    private excelService: ExcelService,
    private apiService: ApiService,
    private toaster:ToastrService,
    private offCanvas:NgbOffcanvas
  ){

  }
  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Distributor' },
      { label: 'My Fund Request', active: true },
    ];
    this.GetMyFundRequests(this.page, this.pageSize);
  }

  
  onSearch(searchText: string):void {
    const searchTextLower = searchText.toLowerCase();
  const filteredMiscs = this.tempMyFundRequests.filter(x => x.fund_request_id.toLowerCase().includes(searchTextLower) || x.ref_no.toLowerCase().includes(searchTextLower));

  if (searchTextLower == '') {
    this.myFundRequests = this.tempMyFundRequests;
  } else
    this.myFundRequests = filteredMiscs;
  }

  export_to_excel() {
      this.excelService.exportAsExcelFile(this.myFundRequests, 'Fund-request-' + random() * 56413216544 + '.xlsx', 'request_date', ['receipt', 'user_id', 'receiver_id'], ['deposit_date', 'fund_request_id', '.payment_mode', 'amount', 'ref_no', 'wallet_name', 'status','remark'])

  }

  GetMyFundRequests(page:number, pageSize:number) {
    const data ={
      'page_no': page, 
      'page_size': pageSize,
  }
      this.apiService.get('fund_request/my_fund_request').subscribe({
          next: (res) => {
              this.myFundRequests = res.data;
              this.tempMyFundRequests = res.data;
              console.log(this.myFundRequests)
          },
          error: (error) => {
              this.toaster.error(error.error.error);
          }
      });
  }


}
