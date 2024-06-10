import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html'
})

/**
 * News Feed Component
 */
export class NewsFeedComponent implements OnInit {

   // News Feed
   @Input() NewsFeed: Array<{
    image?: string;
    content?: string;
    date?: string;
    time?: string;
  }> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
