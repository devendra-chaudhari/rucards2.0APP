import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {MessageService} from "../../shared/services/message.service";
import {ApiService} from "../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
interface ProductList {
    id: string;
    product_image: string;
    product_name: string;
    product_code: string;
    product_type: string;
    branding_category: string;
    service_provider: string;
    product_description: null
    created_user: { username: string }
    product_series: string;
    active: boolean;
    created_at: string;
    wallet_id:number;
}
@Component({
    selector: 'app-gpr-card',
    templateUrl: './gpr-card.component.html'
})
export class GprCardComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    GPRCardsList: any[] = []
    products: ProductList[]=[];
    showCurrentBalance: boolean = false;
    gpr_set_data = {
        "kit_no":null,
        "mobile_no":null,
        "access_token_key":null,
        "owner_id":null,
        "gpr_preferences_pos" : null,
        "gpr_preferences_ecom" : null,
        "gpr_preferences_contactless" : null,
        "gpr_preferences_dcc" : null
    }
    data={
        "user_id":null,
        "amount":0,
        "receiver_kit_no":null,
        "sender_mobile_no":null,
        "option1":null,
        "product_id":null,
    }

    constructor(
        private offCanvas: NgbOffcanvas,
        private toaster: ToastrService,
        private messageService: MessageService,
        private apiService: ApiService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Retailer'},
            {label: 'Manage GPR Card', active: true}
        ];
        this.onGetProductsList();
        this.getGprCardsList();
    }

    onGetProductsList() {
        this.spinner.show();
        this.apiService.get('product/list').subscribe({
            next: (res) => {
                this.products = res.data;
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();

            }
        });
    }

    openFilter(filterDetails: TemplateRef<any>) {
        this.offCanvas.open(filterDetails, {position: 'end'});
    }

    gpr_set_preferences(data:any){
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.gpr_set_data.owner_id = data.user_id;
        this.gpr_set_data.mobile_no = data.mobile_no;
        this.gpr_set_data.access_token_key = data.access_token_key;
        this.gpr_set_data.gpr_preferences_pos = data.gpr_preferences_pos;
        this.gpr_set_data.gpr_preferences_ecom = data.gpr_preferences_ecom;
        this.gpr_set_data.gpr_preferences_contactless = data.gpr_preferences_contactless;
        this.gpr_set_data.gpr_preferences_dcc = data.gpr_preferences_dcc;

        this.apiService.post('paypoint/update_gpr_card_preference',this.gpr_set_data).subscribe({
            next: (res) => {
                if (res['message']['CONTACTLESS'])
                    this.toastr.success("Contactless Gift Card Activated");
                if (res['message']['POS'])
                    this.toastr.success("POS Gift Card Activated");
                if (res['message']['ECOM'])
                    this.toastr.success("ECOM Gift Card Activated");
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.modalService.dismissAll();
                this.offCanvas.dismiss();
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
    }

    setGPRPin(data:any){
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        data = {
            'mobile_no' : data.mobile_no,
            'access_token_key': data.access_token_key,
            'kit_no':data.kit_no,
            'dob':data.dob
        }
        this.apiService.post('paypoint/card_set_pin_iframe_widget',data).subscribe({
            next: (res) => {
                this.toastr.success("Your link is Open in another tab");
                if (res['success'] === true) {
                    // Open the link in a new tab or window
                    window.open(res['data']['Msg']);
                    this.modalService.dismissAll()
                }
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
    }

    getGprCardsList() {
        this.apiService.get('paypoint/view_paypoint_wallets_list').subscribe({
            next: (res) => {
                this.GPRCardsList = res.data;
                this.spinner.hide();
            }, error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();

            }
        });
    }

    openSetGPRCardPreferencesModal(content: any) {
        this.modalService.open(content);
    }

    onGenerate_gpr_preferneces(generate_new_gpr_card: any) {
        this.offCanvas.open(generate_new_gpr_card, {position: 'end', animation: true});
    }

    openGPRSetPinModal(content: any) {
        this.modalService.open(content);
    }

    gprCardDetailsFun(data:any){
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });

        data = {
            'mobile_no' : data.mobile_no,
            'access_token_key': data.access_token_key,
            'kit_no':data.kit_no,
            'dob':data.dob
        }

        this.apiService.post('paypoint/card_view_details_iframe_widget',data).subscribe({
            next: (res) => {
                this.toastr.success("Your link is Open in another tab");
                if (res['success'] === true) {
                    // Open the link in a new tab or window
                    window.open(res['data']['Msg']);
                }
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
    }

    lock(item: any){
        let data={
            "mobile_no":item.mobile_no,
            "access_token_key":item.access_token_key,
            "kit_no":item.kit_no,
            "flag":"L",
            "reason":"Lock For Safety"
        }
        this.validateLockUnlockGPRCardDetails(data);
        this.modalService.dismissAll();
    }

    unlock(item: any){
        let data={
            "mobile_no":item.mobile_no,
            "access_token_key":item.access_token_key,
            "kit_no":item.kit_no,
            "flag":"UL",
            "reason":"UnLock For Use"
        }
        this.validateLockUnlockGPRCardDetails(data);
        this.modalService.dismissAll();

    }

    block(item: any){
        let data={
            "mobile_no":item.mobile_no,
            "access_token_key":item.access_token_key,
            "kit_no":item.kit_no,
            "flag":"BL",
            "reason":"UnLock For Use"
        }
        this.validateLockUnlockGPRCardDetails(data);
        this.modalService.dismissAll();

    }

    openLockModal(content: any) {
        this.modalService.open(content);
    }

//UnLock Modal
    openUnLockModal(content: any) {
        this.modalService.open(content);
    }

    openBlockModal(content: any) {
        this.modalService.open(content);
    }

    validateLockUnlockGPRCardDetails(data:any) {
        // Reset error messages
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('paypoint/lock_unlock_block_card',data).subscribe({
            next: (res) => {
                this.toastr.success(res['message']);
                // success
                // Refresh Card List to show newly Created cards
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
    }

    replaceCard(item:any){
        let data = {
            "mobile_no":item.mobile_no,
            "access_token_key":item.access_token_key,
            "kit_no":item.kit_no
        }

        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('paypoint/replace_card',data).subscribe({
            next: (res) => {
                this.toastr.success(res['message']);
                // success
                // Refresh Card List to show newly Created cards
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide(); // Re-enable the button after completion
            }
        });

    }

    createPhysicalGPRCard(item:any){
        let data={
            "mobile_no":item.mobile_no,
            "access_token_key":item.access_token_key,
            "kit_no":item.kit_no,
            "card_receiver_name":item.first_name+" "+item.last_name,
            "address1":item.address1,
            "address2":item.address2,
            "address3":item.address3,
            "city":item.city,
            "state":item.state,
            "pin_code":item.pincode
        }

        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('paypoint/request_physical_card',data).subscribe({
            next: (res) => {
                if (res['success'] == false){
                    this.toastr.error(res['error']);
                }
                if (res['success'] == true){
                    this.toastr.error(res['Msg']);
                }
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error['Msg']);
                this.spinner.hide();
            }, complete: () => {
                this.modalService.dismissAll()
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
    }

    onSubmitTopUpGPRCard(item:any){
        this.data.user_id=item.user_id;
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('paypoint/topup_wallet', this.data).subscribe({
            next: (res) => {
                this.toastr.success(res['message']);
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.offCanvas.dismiss();
                this.data.amount = 0;
                this.data.receiver_kit_no = null;
                this.data.sender_mobile_no = null;
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
        }

    onRefreshBalanceClick(item){
        item.show = true;
        this.getCurrentBalanceGPRCards(item);
        // Set showCurrentBalance to false after 20 seconds
        setTimeout(() => {
            item.show = false;
            this.showCurrentBalance = false;
        }, 10000); // 20000 milliseconds = 20 seconds
    }

    getCurrentBalanceGPRCards(item){
        // spinner
        const mobile_no = item.mobile_no
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r =>
            {
                return null;
            }
        );
        this.apiService.post('paypoint/view_wallet_passbook', {
            "mobile_no":mobile_no
        }).subscribe({
            next: (res) => {
                const cardToUpdate = this.GPRCardsList.find(card => card.mobile_no === mobile_no);
                if (cardToUpdate) {
                    cardToUpdate.current_balance = res.data.CurrentBalance
                }
                this.spinner.hide().then(r => {
                    this.offCanvas.dismiss()
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => null);
            }, complete: () => {
                this.spinner.hide().then(r => {
                    this.offCanvas.dismiss()
                    return null;
                });
            }

        });
    }

    onValueChange(active, getGprCardsList: any,prefernces:string) {
        this.spinner.show();
        if (active) {
            this.apiService.post('paypoint/update_gpr_card_preference', {
                "mobile_no":getGprCardsList.mobile_no,
                "access_token_key":getGprCardsList.access_token_key, "preferences":prefernces, "status":"ALLOWED"
            }).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.spinner.hide();
                    this.getGprCardsList();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        } else {
            this.apiService.post('paypoint/update_gpr_card_preference', {
                "mobile_no":getGprCardsList.mobile_no,
                "access_token_key":getGprCardsList.access_token_key, "preferences":prefernces, "status":"NOTALLOWED"
            }).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.spinner.hide();
                    this.getGprCardsList();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
    }







}
