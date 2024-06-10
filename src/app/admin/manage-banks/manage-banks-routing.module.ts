import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManageBanksComponent} from "./manage-banks.component";

const routes: Routes = [
  {path: '', component:ManageBanksComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageBanksRoutingModule { }
