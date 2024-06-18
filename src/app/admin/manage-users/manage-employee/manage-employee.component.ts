import { Component } from '@angular/core';
import {FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {Clipboard} from "@angular/cdk/clipboard";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {SortService} from "../../../shared/services/sort.service";
import {NgxSpinnerService} from "ngx-spinner";

interface Roles{
  id: number;
  name: string;
  role_creator_id: string;
  description: string;
}
interface Departments {
  id: number;
  name: string;
  active: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Employees{
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
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.scss']
})
export class ManageEmployeeComponent {
  breadCrumbItems!: Array<{}>;
  employees: Employees[] = [];
  departments:Departments[]=[]
  roles:Roles[]=[]
  page: number = 1;
  page_size: number = 10;
  total: number = 0;
  totalRecords: number = 0;
  isAddEmployeeFormSubmit = false;
  isEditEmployeeFormSubmit = false;
  isResetPassEmployeeFormSubmit = false;
  isMapDepartmentEmployeeFormSubmit = false;
  user_id=null;
  department_id=null
  AddEmployeeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    father_name: new FormControl('', [Validators.required]),
    email_id: new FormControl('', [Validators.required]),
    mobile_no: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
  });

  EditEmployeeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    father_name: new FormControl('', [Validators.required]),
    email_id: new FormControl('', [Validators.required]),
    mobile_no: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
  });

  ResetPasswordEmployeeForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required])
  })

  MapDepartmentEmployeeForm: FormGroup = new FormGroup({
    department_name: new FormControl('', [Validators.required]),
    role_name: new FormControl('', [Validators.required])
  })

  filterUserForm = new UntypedFormGroup({
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
  });

  constructor(
      private offCanvas: NgbOffcanvas,
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
      {label: 'Manage Employee User', active: true}
    ];
    this.getAllEmployee(this.page_size,this.page);
    this.getAllDepartment();
  }
  getMax() {
    return Math.min(this.page * this.page_size, this.totalRecords);
  }
  onChange() {
    this.getAllEmployee(this.page_size,this.page);
  }
  onPageChange(event: any) {
    this.page = event
    this.getAllEmployee(this.page_size,this.page)
  }
  
  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, {centered: true});
  }
  centerAddModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, {centered: true});
  }
  
  centerEditModal(centerDataModal: any, user: Employees) {
    this.user_id=user.id;
    this.EditEmployeeForm.setValue({
      name: user.name,
      father_name: user.father_name,
      email_id: user.email_id,
      mobile_no: user.mobile_no,
      gender: user.gender,
    });
    this.modalService.open(centerDataModal, {centered: true});
  }
  centerResetPasswordModal(centerDataModal: any, user: Employees) {
    this.user_id=user.id;
    this.modalService.open(centerDataModal, {centered: true});
  }

  deleteEmployee(user: Employees) {
    this.spinner.show(undefined,
        {
          type: 'ball-scale-multiple',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        });
    this.apiService.post('user/delete_employee', {
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
        this.getAllEmployee(this.page_size,this.page);
      }

    });
  }

  get af() {
    return this.AddEmployeeForm.controls;
  }
  get ef() {
    return this.EditEmployeeForm.controls;
  }
  get rpf() {
    return this.ResetPasswordEmployeeForm.controls;
  }
  get muf(){
    return this.MapDepartmentEmployeeForm.controls;
  }

  onAddEmployeeSubmit() {
    this.isAddEmployeeFormSubmit = true;
    if (this.AddEmployeeForm.invalid) {
      return;
    } else {
      const data = {
        "name": this.af['name'].value,
        "father_name": this.af['father_name'].value,
        "gender": this.af['gender'].value,
        "email": this.af['email_id'].value,
        "mobile_no": this.af['mobile_no'].value
      }

      this.apiService.post('user/create_employee', data).subscribe({
        next: (res) => {
          this.toastr.success(res['message'])
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        }, complete: () => {
          this.spinner.hide();
          this.AddEmployeeForm.reset();
          this.getAllEmployee(this.page_size,this.page);
          this.modalService.dismissAll();
        }
      })
    }
  }
  onEditEmployeeSubmit(){
    this.isEditEmployeeFormSubmit = true;
    if (this.EditEmployeeForm.invalid) {
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

      this.apiService.post('user/edit_employee', data).subscribe({
        next: (res) => {
          this.toastr.success(res['message'])
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        }, complete: () => {
          this.user_id=null;
          this.spinner.hide();
          this.EditEmployeeForm.reset();
          this.getAllEmployee(this.page_size,this.page);
          this.modalService.dismissAll();
        }
      })
    }

  }
  onResetPasswordEmployeeSubmit(){
    this.isResetPassEmployeeFormSubmit = true;
    if (this.ResetPasswordEmployeeForm.invalid) {
      return;
    }
    else {
      const data = {
        "password": this.rpf['password'].value,
        "confirm_password": this.rpf['confirm_password'].value,
        "user_id":this.user_id
      }
      this.apiService.post('user/reset_password_employee', data).subscribe({
        next: (res) => {
          this.toastr.success(res['message'])
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        }, complete: () => {
          this.spinner.hide();
          this.user_id=null;
          this.ResetPasswordEmployeeForm.reset();
          this.modalService.dismissAll();
        }
      })
    }
  }
  onMapDepartmentEmployee(){
    this.isMapDepartmentEmployeeFormSubmit = true;
    if (this.MapDepartmentEmployeeForm.invalid) {
      return;
    }
    else {
      const data = {
        "department_id": this.muf['department_name'].value,
        "role_id": this.muf['role_name'].value,
        "user_id":this.user_id
      }
      this.apiService.post('user/user_map_department', data).subscribe({
        next: (res) => {
          this.toastr.success(res['message'])
        },
        error: (error) => {
          this.toastr.error(error.error.error);
        }, complete: () => {
          this.spinner.hide();
          this.user_id=null;
          this.MapDepartmentEmployeeForm.reset();
          this.modalService.dismissAll();
        }
      })
    }
  }
  getAllDepartment(){
    this.apiService.get('department/get-department-list').subscribe(res => {
      this.departments = res.data.result;
    });
  }
  getAllDepartmentWiseRoles(department_id:number){
    this.apiService.post('department/get_department_wise_roles',{'department_id':department_id}).subscribe(res => {
      this.roles = res.data.result;
    });
  }
  onDepartmentSelectionChange(){
    const data = {
      "department_id": this.muf['department_name'].value,
    }
    this.getAllDepartmentWiseRoles(data.department_id);
  }

  onSubmitFilterUser(){
    const {start_date, end_date} = this.filterUserForm.value
    console.log(start_date, end_date)
    this.getAllEmployee( this.page_size,this.page, start_date, end_date);
    this.offCanvas.dismiss();
  }
  
  onFilterUser(filter_user: any) {
    this.offCanvas.open(filter_user, {position: 'end', animation: true});
  }

  getAllEmployee(page_size:number, page_no:number, start_date:Date=null, end_date:Date=null){
    const data={
      'page_no': page_no,
      'page_size': page_size,
      'start_date': start_date,
      'end_date': end_date
    }
    this.apiService.post('user/get_all_employee_details', data).subscribe(res => {
      this.employees = res.data.result;
      this.total = res.data.total;
      this.totalRecords = res.data.total;
    });
  }
}
