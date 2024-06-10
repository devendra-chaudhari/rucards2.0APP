import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-support-ticket',
    templateUrl: './support-ticket.component.html'
})
export class SupportTicketComponent {
    breadCrumbItems!: Array<{}>;

    selectedOption: string = '';

    constructor(
        private modalService: NgbModal
    ) {
    }


    ngOnInit(): void {
        this.breadCrumbItems = [
            {label: 'Admin'},
            {label: 'Support Tickets', active: true}
        ];

    }

    openModal(content: any) {
        this.modalService.open(content, {size: 'lg', centered: true});
    }

}
