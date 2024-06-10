import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {MessageService} from "../../shared/services/message.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../shared/services/excel.service";

interface ProductList {
    id: number;
    product_image: string;
    product_name: string;
    product_code: string;
    product_type: string;
    branding_category: string;
    service_provider: string;
    product_description: null
    created_user: string;
    product_series: string;
    active: boolean;
    created_at: string;
    wallet_id:string;
    partners_id:number;
    partners_name:string;
}

interface APIPartners{
    id: number;
    name: string;
    description:string;
    contact_number:number;
    email:string;
    created_at:string;
    updated_at:string;
    active:boolean;
}

export interface Wallets {
    id: string;
    name: string;
    wallet_status: string;
    created_at: string;
    updated_at: string;
    active:boolean;
}

export interface  ProductsIdName{
    product_id:number;
    product_name:string;
}

@Component({
    selector: 'app-manage-product',
    templateUrl: './manage-product.component.html'
})
export class ManageProductComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    isProductSubmit = false;
    title = '';
    productID = 0;
    product_id = null;
    page = 1;
    pageSize = 10;
    products: ProductList[] = [];
    tempProducts: ProductList[] = [];
    SERIES_REGEX = /^\d{6}$/;
    checkWalletById:ProductsIdName[]=[];
    wallets:Wallets[]=[];
    api_partners:APIPartners[]=[];
    wallet_id = null;
    product_wallet_id = null;
    productForm = new UntypedFormGroup({
        product_id: new UntypedFormControl(''),
        product_code: new UntypedFormControl('', [Validators.required]),
        product_name: new UntypedFormControl('', [Validators.required]),
        product_type: new UntypedFormControl('', [Validators.required]),
        branding_category: new UntypedFormControl('', [Validators.required]),
        service_provider: new UntypedFormControl('', [Validators.required]),
        product_description: new UntypedFormControl(''),
        product_series: new UntypedFormControl('', [Validators.required, Validators.pattern(this.SERIES_REGEX)]),
    });
    serviceProviderName:string = "";
    serviceProviderId:number|null ; 
    filterData = {
        product_type: '',
        active: true,
        branding_category: ''
    }

    constructor(
        private offCanvas: NgbOffcanvas,
        private toastr: ToastrService,
        private apiService: ApiService,
        private messageService: MessageService,
        private spinner: NgxSpinnerService,
        private exportService: ExcelService,
        private modalService: NgbModal
    ) {
        this.getWallets()
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Admin'},
            {label: 'Manage Product', active: true}
        ];
        this.getProducts();
    }

    get pf() {
        return this.productForm.controls;
    }

    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredProducts = this.tempProducts.filter(x => x.product_name.toLowerCase().includes(searchTextLower) || x.product_code.toLowerCase().includes(searchTextLower) || x.product_type.toLowerCase().includes(searchTextLower) || x.branding_category.toLowerCase().includes(searchTextLower));

        if (filteredProducts.length > 0) {
            this.products = filteredProducts;
        } else {
            this.products = this.tempProducts;
        }
    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.products?.length ?? 0);
    }

    getProducts() {
        this.apiService.get('product/product_list').subscribe(res => {
            this.products = res.data;
            this.tempProducts = res.data;
        });
    }

    getApiPartners(){
        this.apiService.get('api_partner/api_partner_list').subscribe(res => {
            this.api_partners = res.data.list;
        });
    }

    onFilter() {
        this.spinner.show();
        this.apiService.get('product/list', 'get', this.filterData).subscribe(res => {
            this.products = res.data;
            this.tempProducts = res.data;
            this.spinner.hide();
        
        });
    }

    onValueChange(active:boolean, product: ProductList) {
        this.messageService.confirm(`Are you sure to ${active ? '' : 'In'}active Product`, `${active ? 'A' : 'Ina'}ctive Product`).then(
            value => {
                if (value.isConfirmed) {
                    this.spinner.show().then(r => {
                        return r;
                    });
                    if (active) {
                        this.apiService.post('product/active', {"product_id":product.id}).subscribe({
                            next: (res) => {
                                this.toastr.success(res.message);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            },
                            error: (error) => {
                                this.toastr.error(error.error.error);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            }, complete: () => {
                                this.getProducts();
                                this.offCanvas.dismiss()
                                this.spinner.hide().then(r => {
                                    return r;
                                });

                            }
                        });
                    } else {
                        this.apiService.post('product/inactive', {"product_id":product.id}).subscribe({
                            next: (res) => {
                                this.toastr.success(res.message);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            },
                            error: (error) => {
                                this.toastr.error(error.error.error);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            }, complete: () => {
                                this.getProducts();
                                this.offCanvas.dismiss()
                                this.spinner.hide().then(r => {
                                    return r;
                                });

                            }
                        });
                    }
                } else {
                    this.getProducts();
                }
            }
        );

    }

    openAddProduct(addProduct: TemplateRef<any>) {
        this.productForm.reset();
        this.getApiPartners();
        this.title = 'Add';
        this.productID = 0;
        this.isProductSubmit = false;
        this.offCanvas.open(addProduct, {position: 'end'});
    }

    openEditProduct(addProduct: TemplateRef<any>, product: ProductList) {
        this.productForm.reset();
        this.getApiPartners();
        this.title = 'Edit';
        this.serviceProviderName =product.service_provider
        this.pf['product_name'].setValue(product.product_name);
        this.pf['product_id'].setValue(product.id);
        this.pf['product_code'].setValue(product.product_code);
        this.pf['product_type'].setValue(product.product_type);
        this.pf['branding_category'].setValue(product.branding_category);
        this.pf['service_provider'].setValue(product.service_provider);
        this.pf['product_description'].setValue(product.product_description);
        this.pf['product_series'].setValue(product.product_series);
        this.offCanvas.open(addProduct, {position: 'end'});
    }

    onSubmit() {
        console.log("submit", this.title, this.productForm.value)
        this.isProductSubmit = true;
        // if (this.productForm.invalid) {
        //     return;
        // }
        this.spinner.show();
        if(this.title === "Add") {
            console.log("inside")
            this.apiService.post('product/create', this.productForm.value).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.spinner.hide();
                    this.offCanvas.dismiss();
                    this.getProducts();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }
        if (this.title === "Edit") {
            console.log("inside edit")
            this.apiService.post(`product/edit`, this.productForm.value).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.spinner.hide();
                    this.offCanvas.dismiss();
                    this.getProducts();
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        } 
    }

    onExport() {
        const sortByField = 'product_name';
        const excludedFields = ['created_at', 'active', 'product_image'];
        const columnOrder = ['id', 'product_name', 'product_code', 'product_type', 'branding_category', 'service_provider'];
        this.exportService.exportAsExcelFile(this.products, 'products', sortByField, excludedFields, columnOrder);
    }

    getWallets(){
        this.apiService.post('wallet/rucards-wallet-list',{}).subscribe({
            next: (res) => {
                this.wallets = res.data.result
            },
            error: (error) => {
                this.toastr.error(error.error.error);
            }, complete: () => {}
        });
    }



}
