import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiService} from "../../shared/services/api.service";
import {MessageService} from "../../shared/services/message.service";
import {SessionStorageService} from "../../shared/services/session-storage.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-manage-profile',
    templateUrl: './manage-profile.component.html'
})
export class ManageProfileComponent {
    breadCrumbItems!: Array<{}>;

    passwordSubmitted = false;
    tpinSubmitted = false;

    passwordForm = new UntypedFormGroup({
        old_password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)]),
        password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)]),
        confirm_password: new UntypedFormControl('', [Validators.required, Validators.minLength(8)])
    });

    tpinForm = new UntypedFormGroup({
        old_pin: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
        pin: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
        confirm_pin: new UntypedFormControl('', [Validators.required, Validators.minLength(4)])
    });

    constructor(
        private toastr: ToastrService,
        private messageService: MessageService,
        private spinner: NgxSpinnerService,
        private apiService: ApiService,
        private sessionStorage: SessionStorageService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Users'},
            {label: 'Manage Account', active: true}
        ];
    }

    get pf() {
        return this.passwordForm.controls;
    }

    get tf() {
        return this.tpinForm.controls;
    }

    changePass() {
        this.passwordSubmitted = true;
        if (this.passwordForm.invalid) {
            return;
        }

        if (this.pf['old_password'].value == this.pf['password'].value) {
            this.toastr.warning('New password must be different.')
        } else if (this.pf['password'].value != this.pf['confirm_password'].value) {
            this.toastr.warning('Confirm Password Not Match.')
        } else {
            this.spinner.show();
            this.apiService.post('auth/change_password', this.passwordForm.value).subscribe({
                next: (res) => {
                    if (res.success){
                        this.apiService.get('auth/logout', 'delete').subscribe({
                            next: (res) => {
                                this.sessionStorage.logout();
                                this.router.navigateByUrl('login');
                            },
                            error: (error) => {
                                this.sessionStorage.logout();
                                this.router.navigateByUrl('login');
                            }
                        });
                    }

                    this.passwordForm.reset();
                    this.passwordSubmitted = false;
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }

    }

    changeTpin() {
        this.tpinSubmitted = true;
        if (this.tpinForm.invalid) {
            return;
        }

        if (this.tf['old_pin'].value == this.tf['pin'].value) {
            this.toastr.warning('New T-Pin must be different.')
        } else if (this.tf['pin'].value != this.tf['confirm_pin'].value) {
            this.toastr.warning('Confirm T-Pin Not Match.')
        } else {
            this.spinner.show();
            this.apiService.post('auth/change_pin', this.tpinForm.value).subscribe({
                next: (res) => {
                    if (res.success){
                        this.apiService.get('auth/logout', 'delete').subscribe({
                            next: (res) => {
                                this.sessionStorage.logout();
                                this.router.navigateByUrl('login');
                            },
                            error: (error) => {
                                this.sessionStorage.logout();
                                this.router.navigateByUrl('login');
                            }
                        });
                    }
                    this.messageService.success(res.message);
                    this.tpinForm.reset();
                    this.tpinSubmitted = false;
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }

}
