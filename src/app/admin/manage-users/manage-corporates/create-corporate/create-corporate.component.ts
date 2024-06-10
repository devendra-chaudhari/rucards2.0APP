import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiService} from "../../../../shared/services/api.service";

interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}

@Component({
    selector: 'app-create-corporate',
    templateUrl: './create-corporate.component.html'
})
export class CreateCorporateComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    registrationForm: FormGroup;
    submitted = false;
    step: number = 1;
    isPincodeData: boolean = false;


    constructor(private fb: FormBuilder,
                private router: Router,
                private toastr: ToastrService,
                private spinner: NgxSpinnerService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Manage Users'},
            {label: 'Create Corporate', active: true}
        ];
        this.createRegistrationForm();

    }

    createRegistrationForm() {
        this.registrationForm = this.fb.group({
            role_id: ['', Validators.required],
            name: ['', Validators.required],
            father_name: ['', Validators.required],
            mobile_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            email: ['', [Validators.email]],
            dob: ['', Validators.required],
            gender: ['', Validators.required],
            aadhaar_no: [''],
            pan: [''],
            pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
            state: ['', Validators.required],
            district: ['', Validators.required],
            city: ['', Validators.required],
            address: ['', Validators.required],
        });
    }

    get rf() {
        return this.registrationForm.controls;
    }


    onSubmit() {

        this.spinner.show(undefined,
            {
                type: 'ball-triangle-path',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });

        this.submitted = true;
        if (this.registrationForm.invalid) {
            this.toastr.error('Notification', 'Fill Required information');
            this.spinner.hide();
            return;
        }
        if (this.registrationForm.valid) {
            this.apiService.post('user/create_corporate_user', this.registrationForm.value).subscribe({
                next: (res) => {
                    this.spinner.hide();
                    this.toastr.success(res.message);
                    this.router.navigateByUrl('/admin/manage-users/manage-corporates');
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }


    onPincode() {
        const pincode = this.rf['pincode'].value;
        if (pincode.length == 6) {
            this.spinner.show();
            this.apiService.post('auth/get_pincode_detail', {pincode: pincode}).subscribe({
                next: (res) => {
                    if (res.data[0].Status == 'Success') {
                        this.rf['state'].setValue(res.data[0].PostOffice[0].State);
                        this.rf['district'].setValue(res.data[0].PostOffice[0].District);
                        this.isPincodeData = false;
                        this.spinner.hide();
                    } else {
                        this.isPincodeData = true;
                        this.rf['state'].setValue('');
                        this.rf['district'].setValue('');
                    }
                    this.spinner.hide();

                },
                error: () => {
                    this.isPincodeData = true;
                    this.rf['state'].setValue('');
                    this.rf['district'].setValue('');
                    this.spinner.hide();
                }
            });
        }
    }


}
