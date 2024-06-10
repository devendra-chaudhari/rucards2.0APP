import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { flatMap } from 'lodash';
import { Detail } from 'src/app/shared/interfaces/details';
import { ApiService } from 'src/app/shared/services/api.service';
import { ExcelService } from 'src/app/shared/services/excel.service';


interface BusinessReportList {
  service_category: string;
  service_name: string;
  start_date: string;
  end_date: string;
  filter_mode: string;
  select_role: string;
  select_user: string;
  transaction_status: string;
}


@Component({
  selector: 'app-business-report',
  templateUrl: './business-report.component.html',
  styleUrl: './business-report.component.scss',
  providers: [DatePipe]
})

export class BusinessReportComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  businessReport: BusinessReportList[] = [];
  page: number = 1;
  pageSize: number = 10;
  categorys: Detail[] = [];
  tempExcelData = [];
  select_role = false;
  select_user = false;

  businessReportForm = new FormGroup({
    service_category: new FormControl('', [Validators.required]),
    service_name: new FormControl('', [Validators.required]),
    start_date: new FormControl('', [Validators.required]),
    end_date: new FormControl('', [Validators.required]),
    filter_mode: new FormControl('', [Validators.required]),
    select_role: new FormControl(''),
    select_user: new FormControl(''),
    transaction_status: new FormControl('', [Validators.required]),
  });
  
  constructor(
    private apiService: ApiService,
    private excelService: ExcelService,
    private dt: DatePipe,
    

  ) {

  }
  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Manage Transactions' },
      { label: 'Business Report', active: true },
    ];
    this.getCategory()
  }

  getCategory() {
    this.apiService.get('category/list').subscribe(res => {
      this.categorys = res.data;
    })
  }

  onFilterModeChange(): void {
    const selectedFilterMode = this.businessReportForm.get('filter_mode')?.value;
    this.select_role = selectedFilterMode === '1'; // Show input field for 'filter mode 1'
  }
  onUserRoleChange(): void {
    const selectedUserRole = this.businessReportForm.get('specific_user')?.value;
    this.select_user = true;

  }
  
  onSubmit() {
    console.log(this.businessReportForm.value)
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
  this.businessReportForm.reset()
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
    this.tempExcelData = tempExcelData;
  }

  protected readonly Math = Math;
}
