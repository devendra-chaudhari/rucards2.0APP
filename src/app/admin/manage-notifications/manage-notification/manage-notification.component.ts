
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbDateStruct, NgbOffcanvas, NgbOffcanvasConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Detail } from 'src/app/shared/interfaces/details';
import { ApiService } from 'src/app/shared/services/api.service';
import { ExcelService } from 'src/app/shared/services/excel.service';

interface NotificationList {
  id: number;
  message: string;
  active: boolean;
  visible_at: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrl: './manage-notification.component.scss',
  providers: [NgbOffcanvasConfig, NgbOffcanvas, DatePipe, NgbDatepickerModule, FormsModule],
})

export class ManageNotificationComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  isNotificationSubmit = false;
  categorys: Detail[] = [];
  notifications: NotificationList[] = [];
  tempNotifications: NotificationList[] = [];
  tempExcelData = [];
  title: string;
  miscId: number = 0;
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
  selectedOption: string;
  startDate: string;
  endDate: string;

  notificationForm = new UntypedFormGroup({
    visible_at: new UntypedFormControl('', [Validators.required]),
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
    message: new UntypedFormControl('', [Validators.required])
  });

  editNotificationForm = new UntypedFormGroup({
    visible_at: new UntypedFormControl('', [Validators.required]),
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
    message: new UntypedFormControl('', [Validators.required])
  });

  modalService: any;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private excelService: ExcelService,
    private apiService: ApiService,
    private dt: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private offCanvas: NgbOffcanvas,
    private formBuilder: FormBuilder,

  ) {

  }

  model: NgbDateStruct;

  
  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Notification', active: true },

    ];
    this.notificationForm = this.formBuilder.group({
      visible_at: ['', Validators.required], // Add form controls with initial values and validators
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      message: ['', Validators.required]
    });
    this.editNotificationForm = this.formBuilder.group({
      notification_id: [''],
      visible_at: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.getNotifications()

  }

  openManageNotifications(content: any) {
    this.offcanvasService.open(content, { position: "end", keyboard: false });
  }
  
  onEditNotificationClick() {
      console.log(this.editNotificationForm.value)
      this.apiService.post('manage_notifications/update', this.editNotificationForm.value).subscribe({
        next: (res) => {
          console.log('Notification saved successfully:', res);
            this.toastr.success(res.message);
            this.spinner.hide();
            this.offCanvas.dismiss();
            this.getNotifications();
        },
        error: (error) => {
          this.toastr.error(error.error.error);
          this.spinner.hide().then(r => {
              return r;
          });
      }, complete: () => {
          this.getNotifications();
          this.offCanvas.dismiss()
          this.spinner.hide().then(r => {
              return r;
          });

      }

      });
  }

  editManageNotification(editnotification: any, notification:NotificationList) {
    this.editNotificationForm.setValue({
      notification_id : notification.id,
      visible_at: notification.visible_at,
      start_date: notification.start_date,
      end_date: notification.end_date,
      message: notification.message,
    })
    this.offcanvasService.open(editnotification, { position: "end", keyboard: false });
  }

  getNotifications() {
    this.apiService.get('manage_notifications/get_all').subscribe(res => {
      console.log(res)
      this.notifications = res.data;
      this.tempNotifications = res.data;
    });

  }

  deletemanagenotification(SR: Number) {
    const payload = {
      "id": SR
    }
    this.apiService.post('manage_notifications/delete', payload).subscribe(res => {
    this.getNotifications()
    });
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.notifications.length);
  }

  get mf() {
    return this.notificationForm.controls;
  }

  onSubmit() {
      console.log(this.notificationForm.value)
      this.apiService.post('manage_notifications/add', this.notificationForm.value).subscribe({
        next: (res) => {
          console.log('Notification saved successfully:', res);
            this.toastr.success(res.message);
            this.offCanvas.dismiss();
            this.notificationForm.reset();
          },
          error: (error) => {
            this.toastr.error(error.error.error);
            
          }, complete: () => {
            this.getNotifications();
            this.offCanvas.dismiss()
            this.spinner.hide().then(r => {
              return r;
            });
      }

      });
  }

  onSearch(searchText: string): void {
    const searchTextLower = searchText.toLowerCase();
    const filteredMiscs = this.tempNotifications.filter(x => x.message.toLowerCase().includes(searchTextLower) || x.visible_at.toLowerCase().includes(searchTextLower));

    if (searchTextLower == '') {
      this.notifications = this.tempNotifications;
    } else
      this.notifications = filteredMiscs;
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
    for (let i = 0; i < this.notifications.length; i++) {
      const row = {
        'serial_no': i + 1,
        'message': this.notifications[i].message,
        'status': this.notifications[i].active ? 'Active' : 'Inactive',
        'visible_at': this.notifications[i].visible_at,
        'start_date': this.dt.transform(this.notifications[i].start_date, 'dd/MM/yyyy H:m:s'),
        'end_date': this.dt.transform(this.notifications[i].end_date, 'dd/MM/yyyy H:m:s'),
        'created_at': this.dt.transform(this.notifications[i].created_at, 'dd/MM/yyyy H:m:s'),
        'updated_at': this.dt.transform(this.notifications[i].updated_at ? this.notifications[i].updated_at : this.notifications[i].created_at, 'dd/MM/yyyy H:m:s')
      }
      tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
  }

  protected readonly Math = Math;
}
