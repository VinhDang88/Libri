import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(private authService: SocialAuthService, private userService: UsersService, private router:Router) { }
  
  isExpanded = false;
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  newUser: User = {} as User;

  ngOnInit(): void {

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      //Takes google login information and stores inside our database
      this.userService.addUsers(this.user.id, this.user.firstName, this.user.lastName, this.user.name, this.user.photoUrl).subscribe((response:User)=>{
        this.newUser = response;
        console.log(response)
      })
    });
  }
  //Closes google login window
  collapse() {
    this.isExpanded = false;
  }
//Will open up a pop up to ask the user if they want to sign in with their google
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
//Allows google user to sign out
  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/']);
    location.reload();
    }
}
