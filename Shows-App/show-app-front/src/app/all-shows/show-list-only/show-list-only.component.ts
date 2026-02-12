import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Show } from '../../models/show.model';

@Component({
  selector: 'app-show-list-only',
  templateUrl: './show-list-only.component.html',
  styleUrls: ['./show-list-only.component.css']
})
export class ShowListOnlyComponent implements OnInit {

  @Input() shows: Show[] = [];

  @Output() onPickedShow: EventEmitter<Show> = new EventEmitter();

  @Input() purple: boolean = true;

  showsOrigin: Show[] = [];
  lazyInitShowsOrigin = true;


  buttonAll = 0;
  buttonMovie = 1;
  buttonTv = 2;

  buttonSelected = 0;

  onPickedShowClicked(show: Show): void {
    this.onPickedShow.emit(show);
    // console.log("Show list only ", show);
  }

  constructor() { }

  ngOnInit() { }

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
