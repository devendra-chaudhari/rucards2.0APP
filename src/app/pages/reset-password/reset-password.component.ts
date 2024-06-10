import {AfterViewInit, Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiService} from "../../shared/services/api.service";
import {OwlOptions} from "ngx-owl-carousel-o";


@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements AfterViewInit {
    year: number = new Date().getFullYear();
    isResetPassSubmit = false;
    showPass = false;
    id = '';

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 1600,
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

    resetPasswordForm = new UntypedFormGroup({
        password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)]),
        confirm_password: new UntypedFormControl('', [Validators.required])
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private apiService: ApiService
    ) {
    }

    get rf() {
        return this.resetPasswordForm.controls;
    }

    ngAfterViewInit() {
        this.route.paramMap.subscribe(params => this.id = params.get('id'));
    }

    submit() {
        this.isResetPassSubmit = true;
        if (this.resetPasswordForm.invalid) {
            return;
        }

        if (this.rf['password'].value !== this.rf['confirm_password'].value) {
            this.toastr.warning('Password not matched.')
        } else {

            this.spinner.show();

            this.apiService.post(`auth/reset_password/${this.id}`, this.resetPasswordForm.value).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.spinner.hide();
                    this.resetPasswordForm.reset();
                    this.isResetPassSubmit = false;
                    this.router.navigateByUrl('login');
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }

}
