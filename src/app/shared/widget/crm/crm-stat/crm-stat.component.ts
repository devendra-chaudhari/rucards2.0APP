import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-crm-stat',
    templateUrl: './crm-stat.component.html'
})

/**
 * Crm Stat Component
 */
export class CrmStatComponent implements OnInit {

    @Input() title: string | undefined;
    @Input() value: any | undefined;
    @Input() icon: string | undefined;
    @Input() profit: string | undefined;

    constructor() {
    }

    ngOnInit(): void {
    }

}
