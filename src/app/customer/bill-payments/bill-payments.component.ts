import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-bill-payments',
    templateUrl: './bill-payments.component.html',
    styles: [`
      .services {
        transition: all 0.3s ease-out;
      }

      .services:hover {
        background: rgb(180, 188, 234);
        transform: scale(1.1);
        box-shadow: 0 1rem 3rem rgb(206, 218, 246);
      }
    `]
})
export class BillPaymentsComponent implements OnInit {
    breadCrumbItems!: Array<{}>;
    bbpsStep = 1;
    label = '';

    bbpsServices = [
        {
            category: 'recharges',
            services: [
                {
                    id: 1,
                    img: 'assets/images/bbps/C00.svg',
                    title: 'Mobile Recharge'
                },
                {
                    id: 2,
                    img: 'assets/images/bbps/C03.svg',
                    title: 'DTH'
                },
                {
                    id: 3,
                    img: 'assets/images/bbps/C10.svg',
                    title: 'FASTag'
                },
                {
                    id: 4,
                    img: 'assets/images/bbps/C06.svg',
                    title: 'Cable TV'
                }
            ]
        },
        {
            category: 'utilities',
            services: [
                {
                    id: 1,
                    img: 'assets/images/bbps/C04.svg',
                    title: 'Electricity'
                },
                {
                    id: 2,
                    img: 'assets/images/bbps/C14.svg',
                    title: 'Book a Cylinder'
                },
                {
                    id: 3,
                    img: 'assets/images/bbps/C08.svg',
                    title: 'Water'
                },
                {
                    id: 4,
                    img: 'assets/images/bbps/C07.svg',
                    title: 'Piped Gas'
                },
                {
                    id: 5,
                    img: 'assets/images/bbps/C01.svg',
                    title: 'Postpaid Mobile'
                },
                {
                    id: 6,
                    img: 'assets/images/bbps/C05.svg',
                    title: 'Broadband'
                },
                {
                    id: 7,
                    img: 'assets/images/bbps/C02.svg',
                    title: 'Ladline'
                }
            ]
        },
        {
            category: 'finance & taxes',
            services: [
                {
                    id: 1,
                    img: 'assets/images/bbps/C13.svg',
                    title: 'Loan Repayment'
                },
                {
                    id: 2,
                    img: 'assets/images/bbps/C09.svg',
                    title: 'Insurance'
                },
                {
                    id: 3,
                    img: 'assets/images/bbps/C19.svg',
                    title: 'Muncipal Tax'
                }
            ]
        },
    ]

    constructor(
        private offCanvas: NgbOffcanvas
    ) {
    }

    ngOnInit() {
        this.breadCrumbItems = [
            {label: 'Services'},
            {label: 'BBPS', active: true}
        ];
    }

    goBack() {
        if (this.bbpsStep == 4) {
            this.bbpsStep = 3;
        } else if (this.bbpsStep == 3) {
            this.bbpsStep = 2;
        } else {
            this.bbpsStep = 1;
        }
    }

    payBill(paymentDetails: TemplateRef<any>) {
        this.offCanvas.open(paymentDetails, {position: 'end', backdrop: 'static'});
    }

}