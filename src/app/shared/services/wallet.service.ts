import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api.service";


@Injectable({
  providedIn: 'root'
})

export class WalletService {

  constructor(
      private apiService: ApiService
  ) { }

  getRucardsWalletList(): Observable<any> {
    return this.apiService.post('wallet/rucards-wallet-list',{'user_id':""});
  }

  getUserWallets(): Observable<any> {
    return this.apiService.get('wallet/get-all-user-wallets-balance');
  }

  getTotalWalletsBalance():Observable<any> {
    return this.apiService.get('wallet/get-user-wallet-balance');
  }


}
