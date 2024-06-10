import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit{
  breadCrumbItems!: Array<{}>;
  maxDob: string;
  isFormSubmitted = false;


  constructor() {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      {label: 'Manage Customer'},
      {label: 'Edit Customer', active: true}
    ];
  }

  onGetPincodeDetail() {

  }
}
