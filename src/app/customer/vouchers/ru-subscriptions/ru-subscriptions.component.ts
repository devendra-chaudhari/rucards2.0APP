
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, UntypedFormControl } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormArray, AbstractControl } from '@angular/forms';
interface Product {
  name: string;
  price: number;
}

interface BrandProducts {
  [brand: string]: Product[];
}

export interface BankModel {
  id: any,
  icon: string,
  cardcolor: string,
  card: string,
  amount: string,
  state?:boolean
}

@Component({
  selector: 'app-ru-subscriptions',
  standalone: true,
  imports: [CommonModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './ru-subscriptions.component.html',
  styleUrl: './ru-subscriptions.component.scss'
})
export class RuSubscriptionsComponent {
  breadCrumbItems!: Array<{}>;
  page_no : number = 1;
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
  totalRecords: number = 0;
  selectedBrand: string = '';
  selectedProduct: string = '';
  selectedPrice: string = '';
  brandList: string[] = [];
  productList: Product[] = [];
  private offcanvasRef!: NgbOffcanvasRef;
  bankcardlist!: BankModel[];

  cardForm!: UntypedFormGroup;

  customcardData!: UntypedFormGroup;
  submitted = false;
  purchaseNow: boolean = false;
  showPurchaseButton: boolean = true;

  purchaseForm = new UntypedFormGroup({
    visible_at: new UntypedFormControl('', [Validators.required]),
    start_date: new UntypedFormControl('', [Validators.required]),
    end_date: new UntypedFormControl('', [Validators.required]),
    message: new UntypedFormControl('', [Validators.required])
  });
  
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 1500,
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
    nav: true
  };


  brandProducts: BrandProducts = {
    "MS-Office": [
      { name: "MS-Office H&S GC", price: 7799 },
      { name: "MS-Office Personal GC", price: 3800 },
      { name: "MS-Office H&B GC", price: 27999 },
      { name: "MS-Office Family GC", price: 4950 },
    ],
    "Disney-Hotstar": [
      { name: "Disney-Hotstar Mobile Quaterly GC :", price: 149 },
      { name: "Disney-Hotstar Super Quarterly GC :", price: 299 },
      { name: "Disney-Hotstar Mobile Annual GC :", price: 499 },
      { name: "Disney-Hotstar Premium Quarterly GC :", price: 499 },
      { name: "Disney-Hotstar Super Annual GC :", price: 899 },
      { name: "Disney-Hotstar Premium Annual GC :", price: 1499 },
    ],
    "Norton": [
      { name: "Norton GC", price: 299 },
      { name: "Norton GC", price: 399 },
      { name: "Norton GC", price: 599 },
      { name: "Norton GC", price: 999 },
      { name: "Norton GC", price: 1349 },
      { name: "Norton GC", price: 2099 },
      { name: "Norton GC", price: 2099 },
      { name: "Norton GC", price: 6299 },
      { name: "Norton GC", price: 3199 },
      { name: "Norton GC", price: 7199 },
      { name: "Norton GC", price: 3999 },
      { name: "Norton GC", price: 5999 },
      { name: "Norton GC", price: 9099 },
      { name: "Norton GC", price: 17999 },
    ],
    "Tinder": [
      { name: "inder Plus: One Week GC", price: 189 },
      { name: "Tinder Plus: One Month GC", price: 330 },
      { name: "Tinder Plus: Six Month GCs ", price: 1350 },
      { name: "Tinder Plus: Twelve Month GC", price: 2000 },
      { name: "Tinder Gold: One Month GC", price: 520 },
      { name: "Tinder Gold: Six Month GC", price: 2000 },
      { name: "Tinder Gold: Twelve Month GC", price: 3000 },
    ],
  };

  bankcards:BankModel[] = [
    {
        id: '1',
        icon: 'visa-fill',
        cardcolor: 'success',
        card: 'Ru-Wallet',
        amount: '8,500',
        state: true
    },
    {
        id: '2',
        icon: 'bank-card-2-line',
        cardcolor: 'info',
        card: 'Ru-Card',
        amount: '8,326'
    },
    {
        id: '3',
        icon: 'mastercard-line',
        cardcolor: 'danger',
        card: 'Payment Gateway',
        amount: '8,400'
    }
]


  constructor(
    private offcanvasService: NgbOffcanvas,
    private apiService: ApiService,
    public formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.cardForm = this.formBuilder.group({
      ids: [''],
      amount: ['', [Validators.required]],
    });

    this.customcardData = this.formBuilder.group({
      card_no: ['', [Validators.required]],
      cardholder: ['', [Validators.required]],
      month: ['', [Validators.required]],
      year: ['', [Validators.required]],
      cvc: ['', [Validators.required]]
    });

  }
  ngAfterViewInit() {
    this.populateBrands();
  }

  openVoucherDetails(content: any, brand: string) {
    this.selectedBrand = brand;
    this.populateProducts(brand);
    this.displayPrice('');
    this.offcanvasRef = this.offcanvasService.open(content, { position: 'end', keyboard: false });
  }

  populateBrands() {
    this.brandList = Object.keys(this.brandProducts);
  }

  populateProducts(brand: string) {
    this.productList = this.brandProducts[brand] || [];
  }

  displayPrice(productName: string) {
    if (this.selectedBrand && productName) {
      const product = this.productList.find(p => p.name === productName);
      if (product) {
        this.selectedPrice = `Price: ${product.price} Rs`;
      } else {
        this.selectedPrice = '';
      }
    } else {
      this.selectedPrice = '';
    }
  }

  onBrandChange(event: Event) {
    const brand = (event.target as HTMLSelectElement).value;
    this.selectedBrand = brand;
    this.populateProducts(brand);
    this.displayPrice('');
    this.selectedProduct = ''; // Reset selected product when brand changes
  }

  onProductChange(event: Event) {
    const productName = (event.target as HTMLSelectElement).value;
    this.selectedProduct = productName;
    this.displayPrice(productName);
  }

  onPurchaseNow() {
    this.purchaseNow = true;
    this.showPurchaseButton = false;
  }

  confirmcard(): void {
    if (this.cardForm.valid) {
      const selectedCard = this.cardForm.value.selectedCard;
      // handle the card confirmation logic
      console.log('Selected Card:', selectedCard);
    } else {
      // Show warning message if no card is selected
      const warnElement = document.getElementById('notification-warn');
      if (warnElement) {
        warnElement.classList.remove('d-none');
      }
    }
  }

}
