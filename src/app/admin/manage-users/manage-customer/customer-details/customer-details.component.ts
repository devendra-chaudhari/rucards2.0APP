import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html'
})
export class CustomerDetailsComponent implements OnInit {
    breadCrumbItems!: Array<{}>;

    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Manage Users'},
            {label: 'Customer Details', active: true}
        ];

    }
}
