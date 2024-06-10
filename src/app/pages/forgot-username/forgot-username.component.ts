import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiService} from "../../shared/services/api.service";
import {Clipboard} from "@angular/cdk/clipboard";

@Component({
    selector: 'app-forgot-username',
    templateUrl: './forgot-username.component.html'
})
export class ForgotUsernameComponent {
    isSubmitted = false;
    usernameFound = false;
    usernameData: { username: string }[] = [];

    forgotUsernameForm = new UntypedFormGroup({
        email: new UntypedFormControl('', [Validators.required, Validators.email]),
        mobile: new UntypedFormControl('', [Validators.required, Validators.pattern('^[6789]\\d{9}$')])
    });

    constructor(
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private apiService: ApiService,
        private copyToClipBoard: Clipboard
    ) {
    }

    get fu() {
        return this.forgotUsernameForm.controls;
    }

    submit() {
        this.isSubmitted = true;
        if (this.forgotUsernameForm.invalid) {
            return;
        }

        this.spinner.show();
        this.apiService.post('auth/forgot_username', this.forgotUsernameForm.value).subscribe({
            next: (res) => {
                this.usernameData = res.data;
                this.usernameFound = true;
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    copyUsername(username) {
        this.copyToClipBoard.copy(username);
        this.toastr.success('Copied');
    }

}
