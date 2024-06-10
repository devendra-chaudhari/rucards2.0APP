import {Component, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiService} from "../../shared/services/api.service";
import {CountdownComponent, CountdownEvent} from "ngx-countdown";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
    @ViewChild('cd', {static: false}) private countdown: CountdownComponent;
    config = {leftTime: 60};
    isSubmitted = false;
    needOtp = false;
    resendOtp = false;
    mobile = '';
    requiredMobile = false;
    invalidMobile = false;
    userFound = false;
    otp_msg = '';
    otp_ref_id = '';

    usernameData: { username: string }[] = [];

    forgotPasswordForm = new UntypedFormGroup({
        username: new UntypedFormControl('', [Validators.required])
    });

    otpData = {
        username: '',
        otp: '',
        ref_id: ''
    }

    constructor(
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private apiService: ApiService,
        private modalService: NgbModal
    ) {
    }

    get ff() {
        return this.forgotPasswordForm.controls;
    }

    handleEvent($event: CountdownEvent) {
        if ($event.status === 3) {
            this.resendOtp = false;
            this.countdown.stop();
        }
    }

    resendMobileOtp() {
        this.spinner.show();
        this.apiService.post('auth/forgot_password', this.forgotPasswordForm.value).subscribe({
            next: (res) => {
                this.otp_msg = res.message;
                this.otp_ref_id = res.data.ref_id;
                this.resendOtp = true;
                this.otpData.otp = '';
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    getUsers() {
        if (this.mobile == '') {
            this.requiredMobile = true;
            this.invalidMobile = false;
            return;
        } else if (!this.mobile.match('^[6789]\\d{9}$')) {
            this.invalidMobile = true;
            this.requiredMobile = false;
            return;
        } else {
            this.requiredMobile = false;
            this.invalidMobile = false;
            this.spinner.show();
            this.apiService.post('auth/get_usernames_by_mobile', {mobile: this.mobile}).subscribe({
                next: (res) => {
                    this.usernameData = res.data;
                    this.userFound = true;
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }

    submit() {
        this.isSubmitted = true;
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.spinner.show();
        this.apiService.post('auth/forgot_password', this.forgotPasswordForm.value).subscribe({
            next: (res) => {
                this.otp_msg = res.message;
                this.otp_ref_id = res.data.ref_id;
                this.needOtp = true;
                this.resendOtp = true;
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    verifyOtp() {
        this.spinner.show();
        this.otpData.username = this.ff['username'].value;
        this.otpData.ref_id = this.otp_ref_id;
        this.apiService.post('auth/verify_forgot_password', this.otpData).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.needOtp = false;
                this.userFound = false;
                this.modalService.dismissAll();
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

}
