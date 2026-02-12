import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Show } from 'src/app/all-shows/show.model';
import { Friend } from '../friend';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friends-shows-list',
  templateUrl: './friends-shows-list.component.html',
  styleUrls: ['./friends-shows-list.component.css']
})
export class FriendsShowsListComponent implements OnInit, OnDestroy {

  buttonAll = 0;
  buttonMovie = 1;
  buttonTv = 2;

  buttonSelectedTypes = 0;

  buttonSelected = 0;

  showsOrigin: Show[] = [];

  buttonAllOpertion = 0;
  buttonJointOpertion = 1;
  buttonDifferentOpertion = 2;

  buttonSelectedOpertion = 0;

  actionWithBoth = false;


  shows: Show[] = [];

  friend: Friend = { friendUsername: " OnSug ", friendId: "21na" };

  usernameIn: string = "";

  private friendShowsStatusSub: Subscription;

  constructor(private friendService: FriendsService) { }

  ngOnInit() {
    // algorit to make sure that the picked friend show here :)
    this.friend = this.friendService.pickedFriend;
    // console.log("this.friend", this.friend);

    this.friendShowsStatusSub = this.friendService.getFriendShowsStatusListener().subscribe({
      next: showsResult => {
        this.shows = showsResult;
        this.showsOrigin = [...this.shows];
      },
      error: error => {
        console.log(error);
      }

    });

    this.friendService.getAllFriendShows(this.friend);
    this.usernameIn = localStorage.getItem("username") || "";
  }


  onClickType(btnSelect: number) {

    if (!this.showsOrigin || this.showsOrigin.length == 0) {
      return;
    }

    if (btnSelect === this.buttonAll && this.buttonSelectedTypes !== this.buttonAll) {
      this.shows = this.showsOrigin;
    }
    else if (btnSelect === this.buttonMovie && this.buttonSelectedTypes !== this.buttonMovie) {
      this.shows = this.showsOrigin.filter(show => show.type === "movie");

    }
    else if (btnSelect === this.buttonTv && this.buttonSelectedTypes !== this.buttonTv) {

      this.shows = this.showsOrigin.filter(show => show.type === "tv");
    }

    this.buttonSelectedTypes = btnSelect;
    // do stuff ....

  }


  getAllFriendShows() {
    this.friendService.getAllFriendShows(this.friend);
    this.buttonSelectedOpertion = this.buttonAllOpertion;
    this.buttonSelectedTypes = this.buttonAll;
    this.actionWithBoth = false;
  }

  jointShows() {
    this.friendService.getJointFriendShows(this.friend);
    this.buttonSelectedOpertion = this.buttonJointOpertion;
    this.buttonSelectedTypes = this.buttonAll;
    this.actionWithBoth = true;
  }

  differentShows() {
    this.friendService.getDifferentFriendShows(this.friend);
    this.buttonSelectedOpertion = this.buttonDifferentOpertion;
    this.buttonSelectedTypes = this.buttonAll;
    this.actionWithBoth = true;
  }


  ngOnDestroy(): void {
    this.friendShowsStatusSub.unsubscribe();
  }

  // can be with pic of the friend or the logged in user
  moveToSingleWithFriend($event: Show) {

    const show = $event;
    // console.log("Show ", show);
    this.friendService.moveToSingleWithFriend(show);

  }

  // this is up ^^^^^ its what i meant :)
  // can be with pic of the friend or the logged in user
  // moveToSingleWithFriend($event: Show) {

  //   const show = $event;
  //   this.showService.moveToSinglePage(show);

  //   // showname
  //   const showName = show.title;
  //   this.router.navigate([`/myshows/${showName}`]);
  //   this.pickedShow = show;

  // }

}
