import { NgModule} from "@angular/core";

import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutsModule} from "./layouts/layouts.module";

import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from "@angular/common";
import {ToastrModule} from "ngx-toastr";
import {ApiService} from "./shared/services/api.service";
import {MessageService} from "./shared/services/message.service";
import {AuthService} from "./shared/services/auth.service";
import {SessionStorageService} from "./shared/services/session-storage.service";
import {AuthGuard} from "./shared/guards/auth.guard";
import {RoleGuard} from "./shared/guards/role.guard";
import {AuthInterceptorService} from "./shared/services/auth-interceptor.service";
import {UidaiService} from "./shared/services/uidai.service";
import {ImageConverterService} from "./shared/services/image-converter.service";
import {SortService} from "./shared/services/sort.service";
import {ExcelService} from "./shared/services/excel.service";
import {NgxSpinnerModule} from "ngx-spinner";
import {FormsModule} from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(en);


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        LayoutsModule,
        NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
        ToastrModule.forRoot({
            preventDuplicates: true,
            autoDismiss: true,
            timeOut: 10000,
            progressBar: true,
            closeButton: true,
            progressAnimation: 'decreasing'
        }),
        NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    ],
    providers: [

        ApiService,
        MessageService,
        AuthService,
        SessionStorageService,
        SortService,
        UidaiService,
        ImageConverterService,
        ExcelService,
        AuthGuard,
        RoleGuard,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
        { provide: NZ_I18N, useValue: en_US },
        provideAnimationsAsync(),
        provideHttpClient()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
