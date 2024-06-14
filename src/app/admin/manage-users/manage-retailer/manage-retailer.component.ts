import { Component, TemplateRef, OnInit } from '@angular/core';
import { NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { SharedModule } from "../../../shared/shared.module";
import { CommonModule } from '@angular/common';
import { Clipboard } from "@angular/cdk/clipboard";
import {RouterModule} from '@angular/router';

interface RetailerList {
  id: string;
  username: string;
  full_name: string;
  father_name: string;
  gender: string;
  mobile: string;
  pincode: string;
  email: string;
  dob: string;
  pan: string;
  state: string;
  district: string;
  balance: string;
  retailer: string;
  distributor: string;
  super_distributor: string;
  active: boolean;
  created_at: string;
  role: string;
  parent_username: string;
  parent_full_name: string;
  kyc_type: string;
  address: string;
  user_type:string;
}

@Component({
    selector: 'app-manage-retailer',
    standalone: true,
    templateUrl: './manage-retailer.component.html',
    styleUrl: './manage-retailer.component.scss',
    imports: [SharedModule, CommonModule, NgbModule, RouterModule]
})
export class ManageRetailerComponent {
  breadCrumbItems!: Array<{}>;
  users:RetailerList[] = [];
  total:number = 0;
  page_size = 10;
  page_no = 1;
  protected readonly Math = Math;
  showDetails = false;
  cardNo = '5452 5642 8875 9642';
  retailer_data = {
    id: "",
    username: "",
    full_name: "",
    father_name: "",
    gender: "",
    mobile: "",
    pincode: "",
    email: "",
    dob: "",
    pan: "",
    state: "",
    district: "",
    balance: "",
    retailer: "",
    distributor: "",
    super_distributor: "",
    active: true,
    created_at: "",
    role: "",
    parent_username: "",
    parent_full_name: "",
    kyc_type: "",
    address: "",
    user_type: ""
}

  constructor(
    private offCanvas: NgbOffcanvas,
    private apiService: ApiService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private copyToClipboard: Clipboard,

) {}

ngOnInit() {
    this.breadCrumbItems = [
        {label: 'Manage Users'},
        {label: 'Manage Retailers', active: true}
    ];
    this.getUsers(this.page_size, this.page_no)
}

getUsers(page_size:number, page_no:number) {
  this.apiService.post('user/retailers_list',{'page_size':page_size, 'page_no':page_no}).subscribe(
      (res) => {
        console.log(res)
          this.users = res.data.result;
          this.total = res.data.total;
      },
  );
}

onPageChange(event: any){
  this.page_no = event
  this.getUsers(this.page_size, this.page_no)
}

onPageSizeChange(){
  this.getUsers(this.page_size, this.page_no)
}

copyCardNo() {
  this.copyToClipboard.copy(this.cardNo);
  this.toastr.success('Copied to Clipboard');
}

openDetails(retailerDetails: TemplateRef<any>, retailer:RetailerList) {
  this.retailer_data =retailer
  this.offCanvas.open(retailerDetails, {position: 'end'});
}
}
