import { Component } from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {Clipboard} from "@angular/cdk/clipboard";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {SortService} from "../../../shared/services/sort.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export interface SubAdminUsers{
  active: boolean;
  created_at: string;
  email_id: string;
  id: string;
  mobile_no: string;
  name: string;
  role: number;
  username: string;
  father_name:string;
  gender:string
}
@Component({
  selector: 'app-manage-sub-admin',
  templateUrl: './manage-sub-admin.component.html',
  styleUrls: ['./manage-sub-admin.component.scss']
})
export class ManageSubAdminComponent {
  breadCrumbItems!: Array<{}>;
  sub_admin_users: SubAdminUsers[] = [];
  page: number = 1;
  page_size: number = 10;
  total: number = 0;
  totalRecords: number = 0;
  isAddSubAdminFormSubmit = false;
  isEditSubAdminFormSubmit = false;
  isResetPassSubAdminFormSubmit = false;
  user_id=null;

  AddSubAdminForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    father_name: new FormControl('', [Validators.required]),
    email_id: new FormControl('', [Validators.required]),
    mobile_no: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
  });

  EditSubAdminForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    father_name: new FormControl('', [Validators.required]),
    email_id: new FormControl('', [Validators.required]),
    mobile_no: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
  });

  ResetPasswordSubAdminForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required])
  })
  constructor(
      private offCanvas: NgbOffcanvas,
      private copyToClipboard: Clipboard,
      private toastr: ToastrService,
      private apiService: ApiService,
      private sortService: SortService,
      private spinner: NgxSpinnerService,
      private toaster: ToastrService,
      private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Manage Users'},
      {label: 'Manage Sub-Admin', active: true}
    ];
    this.getAllSubAdminUser();
  }

  getAllSubAdminUser() {
    this.apiService.post('user/get_all_sub_admin_details', {
      'page_no': +this.page,
      'page_size': +this.page_size,
      'from_date': '',
      'to_date': ''
    }).subscribe(res => {
      this.sub_admin_users = res.data.result;
      this.total = res.data.total;
      this.totalRecords = res.data.total;
    });
  }

  getMax() {
    return Math.min(this.page * this.page_size, this.totalRecords);
  }

  onChange() {
    this.getAllSubAdminUser();
  }

  onPageChange(event: any) {
    this.page = event
    this.getAllSubAdminUser()
  }

  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, {centered: true});
  }

  centerAddModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, {centered: true});
  }

  centerEditModal(centerDataModal: any, user: SubAdminUsers) {
    this.user_id=user.id;
    this.EditSubAdminForm.setValue({
      name: user.name,
      username: user.username,
      father_name: user.father_name,
      email_id: user.email_id,
      mobile_no: user.mobile_no,
      gender: user.gender,
    });
    this.modalService.open(centerDataModal, {centered: true});
  }
  centerResetPasswordModal(centerDataModal: any, user: SubAdminUsers) {
    this.user_id=user.id;
    this.modalService.open(centerDataModal, {centered: true});
  }

  deleteSubAdmin(user: SubAdminUsers) {
    this.spinner.show(undefined,
        {
          type: 'ball-scale-multiple',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        });
    this.apiService.post('user/delete_sub_admin', {
      "user_id": user.id
    }).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.spinner.hide();
      },
      error: (error) => {
        this.toaster.error(error.error.error);
        this.spinner.hide();
      }, complete: () => {
        this.offCanvas.dismiss();
        this.modalService.dismissAll();
        this.getAllSubAdminUser();
      }

    });
  }

  get af() {
    return this.AddSubAdminForm.controls;
  }

  get ef() {
    return this.EditSubAdminForm.controls;
  }
  get rpf() {
    return this.ResetPasswordSubAdminForm.controls;
  }

  onAddSubAdminSubmit() {
    this.isAddSubAdminFormSubmit = true;
    if (this.AddSubAdminForm.invalid) {
      return;
    } else {
      const data = {
        "name": this.af['name'].value,
        "father_name": this.af['father_name'].value,
        "gender": this.af['gender'].value,
        "email": this.af['email_id'].value,
        "mobile_no": this.af['mobile_no'].value
      }

      this.apiService.post('user/create_sub_admin', data).subscribe({
        next: (res) => {
          this.toastr.success(res['message'])
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        }, complete: () => {
          this.spinner.hide();
          this.AddSubAdminForm.reset();
          this.getAllSubAdminUser();
          this.modalService.dismissAll();
        }
      })
    }
  }

  onEditSubAdminSubmit(){
    this.isEditSubAdminFormSubmit = true;
    if (this.EditSubAdminForm.invalid) {
      return;
    }
    else {
      const data = {
        "name": this.ef['name'].value,
        "father_name": this.ef['father_name'].value,
        "gender": this.ef['gender'].value,
        "email_id": this.ef['email_id'].value,
        "mobile_no": this.ef['mobile_no'].value,
        "user_id":this.user_id
      }

      this.apiService.post('user/edit_sub_admin', data).subscribe({
        next: (res) => {
          this.toastr.success(res['message'])
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        }, complete: () => {
          this.user_id=null;
          this.spinner.hide();
          this.EditSubAdminForm.reset();
          this.getAllSubAdminUser();
          this.modalService.dismissAll();
        }
      })
    }

  }

  onResetPasswordSubAdminSubmit(){
    this.isResetPassSubAdminFormSubmit = true;
    if (this.ResetPasswordSubAdminForm.invalid) {
      return;
    }
    else {
      const data = {
        "password": this.rpf['password'].value,
        "confirm_password": this.rpf['confirm_password'].value,
        "user_id":this.user_id
      }
      this.apiService.post('user/reset_password_sub_admin', data).subscribe({
        next: (res) => {
          this.toastr.success(res['message'])
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        }, complete: () => {
          this.spinner.hide();
          this.user_id=null;
          this.ResetPasswordSubAdminForm.reset();
          this.modalService.dismissAll();
        }
      })
    }
  }

}