import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule,SharedModule,RouterModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {

  breadCrumbItems!:Array<{}>;

  ngOnInit(){
    this.breadCrumbItems=[
      { label: 'Distributor' },
      { label: 'Retailer Fund Request', active: true },
    ];
  }

}
