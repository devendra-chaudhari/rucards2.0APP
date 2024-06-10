import {Component, TemplateRef} from '@angular/core';
import {NgbModal, NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from 'src/app/shared/services/api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from 'src/app/shared/interfaces/user';
import {SortService} from "../../../shared/services/sort.service";
import {ExcelService} from "../../../shared/services/excel.service";

interface GiftCard {
    KitNumber: string;
    ExpiryDate: string;
    CardType: string;
    CardEndingDigits: string;
    CardCurrentBalance: string;
    CardStatus: string;
    ActivatedOn: string
}
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

interface CardDetailsType {
    name: string;
    expiry: string;
    card_number: string;
    cvv: string;
}

interface UserDetail {
    IssueCard: string;
    TspId: string;
    BinNo: string;
    BinType: string;
    TransactionId: string;
    Amount: string;
    Remarks: string;
    CardType: string;
    Mobileno: string;
    FirstName: string;
    LastName: string;
    PanNumber: string;
    DateOfBirth: string;
    EmailId: string

}

interface PersonalInfo {
    aadhaar_verified: boolean;
    bank_verified: boolean;
    business_verified: boolean;
    aadhaar_no: string;
    active: boolean;
    address: string;
    city: string;
    district: string;
    dob: string;
    email: string;
    email_verified: boolean;
    father_name: string;
    gender: string;
    kyc_type: string;
    mobile: string;
    name: string;
    username: string;
    pan: string;
    pan_verified: boolean;
    applicant_photo: string;
    applicant_sign: string;
    shop_front: string;
    shop_back: string;
    pincode: string;
    state: string;
    enable_2fa: boolean;
    join_date: string;
}

@Component({
    selector: 'app-manage-gift-card',
    templateUrl: './manage-gift-card.component.html',
    styleUrls: ['./manage-gift-card.component.scss'],
})

export class ManageGiftCardComponent {
    gift_cards: GiftCard[] = [];
    tempGiftCardsData: GiftCard[] = [];
    products: ProductList[] = [];
    user: User;
    personalInfo: PersonalInfo;
    amountError: string = '';
    quantityError: string = '';
    total_gift_cards=0;
    giftCardList :{
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
        current_balance:string
    }[] = []
    // gift card data
    gc_data = {
        owner_id: null,
        mobile_no: null,
        issue_card: "2", //1 - For My Self 2 - For Resale
        amount: null,
        quantity: 1,
        remarks: "Test Api",
        first_name: null,
        last_name: null,
        pan_number: null,
        date_of_birth: null,
        email_id: null,
        card_category: "virtual",
        product_id:""
    }

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

    data = {
        customer_id: '',
        product_id: null,
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
    //table
    page_no : number = 1;
    page:number = 1;
    pageSize:number = 10;
    total:number = 0;
    totalRecords: number = 0;

    user_data = {
        id: null,
        customer_id: null,
        card_creator_id: null,
        page_no: this.page_no,
        page_size: 10
    }

    gc_set_data = {
        "kit_no":null,
        "tsp_id":"4",
        "gc_preferences_pos" : null,
        "gc_preferences_ecom" : null,
        "gc_preferences_contactless" : null
    }

    customer_gc_list =
        {
            bin_no : null,
            last_4_digit :null,
            customer_name_id : null,
            kit_no : null,
            mobile_no : null,
            page_no  : this.page_no,
            page_size : this.pageSize
        }

    breadCrumbItems!: Array<{}>;

    // card details
    CardDetails: CardDetailsType[] = [
        {
            name: 'Aakash',
            expiry: '2028-02',
            card_number: '8174 4500 6654',
            cvv: '',
        }
    ]
    fullName: string;

    protected readonly Math = Math;

    // pie chart
    simpleDonutChart: any;

    // filter by date
    todayDate: Date = new Date()
    to_date: Date = new Date()
    from_date:Date = new Date()

    search_input_text = ""

    constructor(
        private offCanvas: NgbOffcanvas,
        private toaster: ToastrService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
        private sortService: SortService,
        private excelService: ExcelService,
        private modalService: NgbModal,
    ) {
        this.getGCList()
    }


    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Manage Gift Card'}, //pie chart
            {label: 'List Of Cards', active: true}// pie chart
        ];

        this.getPersonalInfo()
        // pi chart color Data Get Function 
        this._simpleDonutChart('["--vz-primary", "--vz-success", "--vz-info"]');

        //fetch api for get customer GC list
        this.getCustomerGC()
    }

    getGCList(){
        this.apiService.post('paypoint_gift_card/customer-gc-list',this.customer_gc_list).subscribe({
            next: (res) => {
                this.giftCardList=res.data.result
                this.total = res.data.total
                this.totalRecords = res.data.total
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }
        });
    }

    onGetProductsList() {
        this.apiService.get('product/list').subscribe({
            next: (res) => {
                this.products = res.data;
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }
        });
    }

    validateGiftCardDetails() {
        // Reset error messages
        this.amountError = '';
        this.quantityError = '';

        // Check if the amount is greater than 0 and less than 10000
        if (this.gc_data.amount < 100 || this.gc_data.amount >= 10000) {
            this.amountError = '*Amount should be between than  and less than 10000';
            return;
        }

        // Check if the quantity is greater than 0 and less than 50000
        if (this.gc_data.quantity < 1 || this.gc_data.quantity > 50) {
            this.quantityError = '*Quantity should be between 1 and less than 50';
            return;
        }

        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            });
        this.apiService.post('paypoint_gift_card/gift-manage-generate', this.gc_data).subscribe({
            next: (res) => {
                this.toaster.success('Congratulations! card created Successfully.');
                this.getCustomerGC();
                this.spinner.hide();
                this.offCanvas.dismiss();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
                this.offCanvas.dismiss();
            }
        });
    }

    // Chart Colors Set
    private getChartColorsArray(colors: any) {
        colors = JSON.parse(colors);
        return colors.map(function (value: any) {
            const newValue = value.replace(" ", "");
            if (newValue.indexOf(",") === -1) {
                let color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
                if (color) {
                    color = color.replace(" ", "");
                    return color;
                } else return newValue;
            } else {
                const val = value.split(',');
                if (val.length == 2) {
                    let rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
                    rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
                    return rgbaColor;
                } else {
                    return newValue;
                }
            }
        });
    }

    // get personal info
    getPersonalInfo() {
        this.apiService.get('user/personal_info').subscribe((res) => {
                this.personalInfo = res.data;
                this.gc_data.mobile_no = this.personalInfo.mobile;

                    this.fullName = this.personalInfo.name;
                const fullNameParts = this.fullName.split(' '); // Split the full name by space

                // Check if there are at least two parts (first name and last name)
                if (fullNameParts.length >= 2) {
                    const firstName = fullNameParts[0]; // Get the first part (first name)
                    const lastName = fullNameParts[fullNameParts.length - 1]; // Get the second part (last name)
                    this.gc_data.first_name = firstName; // Save the first name
                    this.gc_data.last_name = lastName; // Save the first name
                } else {
                    // Handle the case where there is no last name
                    this.gc_data.first_name = this.fullName; // Save the entire name as the first name
                }
                this.gc_data.pan_number = this.personalInfo.pan;
                    this.gc_data.date_of_birth = this.personalInfo.dob;
                    this.gc_data.email_id = this.personalInfo.email;
                    this.gc_data.card_category = "virtual"
            }
        );
    }

    // get customer GC
    getCustomerGC() {
        this.user_data.page_size = +this.pageSize
        this.apiService.post('paypoint_gift_card/customer-gc-list', this.user_data).subscribe({
            next: (res) => {
                this.spinner.hide();
                this.giftCardList = res.data.result;
                this.total = res.data.total;
                this.totalRecords = res.data.total;
                // this.total_gift_cards=res.data.total_gift_cards;
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    onProductSelectionChange() {
        const bin_records = this.products.filter(x => x.id === this.data.product_id);
        if (bin_records.length > 0) {
            this.data.product_bin = bin_records[0]['product_series']
            return bin_records[0]['product_bin'];
        }
        return null;
    }

    onGenerateGiftCard(generate_new_gift_card: any) {
        this.onGetProductsList();
        this.offCanvas.open(generate_new_gift_card, {position: 'end', animation: true});
    }

    //pie chart
    private _simpleDonutChart(colors: any) {
        colors = this.getChartColorsArray(colors);
        this.simpleDonutChart = {
            series: [44, 55, 41],
            chart: {
                height: 250,
                type: "donut",
            },
            legend: {
                position: "bottom",
            },
            dataLabels: {
                dropShadow: {
                    enabled: false,
                },
            },
            colors: colors,
            labels: ["Shopping", "Others Load", "Utility"],
        };
    }

    openFilter(filterDetails: TemplateRef<any>) {
        this.offCanvas.open(filterDetails, {position: 'end'});
    }

    sort(column: string) {
        this.sortService.sort(column, this.gift_cards);
    }

    onPageSizeChange() {
        this.user_data.page_size = +this.pageSize
        this.getCustomerGC()
    }

    onPageChange(event: any){
        this.user_data.page_no = +event
        this.getCustomerGC()
    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.totalRecords);
    }

    private excelFields() {
        let tempExcelData: any[] = [];

        for (let i = 0; i < this.gift_cards.length; i++) {
            const row = {
                'serial_no': i + 1,
                'KitNumber': this.gift_cards[i].KitNumber,
                'ExpiryDate': this.gift_cards[i].ExpiryDate,
                'CardType': this.gift_cards[i].CardType,
                'CardEndingDigits': this.gift_cards[i].CardEndingDigits,
                'CardCurrentBalance': this.gift_cards[i].CardCurrentBalance,
                'CardStatus': this.gift_cards[i].CardStatus,
                'ActivatedOn': this.gift_cards[i].ActivatedOn
            }
            tempExcelData.push(row);
        }
        this.tempGiftCardsData = tempExcelData;
    }

    export_to_excel() {
        this.excelFields();
        const sortByField = null;
        const excludeFields = [];
        const columnOrder = [
        'NO',
        'KitNumber',
        'ExpiryDate',
        'CardType',
        'CardEndingDigits',
        'CardCurrentBalance',
        'CardStatus',
        'ActivatedOn'    ]
        this.excelService.exportAsExcelFile(this.tempGiftCardsData, 'GiftCardList', sortByField, excludeFields, columnOrder);
    }

    onFilterByDate(filterCustomers: any) {
        this.offCanvas.open(filterCustomers, {position: 'end', animation: true});
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
                this.giftCardList = res.data.result;
                this.total = res.data.total;
                this.totalRecords = res.data.total;
                this.pageSize = res.data.total;
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

    onTextSearch(searchText: string): void {
        this.tempGiftCardsData = this.gift_cards
        const searchTextLower = searchText.toLowerCase();
        const filteredCustomers = this.tempGiftCardsData.filter(x => x.KitNumber.toLowerCase().includes(searchTextLower) || x.CardEndingDigits.toLowerCase().includes(searchTextLower));
        if (searchTextLower == '') {
            this.gift_cards = this.tempGiftCardsData;
        } else
            this.gift_cards = filteredCustomers;
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
                    // Open the link in a new tab or window
                    window.open(res['data']);
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
                    window.open(res['data'], '_blank');
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



}







