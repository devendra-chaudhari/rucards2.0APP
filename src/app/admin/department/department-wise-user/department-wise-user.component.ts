import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../../shared/services/excel.service";
import {SortService} from "../../../shared/services/sort.service";


interface Users{
  id: string;
  full_name: string;
  username: string;
  mobile_no:string;
  email_id: string;
  user_role: string;
  user_status: boolean;
  department_role: string;
  department_status: boolean;
  created_at: string;
}
interface Departments {
  id: number;
  name: string;
  active: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}
@Component({
  selector: 'app-department-wise-user',
  templateUrl: './department-wise-user.component.html',
  styleUrls: ['./department-wise-user.component.scss']
})
export class DepartmentWiseUserComponent {
  breadCrumbItems!: Array<{}>;
  users:Users[]=[]
  department: Departments | null = null;
  department_id: number | null = null;
  constructor(
      private route: ActivatedRoute,
      private offCanvas: NgbOffcanvas,
      private toaster: ToastrService,
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private excelService: ExcelService,
      private sortService: SortService
  ) {
  }
  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Department'},
      {label: 'Department Wise User', active: true}
    ];
    this.route.queryParams.subscribe(params => {
      this.department_id=params['department_id'];
    });
    if (this.department_id !== null) {
      this.getDepartmentDetails(this.department_id);
    }
    this.getDepartmentUsersDetails();
  }

  getDepartmentDetails(department_id:number){
    this.apiService.post('department/get_department',{"department_id":department_id}).subscribe(res => {
      this.department=res.data.result;
    });
  }

  getDepartmentUsersDetails(){
    this.apiService.post('department/get_department_wise_users',{"department_id":this.department_id}).subscribe(res => {
      this.users=res.data.result;
    });
  }
}
