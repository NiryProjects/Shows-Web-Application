import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Show } from '../../models/show.model';
import { ClipsService } from '../clips.service';
import { ShowsService } from '../shows.service';



@Component({
  selector: 'app-clip-create',
  templateUrl: './clip-create.component.html',
  styleUrls: ['./clip-create.component.css']
})
export class ClipCreateComponent implements OnInit {

  form: FormGroup;

  textAreaValue: string = "";
  inputValue: string = "";

  stars = [false, false, false, false, false];

  /////// Some tests
  searchResults: Show[];

  pickedShow: Show = null;

  // searchShowForm: FormControl;
  // myReviewText: FormControl;

  constructor(private clipsService: ClipsService, private route: ActivatedRoute, private http: HttpClient, private showsService: ShowsService) { }

  ngOnInit() {

    this.form = new FormGroup({
      searchShowForm: new FormControl('', { validators: [Validators.required] }),
      myReviewText: new FormControl('', { validators: [] }),
    });


    // this.searchShowForm = new FormControl('', { validators: [Validators.required] });
    // this.myReviewText = new FormControl('', { validators: [] });

  }


  onStarClick(idx: number) {
    if (idx === 0 && this.stars[0] === false) {
      this.stars[0] = true;
      return;
    }

    if (idx === 0 && this.stars[1] === false) {
      this.stars[0] = false;
      return;
    }


    for (let i = 0; i < this.stars.length; i++) {
      if (i <= idx) {
        this.stars[i] = true;

      } else {
        this.stars[i] = false;

      }
    }
  }


  clearValueFunc() {

    // this.searchShowForm.setValue('');

  }

  value = 'Clear me'; // not in use right now maybe need to delete!!! TD BM


  fillDataResults() {

    // const searchShow = "inception 21";
    const searchShow = this.form.get("searchShowForm").value;

    console.log("Search Show : ", searchShow);

    this.http.get<{ health: string, responseApi: { result } }>(`http://localhost:3000/api/shows/search/${searchShow}`).subscribe(
      {
        next: result => {
          console.log(result);
          this.searchResults = result.responseApi.result.map(show => {
            console.log(show);
            return {
              title: show.title,
              img: show.img,
              rating: show.rating,
              year: show.year,
              apiId: show.apiId,
              type: show.type,
              review: "",
            };
          });

          console.log(this.searchResults);
        },
        error: error => {
          // error

          /////////////// fake fill data

          console.log(error);

          //  this.fakeSearchRsults = this.showsService.showsStaticData;
        }
      }
    );

  }

  onPickShow(show: Show) {

    const pickedShow = this.searchResults.find(aryShow => show.apiId === aryShow.apiId);

    if (pickedShow) {
      this.searchResults = [];
      console.log(pickedShow);

      this.pickedShow = pickedShow;

    }
  }

  onSave() {

    if (!this.pickedShow) {
      console.log("Form Not Valid");
      console.log(this.form.value);
      return;
    }

    console.log("Form Valid");
    console.log(this.form.value);
    console.log(this.pickedShow);


    let showStars = 0

    for (let i = this.stars.length - 1; i >= 0; i--) {
      if (this.stars[i]) {
        showStars = i + 1;
        break;
      }
    }

    console.log("my SHOW STARS rating stars:", showStars);

    const myShow = { ...this.pickedShow };

    myShow.review = this.form.value.myReviewText;
    myShow.rating = showStars;

    console.log(myShow);

    this.showsService.addPickedShow(myShow);
  }

}
