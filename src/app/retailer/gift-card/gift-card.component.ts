import {Component, OnInit} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import {ToastrService} from "ngx-toastr";
import { ApiService } from 'src/app/shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ExcelService} from "../../shared/services/excel.service";
import {SortService} from "../../shared/services/sort.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


export interface Cards{
    kit_number:string;
    current_balance:string;
}
@Component({
    selector: 'app-gift-card',
    templateUrl: './gift-card.component.html'
})
export class GiftCardComponent implements OnInit {
    breadCrumbItems!: Array<{}>;

    showCurrentBalance: boolean = true;
    cards:Cards[]=[]
    //table
    page_no : number = 1;
    page:number = 1;
    pageSize:number = 10;
    total:number = 0;
    totalRecords: number = 0;
    website=null;
    tempExcelData = [];
    stringIframe:SafeResourceUrl;
    products = [];

    customer_gc_list =
        {
        product_id:null,
        bin_no : null,
        last_4_digit :null,//0963
        customer_name_id : null,//"customer Name",
        kit_no : null,//"66e4dcc44582415c",
        mobile_no : null,//"9920254204",
        page_no  : this.page_no,
        page_size : this.pageSize
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
        amount:'',
        quantity:'',
        pin:''
    };

    lock_unlock_block_data = {
        tsp_id : "4",
        kit_no : null,
        flag : null,
        reason : "Lock For Safety",
        gift_card_id : null,
        customer_name_id :null,
        block_reason:null,
        block_type:null,
        block_description:null
    }

    setPin_cardDetails_data = {
        "tsp_id": "4",
        "kit_no":null,
        "dob":null,
        "action_type":null
    }

    giftCardList :{
            bin_no:string;
            activated_on: string,
            card_id: string,
            card_number:string,
            card_type: string,
            expiry_date: string,
            id: number,
            mobile: string,
            name: string,
            gc_flag :string,
            gc_preferences_pos : string, 
            gc_preferences_ecom : string,
            gc_preferences_contactless : string,
            current_balance:string,
            show:boolean
        }[] = []

    gc_set_data = {
        "kit_no":null,
        "tsp_id":"4",
        "gc_preferences_pos" : null, 
        "gc_preferences_ecom" : null,
        "gc_preferences_contactless" : null
    }

    customers = [];

    // filter by date
    todayDate: Date = new Date()
    to_date: Date = new Date()
    from_date:Date = new Date()

    constructor(
        private offCanvas: NgbOffcanvas,
        private toaster: ToastrService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
        private excelService: ExcelService,
        private sortService: SortService,
        private sanitizer: DomSanitizer,
        // private dt: DatePipe
    ) {
        this.onSearch()
    }


    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Retailer'},
            {label: 'Manage Gift Card', active: true}
        ];
        this.onGetProductsList();

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

        setTimeout(() => {
            this.showCurrentBalance = false;
        }, 20000); // 20000 milliseconds = 20 seconds

    }

    onRefreshBalanceClick(item){
        item.show = true;
        this.getCurrentBalanceGiftCards(item);
        // Set showCurrentBalance to false after 20 seconds
        setTimeout(() => {
            item.show = false;
            this.showCurrentBalance = false;
        }, 10000); // 20000 milliseconds = 20 seconds
    }
        
    onGetProductsList() {
        this.spinner.show().then(r => {
            return null;
        });
        this.apiService.get('product/list').subscribe({
            next: (res) => {
                this.products = res.data;
                this.spinner.hide().then(r => {
                    return r;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return null;
                });

            }
        });

    }

    // Create a function to reset the form
    resetForm() {
        this.customer_gc_list = {
        product_id: null,
        bin_no:null,
        mobile_no: null,
        last_4_digit: null,
        customer_name_id: null,
        kit_no: null,
        page_no  : 1,
        page_size : 10
        // other properties...
        };
        this.onSearch()
    }

lock(item: any){
    this.lock_unlock_block_data.customer_name_id = item.gc_card_owner_id
    this.lock_unlock_block_data.kit_no = item.card_id
    this.lock_unlock_block_data.flag = 'L'
    this.lock_unlock_block_data.gift_card_id = item.id
    this.validateLockUnlockGiftCardDetails()
    this.modalService.dismissAll();
}

