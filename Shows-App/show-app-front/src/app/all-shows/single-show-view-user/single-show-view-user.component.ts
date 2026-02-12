import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Show } from '../../models/show.model';
import { ShowsService } from '../shows.service';

@Component({
  selector: 'app-single-show-view-user',
  templateUrl: './single-show-view-user.component.html',
  styleUrls: ['./single-show-view-user.component.css']
})
export class SingleShowViewUserComponent implements OnInit {

  myReviewText = new FormControl('');

  show: Show =
    {
      title: "Rick and Morty",
      img: "https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_Ratio0.6716_AL_.jpg",
      rating: 9.1,
      type: "tv",
      review: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
   Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
    when an unknown printer took a galley of type and scrambled it to make a type specimen book`,
      seasons: 6,
      apiId: "tt11002233"

    };

  editSave = "Edit";

  constructor(private route: ActivatedRoute, private showsService: ShowsService) { }

  ngOnInit() {
    const showId = this.route.snapshot.paramMap.get('apiShowId');

    const foundShow = this.showsService.shows.find(show => show.apiId === showId);
    if (foundShow) {
      this.show = foundShow;
    }
    else {
      // search show on the server and give it back to look at
    }

    console.log("this.show ", this.show);
    console.log("showId ", showId);
    console.log("this.showsService.shows ", this.showsService.shows);

    //  this.showsService.getShowByApiId(showId);

  }

  onDeleteWasClicked(apiId: string) {
    this.showsService.deleteShow(apiId);
  }

  onUpdateWasClicked() {
    if (this.editSave === "Edit") {
      this.inEditMode();
    }
    else  // this.editSave === "Save"
    {
      if (this.myReviewText.valid) {
        this.inSaveMode();
      } else {
        console.log("the review must be valid , only 256 chars or less.");
      }
    }

  }

  inSaveMode() {
    this.editSave = "Edit";
    this.editMode = false;
    this.show.review = this.myReviewText.value;

    let showStars = 0
    for (let i = this.stars.length - 1; i >= 0; i--) {
      if (this.stars[i]) { showStars = i + 1; break; }
    }

    console.log("my SHOW STARS rating stars:", showStars);


    this.show.rating = showStars;
    this.showsService.updateShow(this.show);
  }

  editMode = false;

  inEditMode() {
    this.editMode = true;
    this.myReviewText.setValue(this.show.review);
    // this.show.rating = 1; // tesTing . Nice to have!!
    this.editSave = "Save";

    this.fillStarsArray(this.show.rating - 1);

    // this.onStarClick(this.show.rating - 1);

  }

  // stars edit feature !!

  stars = [false, false, false, false, false];

  fillStarsArray(idx: number) {
    for (let i = 0; i < this.stars.length; i++) {
      if (i <= idx) { this.stars[i] = true; }
      else { this.stars[i] = false; }
    }
  }

  onStarClick(idx: number) {

    console.log("idx : ", idx);

    if (idx === 0 && this.stars[0] === false) {
      this.stars[0] = true;
      return;
    }

    if (idx === 0 && this.stars[1] === false) {
      this.stars[0] = false;
      return;
    }

    this.fillStarsArray(idx);

  }

  // console.log("idx SEC : ", idx);
  // if (idx === 0 && this.stars[1] === false) {
  //   this.stars[0] = false;
  //   return;
  // }
}

/*


title:  " Space raccon :)"

sub title : yet still me ...

review : im nice ' try to find the love of my life , ice cream .


What im doing here ?

where ma i ?

what is the meaning to all of this and that ?

just wait a minute and relax :)


*/

/*

As a few people have mentioned, the parameters in paramMap should be accessed using the common MapAPI:

To get a snapshot of the params, when you don't care that they may change:

this.bankName = this.route.snapshot.paramMap.get('bank');
To subscribe and be alerted to changes in the parameter values (typically as a result of the router's navigation)

this.route.paramMap.subscribe( paramMap => {
    this.bankName = paramMap.get('bank');
})

*/
