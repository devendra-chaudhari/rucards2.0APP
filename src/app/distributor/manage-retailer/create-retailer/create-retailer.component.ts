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

    panCardData: PanCardData = {
        pan_no: '',
        name: '',
        aadhaar_seeding: '',
        category: '',
        valid: false
    }
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
    otp:'';

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

    //retailer form
    retailerForm: FormGroup = new FormGroup({
        pan: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$')]),
        aadhaar: new FormControl('', [Validators.required]),
        mobile: new FormControl('', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]),
        email: new FormControl('', [Validators.required, Validators.email])
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


    handleEvent($event: CountdownEvent) {
        if ($event.status === 3) {
            this.resendRetailerMobileOTP = false;
            this.resendAadharOtp = false;
            this.countdown.stop();
        }
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
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

    validatePanNumber(panNo: string): boolean {
        if (panNo.length !== 10) {
            return false;
        }
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        return panRegex.test(panNo);
    }

}
