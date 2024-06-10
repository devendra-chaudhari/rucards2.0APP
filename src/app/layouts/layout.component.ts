import {Component, OnInit} from '@angular/core';
import {LAYOUT_VERTICAL} from './layout.model';
import {SessionStorageService} from "../shared/services/session-storage.service";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html'
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {

    layoutType!: string;


    constructor(
        private sessionStorage: SessionStorageService
    ) {
    }

    ngOnInit(): void {
        this.layoutType = LAYOUT_VERTICAL;
        this.sessionStorage.changeCurrentUserDetail(this.sessionStorage.getCurrentUser());
    }

    /**
     * Check if the vertical layout is requested
     */
    isVerticalLayoutRequested() {
        return this.layoutType === LAYOUT_VERTICAL;
    }

}
