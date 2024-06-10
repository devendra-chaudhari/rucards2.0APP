import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbNavModule, NgbAccordionModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {ScrollspyDirective} from "./scrollspy.directive";
import {NumberOnlyDirective} from './directives/number-only.directive';
import {DateagoPipe} from './pipes/dateago.pipe';
import {BreadcrumbsComponent} from "./components/breadcrumbs/breadcrumbs.component";
import {AlphabeticInputDirective} from './directives/alphabetic-input.directive';


@NgModule({
    declarations: [
        BreadcrumbsComponent,
        ScrollspyDirective,
        NumberOnlyDirective,
        DateagoPipe,
        AlphabeticInputDirective,
        ],
    imports: [
        CommonModule,
        NgbNavModule,
        NgbAccordionModule,
        NgbDropdownModule
    ],
    exports: [BreadcrumbsComponent, ScrollspyDirective, NumberOnlyDirective, DateagoPipe, AlphabeticInputDirective]
})
export class SharedModule {
}
