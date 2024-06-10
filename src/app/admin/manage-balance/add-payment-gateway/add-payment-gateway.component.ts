import { Component } from '@angular/core';

@Component({
  selector: 'app-add-payment-gateway',
  templateUrl: './add-payment-gateway.component.html',
  styleUrls: ['./add-payment-gateway.component.scss']
})
export class AddPaymentGatewayComponent {
  // for title add-payment-gateway
  breadCrumbItems!: Array<{}>;
}
