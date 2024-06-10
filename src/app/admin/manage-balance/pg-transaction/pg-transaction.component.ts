import { Component } from '@angular/core';

@Component({
  selector: 'app-pg-transaction',
  templateUrl: './pg-transaction.component.html',
  styleUrls: ['./pg-transaction.component.scss']
})
export class PgTransactionComponent {
  breadCrumbItems!: Array<{}>;

  pageSize: number = 10;
  page: number = 1;
  totalRecords: number = 0;
  transactions :{
    date : string,
    transaction_id : string,
    mode: string,
    gateway :string,
    utr: string,
    amount : number,
    status: string
  }[] = [
    {
      'date' : '29-08-2023',
      'transaction_id' : 'T12345678901234',
      'mode': "UPI",
      'gateway' :"CASHFREE",
      'utr': "3256987541256",
      'amount' : 4040,
      'status': "Success"
    },{
      'date' : '29-08-2023',
      'transaction_id' : 'T12345678901234',
      'mode': "UPI",
      'gateway' :"CASHFREE",
      'utr': "3256987541256",
      'amount' : 4040,
      'status': "Failed"
    },{
      'date' : '29-08-2023',
      'transaction_id' : 'T12345678901234',
      'mode': "UPI",
      'gateway' :"CASHFREE",
      'utr': "3256987541256",
      'amount' : 4040,
      'status': "Success"
    },{
      'date' : '29-08-2023',
      'transaction_id' : 'T12345678901234',
      'mode': "UPI",
      'gateway' :"CASHFREE",
      'utr': "3256987541256",
      'amount' : 4040,
      'status': "Failed"
    },
  ]

  ngOnInit(): void {
    this.breadCrumbItems = [
        { label: 'PG Transactions' }, 
        { label: 'Payment Gateway', active: true }
      ];

        
  }
}
