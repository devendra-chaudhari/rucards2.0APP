import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/shared/services/api.service';
import {  ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { NgxSpinner, NgxSpinnerService, Spinner } from 'ngx-spinner';
import { random } from 'lodash';


interface RetailerListByDistributorId {
  id: string;
  username: string;
  full_name: string;
  mobile: string;
  email: string;
  active:boolean;
  created_at: string;
}

@Component({
  selector: 'app-manage-retailer',
  standalone: true,
  providers: [DatePipe],
  imports: [SharedModule, CommonModule, NgbModule, RouterModule, FormsModule, ReactiveFormsModule, DatePipe, NgbDatepickerModule],
  templateUrl: './manage-retailer.component.html',
  styleUrls: ['./manage-retailer.component.scss']
})
export class ManageRetailerComponent {

  breadCrumbItems!: Array<{}>;
  totalRetailers: number = 0;
  totalGPR: number = 0;
  totalGIFT: number = 0;
  retailers: RetailerListByDistributorId[] = [];
  tempRetailers: RetailerListByDistributorId[] = [];
  page:number= 1;
  pageSize:number = 10;
  tempExcelData:[];

  gpr_card:number;
  gift_card:number;
  
  filterUserForm = new UntypedFormGroup({
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
  });
  
  constructor(
    private offCanvas: NgbOffcanvas,
    private apiService: ApiService,
    private toaster: ToastrService,
    private excelService:ExcelService,
    private dt: DatePipe,
    private sessionStorage:SessionStorageService,
    private spinner: NgxSpinnerService,
  ) {}
  options = {
    series: [{
    name: 'series1',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'series2',
    data: [11, 32, 45, 32, 34, 52, 41]
  }],
    chart: {
    height: 350,
    type: 'area'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'datetime',
    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm'
    },
  },
  };

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Distributor' },
      { label: 'Manage Retailer', active: true },
    ];
    this.getRetailerListByDistributorId(this.page, this.pageSize)
    this.getCardsCount()

  }

  getRetailerListByDistributorId(page:number, page_size:number, start_date:Date=null, end_date:Date=null) {
    const data ={
        'page_no': page, 
        'page_size': page_size, 
        'start_date': start_date,
        'end_date': end_date
    }
    console.log("in getRetailerListByDistributorId", data)
    this.apiService.post('user/retailers_list_by_distributor_id',data).subscribe(res => {
        this.retailers = res.data.result;
        this.totalRetailers=res.data.total;
        this.tempRetailers=res.data.result;
        this.filterUserForm.reset();
    },(error) => {
        this.toaster.error(error.error.error);
    }
);
}

  getCardsCount() {
    this.apiService.get('paypoint_gift_card/total_cards_under_distributor').subscribe(res => {
      this.gpr_card = res.data.gpr_card;
      this.gift_card = res.data.gift_cards;
    },(error) => {
        this.toaster.error(error.error.error);
    }
);
}

  
onSearch(searchText: string): void {
  const searchTextLower = searchText.toLowerCase();
  const filteredMiscs = this.tempRetailers.filter(x => x.full_name.toLowerCase().includes(searchTextLower) || x.created_at.toLowerCase().includes(searchTextLower));

  if (searchTextLower == '') {
    this.retailers = this.tempRetailers;
  } else
    this.retailers = filteredMiscs;
}

onSubmitFilterUser(){
    const {start_date, end_date} = this.filterUserForm.value
    console.log(start_date, end_date)
    this.getRetailerListByDistributorId(this.page,this.pageSize, start_date, end_date);
    this.offCanvas.dismiss();
  }
  
  onFilterUser(filter_user: any) {
    this.offCanvas.open(filter_user, {position: 'end', animation: true});
  }

  export_to_excel() {
    this.spinner.show();
    this.excelService.exportAsExcelFile(this.retailers, 'Retailers-' + random() * 56413216544 + '.xlsx', 'request_date', ['receipt', 'user_id', 'receiver_id'], ['full_name', 'username', 'email', 'active', 'created_at']);
    this.spinner.hide();
}

  
}
