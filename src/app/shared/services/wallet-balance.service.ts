import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WalletBalanceService {
  private balanceSubject = new BehaviorSubject<number>(0);

  constructor() { }
  get balance(): BehaviorSubject<number> {
    return this.balanceSubject;
  }
}
