import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {MessageService} from "../../shared/services/message.service";
import {SortService} from "../../shared/services/sort.service";
import {ExcelService} from "../../shared/services/excel.service";
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";

interface Departments {
    id: number;
    name: string;
    active: boolean;
    description: string;
    created_at: string;
    updated_at: string;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
    providers: [DatePipe]
})

export class DepartmentComponent implements OnInit{
    breadCrumbItems!: Array<{}>;
    page:number = 1;
    pageSize:number = 10;
    total:number = 0;
    departments:Departments[]=[]
    tempExcelData:Departments[]=[]
    tempDepartments:Departments[]=[]
    addDepartment= {
        department_name:null,
        description:null
    }
    editDepartment= {
        department_id:null,
        department_name:null,
        description:null
    }
    isAddRoleDepartmentFormSubmit = false;
    AddRoleDepartmentForm: FormGroup = new FormGroup({
        role_name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required])
    });
    constructor(
        private modalService: NgbModal,
        private offCanvas: NgbOffcanvas,
        private apiService: ApiService,
        private toaster: ToastrService,
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
            {label: 'Department', active: true}
        ];
        this.getAllDepartments()
    }

    getAllDepartments(){
        this.apiService.get('department/get-department-list').subscribe(res => {
            this.departments=res.data.result;
            this.total=res.data.total;
        });
    }

    sort(column: string) {
        this.sortService.sort(column, this.departments);
    }

    onValueChange(active:boolean, department: Departments) {
        this.messageService.confirm(`Are you sure to ${active ? '' : 'In'}active master`, `${active ? 'A' : 'Ina'}ctive Master`).then(
            value => {
                if (value.isConfirmed) {
                    this.spinner.show();
                    if (active) {
                        this.apiService.post(`department/${department.id}/edit`, department, 'put').subscribe({
                            next: (res) => {
                                this.toaster.success(res.message);
                                this.spinner.hide();
                                this.getAllDepartments();
                            },
                            error: (error) => {
                                this.toaster.error(error.error.error);
                                this.spinner.hide();
                            }
                        });
                    } else {
                        this.apiService.get(`department/${department.id}/delete`, 'delete').subscribe({
                            next: (res) => {
                                this.toaster.success(res.message);
                                this.spinner.hide();
                                this.getAllDepartments();
                            },
                            error: (error) => {
                                this.toaster.error(error.error.error);
                                this.spinner.hide();
                            }
                        });
                    }
                } else {
                    this.getAllDepartments();
                }
            }
        );

    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.departments.length);
    }

    export_to_excel() {
        this.excelFields();
        const sortByField = null;
        const excludeFields = [];
        const columnOrder = ['serial_no', 'name', 'active', 'created_at', 'updated_at']
        this.excelService.exportAsExcelFile(this.tempExcelData, 'walletData', sortByField, excludeFields, columnOrder);
    }

    private excelFields() {
        let tempExcelData: any[] = [];
        for (let i = 0; i < this.departments.length; i++) {
            //serial_no , name, category_name, status,created_at, updated_at
            const row = {
                'serial_no': i + 1,
                'name': this.departments[i].name,
                'status': this.departments[i].active ? 'Active' : 'Inactive',
                'created_at': this.dt.transform(this.departments[i].created_at, 'dd/MM/yyyy H:m:s'),
                'updated_at': this.dt.transform(this.departments[i].updated_at ? this.departments[i].updated_at : this.departments[i].created_at, 'dd/MM/yyyy H:m:s')
            }
            tempExcelData.push(row);
        }
        this.tempExcelData = tempExcelData;
    }

    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredMiscs = this.tempDepartments.filter(x => x.name.toLowerCase().includes(searchTextLower) );

        if (searchTextLower == '') {
            this.departments = this.tempDepartments;
        } else
            this.departments = filteredMiscs;
    }

    onEditDepartmentSubmit(){
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
                return r;
            }
        );
        this.apiService.post('department/update_department', this.addDepartment).subscribe({
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
                this.getAllDepartments();
                this.modalService.dismissAll()
                this.editDepartment.department_name = null
                this.editDepartment.department_id = null
                this.editDepartment.description = null
                this.spinner.hide().then(r => {
                    return r;
                });
            }
        });
    }

    onAddDepartmentSubmit(){
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
                return r;
            }
        );
        this.apiService.post('department/create_department', this.addDepartment).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
                this.spinner.hide()

            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide()

            }, complete: () => {
                this.getAllDepartments();
                this.modalService.dismissAll()
                this.addDepartment.department_name = null
                this.addDepartment.description = null
                this.spinner.hide()
            }
        });
    }

    onDeleteDepartmentSubmit(department:Departments){
        // spinner
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }
        );
        this.apiService.post('department/delete_department', {"department_id":department.id}).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide();
                this.getAllDepartments();
                this.modalService.dismissAll()
            }
        });
    }

    openDepartmentModal(content: any) {
        this.modalService.open(content, {centered: true, keyboard: false});
    }

    openEditDepartmentModal(content: any, department:Departments){
        this.editDepartment.department_name = department.name
        this.editDepartment.department_id = department.id
        this.editDepartment.description = department.description
        this.modalService.open(content, {centered: true, keyboard: false});
    }

    get rf() {
        return this.AddRoleDepartmentForm.controls;
    }

    onAddRoleDepartmentSubmit(department:Departments){
        this.isAddRoleDepartmentFormSubmit = true;
        if (this.AddRoleDepartmentForm.invalid) {
            return;
        }
        const data = {
            "role_name": this.rf['role_name'].value,
            "description": this.rf['description'].value,
            "department_id":department.id
        }
        this.spinner.show(undefined,
            {
                type: 'ball-scale-multiple',
                size: 'medium',
                bdColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fullScreen: true
            }
        );
        this.apiService.post('department/create_department_role', data).subscribe({
            next: (res) => {
                this.toaster.success(res.message);
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.AddRoleDepartmentForm.reset()
                this.spinner.hide();
                this.getAllDepartments();
                this.modalService.dismissAll()
            }
        });
    }

    centerModal(centerDataModal: any) {
        this.modalService.open(centerDataModal, {centered: false});
    }

    centerCreateDepartmentRoleModal(centerDataModal: any) {
        this.modalService.open(centerDataModal, {centered: true});
    }
}
