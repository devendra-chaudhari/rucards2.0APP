import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department.component';
import {DepartmentWiseUserComponent} from "./department-wise-user/department-wise-user.component";

const routes: Routes = [
  {path: 'department', component:DepartmentComponent},
  {path:'department-wise-user', component:DepartmentWiseUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
