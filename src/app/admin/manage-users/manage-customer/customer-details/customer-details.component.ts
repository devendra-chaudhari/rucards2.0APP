import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';


interface CustomerData{
    id: string;
    username: string;
    full_name: string;
    father_name: string;
    gender: string;
    mobile: string;
    pincode: string;
    email: string;
    dob: string;
    pan: string;
    state: string;
    district: string;
    balance: string;
    retailer: string;
    distributor: string;
    admin: string;
    super_distributor: string;
    active: boolean;
    created_at: string;
    role: string;
    parent_username: string;
    parent_full_name: string;
    kyc_type: string;
    address: string;
    user_type: string;
}

@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html'
})
export class CustomerDetailsComponent implements OnInit {
    breadCrumbItems!: Array<{}>;

    customer_data:CustomerData = {
        id: '',
        username:'',
        full_name: '',
        father_name: '',
        gender: '',
        mobile: '',
        pincode: '',
        email: '',
        dob: '',
        pan: '',
        state: '',
        district: '',
        balance: '',
        retailer: '',
        distributor: '',
        admin: '',
        super_distributor: '',
        active: false,
        created_at: '',
        role: '',
        parent_username: '',
        parent_full_name: '',
        kyc_type: '',
        address: '',
        user_type: ''
    }
    firstName: string;
    lastName: string;

    constructor(
        private route: ActivatedRoute,
    ){}

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Manage Users'},
            {label: 'Customer Details', active: true}
        ];
        this.route.queryParams.subscribe(params => {
            console.log(params['kyc_type'])
            this.customer_data.id = params['id'];
            this.customer_data.username = params['username'];
            this.customer_data.full_name = params['full_name'];
            this.customer_data.father_name = params['father_name'];
            this.customer_data.gender = params['gender'];
            this.customer_data.mobile = params['mobile'];
            this.customer_data.pincode = params['pincode'];
            this.customer_data.email = params['email'];
            this.customer_data.dob = params['dob'];
            this.customer_data.pan = params['pan'];
            this.customer_data.state = params['state'];
            this.customer_data.district = params['district'];
            this.customer_data.balance = params['balance'];
            this.customer_data.retailer = params['retailer'];
            this.customer_data.distributor = params['distributor'];
            this.customer_data.super_distributor = params['super_distributor'];
            this.customer_data.active = params['active'];
            this.customer_data.created_at = params['created_at'];
            this.customer_data.role = params['role'];
            this.customer_data.parent_username = params['parent_username'];
            this.customer_data.parent_full_name = params['full_name'];
            this.customer_data.kyc_type = params['kyc_type'];
            this.customer_data.address = params['address'];
            this.customer_data.user_type = params['user_type'];
          })
          this.updateFirstName()
        }

        updateFirstName() {
            const fullName = this.customer_data.full_name;
            const firstName = fullName.split(' ')[0];
            const lastName = fullName.split(' ')[1];
            this.firstName = firstName;
            this.lastName = lastName;
          }

}
