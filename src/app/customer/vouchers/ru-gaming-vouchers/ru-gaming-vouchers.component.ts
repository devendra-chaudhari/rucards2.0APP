
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
  selectedPrice: number;
  brandList: string[] = [];
  productList: Product[] = [];
  private offcanvasRef!: NgbOffcanvasRef;
  bankcardlist!: BankModel[];

  cardForm!: UntypedFormGroup;

  customcardData!: UntypedFormGroup;
  submitted = false;
  purchaseNow: boolean = false;
  showPurchaseButton: boolean = true;
  totalPrice: number = 0;
  quantity: number = 1;

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

  buyNowForm = new UntypedFormGroup({
    product: new UntypedFormControl('', [Validators.required]),
    quantity: new UntypedFormControl('', [Validators.required]),
    paymentOption : new UntypedFormControl('', [Validators.required])
  });

  brandProducts: BrandProducts = {
    "MS-Xbox": [
      { name: "MS-Xbox GC ", price: 549 },
      { name: "MS-Xbox GC", price: 1049 },
      { name: "MS-Xbox GC ", price: 1649 },
      { name: "MS-Xbox GC", price: 349 },
      { name: "MS-Xbox GC", price: 749 },
      { name: "MS-Xbox GC", price: 1999 },
    ],
    "Sony-PSN": [
      { name: "Sony PSN GC", price: 500 },
      { name: "Sony PSN GC", price: 1000 },
      { name: "Sony PSN GC", price: 1200 },
      { name: "Sony PSN GC", price: 1500 },
      { name: "Sony PSN GC", price: 2000 },
      { name: "Sony PSN GC", price: 2300 },
      { name: "Sony PSN GC", price: 2500 },
      { name: "Sony PSN GC", price: 3000 },
      { name: "Sony PSN GC", price: 3500 },
      { name: "Sony PSN GC", price: 4000 },
      { name: "Sony PSN GC", price: 4500 },
      { name: "Sony PSN GC", price: 5000 },
      { name: "Sony PSN GC", price: 5800 },
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

    this.buyNowForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: [this.quantity],
      paymentOption: ['', Validators.required]
    })

  }
  ngAfterViewInit() {
    this.populateBrands();
  }

  openVoucherDetails(content: any, brand: string) {
    this.selectedBrand = brand;
    this.populateProducts(brand);
    // this.displayPrice('');
    this.offcanvasRef = this.offcanvasService.open(content, { position: 'end', keyboard: false });
  }

  populateBrands() {
    this.brandList = Object.keys(this.brandProducts);
  }

  populateProducts(brand: string) {
    this.productList = this.brandProducts[brand] || [];
  }

  onProductChange(event: Event) {
    const product = JSON.parse((event.target as HTMLSelectElement).value);
    this.selectedProduct = product['name'];
    this.selectedPrice = product['price'];
    this.totalPrice = product['price'];
  }

  onPurchaseNow() {
    this.purchaseNow = true;
    this.showPurchaseButton = false;
  }

  onSubmit(): void {
    console.log(this.buyNowForm.value)
  }

  updateTotalPrice(): void {
    const quantity = this.buyNowForm.get('quantity')?.value || 1;
    this.totalPrice = quantity * (this.selectedPrice);
  }

  
}
