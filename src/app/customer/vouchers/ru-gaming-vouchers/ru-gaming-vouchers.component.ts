
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
  selector: 'app-ru-gaming-vouchers',
  templateUrl: './ru-gaming-vouchers.component.html',
  styleUrls: ['./ru-gaming-vouchers.component.scss'],
  standalone: true,
  imports: [CommonModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class RuGamingVouchersComponent {
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
    "MS-Xbox": [
      { name: "MS-Xbox GC : 549 Rs ", price: 549 },
      { name: "MS-Xbox GC : 1049 Rs", price: 1049 },
      { name: "MS-Xbox GC : 1649 Rs ", price: 1649 },
      { name: "MS-Xbox GC : 349 Rs", price: 349 },
      { name: "MS-Xbox GC : 749 Rs", price: 749 },
      { name: "MS-Xbox GC : 1999 Rs", price: 1999 },
    ],
    "Sony-PSN": [
      { name: "Sony PSN GC: 500 Rs", price: 500 },
      { name: "Sony PSN GC : 1000 Rs", price: 1000 },
      { name: "Sony PSN GC : 1200 Rs", price: 1200 },
      { name: "Sony PSN GC : 1500 Rs", price: 1500 },
      { name: "Sony PSN GC : 2000 Rs", price: 2000 },
      { name: "Sony PSN GC : 2300 Rs", price: 2300 },
      { name: "Sony PSN GC : 2500 Rs", price: 2500 },
      { name: "Sony PSN GC : 3000 Rs", price: 3000 },
      { name: "Sony PSN GC : 3500 Rs", price: 3500 },
      { name: "Sony PSN GC : 4000 Rs", price: 4000 },
      { name: "Sony PSN GC : 4500 Rs", price: 4500 },
      { name: "Sony PSN GC : 5000 Rs", price: 5000 },
      { name: "Sony PSN GC : 5800 Rs", price: 5800 },
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
