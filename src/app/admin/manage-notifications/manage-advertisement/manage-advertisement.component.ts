
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbOffcanvas, NgbOffcanvasConfig } from '@ng-bootstrap/ng-bootstrap';
import { Detail } from 'src/app/shared/interfaces/details';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'src/app/shared/services/message.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ImageConverterService } from 'src/app/shared/services/image-converter.service';




interface AdvertisementList {
  id: number;
  title: string;
  description: string;
  image_url: File;
  created_at: string;
  start_date: string;
  end_date: string;
  detail_description: string;
  status: boolean;
}


@Component({
  selector: 'app-manage-advertisement',
  templateUrl: './manage-advertisement.component.html',
  styleUrls: ['./manage-advertisement.component.scss'],
  providers: [NgbOffcanvasConfig, NgbOffcanvas, DatePipe, NgbDatepickerModule, FormsModule],
})
export class ManageAdvertisementComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  isMasterSubmit = false;
  categorys: Detail[] = [];
  advertisements: AdvertisementList[] = [];
  tempAdvertisements: AdvertisementList[] = [];
  tempExcelData = [];
  title: string = '';
  miscId: number = 0;
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;

  dragging = false;
  filePath = 'assets/images/receipt.svg';



  advertisementForm = new UntypedFormGroup({
    title: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
    image_url: new UntypedFormControl('', [Validators.required]),
    detail_description: new UntypedFormControl('', [Validators.required])
  });

  editAdvertisementForm = new UntypedFormGroup({
    title: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
    image_url: new UntypedFormControl('', [Validators.required]),
    detail_description: new UntypedFormControl('', [Validators.required])
  });

  constructor(
    private offcanvasService: NgbOffcanvas,
    private excelService: ExcelService,
    private dt: DatePipe,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private offCanvas: NgbOffcanvas,
    private http: HttpClient,
    private imageConverterService: ImageConverterService,

  ) {

  }

  model: NgbDateStruct;
  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Advertisement', active: true }
    ];
    this.advertisementForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      image_url: ['', Validators.required],
      detail_description: ['', Validators.required]
    });

    this.editAdvertisementForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      image_url: ['', Validators.required],
      detail_description: ['', Validators.required]
    });

    this.getAdvertisements()
  }

  openManageAdvertisement(add_advertisement: any) {
    this.offcanvasService.open(add_advertisement, { position: "end", keyboard: false });
  }

  onEditAdvertisementClick() {
    console.log(this.editAdvertisementForm.value)
    const file_url =
      this.apiService.post('manage_advertisement/update', this.editAdvertisementForm.value).subscribe({
        next: (res) => {
          console.log('Notification saved successfully:', res);
          this.toastr.success(res.message);
          this.spinner.hide();
          this.offCanvas.dismiss();
          this.getAdvertisements();
        },
        error: (error) => {
          this.toastr.error(error.error.error);
          this.spinner.hide().then(r => {
            return r;
          });
        }, complete: () => {
          this.getAdvertisements();
          this.offCanvas.dismiss()
          this.spinner.hide().then(r => {
            return r;
          });

        }

      });
  }

  getAdvertisements() {
    this.apiService.get('manage_advertisement/get_all').subscribe(res => {
      console.log(res)
      this.advertisements = res.data;
      this.tempAdvertisements = res.data;
    });
  }

  get mf() {
    return this.advertisementForm.controls;
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.advertisements.length);
  }

  editManageAdvertisement(editadvertisement: any, advertisement: AdvertisementList) {
    this.editAdvertisementForm.setValue({
      title: advertisement.id,
      description: advertisement.description,
      start_date: advertisement.start_date,
      end_date: advertisement.end_date,
      image_url: advertisement.image_url,
      detail_description: advertisement.detail_description
    })
    this.offcanvasService.open(editadvertisement, { position: "end", keyboard: false });
  }

  deleteAdvertisement(advertisement_id: number) {
    const payload = {
      "id": advertisement_id
    }
    this.apiService.post('manage_advertisement/delete', payload).subscribe(res => {
      console.log(res)
      this.advertisements = res.data;
      this.tempAdvertisements = res.data;
    });
    this.getAdvertisements()
  }

  onValueChange(status, advertisement: AdvertisementList) {

    const payload = {
      "id": advertisement.id,
      "status": status
    }

    this.messageService.confirm(`Are you sure to ${status ? '' : 'In'}active advertisement`, `${status ? 'A' : 'Ina'}ctive advertisement`).then(
      value => {
        if (value.isConfirmed) {
          this.spinner.show();
          if (status) {
            this.apiService.post(`manage_advertisement/active`, payload).subscribe({
              next: (res) => {
                this.toastr.success(res.message);
                this.spinner.hide();
              },
              error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
              }
            });
          } else {
            this.apiService.post(`manage_advertisement/inactive`, payload).subscribe({
              next: (res) => {
                this.toastr.success(res.message);
                this.spinner.hide();
              },
              error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
              }
            });
          }
        } else {
          this.getAdvertisements()
        }
      }
    );

  }

  
  uploadAdvertisementImage(event: any) {
    this.imageConverterService.convertBlobToBase64(event.target.files[0]).then(value => {
        this.filePath = value;
    });
}

  onSubmit() {
    try {

      console.log(this.advertisementForm.value);
      const { title, description, start_date, end_date, image_url, detail_description } = this.advertisementForm.value;

      const payload = {
        "title": title,
        'description': description,
        'start_date': start_date,
        'end_date': end_date,
        'image_url': image_url,
        "detail_description": detail_description
      };

      this.apiService.post('manage_advertisement/add', payload).subscribe({
        next: (res) => {
          console.log('Advertisement saved successfully:', res);
          this.toastr.success(res.message);
          this.offCanvas.dismiss();
          this.getAdvertisements();
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        },
        complete: () => {
          this.spinner.hide().then(() => {
            this.offCanvas.dismiss();
          });
        }
      });
    } catch (error) {
      console.error('Error submitting advertisement:', error);
      this.toastr.error('An error occurred while submitting the advertisement.');
    }
  }


  onSearch(searchText: string): void {
    const searchTextLower = searchText.toLowerCase();
    const filteredMiscs = this.tempAdvertisements.filter(x => x.title.toLowerCase().includes(searchTextLower) || x.description.toLowerCase().includes(searchTextLower) || x.start_date.toLowerCase().includes(searchTextLower));

    if (searchTextLower == '') {
      this.advertisements = this.tempAdvertisements;
    } else
      this.advertisements = filteredMiscs;
  }


  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = ['serial_no', 'Title', 'Description', 'image_link', 'created_at', 'updated_at', 'status']
    this.excelService.exportAsExcelFile(this.tempExcelData, 'masterData', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.advertisements.length; i++) {
      const row = {
        'serial_no': i + 1,
        'Title': this.advertisements[i].title,
        'image_link': this.advertisements[i].image_url,
        'Description': this.advertisements[i].description,
        'created_at': this.dt.transform(this.advertisements[i].created_at, 'dd/MM/yyyy H:m:s'),
        'updated_at': this.dt.transform(this.advertisements[i].end_date ? this.advertisements[i].end_date : this.advertisements[i].created_at, 'dd/MM/yyyy H:m:s'),
        'status': this.advertisements[i].status ? 'status' : 'Inactive',
      }
      tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
  }

  protected readonly Math = Math;

}








