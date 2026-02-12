import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Show } from '../models/show.model';

const BACKEND_URL = environment.apiUrl + "/shows/";

@Injectable({ providedIn: 'root' })
export class ShowsService {
  public shows: Show[] = [];
  private showsStatusListener = new Subject<Show[]>();
  // pickedShow is used in some components (legacy pattern? keeping for compatibility)
  pickedShow: Show | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  getShowsStatusListener() {
    return this.showsStatusListener.asObservable();
  }

  getAllShows() {
    this.http
      .get<{ message: string; shows: Show[] }>(BACKEND_URL)
      .subscribe({
        next: responseData => {
          this.shows = responseData.shows;
          this.showsStatusListener.next([...this.shows]);
        },
        error: error => {
          console.error("Error fetching shows:", error);
        }
      });
  }

  moveToSinglePage(show: Show) {
    // Navigate using apiId
    const showId = show.apiId;
    this.router.navigate([`/myshows/${showId}`]);
  }

  addPickedShow(show: Show) {
    this.http
      .post<{ message: string; show: Show }>(BACKEND_URL, show)
      .subscribe({
        next: responseData => {
          console.log("Show added:", responseData);
          this.router.navigate(["/myshows"]);
        },
        error: error => {
          console.error("Error adding show:", error);
        }
      });
  }

  getShowByApiId(apiId: string) {
    const url = BACKEND_URL + apiId;
    this.http
      .get<{ message: string; show: Show }>(url)
      .subscribe({
        next: responseData => {
          this.pickedShow = responseData.show;
          // Verify if navigation is needed here, usually get by ID is for detail view
          // But previous code navigated.
          this.router.navigate([`/myshows/${apiId}`]);
        },
        error: error => {
          console.error("Error fetching show details:", error);
        }
      });
  }

  updateShow(show: Show) {
    const url = BACKEND_URL + show.apiId;
    this.http.put<{ message: string; show: Show }>(url, show)
      .subscribe({
        next: responseData => {
          console.log("Show updated:", responseData);
          this.router.navigate(["/myshows"]);
        },
        error: error => {
          console.error("Error updating show:", error);
        }
      });
  }

  deleteShow(apiId: string) {
    const url = BACKEND_URL + apiId;
    this.http.delete<{ message: string; show: Show }>(url)
      .subscribe({
        next: responseData => {
          console.log("Show deleted:", responseData);
          // Optimistic update or refetch?
          // Previous code just navigated
          this.router.navigate(["/myshows"]);
        },
        error: error => {
          console.error("Error deleting show:", error);
        }
      });
  }
}
