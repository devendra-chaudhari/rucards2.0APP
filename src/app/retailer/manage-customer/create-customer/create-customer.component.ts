import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe, formatDate} from "@angular/common";
import {ApiService} from "../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UidaiService} from "../../../shared/services/uidai.service";
import {CountdownComponent, CountdownEvent} from "ngx-countdown";
import {Router} from "@angular/router";

@Component({
    selector: 'app-create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    maxDob: string;
    isFormSubmitted = false;
    @ViewChild('cd', {static: false}) private countdown: CountdownComponent;
    config = {leftTime: 60};
    step: number = 1;

    confirmed: boolean = false;
    mobile_otp: string = null;
    terms: boolean = false;
    resendCustomerMobileOTP: boolean = false;
    otp_msg: string;


    customerForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        father_name: ['', [Validators.required, Validators.minLength(3)]],
        dob: [null, Validators.required],
        gender: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile_no: [null, [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
        pan: ['', [this.panValidator, Validators.required]],
        aadhaar_no: ['', [this.aadhaarValidator]],
        state: [null, Validators.required],
        district: [null, Validators.required],
        city: [null, Validators.required],
        pincode: [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        address: [null, [Validators.required, Validators.minLength(10)]],
        ref_id: [null],
        otp: [null]
    });

    panValidator(control: AbstractControl): { [key: string]: any } | null {
        const value = control.value;
        if (value && !/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(value)) {
            return {invalidPan: true};
        }
        return null;
    }

    aadhaarValidator(control: AbstractControl): { [key: string]: any } | null {
        const value = control.value;
        if (value && !/^[0-9]{12}$/.test(value)) {
            return {invalidAadhaar: true};
        }
        return null;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.customerForm.get(fieldName);
        return field?.invalid && field?.touched;
    }


    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private uidaiService: UidaiService,
        private toasterService: ToastrService,
        private spinner: NgxSpinnerService,
        private dp: DatePipe,
        private router: Router
    ) {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 18);
        this.maxDob = formatDate(maxDate, 'yyyy-MM-dd', 'en');
    }

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Manage Customer'},
            {label: 'Create Customer', active: true}
        ];

    }

    get cf() {
        return this.customerForm.controls;
    }

    onGetPincodeDetail() {
        if (this.cf['pincode'].value && this.cf['pincode'].value.length == 6) {
            this.spinner.show();
            this.apiService.post('auth/get_pincode_detail', {pincode: this.cf['pincode'].value}).subscribe({
                next: (res) => {
                    if (res.data[0].Status == 'Success') {
                        this.cf['state'].setValue(res.data[0].PostOffice[0].State);
                        this.cf['district'].setValue(res.data[0].PostOffice[0].District);
                    } else {
                        this.cf['state'].setValue(null);
                        this.cf['district'].setValue(null);
                    }
                    this.spinner.hide();
                },
                error: () => {
                    this.cf['state'].setValue(null);
                    this.cf['district'].setValue(null);
                    this.spinner.hide();

                }
            });
        }
    }

    onStep1Submit() {
        this.isFormSubmitted = true;
        if (this.customerForm.invalid) {
            this.customerForm.markAsUntouched();
            return;
        } else {
            this.step = 2;
        }
    }

    onFinalSubmit() {
        this.spinner.show();

        const customer_data = {
            "name": this.cf['name'].value,
            "father_name": this.cf['father_name'].value,
            "dob": this.dp.transform(this.cf['dob'].value, 'yyyy-MM-dd'),
            "gender": this.cf['gender'].value,
            "email": this.cf['email'].value,
            "mobile_no": this.cf['mobile_no'].value,
            "pan": this.cf['pan'].value,
            "aadhaar_no": this.cf['aadhaar_no'].value,
            "state": this.cf['state'].value,
            "district": this.cf['district'].value,
            "city": this.cf['city'].value,
            "pincode": this.cf['pincode'].value,
            "address": this.cf['address'].value,
            "otp": this.mobile_otp,
            "ref_id": this.cf['ref_id'].value,
            "role": "customer"

        };
        this.spinner.show(undefined,
            {
                type: 'ball-triangle-path',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('user/create_customer_user', customer_data).subscribe({
            next: (res) => {
                this.customerForm.reset();
                this.toasterService.success(res.message);
                this.spinner.hide();
                this.router.navigateByUrl('/retailer/manage-customers');
            }, error: (error) => {
                this.step = 2;
                this.toasterService.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }


    onConfirmedDetails() {
        const data = {
            mobile: this.cf['mobile_no'].value,
            email: this.cf['email'].value,
            pan: this.cf['pan'].value,
            aadhaar: this.cf['aadhaar_no'].value,
            user_type: 'customer'
        }
        this.spinner.show(undefined,
            {
                type: 'ball-triangle-path',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('auth/check_user_exist', data).subscribe({
            next: (res) => {
                if (res.data.user_found) {
                    this.toasterService.error('Customer Already Exist.');
                    this.spinner.hide();
                    return;
                } else {
                    this.apiService.post('auth/generate_register_otp', {
                        mobile: this.cf['mobile_no'].value
                    }).subscribe({
                        next: (res) => {
                            this.cf['ref_id'].setValue(res.data.ref_id);
                            this.cf['otp'].setValue('');
                            this.otp_msg = res.message;
                            this.resendCustomerMobileOTP = true;
                            this.step = 2;
                            this.confirmed = true;
                            this.spinner.hide();
                        },
                        error: (error) => {
                            this.toasterService.error(error.error.error);
                            this.spinner.hide();
                        }
                    });


                }
            }
        });


    }

    handleEvent($event: CountdownEvent) {
        if ($event.status === 3) {
            this.resendCustomerMobileOTP = false;
            this.countdown.stop();
        }
    }

    resendMobileOtp() {
        this.spinner.show(undefined,
            {
                type: 'ball-triangle-path',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('auth/generate_register_otp', {mobile: this.cf['mobile_no'].value}).subscribe({

            next: (res) => {
                this.cf['ref_id'].setValue(res.data.ref_id);
                this.cf['otp'].setValue('');
                this.otp_msg = res.message;
                this.resendCustomerMobileOTP = true;
                this.spinner.hide();
            },
            error: (error) => {
                this.toasterService.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }
}
