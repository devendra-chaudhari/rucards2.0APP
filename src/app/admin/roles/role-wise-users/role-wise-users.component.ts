import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { ApiService } from 'src/app/shared/services/api.service';
import {ToastrService} from "ngx-toastr";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from "ngx-spinner";

interface CorporateUserList {
    "aadhar_no": string;
    "active": boolean;
    "address": string;
    "balance": number;
    "city": string;
    "created_at": string;
    "district": string;
    "dob": string;
    "email": string;
    "father_name": string;
    "full_name": string;
    "gender": string;
    "id": string;
    "kyc_type": string;
    "mobile": string;
    "pan": string;
    "pincode": string;
    "role": string;
    "state": string;
    "username": string;
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
    selector: 'app-role-wise-users',
    templateUrl: './role-wise-users.component.html',
    styleUrls: ['./role-wise-users.component.scss']
})
export class RoleWiseUsersComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    role = {
        role_id : null ,
        role_name : null
    }
    user = {
        user_id: null,
        user_name : null
    }
    permissions: Permission[] = [];
    users: CorporateUserList[] = [];
    page = 1;
    pageSize: number = 10;
    totalUsers: number = 0;
    roleId = ""
    
    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            // Retrieve the parameters from the route
            this.role.role_id = params.get('role_id');
            this.role.role_name = params.get('role_name');
            // Now you can use this.roleId and this.roleName in your component
          });

        this.breadCrumbItems = [
            {label: 'Manage Users'},
            {label: 'Role-wise Users List', active: true}
        ];
        this.getRoleWiseUserList(this.role.role_id)
    }

    getRoleWiseUserList(payload){
        this.apiService.post('role/role-wise-list',{'role_id':payload}).subscribe({
            next: (res) => {
                this.users = res.data
            }, error: (error) => {
                this.toastr.error(error.error.error);
            }
        });
    }

    protected readonly Math = Math;

    // scroll modal for view user based permissions
    scrollModal(scrollDataModal: any, user) {
        this.getAllPermissionsList();
        this.getDefaultRolePermission(user.id,user.full_name);
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

      

    getDefaultRolePermission(id,name){
        this.apiService.post('permission/get-user-based-permission', {"user_id":id,"user_name":name}).subscribe({
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
