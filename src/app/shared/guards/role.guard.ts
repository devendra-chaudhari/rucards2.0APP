import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { SessionStorageService } from '../services/session-storage.service';
import { User } from '../interfaces/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    currentUser: User;

    constructor(
        private toastr: ToastrService,
        private router: Router,
        private sessionStorage: SessionStorageService
    ) {
        this.sessionStorage.currentUser.subscribe(user => {
            if (this.currentUser == null) {
                this.currentUser = this.sessionStorage.getCurrentUser();

                this.sessionStorage.changeCurrentUserDetail(this.sessionStorage.getCurrentUser());
            } else {
                this.currentUser = user;
            }
        });
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.currentUser) {
            const roles = route.data;

            // if (roles && roles.indexOf(this.currentUser.role) === -1) {
            //     return this.handleAccessDenied();
            // }

            return true;
        }

        return true;
    }

    private handleAccessDenied(): false {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map((event: NavigationEnd) => this.router.navigateByUrl(event.url))
            )
            .subscribe(() => this.toastr.error('Access Denied!'));

        return false;
    }
}
