import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {CountdownComponent, CountdownEvent} from "ngx-countdown";

import {NgbModule, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule, DatePipe} from "@angular/common";
import { SharedModule } from 'src/app/shared/shared.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ApiService } from 'src/app/shared/services/api.service';
import { PagesRoutingModule } from 'src/app/pages/pages-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { UidaiService } from 'src/app/shared/services/uidai.service';
import { SanitizeService } from 'src/app/shared/services/sanitize.service';
import { AadhaarCard, AadhaarCardData, PanCardData, RetailerData } from 'src/app/pages/register/register-models';


@Component({
  selector: 'app-create-retailer',
  standalone: true,
  imports: [CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    CountdownComponent,
    NgOtpInputModule,
    NgxSpinnerModule,
    UiSwitchModule,
    CarouselModule,
    SimplebarAngularModule
],
providers: [DatePipe],
schemas: [CUSTOM_ELEMENTS_SCHEMA],
    
  templateUrl: './create-retailer.component.html',
  styleUrl: './create-retailer.component.scss'
})
export class CreateRetailerComponent implements OnInit {
    year: number = new Date().getFullYear();
    @ViewChild('cd', {static: false}) private countdown: CountdownComponent;
    config = {leftTime: 60};
    role = 'retailer';
    otp_msg = '';
    otp_ref_id = '';
    maxDate = new Date();


    //retailer
    needRetailerMobileOtp = false;
    resendRetailerMobileOTP = false;
    resendAadharOtp = false;
    retailerCurrentStep = 1;
    isRetailerSubmit = false;
    panVerified = false;
    aadhaarVerified = false;
    aadhaarExists = false;
    retailer_terms = false;
    retailer_mobile_otp = '';
    ref_id = '';
    showPassword: boolean = false;


    //customer registration
    showConfirmPassword: boolean = false;
    customer_confirm_password: string = null;
    customer_password: string = null;
    panCardData: PanCardData = {
        pan_no: '',
        name: '',
        aadhaar_seeding: '',
        category: '',
        valid: false
    }

    aadhaarCardData: AadhaarCardData | undefined;
    retailerData: RetailerData = {
        name: '',
        father_name: '',
        mobile_no: '',
        email: '',
        pan_no: '',
        aadhaar_no: '',
        dob: '',
        gender: '',
        state: '',
        district: '',
        city: '',
        pincode: '',
        role: '',
        address: '',
        otp: '',
        ref_id: '',
    };

    //customer
    otp = '';
    needCustomerMobileOtp = false;
    resendCustomerMobileOTP = false;
    customerCurrentStep = 1;
    isCustomerSubmit = false;
    customer_terms = false;
    customer_mobile_otp = '';
    isPincodeData = false;
    state = '';
    state_name = '';
    district = '';


