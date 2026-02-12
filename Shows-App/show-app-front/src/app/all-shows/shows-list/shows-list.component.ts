import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Show } from '../../models/show.model';
import { ShowsService } from '../shows.service';

@Component({
  selector: 'app-shows-list',
  templateUrl: './shows-list.component.html',
  styleUrls: ['./shows-list.component.css']
})
export class ShowsListComponent implements OnInit, OnDestroy {

  showsOrigin: Show[];

  buttonAll = 0;
  buttonMovie = 1;
  buttonTv = 2;

  buttonSelected = 0;

  shows: Show[];

  private showsStatusSub: Subscription;

  constructor(public showService: ShowsService) { }

  ngOnDestroy(): void {
    this.showsStatusSub.unsubscribe();
  }
  // constructor(public showService: ClipsService) { }
  // constructor() { }


  ngOnInit(): void {
    //    throw new Error('Method not implemented.');
    console.log("On init");
    // this.fillAllShows();
    // this.initShows();

    console.log(this.shows);

    console.log("showService? : ", this.showService);

    ////////////////////////////////////////////////////////////////


    this.showsStatusSub = this.showService.getShowsStatusListener().subscribe(results => {
      this.showsOrigin = results;
      this.shows = [...this.showsOrigin];
      console.log(" in the listener ", results);
    });


    this.showService.getAllShows();




  }


  initShows() {
    this.showService.getAllShows();
  }

  numberToNumEmoji(rating: number) {

    const mapNumToNumEmoji = {
      0: '0️⃣',
      1: '1️⃣ ⭐',
      2: '2️⃣ ⭐ ⭐',
      3: '3️⃣ ⭐ ⭐ ⭐',
      4: '4️⃣ ⭐ ⭐ ⭐ ⭐',
      5: '5️⃣ ⭐ ⭐ ⭐ ⭐ ⭐'
    }

    return mapNumToNumEmoji[rating];
  }


  moveToSingle($event: Show) {

    const show = $event;
    this.showService.moveToSinglePage(show);

  }

  onClickType(btnSelect: number) {

    if (!this.showsOrigin || this.showsOrigin.length == 0) {
      return;
    }

    if (btnSelect === this.buttonAll && this.buttonSelected !== this.buttonAll) {
      this.shows = [...this.showsOrigin];
    }
    else if (btnSelect === this.buttonMovie && this.buttonSelected !== this.buttonMovie) {
      this.shows = this.showsOrigin.filter(show => show.type === "movie");

    }
    else if (btnSelect === this.buttonTv && this.buttonSelected !== this.buttonTv) {

      this.shows = this.showsOrigin.filter(show => show.type === "tv");
    }

    this.buttonSelected = btnSelect;
    // do stuff ....

  }

  onSortByTitle() {
    this.shows.sort((showA, showB) => {
      if (showA.title === showB.title) {
        return 0;
      }
      return showA.title < showB.title ? -1 : 1;
    }
    );
  }

  onSortByRating() {
    this.shows.sort((showA, showB) => {

      if (showA.rating === showB.rating) {
        if (showA.title === showB.title) {
          return 0;
        }

        return showA.title < showB.title ? -1 : 1;
      }

      return showB.rating - showA.rating;
    }
    );
  }

  onReverse() {
    this.shows.reverse();
  }

}
