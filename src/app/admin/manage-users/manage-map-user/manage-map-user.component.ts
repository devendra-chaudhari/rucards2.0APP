import { Component } from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {Clipboard} from "@angular/cdk/clipboard";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {SortService} from "../../../shared/services/sort.service";
import {NgxSpinnerService} from "ngx-spinner";

interface User{
  id: string;
  name: string;
  username: string;
  role: string;
  mobile_no: string;
  email_id: string;
  state: string;
  district: string;
  active: string;
  pan_no: string;
  aadhar_no: string;
  parent_name: string;
  parent_username: string;
  dob: string;
  created_at: string;
}

@Component({
  selector: 'app-manage-map-user',
  templateUrl: './manage-map-user.component.html',
  styleUrls: ['./manage-map-user.component.scss']
})
export class ManageMapUserComponent {
  breadCrumbItems!: Array<{}>;
  data={
    'from_date':null,
    'to_date':null,
    'username':null,
    'role_id':"",
    'page_no': 1,
    'page': 1,
    'page_size': 10,
    'total': 0,
    'totalRecords': 0
  }
  username=null;
  users:User[]=[]
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
      {label: 'Manage Map Users', active: true}
    ];
    this.getMapUsers(this.data)
  }

  getMapUsers(data:any){
    this.apiService.post('user/user_map_details',data).subscribe(res => {
      this.users = res.data.result;
      this.data.total = res.data.total;
      this.data.totalRecords = res.data.total;
    });
  }

  getMax() {
    return Math.min(this.data.page * this.data.page_size, this.data.totalRecords);
  }

  sort(column: string) {
    this.sortService.sort(column, this.users);
  }
  onChange() {
    this.getMapUsers(this.data);
  }

  onPageChange(event: any){
    this.data.page_no = event
    this.getMapUsers(this.data)
  }

  onMapUser(map_user: any) {
    this.offCanvas.open(map_user, {position: 'end', animation: true});
  }

  onMapUserSubmit(user:any){
    this.spinner.show(undefined,
        {
          type: 'ball-scale-multiple',
          size: 'medium',
          bdColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          fullScreen: true
        });
    this.apiService.post('user/user_map_accept',{
      "user_id":user.id,
      "username":this.username
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
        this.getMapUsers(this.data);
      }

    });
  }

  openMapModal(content: any) {
    this.modalService.open(content);
  }

}