unlock(item: any){
    this.lock_unlock_block_data.customer_name_id = item.gc_card_owner_id
    this.lock_unlock_block_data.kit_no = item.card_id
    this.lock_unlock_block_data.flag = 'UL'
    this.lock_unlock_block_data.gift_card_id = item.id
    this.validateLockUnlockGiftCardDetails()
}

setPin(data:any){
    this.spinner.show(undefined,
        {
            type: 'ball-scale-multiple',
            size: 'medium',
            bdColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fullScreen: true
        });

        this.setPin_cardDetails_data.action_type = "setPin"
        this.setPin_cardDetails_data.dob = data.gc_owner_dob
        this.setPin_cardDetails_data.kit_no = data.card_id
        this.apiService.post('paypoint_gift_card/iframe-widget',this.setPin_cardDetails_data).subscribe({
        next: (res) => {
            this.toaster.success("Your link is Open in another tab");
            if (res['message'] == "success") {
                this.website = res['data']
                // Open the link in a new tab or window
                // window.open(res['data']);
            }
            this.spinner.hide();
        },
        error: (error) => {
            this.toaster.error(error.error.error);
            this.spinner.hide();
        }, complete: () => {
            this.spinner.hide(); // Re-enable the button after completion
        }
    });
}


cardDetails(data:any){
    this.spinner.show(undefined,
        {
            type: 'ball-scale-multiple',
            size: 'medium',
            bdColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fullScreen: true
        });

        this.setPin_cardDetails_data.action_type = "cardDetails"
        this.setPin_cardDetails_data.dob = "11-05-2002"
        this.setPin_cardDetails_data.kit_no = data.card_id
        
        this.apiService.post('paypoint_gift_card/iframe-widget',this.setPin_cardDetails_data).subscribe({
        next: (res) => {
            this.toaster.success(res['message']);
            // Check if a link exists in the response
            if (res['message'] == "success") {
                // Open the link in a new tab or window
                this.website=res['data']
            }
            this.spinner.hide();
        },
        error: (error) => {
            this.toaster.error(error.error.error);
            this.spinner.hide();
        }, complete: () => {
            this.spinner.hide(); // Re-enable the button after completion
        }
    });
}


//update gc_preferneces
gc_set_preferences(data:any){
    this.spinner.show(undefined,
        {
            type: 'ball-scale-multiple',
            size: 'medium',
            bdColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fullScreen: true
        });

        this.gc_set_data.kit_no  = data.card_id;
        this.gc_set_data.gc_preferences_pos = data.gc_preferences_pos;
        this.gc_set_data.gc_preferences_ecom = data.gc_preferences_ecom;
        this.gc_set_data.gc_preferences_contactless = data.gc_preferences_contactless

        this.apiService.post('paypoint_gift_card/update-card-preferences',this.gc_set_data).subscribe({
        next: (res) => {
            if (res['message']['CONTACTLESS'])
                this.toaster.success("Contactless Gift Card Activated");
            if (res['message']['POS'])
                this.toaster.success("POS Gift Card Activated");
            if (res['message']['ECOM'])
                this.toaster.success("ECOM Gift Card Activated");
            this.spinner.hide();
        },
        error: (error) => {
            this.toaster.error(error.error.error);
            this.spinner.hide();
        }, complete: () => {
                this.modalService.dismissAll();
                this.spinner.hide(); // Re-enable the button after completion
        }
    });
}

validateLockUnlockGiftCardDetails() {
    // Reset error messages
    this.spinner.show(undefined,
        {
            type: 'ball-scale-multiple',
            size: 'medium',
            bdColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fullScreen: true
        });
        this.apiService.post('paypoint_gift_card/lock-unlock-block',this.lock_unlock_block_data).subscribe({
        next: (res) => {
            this.toaster.success(res['message']);
            // success
            // Refresh Card List to show newly Created cards
            this.spinner.hide();
        },
        error: (error) => {
            this.toaster.error(error.error.error);
            this.spinner.hide();
        }, complete: () => {
            this.spinner.hide(); // Re-enable the button after completion
        }
    });
}

// offcanvas gc prefernces
onGenerate_gc_preferneces(generate_new_gpr_card: any, data: any) {
    this.data.customer_id = data.id;
    this.data.pan_no = data.pan;
    this.data.customer_mobile = data.mobile;
    this.offCanvas.open(generate_new_gpr_card, {position: 'end', animation: true});
}

//set pin Modal
openModal(content: any) {
    this.modalService.open(content);
  }

