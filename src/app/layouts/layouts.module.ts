import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {SimplebarAngularModule} from 'simplebar-angular';
import {LayoutComponent} from './layout.component';
import {VerticalComponent} from './vertical/vertical.component';
import {TopbarComponent} from './topbar/topbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {UiSwitchModule} from "ngx-ui-switch";

@NgModule({
    declarations: [
        LayoutComponent,
        VerticalComponent,
        TopbarComponent,
        SidebarComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbDropdownModule,
        NgbNavModule,
        SimplebarAngularModule,
        NgxSpinnerModule,
        UiSwitchModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutsModule {

}
