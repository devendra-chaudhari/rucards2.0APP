import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {SessionStorageService} from "../../shared/services/session-storage.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {User} from "../../shared/interfaces/user";
import {MessageService} from "../../shared/services/message.service";
import {values} from "lodash";

interface LoginHistory {
    channel: string;
    client: string;
    device_id: string;
    ip: string;
    latitude: string;
    longitude: string;
    created_at: string;
}

interface BankList {
    id: number;
    beneficiary_name: string;
    bank_name: string;
    account_no: string;
    branch: string;
    ifsc_code: string;
    is_default: boolean;
    account_status: string;
    account_type: string;
}

interface PersonalInfo {
    aadhaar_verified: boolean;
    bank_verified: boolean;
    business_verified: boolean;
    aadhar_no: string;
    active: boolean;
    address: string;
    city: string;
    district: string;
    dob: string;
    email: string;
    email_verified: boolean;
    father_name: string;
    gender: string;
    kyc_type: string;
    mobile: string;
    name: string;
    username: string;
    pan: string;
    pan_verified: boolean;
    applicant_photo: string;
    applicant_sign: string;
    shop_front: string;
    shop_back: string;
    pincode: string;
    state: string;
    enable_2fa: boolean;
    join_date: string;
}

interface BusinessInfo {
    business_address: string;
    business_name: string;
    constitution_category: string;
    gstin: string;
    jurisdiction: string;
    nature_of_business: string;
    taxpayer_type: string;
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    user: User | undefined;
    loading = false;
    gstin: string | undefined;
    isGst = '';
    gstExist = false;
    mode = 'BANK';
    invalidBank = false;
    invalidacType = false;
    invalidIfsc = false;
    invalidUpi = false;
    bankorupiExist = false;
    nonGstConsult = false;
    loginHistories: LoginHistory[] = [];
    banks: BankList[] = [];
    personalInfo: PersonalInfo | undefined;
    businessInfo: BusinessInfo | undefined;
    businessData = {
        GSTIN: '',
        center_jurisdiction: '',
        constitution_of_business: '',
        date_of_registration: '',
        gst_in_status: '',
        legal_name_of_business: '',
        nature_of_business_activities: '',
        principal_place_address: '',
        taxpayer_type: '',
        valid: false,
        remark: ''
    }

    nonGstData = {
        gstin: '',
        business_name: '',
        business_address: '',
        taxpayer_type: '',
        gst_in_status: '',
        constitution_category: '',
        reg_date: '',
        jurisdiction: '',
        nature_of_business: '',
        remark: ''

    }

    bankDetails = {
        accountStatus: '',
        bankName: '',
        branch: '',
        city: '',
        name: '',
        utr: ''
    }

    upiDetails = {
        status: '',
        name: '',
        accountExist: ''
    }

    bankData = {
        account_no: '',
        account_type: '',
        ifsc_code: ''
    }

    bankUpdateData = {
        account_no: '',
        account_type: '',
        ifsc_code: '',
        verification_mode: '',
        beneficiary_name: '',
        bank_name: '',
        branch: '',
        account_status: ''
    }

    upiData = {
        vpa: ''
    }

    constructor(
        private offCanvas: NgbOffcanvas,
        private apiService: ApiService,
        private sessionStorage: SessionStorageService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Users'},
            {label: 'Profile', active: true}
        ];