//Lock Modal
openLockModal(content: any) {
    this.modalService.open(content);
  }

//UnLock Modal
openUnLockModal(content: any) {
    this.modalService.open(content);
  }

//offcanvas Modal
openSetPreferencesModal(content: any) {
    this.modalService.open(content);
  }

onSearch(){
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
        this.apiService.post('paypoint_gift_card/customer-gc-list',this.customer_gc_list).subscribe({
        next: (res) => {
            this.giftCardList=res.data.result
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

onProductSelectionChange() {
    const bin_records = this.products.filter(x => x.id == this.data.product_id);
    if (bin_records.length > 0) {
        this.data.product_bin = bin_records[0]['product_series']
        return bin_records[0]['product_bin'];
    }
    return null;
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
        'gc_flag' ,
        'gc_preferences_pos' ,
        'gc_preferences_ecom' ,
        'gc_preferences_contactless'
    ]
    this.excelService.exportAsExcelFile(this.tempExcelData, 'giftCardList', sortByField, excludeFields, columnOrder);
}

private excelFields() {
    let tempExcelData: any[] = [];
    for (let i = 0; i < this.giftCardList.length; i++) {
        const row = {
            'serial_no': i + 1,
            // 'activated_on':this.dt.transform(this.giftCardList[i].activated_on, 'dd/MM/yyyy H:m:s'),
            'card_id':this.giftCardList[i].card_id,
            'card_number':this.giftCardList[i].card_number,
            'card_type':this.giftCardList[i].card_type,
            // 'expiry_date':this.giftCardList[i].expiry_date,
            'id':this.giftCardList[i].id,
            'mobile':this.giftCardList[i].mobile,
            'name':this.giftCardList[i].name,
            'gc_flag' :this.giftCardList[i].gc_flag,
            'gc_preferences_pos' :this.giftCardList[i].gc_preferences_pos,
            'gc_preferences_ecom' :this.giftCardList[i].gc_preferences_ecom,
            'gc_preferences_contactless':this.giftCardList[i].gc_preferences_contactless
        }
        tempExcelData.push(row);
    }
    this.tempExcelData = tempExcelData;
}

getMax() {
        return Math.min(this.page * this.pageSize, this.totalRecords);
    }

sort(column: string) {
        this.sortService.sort(column, this.giftCardList);
    }

onPageSizeChange() {
    this.customer_gc_list.page_size = +this.pageSize
    this.onSearch()
}

onPageChange(event: any){
    this.customer_gc_list.page_no = event
    this.onSearch()
}

// get giftCards List Filter By date
onFilterByDate(filterGiftCards: any) {
    this.offCanvas.open(filterGiftCards, {position: 'end', animation: true});
}

onSearchFilterByDate(){
    if (this.from_date > this.to_date) {
        this.toaster.error("Please Check Date");
    }
    else{
        this.getGiftCardListFilterByDate()
    }

}

getGiftCardListFilterByDate(){
    // spinner
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
    this.apiService.post('paypoint_gift_card/customers-gc-list-filter-by-date', {'to_date': this.to_date,'from_date': this.from_date}).subscribe({
        next: (res) => {
            this.giftCardList=res.data.result
            this.total = res.data.total
            this.totalRecords = res.data.total
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

getCurrentBalanceGiftCards(item){
    // spinner
    const kit_number = item.card_id
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
        this.apiService.post('paypoint_gift_card/cards', {
            "from_date": "",
            "to_date": "",
            "card_status": -1,
            "kit_number": kit_number,
            "card_ending_digits": "",
            "page_no": 1,
            "pagesize": 10
        }).subscribe({
            next: (res) => {
                const cardToUpdate = this.giftCardList.find(card => card.card_id === kit_number);
                if (cardToUpdate) {
                    cardToUpdate.current_balance = res.data.TxnList[0].CardCurrentBalance
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

openIframeModal(content:any, item:any, action:string){
        if (action==='setPin'){
            this.performActions(item);
        }
        if(action==='cardDetails'){
            this.cardDetails(item);
        }
    this.stringIframe=this.sanitizer.bypassSecurityTrustResourceUrl(this.website)
    this.modalService.open(content, { backdrop: 'static' });
}


performActions(item: any) {
    this.setPin(item); // Call your setPin function
    this.modalService.dismissAll('Close click'); // Close the modal
}

closeModal(){
        this.stringIframe=null;
        this.modalService.dismissAll()
}



}
