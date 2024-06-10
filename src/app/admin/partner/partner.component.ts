import { Component } from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "../../shared/services/message.service";
import {SortService} from "../../shared/services/sort.service";
import {ExcelService} from "../../shared/services/excel.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {CookieService} from 'ngx-cookie-service';

interface APIPartners {
  id: number;
  name: string;
  description: string;
  contact_number: number;
  slug:string;
  email: string;
  active: string;
  updated_at: string;
  created_at: string;
}


@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent {
  breadCrumbItems!: Array<{}>;
  isPartnerSubmit = false;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  partners:APIPartners[]=[]
  tempPartners: APIPartners[] = [];
  tempExcelData = [];
  title:string = '';
  partnerId:number = 0;

  partnerForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
    contact_number: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required]),
  });
  constructor(
      private modalService: NgbModal,
      private apiService: ApiService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private sortService: SortService,
      private excelService: ExcelService,
  ) {
  }

  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Administration'},
      {label: 'API Partner', active: true}
    ];
    this.getAPIPartnersDetails();

  }

  get pf() {
    return this.partnerForm.controls;
  }

  getMax() {
    return Math.min(this.page * this.pageSize, this.partners.length);
  }

  sort(column: string) {
    this.sortService.sort(column, this.partners);
  }

  onSearch(searchText: string): void {
    const searchTextLower = searchText.toLowerCase();
    const filteredPartners = this.tempPartners.filter(x => x.name.toLowerCase().includes(searchTextLower) || x.email.toLowerCase().includes(searchTextLower) || x.contact_number);

    if (searchTextLower == '') {
      this.partners = this.tempPartners;
    } else
      this.partners = filteredPartners;
  }

  export_to_excel() {
    this.excelFields();
    const sortByField = null;
    const excludeFields = [];
    const columnOrder = ['serial_no', 'name', 'category_name', 'status', 'created_at', 'updated_at']
    this.excelService.exportAsExcelFile(this.tempExcelData, 'masterData', sortByField, excludeFields, columnOrder);
  }

  private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.partners.length; i++) {
      //serial_no , name, category_name, status,created_at, updated_at
      const row = {
        'serial_no': i + 1,
        'name': this.partners[i].name,
        'category_name': this.partners[i].email,
        'status': this.partners[i].active ? 'Active' : 'Inactive',
         }
      tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
  }

  protected readonly Math = Math;

  openPartnerModal(content: any) {
    this.title = 'Add';
    this.partnerId = 0;
    this.pf['description'].setValue('');
    this.pf['name'].setValue('');
    this.isPartnerSubmit = false
    this.modalService.open(content, {centered: true, backdrop: "static", keyboard: false});
  }

  onSubmit(){
    this.isPartnerSubmit = true;
    if (this.partnerForm.invalid) {
      return;
    }

    this.spinner.show();
    this.apiService.post('api_partner/create_api_partner', this.partnerForm.value).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.modalService.dismissAll();
        this.spinner.hide();
        this.getAPIPartnersDetails();
      },
      error: (error) => {
        this.toastr.error(error.error.error);
        this.spinner.hide();
      }
    });
  }



  getAPIPartnersDetails(){
    this.apiService.get('api_partner/api_partner_list').subscribe({
      next: (res) => {
        this.partners = res.data
      }
    });
  }



  openEditpartnerModal(content: any, partner: APIPartners) {
    this.title = 'Edit';
    this.partnerId = partner.id;
    this.pf['description'].setValue(partner.description);
    this.pf['name'].setValue(partner.name);
    this.pf['contact_number'].setValue(partner.contact_number);
    this.pf['email'].setValue(partner.email);
    this.modalService.open(content, {centered: true, backdrop: "static", keyboard: false});
  }

}
