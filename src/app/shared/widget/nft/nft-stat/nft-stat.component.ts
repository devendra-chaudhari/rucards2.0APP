import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nft-stat',
  templateUrl: './nft-stat.component.html'
})

/**
 * Nft-Stat Component
 */
export class NftStatComponent implements OnInit {

  @Input() icon: string | undefined;
  @Input() title: string | undefined;
  @Input() value: any | undefined;
  @Input() persantage: string | undefined;
  @Input() profit: string | undefined;
  @Input() bg_color: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
