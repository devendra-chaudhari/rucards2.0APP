import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManageSubAdminComponent} from "./manage-sub-admin.component";

const routes: Routes = [
  {path: '', component:ManageSubAdminComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSubAdminRoutingModule { }
