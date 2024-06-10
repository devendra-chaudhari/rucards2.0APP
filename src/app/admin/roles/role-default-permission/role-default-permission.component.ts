import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "../../../shared/services/message.service";
import {ToastrService} from "ngx-toastr";
import {ApiService} from "../../../shared/services/api.service";
import {NgxSpinnerService} from "ngx-spinner";
import { values } from 'lodash';


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
    selector: 'app-role-default-permission',
    templateUrl: './role-default-permission.component.html',
    styleUrls: ['./role-default-permission.component.scss']

})

export class RoleDefaultPermissionComponent implements OnInit {
    role_id: string = null;
    role_name: string = null;

    // select all
    selectAllChecked: { [groupName: string]: boolean } = {};
    breadCrumbItems!: Array<{}>;
    permissions: Permission[] = [];
    data = null
    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private toaster: ToastrService,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit(): void {
        this.role_id = this.route.snapshot.paramMap.get('role_id');
        this.role_name = this.route.snapshot.paramMap.get('role_name');

        this.breadCrumbItems = [
            {label: 'Manage Permission'},
            {label: 'Set Role Default Permission', active: true}
        ];
        this.getAllPermissionsList();

        this.apiService.post('role/role-default-permission-get', {"role_id":this.role_id}).subscribe({
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
                this.toaster.error(error.error.error);
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
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }
        });
    }

    groupPermissionsByGroupName(): { [groupName: string]: Permission[] } {
        return this.permissions.reduce((groups: { [groupName: string]: Permission[] }, permission) => {
            const groupName = permission.group_name;
            groups[groupName] = groups[groupName] || [];
            groups[groupName].push(permission);
            return groups;
        }, {});
    }

    selectAll(permissions: any[]) {
        const groupName = permissions[0].group_name; // Assuming group name is the same for all permissions in a group
    
        // Toggle the "Select All" state for the group
        this.selectAllChecked[groupName] = !this.selectAllChecked[groupName];
        
        // Update the "active" state of individual permissions
        permissions.forEach(permission => {
          permission.active = this.selectAllChecked[groupName];
        });
      }
    
      togglePermission(permission: any, groupName: string) {
        // Update the "active" state of individual permission
        permission.active = !permission.active;
    
        // Check if all permissions in the group are selected, and update the "Select All" state accordingly
        const allSelected = this.groupPermissionsByGroupName()[groupName].every(p => p.active);
        this.selectAllChecked[groupName] = allSelected;
      }

      submitPermissions() {
       const permissions = []
       const keys = Object.keys(this.groupPermissionsByGroupName())
        for (const key of keys){
            const values = this.groupPermissionsByGroupName()[key]
            for (const value of values){
                permissions.push({ 'id': value['id'], 'active': value['active'] });
                
            }
        }
        const payload={"role_id":this.role_id,"role_name":this.role_name, "permissions":permissions}
        this.apiService.post('role/role-default-permission-set',payload).subscribe({
            next: (res) => {                
                this.toaster.success(res.message);
                this.spinner.hide();
            },
            error: (error) => {
                this.toaster.error(error.error.error);
                this.spinner.hide();
            }
        });
       
      }
    

}
