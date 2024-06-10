import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../../../shared/services/api.service";
import {SessionStorageService} from "../../../../shared/services/session-storage.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";

interface LoginHistory {
    channel: string;
    client: string;
    device_id: string;
    ip: string;
    latitude: string;
    longitude: string;
    created_at: string;
}

interface PersonalInfo {
    "id":string;
    "aadhaar_verified": boolean;
    "bank_verified": boolean;
    "business_verified": boolean;
    "aadhar_no": string;
    "active": boolean;
    "address": string;
    "city": string;
    "district": string;
    "dob": string;
    "email": string;
    "email_verified": boolean;
    "father_name": string;
    "gender": string;
    "kyc_type": string;
    "mobile": string;
    "name": string;
    "username": string;
    "pan": string;
    "pan_verified": boolean;
    "applicant_photo": string;
    "applicant_sign": string;
    "shop_front": string;
    "shop_back": string;
    "pincode": string;
    "state": string;
    "enable_2fa": boolean;
    "join_date": string;
    "mobile_verified": string;
    "user_type":string
}

@Component({
    selector: 'app-edit-corporate',
    templateUrl: './edit-corporate.component.html'
})
export class EditCorporateComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    mode = 'bank';
    loginHistories: LoginHistory[] = [];
    personalInfo: PersonalInfo;
    userPersonalInfo: PersonalInfo;
    user_id = null
    editMode: boolean = false;
    edit_personalInfo = {
        "id" : "",
        "aadhaar_verified": "",
        "bank_verified": "",
        "business_verified": "",
        "aadhar_no": "",
        "active": "",
        "home_address": "",
        "city": "",
        "district": "",
        "dob": "",
        "email": "",
        "email_verified": "",
        "father_name": "",
        "gender": "",
        "kyc_type": "",
        "mobile": "",
        "name": "",
        "username": "",
        "pan": "",
        "pan_verified": "",
        "applicant_photo": "",
        "applicant_sign": "",
        "shop_front": "",
        "shop_back": "",
        "pincode": "",
        "state": "",
        "enable_2fa": "",
        "join_date": "",
        "mobile_verified": ""
    }

    constructor(
        private route: ActivatedRoute,
        private offCanvas: NgbOffcanvas,
        private apiService: ApiService,
        private sessionStorage: SessionStorageService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.user_id=this.route.snapshot.paramMap.get('id')
        this.breadCrumbItems = [
            {label: 'Manage Users'},
            {label: 'Edit Corporate', active: true}
        ];

        this.getPersonalInfo();
        if (this.user_id !== null) {
            this.apiService.post('user/get-user-personal-info',{'id':this.user_id}).subscribe({
                next: (res) => {
                    this.personalInfo = res.data;
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                }
            });
          }
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
      }

    getLoginHistory() {
        this.apiService.get('user/login_history').subscribe(res => {
            this.loginHistories = res.data;
        });
    }

    onpenProfileScore(profileScore: TemplateRef<any>) {
        this.offCanvas.open(profileScore, {position: 'end', backdrop: 'static'});
    }

    openMicroRights(microRights: TemplateRef<any>) {
        this.offCanvas.open(microRights, {position: 'end', backdrop: 'static'});
    }

    getPersonalInfo() {
        this.apiService.get('user/personal_info').subscribe({
            next: (res) => {
                this.personalInfo = res.data;
            },
            error: (error) => {
                this.toastr.error(error.error.error);
            }
        });
    }
    onSubmitPersonalInfo(personalInfo_id:string){
        
        this.edit_personalInfo.id = personalInfo_id
        this.spinner.show();
        this.apiService.post('user/set-user-personal-info',this.edit_personalInfo).subscribe({
            next: (res) => {
                this.spinner.hide();
                this.toastr.success(res['message']);
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

}
