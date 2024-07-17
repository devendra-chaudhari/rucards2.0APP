import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-subscription-vouchers',
  standalone: true,
  imports: [NgbModule, CarouselModule,CommonModule,RouterModule],
  templateUrl: './subscription-vouchers.component.html',
  styleUrl: './subscription-vouchers.component.scss'
})
export class SubscriptionVouchersComponent {
  @ViewChild('targetSection', { static: false }) targetSection!: ElementRef;

  carouselOptions = {
    items: 1,
    loop: true,
    nav: false, // Disable navigation
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true
};

images = [
    { image: 'assets/images/gaming/slider-2.jpg', alt: 'First slide', description: 'Fusce erat dui, venenatis et erat in, vulputate dignissim lacus. Donec vitae tempus dolor, sit amet elementum lorem. Ut cursus tempor turpis.' },
    { image: 'assets/images/gaming/review-bg.png', alt: 'Second slide', description: 'Fusce erat dui, venenatis et erat in, vulputate dignissim lacus. Donec vitae tempus dolor, sit amet elementum lorem. Ut cursus tempor turpis.' }
];

constructor() { }

ngOnInit(): void {
}
scrollToSection() {
  this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
}
}