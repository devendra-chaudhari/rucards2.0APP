import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {User} from "../interfaces/user";

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    public userDetails = new BehaviorSubject<User>(null);
    currentUser = this.userDetails.asObservable();

    constructor() {
    }

    setItem(key: string, data: any): void {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to session storage', e);
            return null;
        }
    }

    getLocalStorage(key: string): any {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (e) {
            console.error('Error getting session data', e);
            return null;
        }
    }

    getCurrentUser(): any {
        return this.getLocalStorage('userDetails');
    }

    logout(): void {
        sessionStorage.clear();
    }

    changeUserDetails(key: string, value: string): void {
        const user = this.getCurrentUser();
        user[key] = value;
        this.setItem('userDetails', user);
    }

    changeCurrentUserDetail(user: User) {
        this.userDetails.next(user);
    }


}
