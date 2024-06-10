import { Component } from '@angular/core';

@Component({
  selector: 'app-view-pg-orders',
  templateUrl: './view-pg-orders.component.html',
  styleUrls: ['./view-pg-orders.component.scss']
})
export class ViewPgOrdersComponent {
  breadCrumbItems!: Array<{}>;

  pageSize: number = 10;
  page: number = 1;
  totalRecords: number = 0;

payments :{
    date : string,
    time : string,
    gateway :string,
    wallet: string,
    transaction_id: string,
    amount : number,
    status: string
}[] = [
  {
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Initiated'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Success'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Initiated'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Failed'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Initiated'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Initiated'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Initiated'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Initiated'
  },{
    'date':'12-05-2023',
    'time':'12:59',
    'gateway': 'CASHFREE',
    'wallet': "PREPAID WALLET",
    'transaction_id': "T123456789452145",
    'amount' : 15000,
    'status' : 'Initiated'
  }
]



  ngOnInit(): void {
    this.breadCrumbItems = [
        { label: 'View PG orders' }, 
        { label: 'Payment Gateway', active: true }
      ];

        
  }
}
