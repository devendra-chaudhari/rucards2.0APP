import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManageWalletsComponent} from "./manage-wallets.component";

const routes: Routes = [
  {path: '', component: ManageWalletsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageWalletsRoutingModule { }
