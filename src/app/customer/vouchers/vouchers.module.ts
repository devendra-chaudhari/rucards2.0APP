import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';
import { RuGamingVouchersComponent } from './ru-gaming-vouchers/ru-gaming-vouchers.component';
import { RuSubscriptionsComponent } from './ru-subscriptions/ru-subscriptions.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    SimplebarAngularModule
  ]
})
export class VouchersModule { }
