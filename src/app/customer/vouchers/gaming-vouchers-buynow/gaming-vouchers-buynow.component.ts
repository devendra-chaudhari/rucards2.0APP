import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-gaming-vouchers-buynow',
  standalone: true,
  imports: [NgbModule, CarouselModule,CommonModule,RouterModule],
  templateUrl: './gaming-vouchers-buynow.component.html',
  styleUrl: './gaming-vouchers-buynow.component.scss'
})
export class GamingVouchersBuynowComponent implements OnInit {

  leftItems : any[] = [];
  quantity: number = 0;

constructor() { }

ngOnInit(): void {
  this.leftItems  = [
    {  title: 'Title 1', price: 50 },
    {  title: 'Title 2', price: 75 },
    {  title: 'Title 3', price: 100 },
    {  title: 'Title 4', price: 125 }
    // Add more items as needed
  ];
}

  increment() {
    this.quantity += 1;
  }

  decrement() {
    if (this.quantity > 0) {
      this.quantity -= 1;
    }
  }
}