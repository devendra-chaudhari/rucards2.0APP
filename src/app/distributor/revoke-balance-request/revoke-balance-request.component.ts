import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Detail } from 'src/app/shared/interfaces/details';
import { ApiService } from 'src/app/shared/services/api.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { ToWords } from 'to-words';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-revoke-balance-request',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    SharedModule,
    NgbModule,
    SimplebarAngularModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    NgSelectModule,],
  templateUrl: './revoke-balance-request.component.html',
  styleUrl: './revoke-balance-request.component.scss'
})
export class RevokeBalanceRequestComponent {
  breadCrumbItems!: Array<{}>;
  page:number= 1;
  pageSize:number = 10;
  tempExcelData:[];

  select_role = false;
  select_user = false;
  retailers = [];
  transferBalanceForm: FormGroup;
  toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: true,
        doNotAddOnly: false,
        currencyOptions: {
            name: 'Rupee',
            plural: 'Rupees',
            symbol: '₹',
            fractionalUnit: {
                name: 'Paisa',
                plural: 'Paise',
                symbol: '',
            },
        }
    }
});
isFundSubmit: boolean = false;

  
  constructor(
    private apiService: ApiService,
    private excelService: ExcelService,
    private toaster:ToastrService,
    private formBuilder: FormBuilder,
    

  ) {

  }
  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Manage Balance' },
      { label: 'Transfer Balance', active: true },
    ];
    this.getRetailerListByDistributorId(this.page,this.pageSize);
    this.transferBalanceForm = this.formBuilder.group({
      selectretailer: ['', Validators.required], // Example form control
      amount: ['', Validators.required],       // Example form control
      remark: ['']                             // Example form control
  });

  }

  get ff() {
    return this.transferBalanceForm.controls;
}

convertNumber(amount: number) {
    return this.toWords.convert(amount);
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
        console.log(this.retailers)
    },(error) => {
        this.toaster.error(error.error.error);
    }
);
}
  
  customSearchFn(term: string, item) {
    const cleanName = item.name.replace(',', '');
    term = term.toLowerCase();
    return cleanName.toLowerCase().indexOf(term) > -1;
  }

  
  onSubmit() {
    console.log(this.transferBalanceForm.value)
    // this.apiService.post('manage_notifications/add', this.businessReportForm.value).subscribe({
    //   next: (res) => {
    //     console.log('Notification saved successfully:', res);
    //       this.toastr.success(res.message);
    //       this.offCanvas.dismiss();
    //       this.businessReportForm.reset();
    //     },
    //     error: (error) => {
    //       this.toastr.error(error.error.error);
          
    //     }, complete: () => {
    //       this.getNotifications();
    //       this.offCanvas.dismiss()
    //       this.spinner.hide().then(r => {
    //         return r;
    //       });
    // }

    // });
}

onReset() {
  this.transferBalanceForm.reset()
}

onSearch(searchText: string): void {
  // const searchTextLower = searchText.toLowerCase();
  // const filteredMiscs = this.tempNotifications.filter(x => x.message.toLowerCase().includes(searchTextLower) || x.visible_at.toLowerCase().includes(searchTextLower));

  // if (searchTextLower == '') {
  //   this.notifications = this.tempNotifications;
  // } else
  //   this.notifications = filteredMiscs;
}
  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = ['serial_no', 'message', 'status', 'visible_at', 'start_date', 'end_date', 'created_at', 'updated_at']
    this.excelService.exportAsExcelFile(this.tempExcelData, 'masterData', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    // for (let i = 0; i < this.notifications.length; i++) {
    //   const row = {
    //     'serial_no': i + 1,
    //     'message': this.notifications[i].message,
    //     'status': this.notifications[i].active ? 'Active' : 'Inactive',
    //     'visible_at': this.notifications[i].visible_at,
    //     'start_date': this.dt.transform(this.notifications[i].start_date, 'dd/MM/yyyy H:m:s'),
    //     'end_date': this.dt.transform(this.notifications[i].end_date, 'dd/MM/yyyy H:m:s'),
    //     'created_at': this.dt.transform(this.notifications[i].created_at, 'dd/MM/yyyy H:m:s'),
    //     'updated_at': this.dt.transform(this.notifications[i].updated_at ? this.notifications[i].updated_at : this.notifications[i].created_at, 'dd/MM/yyyy H:m:s')
    //   }
    //   tempExcelData.push(row);
    // }
    // this.tempExcelData = tempExcelData;
  }

  protected readonly Math = Math;
}