    //retailer form
    retailerForm: FormGroup = new FormGroup({
        pan: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$')]),
        aadhaar: new FormControl('', [Validators.required]),
        mobile: new FormControl('', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]),
        email: new FormControl('', [Validators.required, Validators.email])
    });

    //customer form
    customerForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        father_name: new FormControl('', [Validators.required]),
        mobile_no: new FormControl('', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]),
        email: new FormControl('', [Validators.required, Validators.email]),
        role: new FormControl(''),
        otp: new FormControl(''),
        ref_id: new FormControl(''),
        pan_no: new FormControl(''),
        aadhaar_no: new FormControl(''),
        dob: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        pincode: new FormControl('', [Validators.required, Validators.minLength(6)]),
        address: new FormControl('', [Validators.required])
    });


    private toaster = inject(ToastrService)
    private spinner = inject(NgxSpinnerService)
    private apiService = inject(ApiService)
    private offCanvas = inject(NgbOffcanvas)
    private uidai = inject(UidaiService,)
    private sanitiseService = inject(SanitizeService,)
    private dp = inject(DatePipe)


    ngOnInit() {
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
    }

    get ff() {
        return this.retailerForm.controls;
    }

    get sf() {
        return this.customerForm.controls;
    }

    handleEvent($event: CountdownEvent) {
        if ($event.status === 3) {
            this.resendRetailerMobileOTP = false;
            this.resendAadharOtp = false;
            this.resendCustomerMobileOTP = false;
            this.countdown.stop();
        }
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }


    openPan(panContent: TemplateRef<any>) {
        this.offCanvas.open(panContent, {position: 'end', backdrop: 'static'});
    }

    openAadhaar(aadhaarContent: TemplateRef<any>) {
        this.offCanvas.open(aadhaarContent, {position: 'end', backdrop: 'static'})
        this.resendAadharOtp = true;
    }

    verifyPan(panContent: TemplateRef<any>) {
        const pan_no: string = this.sanitiseService.sanitizeText(this.ff['pan'].value).toUpperCase();
        if (!this.validatePanNumber(pan_no)) {
            this.toaster.error('Invalid Pan Card No');
            return;
        }
        this.apiService.post('cashfree/pan', {pan: pan_no}).subscribe({
            next: (res) => {
                this.panCardData.pan_no = res.data.pan;
                this.panCardData.name = res.data.name_pan_card;
                this.panCardData.aadhaar_seeding = res.data.aadhaar_seeding_status;
                this.panCardData.category = res.data.type;
                this.panCardData.valid = res.data.valid;
                this.panVerified = this.panCardData.valid;
                this.openPan(panContent);
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }

    verifyAadhaar(aadhaarContent: TemplateRef<any>) {
        if (!this.uidai.isValidUidaiNumber(this.ff['aadhaar'].value)) {
            this.toaster.warning('Invalid Aadhaar No')
        } else {
            this.spinner.show();
            this.apiService.post('cashfree/check_aadhaar_status', {aadhaar_number: this.ff['aadhaar'].value}).subscribe({
                next: (res) => {
                    if (res.message == 'NA') {
                        this.apiService.post('cashfree/aadhaar_generate_otp', {aadhaar_number: this.ff['aadhaar'].value}).subscribe({
                            next: (res) => {
                                this.ref_id = res.data.ref_id;
                                this.openAadhaar(aadhaarContent);
                                this.spinner.hide();
                            },
                            error: (error) => {
                                this.toaster.error(error.error.error);
                                this.spinner.hide();
                            }
                        });
                    } else {
                        this.aadhaarCardData = res
                        this.aadhaarExists = true;
                        this.openAadhaar(aadhaarContent);
                        this.aadhaarVerified = this.aadhaarCardData.data.status == 'VALID';
                        this.spinner.hide();

                    }
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toaster.error(error.error.error);
                    this.spinner.hide();

                }, complete: () => {
                    this.spinner.hide();
                }
            });
        }
    }

    verifyAadhaarOtp() {
        this.spinner.show();
        this.apiService.post('cashfree/validate_aadhaar_otp', {
            ref_id: this.ref_id, aadhaar_number: this.ff['aadhaar'].value, otp: this.otp
        }).subscribe({

            next: (res: any) => {
                this.aadhaarCardData = res.data
                this.aadhaarExists = true;
                this.aadhaarVerified = this.aadhaarCardData.data.status == 'VALID';
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }

    resendAadhaarOtp() {
        this.spinner.show();
        this.apiService.post('cashfree/aadhaar_generate_otp', {aadhaar_number: this.ff['aadhaar'].value}).subscribe({
            next: (res) => {
                this.ref_id = res.data.ref_id;
                this.otp = '';
                this.resendAadharOtp = true;
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }

    onStepOne() {
        this.isRetailerSubmit = true;
        if (this.retailerForm.invalid) {
            return;
        }

        if (!this.panVerified) {
            this.toaster.warning('Please Verify Your Pan No');
        } else if (!this.aadhaarVerified) {
            this.toaster.warning('Please Verify Your Aadhaar No')
        } else {
            const data = {
                mobile: this.ff['mobile'].value,
                email: this.ff['email'].value,
                pan: this.ff['pan'].value,
                aadhaar: this.ff['aadhaar'].value,
                user_type: 'retailer'
            }
            this.apiService.post('auth/check_user_exist', data).subscribe({
                next: (res) => {
                    if (res.data.user_found) {
                        this.toaster.error('User Already Exist.');
                    } else {
                        this.retailerCurrentStep = 2;
                    }
                }
            });
        }
    }

    confirmTerm() {
        this.apiService.post('auth/generate_register_otp', {mobile: this.ff['mobile'].value}).subscribe({
            next: (res) => {
                this.otp_msg = res.message;
                this.otp_ref_id = res.data.ref_id;
                this.needRetailerMobileOtp = true;
                this.resendRetailerMobileOTP = true;
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }
        });
    }

    resendMobileOtp() {
        this.spinner.show();
        this.apiService.post('auth/generate_register_otp', {mobile: this.ff['mobile'].value}).subscribe({
            next: (res) => {
                this.otp_msg = res.message;
                this.otp_ref_id = res.data.ref_id;
                this.retailer_mobile_otp = '';
                this.resendRetailerMobileOTP = true;
                this.spinner.hide();

            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();

            },
            complete: () => {
                this.spinner.hide();
            }
        });
    }

    goBack() {
        this.needRetailerMobileOtp = false;
        this.retailer_mobile_otp = '';
        this.retailerCurrentStep = 1;
    }

    registerRetailer() {
        const dateParts = this.aadhaarCardData.data.dob.split('-');
        const newDate = new Date(Number(dateParts[2]), Number(dateParts[1]), Number(dateParts[0]));
        this.retailerData.name = 'Rajesh Kumar Saini';
        this.retailerData.father_name = 'C/o Hari Ram Saini';
        // this.retailerData.name = this.aadhaarCardData.data.name;
        // this.retailerData.father_name = this.aadhaarCardData.data.care_of;
        this.retailerData.mobile_no = this.ff['mobile'].value;
        this.retailerData.pan_no = this.ff['pan'].value.toUpperCase();
        this.retailerData.aadhaar_no = this.ff['aadhaar'].value;
        this.retailerData.email = this.ff['email'].value;
        this.retailerData.dob = this.dp.transform(newDate, 'yyyy-MM-dd');
        if (this.aadhaarCardData.data.gender == 'M') {
            this.retailerData.gender = 'Male';
        } else if (this.aadhaarCardData.data.gender == 'F') {
            this.retailerData.gender = 'Female';
        }
        this.retailerData.state = this.aadhaarCardData.data.split_address.state;
        this.retailerData.district = this.aadhaarCardData.data.split_address.dist;
        this.retailerData.city = this.aadhaarCardData.data.split_address.subdist + this.aadhaarCardData.data.split_address.vtc + this.aadhaarCardData.data.split_address.street + this.aadhaarCardData.data.split_address.landmark;
        this.retailerData.pincode = this.aadhaarCardData.data.split_address.pincode;
        this.retailerData.address = this.aadhaarCardData.data.address;
        this.retailerData.role = this.role;
        this.retailerData.otp = this.retailer_mobile_otp;
        this.retailerData.ref_id = this.otp_ref_id;

        this.spinner.show();


        this.apiService.post('auth/signup', this.retailerData).subscribe({
            next: (res) => {
                this.retailerForm.reset();
                this.isRetailerSubmit = false;
                this.retailerCurrentStep = 3;
                this.toaster.success(res.message);
                this.spinner.hide();

            }, error: (error) => {
                this.retailerCurrentStep = 2;
                this.toaster.error(error.error.error);
                this.spinner.hide();

            }
        });
    }


    onPincode(pincode) {
        if (pincode.length == 6) {
            this.spinner.show();
            this.apiService.post('auth/get_pincode_detail', {pincode: pincode}).subscribe({
                next: (res) => {
                    if (res.data[0].Status == 'Success') {
                        this.state = res.data[0].PostOffice[0].State;
                        this.district = res.data[0].PostOffice[0].District;
                        this.sf['state'].setValue(this.state);
                        this.sf['district'].setValue(this.district);
                        this.isPincodeData = false;
                    } else {
                        this.isPincodeData = true;
                        this.sf['state'].setValue('');
                        this.sf['district'].setValue('');
                    }
                    this.spinner.hide();

                },
                error: () => {
                    this.isPincodeData = true;
                    this.sf['state'].setValue('');
                    this.sf['district'].setValue('');
                    this.spinner.hide();

                }
            });
        }
    }


    onCustomerStepOne() {
        this.isCustomerSubmit = true;
        if (this.customerForm.invalid) {
            return;
        }
        if (this.isPincodeData) {
            this.state_name = this.sf['state'].value;
        }
        const data = {
            mobile: this.sf['mobile_no'].value,
            email: this.sf['email'].value,
            user_type: 'customer'
        }
        this.apiService.post('auth/check_user_exist', data).subscribe({
            next: (res) => {
                if (res.data.user_found) {
                    this.toaster.error('User Already Exist.');
                } else {
                    this.customerCurrentStep = 2;
                }
            }
        });
    }

    validateCustomerRegistration() {
        const data = {
            password: this.customer_password,
            confirm_password: this.customer_confirm_password,
        }
        if (data.password == '' || data.password == null) {
            this.toaster.warning('Enter Password')
            return;
        } else if (data.confirm_password == '' || data.confirm_password == null) {
            this.toaster.warning('Enter Confirm Password')
            return;
        } else if (data.password != data.confirm_password) {
            this.toaster.warning('Password and Confirm Password Not Match')
            return;
        } else if (data.password.length < 8) {
            this.toaster.warning('Password must be 8 Character Long.')
            return;
        } else {
            this.apiService.post('auth/generate_register_otp', {
                mobile: this.sf['mobile_no'].value

            }).subscribe({
                next: (res) => {
                    this.otp_msg = res.message;
                    this.otp_ref_id = res.data.ref_id;
                    this.needCustomerMobileOtp = true;
                    this.resendCustomerMobileOTP = true;
                },
                error: (error) => {
                    this.toaster.error(error.error.error);
                }
            });
        }
    }

    resendCustomerMobileOtp() {
        this.spinner.show();
        this.apiService.post('auth/generate_register_otp', {mobile: this.sf['mobile_no'].value}).subscribe({
            next: (res) => {
                this.otp_msg = res.message;
                this.otp_ref_id = res.data.ref_id;
                this.customer_mobile_otp = '';
                this.spinner.hide();

                this.resendCustomerMobileOTP = true;
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    changeCustomerDetails() {
        this.needCustomerMobileOtp = false;
        this.customer_mobile_otp = '';
        this.customerCurrentStep = 2;
    }

    registerCustomer() {
        if (this.isPincodeData) {
            const stateName = this.sf['state'].value;
            this.sf['state'].setValue(stateName);
        }
        const data = {
            name: this.sf['name'].value,
            father_name: this.sf['father_name'].value,
            mobile_no: this.sf['mobile_no'].value,
            email: this.sf['email'].value,
            otp: this.customer_mobile_otp,
            ref_id: this.otp_ref_id,
            dob: this.sf['dob'].value,
            gender: this.sf['gender'].value,
            state: this.sf['state'].value,
            district: this.sf['district'].value,
            city: this.sf['city'].value,
            pincode: this.sf['pincode'].value,
            address: this.sf['address'].value,
            role: this.role,
            password: this.customer_password,
            confirm_password: this.customer_confirm_password,
        }
        if (data.password == '' || data.password == null) {
            this.toaster.warning('Enter Password')
            return;
        } else if (data.confirm_password == '' || data.confirm_password == null) {
            this.toaster.warning('Enter Confirm Password')
            return;
        } else if (data.password != data.confirm_password) {
            this.toaster.warning('Password and Confirm Password Not Match')
            return;
        } else if (data.password.length < 8) {
            this.toaster.warning('Password must be 8 Character Long.')
            return;
        } else {
            this.spinner.show();
            this.apiService.post('auth/signup', data).subscribe({
                next: (res) => {
                    this.customerForm.reset();
                    this.isCustomerSubmit = false;
                    this.customerCurrentStep = 3;
                    this.toaster.success(res.message);
                    this.spinner.hide();

                }, error: (error) => {
                    this.customerCurrentStep = 2;
                    this.toaster.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }

    validatePanNumber(panNo: string): boolean {
        if (panNo.length !== 10) {
            return false;
        }
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        return panRegex.test(panNo);
    }

}
