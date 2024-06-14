import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../../shared/services/api.service";
import {OwlOptions} from "ngx-owl-carousel-o";
import {DatePipe} from "@angular/common";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";

interface CorporateUserList {
    "aadhar_no": string;
    "active": boolean;
    "address": string;
    "balance": number;
    "city": string;
    "created_at": string;
    "district": string;
    "dob": string;
    "email": string;
    "father_name": string;
    "full_name": string;
    "gender": string;
    "id": string;
    "kyc_type": string;
    "mobile": string;
    "pan": string;
    "pincode": string;
    "role": string;
    "state": string;
    "username": string;
}

@Component({
    selector: 'app-manage-corporates',
    templateUrl: './manage-corporates.component.html'
})
export class ManageCorporatesComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    page = 1;
    pageSize: number = 10;
    totalUsers: number = 0;
    updated_at: Date = new Date();
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        autoplay: true,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 4
            },
            940: {
                items: 4
            }
        },
        nav: false
    }
    user_details ={
    "aadhar_no": null,
    "active": null,
    "address": null,
    "balance": null, 
    "city": null,
    "created_at": null,
    "district": null,
    "dob": null,
    "email": null,
    "father_name": null,
    "full_name": null,
    "gender": null,
    "id": null,
    "kyc_type": null,
    "mobile": null,
    "pan": null,
    "pincode": null,
    "role": null,
    "state": null,
    "username": null
}
    users: CorporateUserList[] = [];
    statistics_list: any[] = [];

    constructor(
        private offCanvas: NgbOffcanvas,
        private apiService: ApiService,
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
    ) {}

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Manage Users'},
            {label: 'Corporates', active: true}
        ];

        this.getRolesList();
        this.getUsers();
    }

    getRolesList() {
        this.apiService.get('role/list').subscribe({
            next: (res) => {
                this.statistics_list = res.data.statistics;
            }
        });
    }

    getUsers() {
        const args = {
            limit: 10,
            page: 1,
            from_date: this.datePipe.transform(new Date(), 'y-m-d'), // Format the date here
            to_date: this.datePipe.transform(new Date(), 'y-m-d')   // Format the date here

        };

        this.apiService.get('user/corporate_list').subscribe(
            (response) => {
                this.users = response.data.result;
                this.totalUsers = response.data.total;
            },
        );
    }

    openDetails(retailerDetails: TemplateRef<any>) {
        this.offCanvas.open(retailerDetails, {position: 'end'});
    }

    getStartIndex(): number {
        return (this.page - 1) * this.pageSize + 1;
    }

    getEndIndex(): number {
        return Math.min(this.page * this.pageSize, this.users?.length ?? 0);
    }

    protected readonly Math = Math;

    forceResetPassword() {
        // Add the logic you want to perform when this menu item is clicked
    }

    editUserDetails() {
        // Add the logic you want to perform when this menu item is clicked
    }

    viewKYCDetails() {
        // Add the logic you want to perform when this menu item is clicked
    }

    manageCommission() {
        // Add the logic you want to perform when this menu item is clicked
    }

    onPromoteUser(promote_user: any, data: any) {
        this.user_details = data
        this.offCanvas.open(promote_user, {position: 'end', animation: true});
    }

    centerModal(centerDataModal: any) {
        this.modalService.open(centerDataModal, { centered: true });
      }

    submitPromote(user_details:object) {
        this.spinner.show();
        this.apiService.post('user/promote-user',{"id":user_details['id']}).subscribe({
            next: (res) => {
                this.spinner.hide();
                this.toastr.success(res['message']);
                this.getUsers();
                this.offCanvas.dismiss();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();

            }
        });

    }
    onPageChange(event: any){
        this.page = event
        this.getUsers()
      }
}
