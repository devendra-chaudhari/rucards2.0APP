import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { ApiService } from 'src/app/shared/services/api.service';
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";


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
  selector: 'app-assign-user-permission',
  templateUrl: './assign-user-permission.component.html',
  styleUrls: ['./assign-user-permission.component.scss']
})
export class AssignUserPermissionComponent {
  breadCrumbItems!: Array<{}>;
  user={
    user_name:null,
    user_id:null
  }
  permissions: Permission[] = [];// select all
  selectAllChecked: { [groupName: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toaster: ToastrService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    ) {
}


ngOnInit(): void {
    this.user.user_id = this.route.snapshot.paramMap.get('user_id');
    this.user.user_name = this.route.snapshot.paramMap.get('user_name');

    this.breadCrumbItems = [
        {label: 'Manage Permission'},
        {label: 'Set Role Default Permission', active: true}
    ];
    this.getAllPermissionsList();
    this.apiService.post('permission/get-user-based-permission', {"user_id":this.user.user_id, "user_name":this.user.user_name}).subscribe({
      next: (res) => {
          const jsonStringfy = JSON.stringify(res.data);
          const get_permissions = JSON.parse(jsonStringfy) ;

          // Merge the two arrays based on id and update the active value
          this.permissions = this.permissions.map((frontendPermission) => {
            const backendPermission = get_permissions.find(backendPerm => backendPerm.id === frontendPermission.id);
            
            if (backendPermission) {
              return { ...frontendPermission, active: backendPermission.active };
            }

          // If id is not found, return the original frontendPermission
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
      const payload={"user_id":this.user.user_id,"user_name":this.user.user_name, "permissions":permissions}
      this.apiService.post('permission/set-user-based-permission',payload).subscribe({
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
