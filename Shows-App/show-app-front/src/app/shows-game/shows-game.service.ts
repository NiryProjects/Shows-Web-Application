import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, map } from 'rxjs';

import { environment } from "../../environments/environment";
import { MovieItem } from '../models/movie-static.model';
import { ShowGame } from './shows-game-highlow/showGame.model';

const BACKEND_URL = environment.apiUrl + "/showsgame/";

// Typed response from the backend (which returns the static dataObj)
interface ShowGet {
  dataObj: {
    items: MovieItem[];
    errorMessage?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ShowsGameService {
  private shows: ShowGame[] = [];
  private showsUpdated = new Subject<{ shows: ShowGame[] }>();

  constructor(private http: HttpClient, private router: Router) { }

  getShowUpdateListener() {
    return this.showsUpdated.asObservable();
  }

  getShows(media: string) {
    const numberOfTakeShows = 70;
    this.http
      .get<ShowGet>(BACKEND_URL + media)
      .pipe(
        map(showsData => {
          const items = showsData.dataObj.items || [];
          const showsDataSlice = items.slice(0, Math.min(items.length, numberOfTakeShows));

          return {
            shows: showsDataSlice.map(showDataObj => {
              return {
                title: showDataObj.title,
                rating: +showDataObj.imDbRating, // Convert string rating to number
                img: showDataObj.image,
              } as ShowGame;
            })
          };
        })
      )
      .subscribe({
        next: transformedShowsData => {
          this.shows = transformedShowsData.shows;
          this.showsUpdated.next({
            shows: [...this.shows],
          });
        },
        error: error => {
          console.error("Error fetching game shows:", error);
        }
      });
  }
}
