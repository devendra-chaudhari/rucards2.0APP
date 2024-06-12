import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiService} from "../../shared/services/api.service";
import {AuthService} from "../../shared/services/auth.service";
import {SessionStorageService} from "../../shared/services/session-storage.service";
import {User} from "../../shared/interfaces/user";
import {OwlOptions} from "ngx-owl-carousel-o";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgOtpInputConfig} from "ng-otp-input";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    year: number = new Date().getFullYear();
    isLoginSubmit = false;
    isPasswordSubmit = false;
    oldShowPass = false;
    showPass = false;
    showconfirmPass = false;
    currentStep = 1;
    latitude: string;
    longitude: string;
    deviceId: string = '';
    user: User;
    firstTimeLogin: boolean = false;
    newTpin:string = '';
    confirmTpin:string = '';
    securityUsername:string = '';
    userType:string = 'retailer';

    otpNew: NgOtpInputConfig = {
        allowNumbersOnly: true,
        length: 4,
        disableAutoFocus: true
    }

    otpConfirm: NgOtpInputConfig = {
        allowNumbersOnly: true,
        length: 4,
        isPasswordInput: true,
        disableAutoFocus: true
    }

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 100,
        autoplay: true,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 1
            },
            740: {
                items: 1
            },
            940: {
                items: 1
            }
        },
        nav: false
    }

    loginForm = new UntypedFormGroup({
        username: new UntypedFormControl(''),
        password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)])
    });

    setPasswordForm = new UntypedFormGroup({
        username: new UntypedFormControl(''),
        old_password: new UntypedFormControl('', [Validators.required]),
        new_password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)]),
        confirm_password: new UntypedFormControl('', [Validators.required]),
        user_type: new UntypedFormControl('')
    });
    customer_mobile: string = null;
    customerTin: string = null;
    customerConfirmTpin: string = null;
    marqueeNotification: string = 'Notifications: Welcome to Rucards! Explore our features for budgeting, investments, and more Stay updated with the latest financial news and trends Reach out to our support team for any assistance   Thank you for choosing our Fintech Portal!';

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
        private sessionStorageService: SessionStorageService,
        private authService: AuthService,
        private modalService: NgbModal
    ) {
        if (this.authService.isAuthenticated()) {
            this.user = this.sessionStorageService.getCurrentUser();
            if (this.user.verified) {
                this.router.navigateByUrl(`dashboard/${this.user.role}`);
            } else {
                this.router.navigateByUrl('users/profile');
            }
        }
    }

    ngOnInit(): void {
        this.getLocation();
        this.getDeviceId();
    }

    get lf() {
        return this.loginForm.controls;
    }

    get pf() {
        return this.setPasswordForm.controls;
    }

    onLoginSubmit() {
        this.isLoginSubmit = true;
        if (this.userType == 'customer') {
            this.lf['username'].setValidators([Validators.required, Validators.pattern('^[6789]\\d{9}$')]);
        } else {
            this.lf['username'].setValidators([Validators.required, Validators.pattern('^[A-Z][0][0][0-9]{6}$')]);
        }
        this.lf['username'].updateValueAndValidity();

        if (this.loginForm.invalid) {
            return;
        }

        if (!this.longitude || !this.latitude) {
            this.getLocation();
        } else {
            const data = {
                'channel': "web",
                'device_id': this.deviceId,
                'latitude': this.latitude.toString(),
                'longitude': this.longitude.toString(),
                'password': this.lf['password'].value.trim(),
                'user_type': this.userType,
                'username': this.lf['username'].value.trim()
            }
            this.securityUsername = this.lf['username'].value.trim();

            this.spinner.show(undefined,
                {
                    type: 'ball-scale-multiple',
                    size: 'medium',
                    bdColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    fullScreen: true
                });

            this.apiService.post('auth/login', data).subscribe({
                next: (res) => {
                    this.lf['username'].setValue('');
                    this.lf['password'].setValue('');
                    this.isLoginSubmit = false;
                    if (res.data.first_login) {
                        this.firstTimeLogin = true;
                        this.customer_mobile = data.username
                        this.userType = data.user_type
                        this.currentStep = 1;
                    } else {
                        this.sessionStorageService.setItem('userDetails', res.data);
                        this.sessionStorageService.changeCurrentUserDetail(res.data);
                        this.router.navigateByUrl(`dashboard/${res.data.role}`);
                    }

                    this.spinner.hide();

                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();

                }, complete: () => {
                    this.spinner.hide();
                }
            });
        }
    }

    async getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude.toString();
                    this.longitude = position.coords.longitude.toString();
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            this.toastr.error("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            this.toastr.error("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            this.toastr.error("The request to get user location timed out.");
                            break;
                        default:
                            this.toastr.error("An unknown error occurred.");
                            break;
                    }
                });
        } else {
            this.toastr.error('Geolocation is not supported by this browser.');
        }
    }

    getDeviceId() {
        const fpPromise = FingerprintJS.load();
        (async () => {
            const fp = await fpPromise
            const result = await fp.get()
            this.deviceId = result.visitorId;
        })();
    }

    openUsernameModal(usernameModal: any) {
        this.modalService.open(usernameModal, {centered: true, backdrop: 'static'});
    }

    openPasswordModal(passwordModal: any) {
        this.modalService.open(passwordModal, {centered: true, backdrop: 'static'});
    }

    openChangeLogModal(webContent: any) {
        this.modalService.open(webContent, {centered: true, backdrop: 'static'});
    }

    passwordStepOne() {
        this.isPasswordSubmit = true;
        if (this.setPasswordForm.invalid) {
            return;
        }

        if (this.pf['new_password'].value !== this.pf['confirm_password'].value) {
            this.toastr.warning('Password Not Matched');
        } else {
            this.currentStep = 2;
        }
    }

    onBack() {
        this.firstTimeLogin = false;
        this.setPasswordForm.reset();
        this.isPasswordSubmit = false;
    }

    onsetTpin(otp:string) {
        this.newTpin = otp;
    }

    onConfirmTpin(otp:string) {
        this.confirmTpin = otp;
    }


    onCustomerSetTpin(otp:string) {
        this.customerTin = otp;
    }

    onCustomerConfirmTpin(otp:string) {
        this.customerConfirmTpin = otp;
    }

    updateSecurity() {
        if (this.newTpin !== this.confirmTpin) {
            this.toastr.warning('T-Pin Not Matched')
        } else {
            const tpin = new UntypedFormControl(this.newTpin)
            const confirmTpin = new UntypedFormControl(this.confirmTpin)
            this.setPasswordForm.addControl('new_tpin', tpin);
            this.setPasswordForm.addControl('confirm_tpin', confirmTpin);
            this.pf['username'].setValue(this.securityUsername);
            this.pf['user_type'].setValue(this.userType);
            this.apiService.post('auth/initial_security_setup', this.setPasswordForm.value).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.firstTimeLogin = false;
                    this.lf['username'].setValue('');
                    this.lf['password'].setValue('');
                    this.isLoginSubmit = false;
                    this.currentStep = 0;
                }, error: (error) => {
                    this.toastr.error(error.error.error);
                }
            });
        }
    }

    onUpdateCustomerPinSecurity() {
        const data = {
            username: this.customer_mobile,
            new_pin: this.customerTin,
            confirm_pin: this.customerConfirmTpin,
        }
        this.apiService.post('auth/set_new_pin', data).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.firstTimeLogin = false;
                this.isLoginSubmit = false;
                this.currentStep = 0;
            }, error: (error) => {
                this.toastr.error(error.error.error);
            }
        });
    }
    getLatestNotifications() {
        this.apiService.get('notice/list').subscribe({
            next: (res) => {
               this.marqueeNotification=res.data;
            }
        });
    }

}
