import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessReportComponent } from './business-report/business-report.component';
import { PendingTransactionsComponent } from './pending-transactions/pending-transactions.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UiSwitchModule } from 'ngx-ui-switch';

const routes: Routes = [
  { path: 'business-report', component: BusinessReportComponent },
  { path: 'pending-transactions', component: PendingTransactionsComponent },
];

@NgModule({
  declarations: [
    BusinessReportComponent,
    PendingTransactionsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlatpickrModule.forRoot(),
    SharedModule,
    NgbModule,
    SimplebarAngularModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    UiSwitchModule.forRoot({
      size: 'small',
      checkedLabel: 'Active',
      uncheckedLabel: 'Inactive',
      defaultBgColor: 'red',
      checkedTextColor: 'white',
      uncheckedTextColor: 'white'
    }),
  ]
})
export class ManageTransactionsModule { }
