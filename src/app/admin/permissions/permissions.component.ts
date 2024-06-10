import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../../shared/services/api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Detail} from "../../shared/interfaces/details";

import {ExcelService} from "../../shared/services/excel.service";
import {DatePipe} from "@angular/common";
import { Router } from '@angular/router';


interface PermissionList {
    id: number;
    display_name: string;
    group_name: string;
    active: boolean;
    description: string;
    created_at: string;
    updated_at: string;
}


@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    providers: [DatePipe]
})
export class PermissionsComponent implements OnInit {
    @ViewChild('editDialog') editDialog!: TemplateRef<any>; // Reference to the ng-template
    selected_Permission: PermissionList; // Property to hold the permission object

    breadCrumbItems!: Array<{}>;
    title = '';
    permissionId = 0;
    permissions: PermissionList[] = [];
    tempPermissions: PermissionList[] = [];
    isPermissionSubmit = false;
    page = 1;
    pageSize = 10;
    permissionGroup: Detail[] = [];

    permissionForm = new UntypedFormGroup({
        group: new UntypedFormControl(null, [Validators.required]),
        display_name: new UntypedFormControl('', [Validators.required]),
        description: new UntypedFormControl(null, [Validators.required]),
    });
    currentPage: number = 1;
    total: number = 0;

    tempExcelData : any[];

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private excelService: ExcelService,
        private dt: DatePipe,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Administration'},
            {label: 'Permission', active: true}
        ];

        this.getAllPermission();
        this.getPermissionGroup();
    }

    get pf() {
        return this.permissionForm.controls;
    }

    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredPermissions = this.tempPermissions.filter(x => x.display_name.toLowerCase().includes(searchTextLower));
        if (filteredPermissions) {
            this.permissions = filteredPermissions;
        } else {
            this.permissions = this.tempPermissions;
        }
    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.permissions?.length ?? 0);
    }

    openPermission(content: any) {
        this.title = 'Add';
        this.permissionId = 0;
        this.permissionForm.reset();
        this.isPermissionSubmit = false;
        this.modalService.open(content, {centered: true, keyboard: false});
    }
    

    getAllPermission() {
        this.apiService.get('permission/list').subscribe(res => {
            this.permissions = res.data.permissions;
            this.total = res.data.total;
            this.tempPermissions = res.data.permissions;
        });
    }

    getPermissionGroup() {
        this.apiService.get('permission/group_list').subscribe(res => {
            this.permissionGroup = res.data;
        });
    }

    onCreatePermission() {
        this.isPermissionSubmit = true;
        if (this.permissionForm.invalid) {
            return;
        }

        this.spinner.show();
        this.apiService.post('permission/create', this.permissionForm.value).subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.spinner.hide();
                this.permissionForm.controls['display_name'].setValue('');
                this.permissionForm.controls['description'].setValue('N/A');
                this.getAllPermission();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }

    getStartIndex(): number {
        return (this.currentPage - 1) * this.pageSize + 1;
    }


    openEditDialog(permission: any) {
        this.selected_Permission = permission; // Assign the permission object to the component property
        this.modalService.open(this.editDialog);
    }

    saveChanges() {
        this.spinner.show();
        this.apiService.post(`permission/${this.selected_Permission.id}/edit`, this.selected_Permission, 'PUT').subscribe({
            next: (res) => {
                this.toastr.success(res.message);
                this.spinner.hide();
                this.getAllPermission();
                this.modalService.dismissAll();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }, complete: () => {
                this.spinner.hide();
            }
        });
    }

    export_to_excel() {
        this.excelFields();
        const sortByField = null;
        const excludeFields = [];
        const columnOrder = ['serial_no', 'name', 'group_name', 'status', 'created_at', 'updated_at']
        this.excelService.exportAsExcelFile(this.tempExcelData, 'masterData', sortByField, excludeFields, columnOrder);
    }

    private excelFields() {
        let tempExcelData: any[] = [];
        for (let i = 0; i < this.permissions.length; i++) {
            //serial_no , name, category_name, status,created_at, updated_at
            const row = {
                'serial_no': i + 1,
                'name': this.permissions[i].display_name.toUpperCase(),
                'group_name': this.permissions[i].group_name,
                'status': this.permissions[i].active ? 'Active' : 'Inactive',
                'created_at': this.dt.transform(this.permissions[i].created_at, 'dd/MM/yyyy H:m:s'),
                'updated_at': this.dt.transform(this.permissions[i].updated_at ? this.permissions[i].updated_at : this.permissions[i].created_at, 'dd/MM/yyyy H:m:s')
            }
            tempExcelData.push(row);
        }
        this.tempExcelData = tempExcelData;
    }

    redirectToPage(event: any) {
        const selectedValue = event.target.value;
        const [id, name] = selectedValue.split('_');
        this.router.navigate(['/admin/roles/role-wise-users/'+ id +'/'+ name]);
    }


}
