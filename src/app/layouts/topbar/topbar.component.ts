import {Component, OnInit, EventEmitter, Output, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {User} from "../../shared/interfaces/user";
import {SessionStorageService} from "../../shared/services/session-storage.service";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {WalletService} from "../../shared/services/wallet.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";

export interface Wallets {
    id: string;
    name: string;
    wallet_status: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    balance: number;
    user_id: string;
    parent_wallet_id: string;
}

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit {
    user: User;
    element: any;
    mode: string | undefined;
    @Output() mobileMenuButtonClicked = new EventEmitter();
    loading_balance = false;
    wallets: Wallets[] = [];

    total_balance = 0

    constructor(
        @Inject(DOCUMENT) private document: any,
        private router: Router,
        private spinner: NgxSpinnerService,
        private apiService: ApiService,
        private sessionStorage: SessionStorageService,
        private toastr: ToastrService,
        private wallet: WalletService,
        private modalService: NgbModal,
    ) {
        this.wallet.getUserWallets().subscribe(res => {
            this.wallets = res.data.result;
        });
    }

    ngOnInit(): void {
        this.element = document.documentElement;
        this.loadBalance();


    }

    navigateToWallet(walletId: string) {
        this.router.navigate(['/manage-balance/add-fund-wallet-transaction'], {
            queryParams: {wallet_id: walletId}
        });

    }

    toggleMobileMenu(event: any) {
        event.preventDefault();
        this.mobileMenuButtonClicked.emit();
    }

    fullscreen() {
        document.body.classList.toggle('fullscreen-enable');
        if (
            !document.fullscreenElement && !this.element.mozFullScreenElement &&
            !this.element.webkitFullscreenElement) {
            if (this.element.requestFullscreen) {
                this.element.requestFullscreen();
            } else if (this.element.mozRequestFullScreen) {
                this.element.mozRequestFullScreen();
            } else if (this.element.webkitRequestFullscreen) {
                this.element.webkitRequestFullscreen();
            } else if (this.element.msRequestFullscreen) {
                this.element.msRequestFullscreen();
            }
        } else {
            if (this.document.exitFullscreen) {
                this.document.exitFullscreen();
            } else if (this.document.mozCancelFullScreen) {
                this.document.mozCancelFullScreen();
            } else if (this.document.webkitExitFullscreen) {
                this.document.webkitExitFullscreen();
            } else if (this.document.msExitFullscreen) {
                this.document.msExitFullscreen();
            }
        }
    }


    loadBalance() {
        this.loading_balance = true;
        this.apiService.get('wallet/get-user-wallet-balance').subscribe({
            next: (res) => {
                this.user = this.sessionStorage.getCurrentUser();
                this.user.wallets = res.data.wallets;
                this.total_balance = this.user.wallets.reduce((total, item) => total + item.balance, 0);
                this.sessionStorage.changeCurrentUserDetail(this.user);
                this.loading_balance = false;
            },
            complete: () => {
                this.loading_balance = false;
            }
        });
    }


    logout() {
        this.apiService.get('auth/logout', 'delete').subscribe({
            next: () => {
                this.sessionStorage.logout();
                this.router.navigateByUrl('login');
            },
            error: () => {
                this.sessionStorage.logout();
                this.router.navigateByUrl('login');
            }
        });
    }


    onPromotionRequestSubmit() {
        // spinner
        this.spinner.show();
        this.apiService.get(`user/create-request-promote-user`).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.modalService.dismissAll();
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    openRequestPromotionModal(content: any) {
        this.modalService.open(content, {centered: true, keyboard: false});
    }


}
