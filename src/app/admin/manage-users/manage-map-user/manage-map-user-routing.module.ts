import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManageMapUserComponent} from "./manage-map-user.component";

const routes: Routes = [
  {path: '', component: ManageMapUserComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageMapUserRoutingModule { }
