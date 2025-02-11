import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ShowsInfo, Show } from '../models';
import { ShowService } from '../show.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatBadgeModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title = 'Recommended Shows';

  showsInfo: ShowsInfo | null = null;
  errorMessage?: string;

  constructor(private showService: ShowService) {}

  ngOnInit() {
    const getSuccessFn = (showsInfo: ShowsInfo) => {
      // console.log("getShowsInfo:getSuccessFn");
      // console.log(showsInfo);

      this.showsInfo = showsInfo;
    };

    const getErrorFn = (error: any) => {
      // console.log("getShowsInfo:errorFn");
      // console.log(error);

      this.errorMessage = error.message;
    };

    const getCompleteFn = () => {
      // console.log("getShowsInfo:completeFn");
    };

    this.showService
      .getShowsInfo()
      .subscribe(getSuccessFn, getErrorFn, getCompleteFn);
  }

  isRecentlyAdded = (show: Show, thresholdInDays = 1) => {
    if (!show.addedDate) {
      return false;
    }

    const addedDate = new Date(show.addedDate);
    const currentDate = new Date();

    const millisecondsSinceAdded = currentDate.getTime() - addedDate.getTime();

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const thresholdInMilliseconds = thresholdInDays * millisecondsPerDay;

    const result = millisecondsSinceAdded < thresholdInMilliseconds;

    return result;

    // tslint:disable-next-line:semicolon
  };

  get allShows(): Show[] {
    if (!this.showsInfo) {
      return [];
    }

    return this.showsInfo.shows;
  }

  get addedTodayShows(): Show[] {
    if (!this.showsInfo) {
      return [];
    }

    return this.showsInfo.shows.filter((show) => {
      return this.isRecentlyAdded(show, 1);
    });
  }

  get addedWithin3DaysShows(): Show[] {
    if (!this.showsInfo) {
      return [];
    }

    return this.showsInfo.shows.filter((show) => {
      return this.isRecentlyAdded(show, 3);
    });
  }

  get addedWithin7DaysShows(): Show[] {
    if (!this.showsInfo) {
      return [];
    }

    return this.showsInfo.shows.filter((show) => {
      return this.isRecentlyAdded(show, 7);
    });
  }
}
