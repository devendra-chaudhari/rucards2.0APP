import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManualRefundComponent} from "./manual-refund.component";

const routes: Routes = [
  {path: '',component: ManualRefundComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualRefundRoutingModule { }
