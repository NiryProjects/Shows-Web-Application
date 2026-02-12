import { Component, Input, OnInit } from '@angular/core';
import { Show } from '../../models/show.model';
import { ShowsService } from '../shows.service';

@Component({
  selector: 'app-clip-card',
  templateUrl: './clip-card.component.html',
  styleUrls: ['./clip-card.component.css']
})
export class ClipCardComponent implements OnInit {

  stars = [];

  @Input() show: Show =
    {
      title: "Rick and Morty",
      img: "https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_Ratio0.6716_AL_.jpg",
      rating: 9.1,
      type: "tv",
      review: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
when an unknown printer took a galley of type and scrambled it to make a type specimen book.
 It has survived not only five centuries,`,
      seasons: 6,
      apiId: "tt11002233"

    };


  ratingString = "";

  constructor(private showsService: ShowsService) { }

  ngOnInit() {
    const pickedShow = this.showsService.pickedShow;


    if (pickedShow) {
      this.show = pickedShow;
    }

    this.ratingString = this.ratingToStarsStringVariation();

    //     this.stars = this.ratingToStars(this.show.rating);


    // this.stars = Array.from({ length: Math.floor(this.show.rating) }, (_, i) => i + 1);

    // console.log(this.stars);
    // console.log(this.show.rating);
    // console.log(this.show);

  }

  ratingToStarsStringVariation() {
    this.ratingString = "";
    const length = Math.floor(this.show.rating);
    for (let i = 0; i < length; i++) {
      this.ratingString += "⭐ ";
    }
    console.log("this.ratingString ", this.ratingString);
    return this.ratingString;
  }

  ratingToStars(rating) {
    this.stars = Array.from({ length: Math.floor(rating) }, (_, i) => i + 1);

    console.log(this.stars);
    console.log(rating);
    console.log(this.show);
    return this.stars;
  }



}
