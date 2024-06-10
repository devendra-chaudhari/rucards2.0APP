import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../shared/services/excel.service";
import {SortService} from "../../shared/services/sort.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-platinum-gift-cards',
    templateUrl: './platinum-gift-cards.component.html',
    styleUrls: ['./platinum-gift-cards.component.scss']
})

export class PlatinumGiftCardsComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    page_no: number = 1;
    page: number = 1;
    pageSize: number = 10;
    total: number = 0;
    totalRecords: number = 0;
    tempExcelData = [];
    customers = [];
    giftCardList = [];
    gc_load_amount: number = 0;
    gc_load_card_number: string = "";
    gc_load_name: string = "";
    gc_load_mobile_number: string = "";
    gc_product_id: number;
    gc_id: number;
    amountError: string = '';
    newPinError: string = '';
    oldPinError: string = '';
    gc_new_pin: string;
    gc_old_pin: string;

    customer_gc_list =
        {
            product_id: null,
            bin_no: null,
            last_4_digit: null,
            customer_name_id: null,
            kit_no: null,
            mobile_no: null,
            page_no: this.page_no,
            page_size: this.pageSize
        }
    data = {
        customer_id: '',
        product_id: '',
        product_bin: '',
        card_category: 'virtual',
        otp: '',
        kit_no: '',
        pan_no: '',
        customer_mobile: '',
        amount: '',
        quantity: '',
        pin: ''
    };
    pinData: object;
    cvdData: {
        'pan_mask': string,
        'exp': string,
        'cvv': string
    };
    current_card_balance: null;
    block_reason: string = '';


    constructor(
        private offCanvas: NgbOffcanvas,
        private toaster: ToastrService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
        private excelService: ExcelService,
        private sortService: SortService,
    ) {

    }


    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Retailer'},
            {label: 'Gift Card', active: true}
        ];
        this.getGiftCardList(this.page_no, this.pageSize)
        this.getCustomerList();

    }


    getCustomerList() {
        this.apiService.get('paypoint_gift_card/customer-lists').subscribe({
            next: (res) => {
                this.customers.push(res.data)
                this.spinner.hide().then(r => {
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return null;
                });
            }, complete: () => {
                this.spinner.hide().then(r => {
                    return null;
                });
            }
        });
    }

    getGiftCardList(page_no: number, page_size: number) {
        this.apiService.post('qps/qps_customer_gc_list', {"page_no": page_no, "page_size": page_size}).subscribe({
            next: (res) => {
                this.giftCardList = res.data.result
                this.total = res.data.total
                this.totalRecords = res.data.total
                this.spinner.hide().then(r => {
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return null;
                });
            }, complete: () => {
                this.spinner.hide().then(r => {
                    return null;
                });
            }
        });
    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.totalRecords);
    }

    sort(column: string) {
        this.sortService.sort(column, this.giftCardList);
    }

    onPageSizeChange() {
        this.customer_gc_list.page_size = +this.pageSize
        this.getGiftCardList(this.page_no, this.pageSize)
    }

    onPageChange(event: any) {
        this.customer_gc_list.page_no = event
        this.page_no = event
        this.getGiftCardList(this.page_no, this.pageSize)
    }


    export_to_excel() {
        this.excelFields();
        const sortByField = null;
        const excludeFields = [];
        const columnOrder = [
            'activated_on',
            'card_id',
            'card_number',
            'card_type',
            'expiry_date',
            'id',
            'mobile',
            'name',
            'gc_flag',
            'gc_preferences_pos',
            'gc_preferences_ecom',
            'gc_preferences_contactless'
        ]
        this.excelService.exportAsExcelFile(this.tempExcelData, 'giftCardList', sortByField, excludeFields, columnOrder);
    }

    excelFields() {
        let tempExcelData: any[] = [];
        for (let i = 0; i < this.giftCardList.length; i++) {
            const row = {
                'serial_no': i + 1,
                // 'activated_on':this.dt.transform(this.giftCardList[i].activated_on, 'dd/MM/yyyy H:m:s'),
                'card_id': this.giftCardList[i].card_id,
                'card_number': this.giftCardList[i].card_number,
                'card_type': this.giftCardList[i].card_type,
                // 'expiry_date':this.giftCardList[i].expiry_date,
                'id': this.giftCardList[i].id,
                'mobile': this.giftCardList[i].mobile,
                'name': this.giftCardList[i].name,
                'gc_flag': this.giftCardList[i].gc_flag,
                'gc_preferences_pos': this.giftCardList[i].gc_preferences_pos,
                'gc_preferences_ecom': this.giftCardList[i].gc_preferences_ecom,
                'gc_preferences_contactless': this.giftCardList[i].gc_preferences_contactless
            }
            tempExcelData.push(row);
        }
        this.tempExcelData = tempExcelData;
    }

    onSearch() {
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r => {
            return null;
        });
        this.customer_gc_list.bin_no = this.data.product_bin
        this.apiService.post('qps/qps_customer_gc_list', this.customer_gc_list).subscribe({
            next: (res) => {
                this.giftCardList = res.data.result
                this.total = res.data.total
                this.totalRecords = res.data.total

                this.spinner.hide().then(r => {
                    return null;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return null;
                });
            }, complete: () => {
                this.spinner.hide().then(r => {
                    return null;
                });
            }
        });

    }

    resetForm() {
        this.customer_gc_list = {
            product_id: null,
            bin_no: null,
            mobile_no: null,
            last_4_digit: null,
            customer_name_id: null,
            kit_no: null,
            page_no: 1,
            page_size: 10
            // other properties...
        };
        this.onSearch()
    }

    openCardClosureModal(content: any) {
        this.modalService.open(content);
    }

    onLoadGiftCard(load_gift_card: any, data: any) {
        this.gc_load_name = data.name
        this.gc_load_mobile_number = data.mobile
        this.gc_load_card_number = data.card_number.slice(0, 4) + "XXXX" + data.card_number.slice(-4)
        this.gc_product_id = data.product_id
        this.gc_id = data.id
        this.offCanvas.open(load_gift_card, {position: 'end', animation: true});
    }

    submitLoadGiftCardDetails() {
        this.amountError = '';

        if (this.gc_load_amount < 100 || this.gc_load_amount >= 10000) {
            this.amountError = '*Should be greater than 100  and less than 10000';
            return;
        }
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('qps/gift_card_load', {
            "product_id": this.gc_product_id,
            "amount": this.gc_load_amount,
            "mobile_no": this.gc_load_mobile_number,
            "gift_card_id": this.gc_id,
        }).subscribe({
            next: (res) => {
                this.toaster.success(res['message']);
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.offCanvas.dismiss()
                this.spinner.hide();
            }, complete: () => {
                this.offCanvas.dismiss()
                this.spinner.hide(); // Re-enable the button after completion
            }
        });

    }

    submitForCardClosure(item: any) {
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('qps/card_closure', {'gift_card_id': item.id}).subscribe({
            next: (res) => {
                this.toaster.success(res['message']);
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.modalService.dismissAll()
                this.spinner.hide();
            }, complete: () => {
                this.modalService.dismissAll()
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
    }


    openCardBlockModal(content: any) {
        this.modalService.open(content);
    }

    submitForCardBlock(card_no: string) {
        if (this.block_reason == null || this.block_reason == "") {
            this.toaster.error('Please Select Valid Card Block Reason')
            return;
        } else {
            this.spinner.show();
            this.apiService.post('qps/card_block', {
                'card_no': card_no,
                'block_reason': this.block_reason,
            }).subscribe({
                next: (res) => {
                    this.toaster.success(res['message']);
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toaster.error(error.error.error);
                    this.modalService.dismissAll()
                    this.spinner.hide();
                }, complete: () => {
                    this.modalService.dismissAll()
                    this.spinner.hide();
                }
            });
        }


    }

    submitForUpdateSetCardPin(item: any, action: string) {
        const pinRegex = /^\d{0}$|^\d{6}$/; // Regex to match empty or exactly 4 digits
        if (!pinRegex.test(this.gc_new_pin)) {
            this.newPinError = '*Please Enter a Valid Pin (6 digits)';
            return;
        }
        if (action === 'set') {
            this.pinData = {
                'gift_card_id': item.id,
                'action': 'set',
                'new_pin': this.gc_new_pin
            }
        }
        if (action === 'update') {
            this.pinData = {
                'gift_card_id': item.id,
                'action': 'update',
                'new_pin': this.gc_new_pin,
                'old_pin': this.gc_old_pin
            }
        }
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('qps/set_or_update_pin', this.pinData).subscribe({
            next: (res) => {
                this.toaster.success(res['message']);
                this.pinData = {}
                this.gc_new_pin = null;
                this.gc_old_pin = null;
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.pinData = {}
                this.gc_new_pin = null;
                this.gc_old_pin = null;
                this.modalService.dismissAll()
                this.spinner.hide();
            }, complete: () => {
                this.modalService.dismissAll()
                this.pinData = {}
                this.gc_new_pin = null;
                this.gc_old_pin = null;
                this.spinner.hide(); // Re-enable the button after completion
            }
        });
    }

    openCardUnlockModal(content: any) {
        this.modalService.open(content);
    }

    openSetPinModal(content: any) {
        this.modalService.open(content, {centered: true});
    }

    openUpdatePinModal(content: any) {
        this.modalService.open(content, {centered: true});
    }

    submitForCardUnlock(card_no: string) {

        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('qps/card_unlock', {
            'card_no': card_no,
        }).subscribe({
            next: (res) => {
                this.toaster.success(res['message']);
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.modalService.dismissAll()
                this.spinner.hide();
            }, complete: () => {
                this.modalService.dismissAll()
                this.spinner.hide(); // Re-enable the button after completion
            }
        });

    }

    onGenerate_gpr_preferneces(generate_new_gpr_card: any) {
        this.offCanvas.open(generate_new_gpr_card, {position: 'end', animation: true});
    }


    onValueChange(active, getCard: any, prefernces: string) {
        this.spinner.show();
        if (active) {
            this.apiService.post('qps/card_preference', {
                "gift_card_id": getCard.id,
                "preferences": prefernces, "status": "ALLOWED"
            }).subscribe({
                next: (res) => {
                    this.toaster.success(res.message);
                    this.getGiftCardList(this.page_no, this.pageSize)
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toaster.error(error.error.error);
                    this.getGiftCardList(this.page_no, this.pageSize)
                    this.spinner.hide();
                }
            });
        } else {
            this.apiService.post('qps/card_preference', {
                "gift_card_id": getCard.id,
                "preferences": prefernces, "status": "NOTALLOWED"
            }).subscribe({
                next: (res) => {
                    this.toaster.success(res.message);
                    this.getGiftCardList(this.page_no, this.pageSize)
                    this.spinner.hide();
                },
                error: (error) => {
                    this.toaster.error(error.error.error);
                    this.getGiftCardList(this.page_no, this.pageSize)
                    this.spinner.hide();
                }
            });
        }
    }


    showCardDetails(card_no: string) {
        this.spinner.show();
        this.apiService.post('qps/get_card_cvd', {"cardNumber": card_no}).subscribe({
            next: (res) => {
                this.cvdData = res.data;
                this.spinner.hide();
                setTimeout(() => {
                    this.cvdData.cvv = null;
                    this.cvdData.pan_mask = null;
                    this.cvdData.exp = null;
                }, 15000);
            },
            error: () => {
                this.spinner.hide();
            },
            complete: () => {
                this.spinner.hide();

            }
        });
    }

    getCardBalance(card_no) {
        this.spinner.show();
        this.apiService.post('qps/card_balance_details', {"cardNumber": card_no}).subscribe({
            next: (res) => {
                this.current_card_balance = res.data['responseData']['walletDetails'][0]['balanceAmount'];
                this.spinner.hide();
                console.log(res.data['responseData']['walletDetails'][0]['balanceAmount']);
                setTimeout(() => {
                    this.current_card_balance = null;

                }, 15000);
            },
            error: () => {
                this.spinner.hide();
            },
            complete: () => {
                this.spinner.hide();

            }
        });
    }
}
