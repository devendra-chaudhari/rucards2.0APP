import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {OwlOptions} from "ngx-owl-carousel-o";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "../../shared/services/api.service";
import {ToastrService} from "ngx-toastr";
import {SortService} from "../../shared/services/sort.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from "ngx-spinner";

interface RolesInterFace {
    id: number;
    name: string;
    prefix: string;
}
interface Permission {
    active: boolean;
    created_at: string;
    description: string;
    display_name: string;
    group_name: string;
    id: number;
    updated_at: string;
}

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    providers: [DecimalPipe],
    changeDetection: ChangeDetectionStrategy.Default
})

export class RolesComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    roles: RolesInterFace[] = [];
    tempRoles: RolesInterFace[] = [];
    page = 1;
    pageSize: number = 10;

    role= {
        id:null,
        name:null,
        prefix:null
    }

    statistics_list: { name: string, user_count: number }[] = [];
    permissions: Permission[] = [];
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: false,
        navSpeed: 700,
        autoplay: true,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 4
            },
            940: {
                items: 4
            }
        },
        nav: false
    }

    constructor(
        private offCanvas: NgbOffcanvas,
        private apiService: ApiService,
        private toastr: ToastrService,
        private sortService: SortService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
    ) {

    }

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Administration'},
            {label: 'Roles', active: true}
        ];
        this.getRolesList();
    }

    onSearch(searchText: string): void {
        const searchTextLower = searchText.toLowerCase();
        const filteredRoles = this.tempRoles.filter(x => x.name.replace('_', ' ').toLowerCase().includes(searchTextLower));
        if (searchTextLower == '') {
            this.roles = this.tempRoles;
        } else {
            this.roles = filteredRoles;
        }
    }

    getMax() {
        return Math.min(this.page * this.pageSize, this.roles?.length ?? 0);
    }

    sort(column:string ) {
        this.sortService.sort(column, this.roles);
    }

    getRolesList() {
        this.apiService.get('role/list').subscribe({
            next: (res) => {
                this.roles = res.data.roles
                this.tempRoles = res.data.roles;
                this.statistics_list = res.data.statistics;
            }, error: (error) => {
                this.toastr.error(error.error.error);
            }
        });
    }
    // scroll modal for view default permissions role wise
    scrollModal(scrollDataModal: any, role) {
        this.role = role
        this.getAllPermissionsList();
        this.getDefaultRolePermission(role.id);
        this.modalService.open(scrollDataModal, { scrollable: true });
        
      }
      groupPermissionsByGroupName(): { [groupName: string]: Permission[] } {
        return this.permissions.reduce((groups: { [groupName: string]: Permission[] }, permission) => {
            const groupName = permission.group_name;
            groups[groupName] = groups[groupName] || [];
            groups[groupName].push(permission);
            return groups;
        }, {});
    }

      

    getDefaultRolePermission(id){
        this.apiService.post('role/role-default-permission-get', {"role_id":id}).subscribe({
            next: (res) => {
                const get_permissions = res.data;
                // Merge the two arrays based on id and update the active value
                this.permissions = this.permissions.map(frontendPermission => {
                    const backendPermission = get_permissions.find(backendPerm => backendPerm.id === frontendPermission.id);
    
                    if (backendPermission) {
                        return { ...frontendPermission, active: backendPermission.active };
                    }
    
                    return frontendPermission;
                    });
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    getAllPermissionsList() {
        this.spinner.show();
        this.apiService.get('permission/list').subscribe({
            next: (res) => {
                this.permissions = res.data.permissions;
                this.spinner.hide();
            },
            error: (error) => {
                this.toastr.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

}
