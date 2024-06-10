import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelService} from "../../shared/services/excel.service";
import {SortService} from "../../shared/services/sort.service";
import {DatePipe} from "@angular/common";
import {MessageService} from "../../shared/services/message.service";

export interface WalletsIdName {
    wallet_id: string;
    wallet_name: string;
}

export interface Wallets {
    id: string;
    name: string;
    wallet_status: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

interface ProductList {
    id: number;
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
    wallet_id: number;
}


@Component({
    selector: 'app-manage-wallets',
    templateUrl: './manage-wallets.component.html',
    styleUrls: ['./manage-wallets.component.scss'],
    providers: [DatePipe]
})

export class ManageWalletsComponent implements OnInit{
    breadCrumbItems!: Array<{}>;
    wallets: Wallets[] = [];
    tempProduct_id = null;
    tempExcelData = [];
    tempWalletsData: Wallets[] = [];
    title: string = '';
    editWallet = {
        'wallet_name': null,
        'wallet_id': null
    }
    addWallet = {
        'wallet_name': null
    }
    page: number = 1;
    pageSize: number = 10;
    total: number = 0;
    products: ProductList[] = [];
    mapWallet_id: number = null;
    mapWallet_name: string = null

    checkWalletById: WalletsIdName[] = [];

    constructor(
        private modalService: NgbModal,
        private toaster: ToastrService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
        private excelService: ExcelService,
        private sortService: SortService,
        private dt: DatePipe,
        private messageService: MessageService,
    ) {
        this.getWallets();
        this.getProducts();
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Administration'},
            {label: 'Wallet Management', active: true}
        ];

    }

    getWallets() {
        this.apiService.post('wallet/rucards-wallet-list', {}).subscribe({
            next: (res) => {
                this.wallets = res.data.result
                this.total = res.data.total
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }, complete: () => {
            }
        });
    }

