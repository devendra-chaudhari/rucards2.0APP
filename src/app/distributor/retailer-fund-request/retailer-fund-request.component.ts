import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-retailer-fund-request',
  standalone: true,
  imports: [CommonModule, SharedModule,RouterModule],
  templateUrl: './retailer-fund-request.component.html',
  styleUrl: './retailer-fund-request.component.scss'
})
export class RetailerFundRequestComponent {

  breadCrumbItems!: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Distributor' },
      { label: 'Retailer Fund Request', active: true },
    ];
  }

}
