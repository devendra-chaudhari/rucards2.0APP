import { Component } from '@angular/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  breadCrumbItems!: Array<{}>;
  page_no : number = 1;
  page:number = 1;
  pageSize:number = 10;
  total:number = 0;
  totalRecords: number = 0;

  getMax() {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }
}
