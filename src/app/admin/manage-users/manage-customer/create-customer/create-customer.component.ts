import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../../../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {UidaiService} from "../../../../shared/services/uidai.service";
import {CountdownComponent, CountdownEvent} from "ngx-countdown";
import * as moment from "moment/moment";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";


@Component({
    selector: 'app-create-customer',
    templateUrl: './create-customer.component.html'
})
export class CreateCustomerComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    year: number = new Date().getFullYear();
    maxDate = moment().subtract(18, 'years').toDate();
    navigate_url = ''
    title = ''
    showPassword: boolean = false;

    //customer registration
    showConfirmPassword: boolean = false;
    customer_confirm_password: string = null;
    customer_password: string = null;

    //customer
    customerCurrentStep = 1;
    isCustomerSubmit = false;
    customer_terms = true;
    isPincodeData = false;
    state = '';
    state_name = '';
    district = '';

    //customer form
    customerForm = new UntypedFormGroup({
        name: new UntypedFormControl('', [Validators.required]),
        father_name: new UntypedFormControl('', [Validators.required]),
        mobile_no: new UntypedFormControl('', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]),
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        pan_no: new UntypedFormControl(''),
        aadhaar_no: new UntypedFormControl(''),
        dob: new UntypedFormControl('', [Validators.required]),
        gender: new UntypedFormControl('', [Validators.required]),
        state: new UntypedFormControl('', [Validators.required]),
        district: new UntypedFormControl('', [Validators.required]),
        city: new UntypedFormControl('', [Validators.required]),
        pincode: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
        address: new UntypedFormControl('', [Validators.required])
    });

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private apiService: ApiService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            console.log(params['user_type'])
            this.title = params['user_type'];
          })
    }

    get sf() {
        return this.customerForm.controls;
    }


    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
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
                    this.toastr.error('User Already Exist.');
                } else {
                    this.customerCurrentStep = 2;
                }
            }
        });
    }


    changeCustomerDetails() {
        this.customerCurrentStep = 1;
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
            dob: this.sf['dob'].value,
            gender: this.sf['gender'].value,
            state: this.sf['state'].value,
            district: this.sf['district'].value,
            city: this.sf['city'].value,
            pincode: this.sf['pincode'].value,
            address: this.sf['address'].value,
            role: this.title,
            password: this.customer_password,
            confirm_password: this.customer_confirm_password,
        }
        if (this.title === 'Customer'){
            this.navigate_url = '/admin/manage-users/manage-customer'
        }
        if (this.title === 'Retailer'){
            this.navigate_url = '/admin/manage-users/manage-retailer'
        }
        
        if (data.password == '' || data.password == null) {
            this.toastr.warning('Enter Password')
            return;
        } else if (data.confirm_password == '' || data.confirm_password == null) {
            this.toastr.warning('Enter Confirm Password')
            return;
        } else if (data.password != data.confirm_password) {
            this.toastr.warning('Password and Confirm Password Not Match')
            return;
        } else if (data.password.length < 8) {
            this.toastr.warning('Password must be 8 Character Long.')
            return;
        } else {
            this.spinner.show();
            this.apiService.post('user/create_user_by_admin', data).subscribe({
                next: (res) => {
                    this.customerForm.reset();
                    this.isCustomerSubmit = false;
                    this.toastr.success(res.message);
                    this.router.navigateByUrl(this.navigate_url)
                    this.spinner.hide();

                }, error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }
}
