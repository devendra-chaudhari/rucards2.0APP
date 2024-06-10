import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {SessionStorageService} from "./session-storage.service";
import {Router, NavigationEnd } from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {FULL_ROUTES} from "../routes/full-layouts.route";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    private routerEventsSubscription: Subscription;
    currentUrl: string;
    userRole: null;

    constructor(
        private sessionStorage: SessionStorageService,
        public router: Router
    ) {
        this.routerEventsSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.currentUrl = event.url;
            });
        const adminRolesRoute = FULL_ROUTES.find(route => route.path === 'admin/roles');
        if (adminRolesRoute) {
            this.userRole = adminRolesRoute.data['roles'][0]
        } else {
        }
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.addAuthHeader(request);
        if (this.sessionStorage.getCurrentUser() != null){
            const currentUser = this.sessionStorage.getCurrentUser();
            this.routerEventsSubscription = this.router.events
                .pipe(filter(event => event instanceof NavigationEnd))
                .subscribe((event: NavigationEnd) => {
                    this.currentUrl = event.url;
                });
            const adminRolesRoute = FULL_ROUTES.find(route => "/"+route.path === this.currentUrl);
            if (adminRolesRoute) {
                this.userRole = adminRolesRoute.data['roles'][0]
            } else {
            }
            if (currentUser.role == this.userRole){
            }
            else{
            }
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && error.error.error === 'The token has been revoked') {
                    sessionStorage.removeItem('userDetails');
                    this.router.navigateByUrl('login');
                }
                return throwError(error);
            })
        );
    }

    addAuthHeader(request: HttpRequest<any>) {
        const localUser = this.sessionStorage.getCurrentUser();
        if (localUser !== null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${localUser['token']}`
                }
            });
        }
        return request;
    }
}