        this.sessionStorage.currentUser.subscribe(user => this.user = user);
        this.getPersonalInfo();
        this.getBusinessInfo();
        this.bankList();
    }

    getLoginHistory() {
        this.apiService.get('user/login_history').subscribe(res => {
            this.loginHistories = res.data;
        });
    }

    openGstin(gstIn: TemplateRef<any>) {
        this.gstin = '';
        this.offCanvas.open(gstIn, {position: 'end', backdrop: 'static'});
    }

    openAccount(addAccount: TemplateRef<any>) {
        this.offCanvas.open(addAccount, {position: 'end', backdrop: 'static'});
    }

    onpenProfileScore(profileScore: TemplateRef<any>) {
        this.offCanvas.open(profileScore, {position: 'end', backdrop: 'static'});
    }

    getPersonalInfo() {
        this.apiService.get('user/personal_info').subscribe((res) => {
                this.personalInfo = res.data;
            }
        );
    }

    getBusinessInfo() {
        this.apiService.get('user/business_info').subscribe((res) => {
                this.businessInfo = res.data;
            }
        );
    }

    verifyGst() {
        if (this.gstin == '' || this.gstin == null) {
            this.toastr.warning('Gst No is Required.')
        } else {
            this.loading = true;
            this.apiService.post('cashfree/gst_verification', {gstin: this.gstin}).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.businessData.GSTIN = res.data.GSTIN;
                    this.businessData.principal_place_address = res.data.principal_place_address;
                    this.businessData.constitution_of_business = res.data.constitution_of_business;
                    this.businessData.legal_name_of_business = res.data.legal_name_of_business;
                    this.businessData.center_jurisdiction = res.data.center_jurisdiction;
                    this.businessData.date_of_registration = res.data.date_of_registration;
                    this.businessData.gst_in_status = res.data.gst_in_status;
                    this.businessData.taxpayer_type = res.data.taxpayer_type;
                    this.businessData.principal_place_address = res.data.principal_place_address;
                    this.businessData.remark = res.data.message;
                    this.businessData.nature_of_business_activities = res.data.nature_of_business_activities[0];
                    this.businessData.valid = res.data.valid;
                    this.gstExist = true;
                    this.loading = false;
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.loading = false;
                }
            });
        }
    }

    updateBusnissInfo() {
        this.nonGstData.business_name = this.businessData.legal_name_of_business;
        this.nonGstData.gstin = this.businessData.GSTIN;
        this.nonGstData.business_address = this.businessData.principal_place_address;
        this.nonGstData.taxpayer_type = this.businessData.taxpayer_type;
        this.nonGstData.gst_in_status = this.businessData.gst_in_status;
        this.nonGstData.constitution_category = this.businessData.constitution_of_business;
        this.nonGstData.reg_date = this.businessData.date_of_registration;
        this.nonGstData.jurisdiction = this.businessData.center_jurisdiction;
        this.nonGstData.nature_of_business = this.businessData.nature_of_business_activities;
        this.nonGstData.remark = this.businessData.remark;
        this.spinner.show();
        this.apiService.post('user/update_gst_detail', this.nonGstData).subscribe({
            next: (res) => {
                this.gstExist = false;
                this.offCanvas.dismiss();
                this.getPersonalInfo();
                this.getBusinessInfo();
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    updateNonGst() {
        if (this.nonGstData.business_name == '') {
            this.toastr.warning('Business name is required.')
        } else if (this.nonGstData.business_address == '') {
            this.toastr.warning('Business address is required.')
        } else {
            this.spinner.show();
            this.apiService.post('user/update_gst_detail', this.nonGstData).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.getPersonalInfo();
                    this.getBusinessInfo();
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }

    verifyBank() {
        if (this.mode == 'BANK' && this.bankData.account_no == '') {
            this.invalidBank = true;
            return;
        } else {
            this.invalidBank = false;
        }

        if (this.mode == 'BANK' && this.bankData.account_type == '') {
            this.invalidacType = true;
            return;
        } else {
            this.invalidacType = false;
        }

        if (this.mode == 'BANK' && this.bankData.ifsc_code == '') {
            this.invalidIfsc = true;
            return;
        } else {
            this.invalidIfsc = false;
        }

        if (this.mode == 'UPI' && this.upiData.vpa == '') {
            this.invalidUpi = true;
            return;
        } else {
            this.invalidUpi = false;
        }

        this.spinner.show();
        if (this.mode == 'BANK') {
            this.apiService.post('cashfree/account_verification', this.bankData).subscribe({
                next: (res) => {
                    this.bankDetails.accountStatus = res.data.accountStatus;
                    this.bankDetails.bankName = res.data.data.bankName;
                    this.bankDetails.branch = res.data.data.branch;
                    this.bankDetails.city = res.data.data.city;
                    this.bankDetails.utr = res.data.data.utr;
                    this.bankDetails.name = res.data.data.nameAtBank;
                    this.bankorupiExist = true;
                    this.toastr.success(res.message);
                    this.spinner.hide();
                }, error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        } else {
            this.apiService.post('cashfree/upi_verification', this.upiData).subscribe({
                next: (res) => {
                    this.upiDetails.status = res.data.status;
                    this.upiDetails.name = res.data.data.nameAtBank;
                    this.upiDetails.accountExist = res.data.data.accountExists;
                    this.bankorupiExist = true;
                    this.toastr.success(res.message);
                    this.spinner.hide();
                }, error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }

    updateBank() {
        this.bankUpdateData.bank_name = this.bankDetails.bankName;
        this.bankUpdateData.branch = this.bankDetails.branch;
        this.bankUpdateData.beneficiary_name = this.bankDetails.name;
        this.bankUpdateData.verification_mode = this.mode;
        this.bankUpdateData.account_status = this.bankDetails.accountStatus;
        this.bankUpdateData.account_no = this.bankData.account_no;
        this.bankUpdateData.account_type = this.bankData.account_type;
        this.bankUpdateData.ifsc_code = this.bankData.ifsc_code;
        this.spinner.show();
        this.apiService.post('user_bank/add_bank', this.bankUpdateData).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.spinner.hide();
                this.offCanvas.dismiss();
                this.bankList();
            }, error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    bankList() {
        this.apiService.get('user_bank/list').subscribe(res => {
                this.banks = res.data;
            }
        );
    }

    setToDefault(id: number) {
        this.messageService.confirm('Set As Default!', 'Are You Sure to Set This Bank as Default?').then(
            value => {
                if (value.isConfirmed) {
                    this.spinner.show();
                    this.apiService.post('user_bank/set_default_bank', {bank_id: id}).subscribe({
                        next: (res) => {
                            this.toastr.success(res.message);
                            this.spinner.hide();
                            this.bankList();
                        }, error: (error) => {
                            this.toastr.error(error.error.error);
                            this.spinner.hide();
                        }
                    });
                }
            }
        );
    }

    updateUpi() {
        // this.spinner.show();
    }

}
