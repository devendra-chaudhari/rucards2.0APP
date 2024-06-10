import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {Detail} from "../../shared/interfaces/details";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MessageService} from "../../shared/services/message.service";
import {SortService} from "../../shared/services/sort.service";
import {ExcelService} from "../../shared/services/excel.service";
import {DatePipe} from "@angular/common";


interface MiscList {
    id: number;
    name: string;
    active: boolean;
    category: { name: string; category_id: number; }
    created_at: string;
    updated_at: string;
}

@Component({
    selector: 'app-master',
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.scss'],
    providers: [DatePipe]
})


export class MasterComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    isMasterSubmit = false;
    categorys: Detail[] = [];
    miscs: MiscList[] = [];
    tempMiscs: MiscList[] = [];
    tempExcelData = [];
    title:string = '';
    miscId:number = 0;
    page:number = 1;
    pageSize:number = 10;
    total:number = 0;

    masterForm = new UntypedFormGroup({
        category_id: new UntypedFormControl('', [Validators.required]),
        name: new UntypedFormControl('', [Validators.required])
    });

    constructor(
        private modalService: NgbModal,
        private offCanvas: NgbOffcanvas,
        private apiService: ApiService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private messageService: MessageService,
        private sortService: SortService,
        private excelService: ExcelService,
        private dt: DatePipe
    ) {
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Administration'},
            {label: 'Master', active: true}
        ];
        this.getMaster(this.pageSize, this.page);
        this.getCategory();
    }

    get mf() {
        return this.masterForm.controls;
    }

    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredMiscs = this.tempMiscs.filter(x => x.name.toLowerCase().includes(searchTextLower) || x.category.name.toLowerCase().includes(searchTextLower));

        if (searchTextLower == '') {
            this.miscs = this.tempMiscs;
        } else
            this.miscs = filteredMiscs;
    }

    sort(column: string) {
        this.sortService.sort(column, this.miscs);
    }


    getCategory() {
        this.apiService.get('category/list').subscribe(res => {
            this.categorys = res.data;
        });
    }
    
    getMax() {
        return Math.min(this.page * this.pageSize, this.total);
    }

    getMaster(page_size, page_no) {
        this.apiService.post('misc/list', {'page_size':page_size, 'page_no':page_no}).subscribe(res => {
            console.log(res)
            this.miscs = res.data.misc_list;
            this.total=res.data.total;
            this.tempMiscs = res.data.misc_list;
            console.log(this.miscs)
        });

    }

    openMasterModal(content: any) {
        this.title = 'Add';
        this.miscId = 0;
        this.mf['category_id'].setValue('');
        this.mf['name'].setValue('');
        this.isMasterSubmit = false
        this.modalService.open(content, {centered: true, backdrop: "static", keyboard: false});
    }

    openEditMasterModal(content: any, misc: MiscList) {
        this.title = 'Edit';
        this.miscId = misc.id;
        this.mf['category_id'].setValue(misc.category['id']);
        this.mf['name'].setValue(misc.name);
        this.modalService.open(content, {centered: true, backdrop: "static", keyboard: false});
    }


    onSubmit() {
        this.isMasterSubmit = true;
        if (this.masterForm.invalid) {
            return;
        }

        this.spinner.show();
        if (this.miscId) {
            this.apiService.post(`misc/${this.miscId}/edit`, this.masterForm.value, 'put').subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.modalService.dismissAll();
                    this.spinner.hide();
                    this.getMaster(this.pageSize, this.page);
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        } else {
            this.apiService.post('misc/create', this.masterForm.value).subscribe({
                next: (res) => {
                    this.toastr.success(res.message);
                    this.modalService.dismissAll();
                    this.spinner.hide();
                    this.getMaster(this.pageSize, this.page);
                },
                error: (error) => {
                    this.toastr.error(error.error.error);
                    this.spinner.hide();
                }
            });
        }

    }

    onValueChange(active, misc: MiscList) {
        this.messageService.confirm(`Are you sure to ${active ? '' : 'In'}active master`, `${active ? 'A' : 'Ina'}ctive Master`).then(
            value => {
                if (value.isConfirmed) {
                    this.spinner.show();
                    if (active) {
                        this.apiService.post(`misc/active`, {"misc_id":misc.id}).subscribe({
                            next: (res) => {
                                this.toastr.success(res.message);
                                this.spinner.hide();
                                this.getMaster(this.pageSize, this.page);
                            },
                            error: (error) => {
                                this.toastr.error(error.error.error);
                                this.spinner.hide();
                            }
                        });
                    } else {
                        this.apiService.post(`misc/inactive`, {"misc_id":misc.id}).subscribe({
                            next: (res) => {
                                this.toastr.success(res.message);
                                this.spinner.hide();
                                this.getMaster(this.pageSize, this.page);
                            },
                            error: (error) => {
                                this.toastr.error(error.error.error);
                                this.spinner.hide();
                            }
                        });
                    }
                } else {
                    this.getMaster(this.pageSize, this.page);
                }
            }
        );

    }

    export_to_excel() {
        this.excelFields();
        const sortByField = null;
        const excludeFields = [];
        const columnOrder = ['serial_no', 'name', 'category_name', 'status', 'created_at', 'updated_at']
        this.excelService.exportAsExcelFile(this.tempExcelData, 'masterData', sortByField, excludeFields, columnOrder);
    }

    private excelFields() {
        let tempExcelData: any[] = [];
        for (let i = 0; i < this.miscs.length; i++) {
            //serial_no , name, category_name, status,created_at, updated_at
            const row = {
                'serial_no': i + 1,
                'name': this.miscs[i].name,
                'category_name': this.miscs[i].category.name,
                'status': this.miscs[i].active ? 'Active' : 'Inactive',
                'created_at': this.dt.transform(this.miscs[i].created_at, 'dd/MM/yyyy H:m:s'),
                'updated_at': this.dt.transform(this.miscs[i].updated_at ? this.miscs[i].updated_at : this.miscs[i].created_at, 'dd/MM/yyyy H:m:s')
            }
            tempExcelData.push(row);
        }
        this.tempExcelData = tempExcelData;
    }

    onPageChange(event: any){
        this.page = event
        this.getMaster(this.pageSize, this.page)
    }
    protected readonly Math = Math;
}
