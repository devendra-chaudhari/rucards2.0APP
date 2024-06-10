import {Injectable} from '@angular/core';
import {User} from "../interfaces/user";
import {SessionStorageService} from "./session-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: User;

    constructor(private sessionStorage: SessionStorageService) {
    }

    isAuthenticated(): boolean {
        return !!this.sessionStorage.getCurrentUser();
    }
    hasRole(role: string): boolean {
        return this.user.role === role;
    }


}