    sort(column: string) {
        this.sortService.sort(column, this.wallets);
    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.wallets.length);
    }

    export_to_excel() {
        this.excelFields();
        const sortByField = null;
        const excludeFields = [];
        const columnOrder = ['serial_no', 'name', 'product_name', 'status', 'created_at', 'updated_at']
        this.excelService.exportAsExcelFile(this.tempExcelData, 'WalletData', sortByField, excludeFields, columnOrder);
    }

    private excelFields() {
        let tempExcelData: any[] = [];
        for (let i = 0; i < this.wallets.length; i++) {
            const row = {
                'serial_no': i + 1,
                'name': this.wallets[i].name,
                'status': this.wallets[i].wallet_status ? 'Active' : 'Inactive',
                'created_at': this.dt.transform(this.wallets[i].created_at, 'dd/MM/yyyy H:m:s'),
                'updated_at': this.dt.transform(this.wallets[i].updated_at ? this.wallets[i].updated_at : this.wallets[i].created_at, 'dd/MM/yyyy H:m:s')
            }
            tempExcelData.push(row);
        }
        this.tempExcelData = tempExcelData;
    }

    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredMiscs = this.tempWalletsData.filter(x => x.name.toLowerCase().includes(searchTextLower));

        if (searchTextLower == '') {
            this.wallets = this.tempWalletsData;
        } else
            this.wallets = filteredMiscs;
    }

    onValueChange(active: boolean, wallet: Wallets) {
        this.messageService.confirm(`Are you sure to ${active ? '' : 'In'}active Wallet`, `${active ? 'A' : 'Ina'}ctive Wallet`).then(
            value => {
                if (value.isConfirmed) {
                    this.spinner.show().then(r => {
                        return r;
                    });
                    if (active) {
                        this.apiService.post('wallet/change-rucards-wallet-status', {"wallet_id": wallet.id, "wallet_status": "active"}).subscribe({
                            next: (res) => {
                                this.toaster.success(res.message);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            },
                            error: (error) => {
                                this.toaster.error(error.error.error);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            }, complete: () => {
                                this.getWallets();
                                this.modalService.dismissAll()
                                this.spinner.hide().then(r => {
                                    return r;
                                });

                            }
                        });
                    } else {
                        this.apiService.post('wallet/change-rucards-wallet-status', {"wallet_id": wallet.id, "wallet_status": "inactive"}).subscribe({
                            next: (res) => {
                                this.toaster.success(res.message);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            },
                            error: (error) => {
                                this.toaster.error(error.error.error);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            }, complete: () => {
                                this.getWallets();
                                this.modalService.dismissAll()
                                this.spinner.hide().then(r => {
                                    return r;
                                });

                            }
                        });
                    }
                } else {
                    this.getWallets();
                }
            }
        );

    }

    onValueProductChange(active: boolean, product: ProductList) {
        this.messageService.confirm(`Are you sure to ${active ? '' : 'Un'}map to Wallet`, `${active ? 'M' : 'Unm'}ap to Wallet`).then(
            value => {
                if (value.isConfirmed) {
                    this.spinner.show().then(r => {
                        return r;
                    });
                    if (active) {
                        this.apiService.post('wallet/product-map-to-wallet', {"product_id": product.id, "wallet_id": this.mapWallet_id}).subscribe({
                            next: (res) => {
                                this.toaster.success(res.message);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            },
                            error: (error) => {
                                this.toaster.error(error.error.error);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            }, complete: () => {
                                this.mapWallet_id = null
                                this.getProducts();
                                this.modalService.dismissAll()
                                this.spinner.hide().then(r => {
                                    return r;
                                });

                            }
                        });
                    } else {
                        this.apiService.post('wallet/product-unmap-to-wallet', {"product_id": product.id}).subscribe({
                            next: (res) => {
                                this.toaster.success(res.message);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            },
                            error: (error) => {
                                this.toaster.error(error.error.error);
                                this.spinner.hide().then(r => {
                                    return r;
                                });
                            }, complete: () => {
                                this.mapWallet_id = null
                                this.getProducts();
                                this.modalService.dismissAll()
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

    getProducts() {
        this.apiService.get('product/list').subscribe({
            next: (res) => {
                this.products = res.data
            },
            error: (error) => {
                this.toaster.error(error.error.error);
            }, complete: () => {
                this.getWallets();
                this.modalService.dismissAll()
                this.spinner.hide().then(r => {
                    return r;
                });
            }
        });
    }

    openEditWalletModal(content: any, wallet: any) {
        this.title = wallet.name
        this.editWallet.wallet_name = wallet.name
        this.editWallet.wallet_id = wallet.id
        this.modalService.open(content, {centered: true, keyboard: false});
    }

    openWalletModal(content: any) {
        this.modalService.open(content, {centered: true, keyboard: false});
    }

    onEditSubmit() {
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r => {
                return r;
            }
        );
        this.apiService.post('wallet/update-rucards-wallet', this.editWallet).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
                this.spinner.hide().then(r => {
                    return r;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => r);
            }, complete: () => {
                this.getWallets();
                this.modalService.dismissAll()
                this.editWallet.wallet_id = null
                this.editWallet.wallet_name = null
                this.spinner.hide().then(r => {
                    return r;
                });
            }
        });
    }

    onAddSubmit() {
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }).then(r => {
                return r;
            }
        );
        this.apiService.post('wallet/create-wallet', this.addWallet).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
                this.spinner.hide().then(r => {
                    return r;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => r);
            }, complete: () => {
                this.getWallets();
                this.modalService.dismissAll()
                this.addWallet.wallet_name = null
                this.spinner.hide().then(r => {
                    return r;
                });
            }
        });
    }

    openMapProductWalletModal(content: any, wallet: any) {
        this.getMapWalletNameById();
        this.mapWallet_id = wallet.id
        this.mapWallet_name = wallet.name
        this.modalService.open(content, {centered: true, keyboard: false});
    }

    openViewProductDetailsModal(content: any, wallet: any) {
        this.getMapWalletNameById()
        this.mapWallet_id = wallet.id
        this.mapWallet_name = wallet.name
        this.modalService.open(content, {centered: true, keyboard: false, size: "lg"});
    }

    getMapWalletNameById() {
        const tempCheckWalletId: WalletsIdName[] = []
        for (let i = 0; i < this.wallets.length; i++) {
            tempCheckWalletId.push(
                {
                    wallet_id: this.wallets[i].id,
                    wallet_name: this.wallets[i].name
                });
        }
        this.checkWalletById = tempCheckWalletId

    }

    onMapProductToWalletSubmit(product_id: number, mapWallet_id: number) {
        this.apiService.post('wallet/product-map-to-wallet', {"product_id": product_id, "wallet_id": mapWallet_id}).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
                this.spinner.hide().then(r => {
                    return r;
                });
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide().then(r => {
                    return r;
                });
            }, complete: () => {
                this.mapWallet_id = null;
                this.mapWallet_name = null;
                this.getProducts();
                this.modalService.dismissAll();
                this.tempProduct_id = null;
                this.spinner.hide().then(r => {
                    return r;
                });

            }
        });
    }

    unmapProductMapping(product_id: number) {
        this.apiService.post('wallet/product-unmap-to-wallet', {"product_id": +product_id}).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.mapWallet_id = null;
                this.mapWallet_name = null;
                this.getProducts();
                this.modalService.dismissAll();
                this.tempProduct_id = null;
                this.spinner.hide().then(r => {
                    return r;
                });

            }
        });
    }
}
