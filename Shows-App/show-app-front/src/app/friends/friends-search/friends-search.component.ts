import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Friend } from '../friend';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friends-search',
  templateUrl: './friends-search.component.html',
  styleUrls: ['./friends-search.component.css']
})
export class FriendsSearchComponent implements OnInit, OnDestroy {

  isLoading = false;
  private searchStatusSub: Subscription;
  form: FormGroup;

  friendFound = false;

  friendName = "Friend_Name_-15"; // | 15 chars |

  friend: Friend = { friendUsername: this.friendName, friendId: "" };

  minchProfilePic = `https://api.dicebear.com/6.x/micah/svg?seed=Felix2-_`;

  constructor(private friendsService: FriendsService) { }

  searchMessage: string = "";
  isFound: boolean = false;

  ngOnInit() {
    this.searchStatusSub = this.friendsService.getSearchStatusListener().subscribe(
      searchStatus => {
        this.isLoading = false;
        // { friendId: result.friendId, found: result.found, message: result.message }
        this.friendFound = searchStatus.found;
        this.isFound = searchStatus.found;
        this.searchMessage = searchStatus.message;

        if (searchStatus.found) {
             this.friend = { friendUsername: this.friendName, friendId: searchStatus.friendId };
             this.fillFriend();
        }
      });



    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      // password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      username: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.pattern(`([A-Za-z0-9\-\_]+)`)]),
    });
  }


  fillFriend() {
    this.minchProfilePic = `https://api.dicebear.com/6.x/micah/svg?seed=${this.friendName}`;
  }

  onSearch() {


    console.log("this.form.get(email).valid", this.form.get("email").valid);
    console.log("this.form.get(username).valid", this.form.get("username").valid);

    if (this.form.get("username").valid) {
      const friendUsername = this.form.get("username").value;
      this.friendName = friendUsername;

      this.friendsService.searchFriend(friendUsername);

      // this.friendFound = true;



      // console.log("this.friendFound : ", this.friendFound);
    }

    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;
    // this.authService.login(this.form.value.email, this.form.value.username, this.form.value.password);
  }

  ngOnDestroy(): void {
    this.searchStatusSub.unsubscribe();
  }

  addFriend(str: string) {

    // console.log("LOLLLL " + str);
    this.friendsService.addFriend(this.friend);

  }

}
