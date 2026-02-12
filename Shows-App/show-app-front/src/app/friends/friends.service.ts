import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Show } from 'src/app/models/show.model';
import { environment } from 'src/environments/environment';
import { Friend } from './friend';

const BACKEND_URL = environment.apiUrl + "/friends/";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  // Removed stale myUserName property to prevent identity bugs

  friends: Friend[] = [];

  private searchfriendStatusListener = new Subject<{ friendId: string, found: boolean }>();
  private friendsStatusListener = new Subject<Friend[]>();

  pickedFriend: Friend = { friendUsername: " OnSug ", friendId: "21na" };

  friendShows: Show[] = [];

  // Initialized with dummy data as per legacy, but using strict Show interface
  pickedShow: Show = {
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

  private showsFriendStatusListener = new Subject<Show[]>();

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  getSearchStatusListener() {
    return this.searchfriendStatusListener.asObservable();
  }

  getFriendsStatusListener() {
    return this.friendsStatusListener.asObservable();
  }

  pickFriend(myFriend: Friend) {
    console.log(" Pick only mine friend");
    this.pickedFriend = myFriend;
    this.router.navigate([`/friend/${myFriend.friendUsername}`]);
  }

  getAllFriends() {
    const url = BACKEND_URL;
    this.http.get<{ message: string, friends: Friend[] }>(url).subscribe(
      {
        next: result => {
          console.log("Friends Found :)", result);
          this.friends = result.friends;
          this.friendsStatusListener.next([...this.friends]);
        },
        error: error => {
          console.log("Error !!!", error);
        },
      });
  }

  addFriend(friend: Friend) {
    const friendName = friend.friendUsername;
    const friendId = friend.friendId;

    this.friends.push(friend);
    this.friendsStatusListener.next([...this.friends]);

    this.http.post<{ message: string, result: any }>(BACKEND_URL + friendName, { friendName, friendId })
      .subscribe({
        next: response => {
          console.log(response);
          this.router.navigate(["/myfriends"]);
        },
        error: error => { console.log(error); },
      });
  }

  searchFriend(username: string) {
    // FIX: Read username from localStorage dynamically to avoid stale identity
    const currentUserName = localStorage.getItem("username");

    console.log("Searching for:", username, "Current user:", currentUserName);

    if (currentUserName !== username) {
      const url = BACKEND_URL + `search/${username}`;
      console.log(url);

      this.http.get<{ message: string, found: boolean, friendId: string }>(url).subscribe(
        {
          next: result => {
            console.log("Search Result:", result);
            // Handle new backend response (200 OK with found: true/false)
            if (result.found) {
               this.searchfriendStatusListener.next({ friendId: result.friendId, found: true });
            } else {
               this.searchfriendStatusListener.next({ friendId: "", found: false });
            }
          },
          error: error => {
             console.log("Error !!!", error);
             // Fallback for network errors
             this.searchfriendStatusListener.next({ friendId: "", found: false });
          },
        });

    } else {
      console.log("It's you ...  -_+");
      // Could emit an error or handle "self-search" specifically if needed
    }
  }

  getFriendShowsStatusListener() {
    return this.showsFriendStatusListener.asObservable();
  }

  getAllFriendShows(friend: Friend) {
    const friendId = friend.friendId;
    const url = BACKEND_URL + friendId;

    this.http
      .get<{ message: string; shows: Show[] }>(url)
      .subscribe(
        {
          next: responseData => {
            if (responseData.shows) {
              console.log(responseData);
              this.friendShows = responseData.shows;
              this.showsFriendStatusListener.next([...this.friendShows]);
            }
          },
          error: error => {
            console.log(error);
          }
        });
  }

  getJointFriendShows(friend: Friend) {
    const friendId = friend.friendId;
    const url = BACKEND_URL + 'joint/' + friendId;

    this.http
      .get<{ message: string; shows: Show[] }>(url)
      .subscribe(
        {
          next: responseData => {
            console.log(responseData);
            this.showsFriendStatusListener.next(responseData.shows);
          },
          error: error => {
            console.log(error);
          }
        });
  }

  getDifferentFriendShows(friend: Friend) {
    const friendId = friend.friendId;
    const url = BACKEND_URL + 'different/' + friendId;

    this.http
      .get<{ message: string; shows: Show[] }>(url)
      .subscribe(
        {
          next: responseData => {
            console.log(responseData);
            this.showsFriendStatusListener.next(responseData.shows);
          },
          error: error => {
            console.log(error);
          }
        });
  }

  moveToSingleWithFriend(show: Show) {
    const showId = show.apiId;
    this.pickedShow = show;
    console.log("pickedShow ", this.pickedShow);
    this.router.navigate([`friend/show/${showId}`]);
  }
}
