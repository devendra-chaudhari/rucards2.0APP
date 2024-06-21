import { Component } from '@angular/core';
import { SharedModule } from "../../../shared/shared.module";
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

interface UserData{
  username: string;
  previous_role?: string;
  request_new_role?: string;
  current_role?: string;
  full_name: string;
  email: string;
  mobile: string;
}

interface PromoteRequests{
  id: string;
  promoted_user_name: string;
  previous_username: string;
  request_new_username: string;
  previous_role: string;
  request_new_role: string;
  request_user_previous_user_id: string;
  created_date: string;
  updated_at: string;
  full_name: string;
  mobile: string;
  email: string;
  request_status: string;
}

@Component({
    selector: 'app-manage-promote-requests',
    standalone: true,
    templateUrl: './manage-promote-requests.component.html',
    styleUrl: './manage-promote-requests.component.scss',
    imports: [SharedModule, CommonModule, FormsModule]
})
export class ManagePromoteRequestsComponent {
  breadCrumbItems!: Array<{}>;
  page:number = 1
  page_size:number = 10
  promoteRequests:PromoteRequests[]=[]
  total:number=0
  userid: string = '';
  userData:UserData;
  isSearch:boolean=false;

  constructor(
    private offCanvas: NgbOffcanvas,
    private toastr: ToastrService,
    private apiService: ApiService,
    private sortService: SortService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    // private offcanvasService: NgbOffcanvas,
) {
}

  ngOnInit() {
    this.breadCrumbItems = [
      {label: 'Manage Users'},
      {label: 'Manage Promote Requests', active: true}
    ];
    this.getPromoteRequests(this.page, this.page_size)
  }

  getPromoteRequests(page:number, page_size:number){
    this.apiService.post('user/get-request-promote-user',{"page_no":this.page, "page_size":this.page_size}).subscribe(res => {
      this.promoteRequests = res.data.result;
      this.total = res.data.total;
      console.log(res)
      console.log(this.promoteRequests)
    });
  }

  onAccept(promoteRequests:PromoteRequests){
    this.spinner.show(undefined,{
      type: 'ball-scale-multiple',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fullScreen: true
              });
  const payload = {
    "request_id":promoteRequests.id,
    "previous_username":promoteRequests.previous_username
  }
  this.apiService.post('user/accept_promote_request',payload).subscribe({
    next: (res) => {
      this.toaster.success(res.message);
      const result = this.promoteRequests.find(request => +request.id === +promoteRequests.id);
      result.request_status = "Accepted"
      this.spinner.hide();
    },
    error: (error) => {
      this.toaster.error(error.error.error);
      this.spinner.hide();
    }
  });
  }

  onReject(id:number){
    this.spinner.show(undefined,{
        type: 'ball-scale-multiple',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
                });
    const payload = {
      "request_id":id
    }
    this.apiService.post('user/reject_promote_request',payload).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        const result = this.promoteRequests.find(request => +request.id === id);
        result.request_status = "Rejected"
        this.spinner.hide();
      },
      error: (error) => {
        this.toaster.error(error.error.error);
        this.spinner.hide();
      }
    });
  }


  getMax() {
    return Math.min(this.page * this.page_size, this.total);
  }

  onChange() {
    this.getPromoteRequests(this.page, this.page_size)
  }

  onPageChange(event: any){
    this.page = event
    this.getPromoteRequests(this.page, this.page_size)
  }
  
  openPromoteUser(content: any) {
    this.offCanvas.open(content, { position: "end", keyboard: false });
  }

  onShow(): void {
    
    const payload = {
      "userid": this.userid
    }
    console.log(this.userid)
    this.apiService.post('user/get_user_by_userid',payload).subscribe({
      next: (res) => {
        this.isSearch = true
        console.log(res)
        this.toaster.success(res.message);
        this.userData = res.data;
        this.spinner.hide();
      },
      error: (error) => {
        this.toaster.error(error.error.error);
        this.spinner.hide();
      }
    });
  }
  manualPromote(previous_username:string){
    this.spinner.show(undefined,{
      type: 'ball-scale-multiple',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fullScreen: true
              });
  const payload = {
    "previous_username":previous_username
  }
  this.apiService.post('user/manually_promote_user',payload).subscribe({
    next: (res) => {
      this.isSearch = false
      this.userData = null;
      this.toaster.success(res.message);
      this.spinner.hide();
    },
    error: (error) => {
      this.toaster.error(error.error.error);
      this.spinner.hide();
    }
  });
  }
}
