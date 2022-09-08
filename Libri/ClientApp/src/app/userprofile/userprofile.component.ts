import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Denied } from '../denied';
import { Favorites } from '../favorites';
import { Follower } from '../follower';
import { ListsService } from '../lists.service';
import { Read } from '../read';
import { Review } from '../review';
import { ReviewsService } from '../reviews.service';
import { User } from '../user';
import { UserReccomendation } from '../user-reccomendation';
import { UsersService } from '../users.service';
import { Wish } from '../wish';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})

export class UserprofileComponent implements OnInit{
  activeUser:SocialUser = {} as SocialUser;
  user: User = {} as User;
  loggedIn: boolean = false;
  wishList:Wish [] = [];
  favoriteList:Favorites [] = [];
  deniedLists:Denied [] = [];
  readLists: Read [] = [];
  wishListItems:Item[] = [];
  favListItems:Item[] = [];
  deniedListItems:Item[] = [];
  readListItems:Item[] = [];
  activeUserWishList:Wish[] = [];
  activeUserFavoriteList:Favorites[] = [];
  activeUserDeniedLists:Denied[] = [];
  activeUserReadLists: Read[] = [];
  displayFavoriteList:boolean = true;
  displayWishList:boolean = false;
  displayReadList:boolean = false;
  displayDeniedList:boolean = false;
  pageOwner:boolean = false;
  following:string[] = [];
  activeUserFollowedUsers:string[] = [];
  followedUsers:string[] = [];
  followingUsers:User[] = [];
  beingFollowedByUsers:User[] = [];
  displayFollowers:boolean = false;
  displayWhoUserIsFollowing:boolean = false;
  displayRecommendationsByOthers:boolean = false;
  displayReviewsByUser:boolean = false;
  userRecommendations:UserReccomendation[] = []; 
  userReviews:Review[] = [];
  pageOwnerTopAuthors:string[] = [];

  constructor(private authService: SocialAuthService, private listsService: ListsService, private bookService: BooksService,
     private route:ActivatedRoute, private usersService: UsersService, private reviewService: ReviewsService, @Inject(LOCALE_ID) private locale: string) { }
     
  
  
  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
    this.authService.authState.subscribe((response:SocialUser) => {
      this.activeUser = response;
      this.loggedIn = (response != null); 
      this.getActiveUserFollowedUsers();
    });
  });
    
    this.route.params.subscribe(routeParams => {
      //emptying lists when user id changes
      this.favListItems = [];
      this.wishListItems = [];
      this.readListItems = [];
      this.deniedListItems = [];
      this.following = [];
      this.followedUsers = [];
      this.activeUserFollowedUsers = [];
      this.followingUsers = [];
      this.beingFollowedByUsers = [];
      this.userRecommendations = [];
      this.userReviews = [];
      //getting new user for profile
      this.usersService.GetUserBySqlId(routeParams.id).subscribe((response:User) => {
        this.user = response;
        //filling lists with new user's lists
        this.getPageOwnerFollowing();
        this.getPageOwnerFollowedUsers();
        this.followedByActiveUser();
        this.checkIfPageOwner();
        this.getWishList();
        this.getReadList();
        this.getFavoriteList();
        this.getDeniedList(); 
        this.getUserRecommendation();
        this.getUserReview();
        this.getPageOwnerTopAuthors();
        this.getActiveUserFavoriteList();
        this.getActiveUserWishList();
        this.getActiveUserReadList();
        this.getActiveUserDeniedList();
      })
    });
    
    console.log(this.activeUser)
    console.log(this.user)
  }

  getNewPageOwner(user:User):User{
    this.usersService.GetUserById(user.id).subscribe((response:User) => {
      this.user = response
    }) 
    return this.user;
  }

  reload():void{
    location.reload();
  }
  

  checkIfPageOwner():boolean{
    this.pageOwner = false;
    if(this.activeUser == null){
      this.pageOwner = false
    }
    else if(this.loggedIn && this.activeUser.id == this.user.id && this.activeUser.photoUrl == this.user.photoUrl){
      this.pageOwner = true;
    }
    return this.pageOwner;
  }

  //Gives the User back a list of books they want to read in the future
  getWishList():any{
    this.listsService.getWishList(this.user.id).subscribe((response:Wish[]) => {
      this.wishList = response;
      this.getWishListByIsbn();
    });
  }

  getWishListByIsbn():any{
    //Reads in wishlist and loops through 
    this.wishList.forEach((w:Wish)=>{ 
      //Searches foreach book by isbn
      this.bookService.getBooksByIsbn(w.isbn).subscribe((response:Books) =>{
        response.items.forEach((i:Item)=>{
          //Pushes the found book into a list
          this.wishListItems.push(i);
        });
      })
    });
  }

  //Gives the User back a list of books they have read
  getReadList():any{
    this.listsService.getReadList(this.user.id).subscribe((response:Read[]) => {
      this.readLists = response;
      this.getReadListByIsbn();
    });
  }

  getReadListByIsbn():any{
    this.readLists.forEach((r:Read)=>{
      this.bookService.getBooksByIsbn(r.isbn).subscribe((response:Books)=>{
        response.items.forEach((i:Item)=>{
          this.readListItems.push(i);
        })
      })
    })
  }

  //Gives the User back a list of books they don't want to read
  getDeniedList():any{
    this.listsService.getDeniedList(this.user.id).subscribe((response:Denied[]) => {
      this.deniedLists = response;
      this.getDeniedListByIsbn();
    })
  }

  getDeniedListByIsbn():any{
    this.deniedLists.forEach((d:Denied)=>{
      this.bookService.getBooksByIsbn(d.isbn).subscribe((response:Books)=>{
        response.items.forEach((i:Item)=>{
          this.deniedListItems.push(i)
        })
      })
    })
  }

  // Shows the user their favorite books
  getFavoriteList():any{
    this.listsService.getUserFavorites(this.user.id).subscribe((response:Favorites[]) => {
      this.favoriteList = response;
      this.getFavoriteListByIsbn();
    })
  }

  getFavoriteListByIsbn():any{
    this.favoriteList.forEach((f:Favorites)=>{
      this.bookService.getBooksByIsbn(f.isbn).subscribe((response:Books)=>{
        if(response.items != undefined){
          response.items.forEach((i:Item)=>{
            this.favListItems.push(i);
          })
        }
        else{
          this.bookService.getBooksById(f.isbn).subscribe((response:Item) => {
            response.volumeInfo.industryIdentifiers.forEach((i) => { 
              //if searched by id make sure it gets correct id
              if(i.type == "ISBN_10"){
                i.identifier = response.id;
              }
              if(i.type == "ISBN_13"){
                i.identifier = response.id;
              }
            })
            this.favListItems.push(response);
          })
        }
      })
    })
  }


  getActiveUserWishList():any{
    this.listsService.getWishList(this.activeUser.id).subscribe((response:Wish[]) => {
      this.activeUserWishList = response;
    });
  }

 getActiveUserReadList():any{
    this.listsService.getReadList(this.activeUser.id).subscribe((response:Read[]) => {
      this.activeUserReadLists = response;
    });
  }

getActiveUserDeniedList():any{
    this.listsService.getDeniedList(this.activeUser.id).subscribe((response:Denied[]) => {
      this.activeUserDeniedLists = response;
    })
  }

getActiveUserFavoriteList():any{
    this.listsService.getUserFavorites(this.activeUser.id).subscribe((response:Favorites[]) => {
      this.activeUserFavoriteList = response;
    })
  }


  getThumbnail(book:Item):string{
    if(<string>book.volumeInfo.imageLinks?.thumbnail == undefined || <string>book.volumeInfo.imageLinks?.thumbnail == null)
    {
      let thumbnail:string = "../../assets/thumbnail.png";
      return thumbnail;
    }
    else
    {
    return <string>book.volumeInfo.imageLinks?.thumbnail;
    }
  }

  getIsbn(book: Item):string{
    //contains identifiers for book
    let bookIds: IndustryIdentifier[] = book.volumeInfo.industryIdentifiers;
    let isbn: string = "";
    //if book has an isbn_10 it is assigned 
    bookIds.forEach((id) => {
      if(id.type == "ISBN_10"){
        isbn = id.identifier
      }
    });
    // if isbn_10 is missing assigns isbn_13 instead
    if(isbn == ""){
      bookIds.forEach((id) => {
        if(id.type == "ISBN_13"){
          isbn = id.identifier
        }
      })
    }
    //if isbns are not found assigns book id instead
    if(isbn == ""){
      isbn = book.id
    }
    return isbn;
  }

  deleteFavoriteListObject(book:Item):any{
    console.log(this.user.id)
    console.log(this.getIsbn(book))
    this.listsService.deleteFavoriteListObject(this.getIsbn(book), this.user.id).subscribe((response:Favorites) => {
      console.log(response);
      let i = this.favListItems.indexOf(book);
      this.favListItems.splice(i,1);
      let index = this.favoriteList.indexOf(response);
      this.favoriteList.splice(index, 1);
    });
  }

  deleteWishListObject(book:Item):any{
    this.listsService.deleteWishListObject(this.getIsbn(book), this.user.id).subscribe((response:Wish) => {
      console.log(response);
      let i = this.wishListItems.indexOf(book);
      this.wishListItems.splice(i,1);
    });
  }

  deleteReadListObject(book:Item):any{
    this.listsService.deleteReadListObject(this.getIsbn(book), this.user.id).subscribe((response:Read) => {
      console.log(response);
      let i = this.readListItems.indexOf(book);
      this.readListItems.splice(i,1);
      let index = this.readLists.indexOf(response);
      this.readLists.splice(index, 1);
    });
  }

  deleteDeniedListObject(book:Item):any{
    this.listsService.deleteDeniedListObject(this.getIsbn(book), this.user.id).subscribe((response:Denied) => {
      console.log(response);
      let i = this.deniedListItems.indexOf(book);
      this.deniedListItems.splice(i,1);
    });
  }

  addFavorite(book:Item):any{
    if(book.volumeInfo.categories == undefined){
      book.volumeInfo.categories = [];
    }
    if(book.volumeInfo.authors == undefined){
      book.volumeInfo.authors = [];
    }
    if(book.volumeInfo.title == undefined){
      book.volumeInfo.title = "";
    }
    this.listsService.addToFavoriteBooks(this.user.id, <string>this.getIsbn(book), book.volumeInfo.title, book.volumeInfo.authors.toString(),
    book.volumeInfo.categories.toString(), <number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount, book.volumeInfo.description, this.getThumbnail(book)).subscribe((response: Favorites)=>{
      this.favoriteList.push(response)
      console.log(response);
      this.favListItems.push(book);
    });
  }

  addToReadList(book:Item):any{
    this.listsService.addToReadList(this.getIsbn(book), this.user.id).subscribe((response:Read) => {
      console.log(response);
      this.readLists.push(response);
      this.readListItems.push(book);
    });
  }


  addToActiveUserReadList(book:Item):any{
    this.listsService.addToReadList(this.getIsbn(book), this.activeUser.id).subscribe((response:Read) => {
      console.log(response);
      this.activeUserReadLists.push(response);
    });
  }

  addActiveUserFavorite(book:Item):any{
    if(book.volumeInfo.categories == undefined){
      book.volumeInfo.categories = [];
    }
    if(book.volumeInfo.authors == undefined){
      book.volumeInfo.authors = [];
    }
    if(book.volumeInfo.title == undefined){
      book.volumeInfo.title = "";
    }
    this.listsService.addToFavoriteBooks(this.activeUser.id, this.getIsbn(book).trim().toString(), book.volumeInfo.title, book.volumeInfo.authors.toString(),
    book.volumeInfo.categories.toString(), <number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount, book.volumeInfo.description, this.getThumbnail(book)).subscribe((response: Favorites) => {
      this.activeUserFavoriteList.push(response)
      console.log(response);
    });
  }

  addToActiveUserWishList(book:Item):any{
    this.listsService.addToWishList(this.getIsbn(book), this.activeUser.id).subscribe((response:Wish) => {
      console.log(response);
      this.activeUserWishList.push(response);
    });
  }

  addToActiveUserDeniedList(book:Item):any{
    this.listsService.addToDeniedList(this.getIsbn(book), this.activeUser.id).subscribe((response:Denied) => {
      console.log(response);
      this.activeUserDeniedLists.push(response);
    });
  }



  checkIfInReadList(book:Item):boolean{
    let read: Read = {
      readListId: this.user.id,
      isbn: this.getIsbn(book)
    }
    return this.readListItems.some(r => this.getIsbn(r) == this.getIsbn(book)) || this.readLists.some(r => r.isbn == read.isbn && r.readListId == read.readListId)
  }

  checkIfInFavoriteList(book:Item):boolean{
    return this.favListItems.some(f => this.getIsbn(f) == this.getIsbn(book)) || this.favoriteList.some(f => f.favoriteListId  == this.getIsbn(book))
  }


  checkIfInActiveUserReadList(book:Item):boolean{
    let read: Read = {
      readListId: this.activeUser.id,
      isbn: this.getIsbn(book)
    }
    return this.activeUserReadLists.some(r => r.isbn == read.isbn && r.readListId == read.readListId)
  }

  checkIfInActiveUserFavoriteList(book:Item):boolean{
    return this.activeUserFavoriteList.some(f => f.isbn.trim().toString() == this.getIsbn(book).trim().toString() && f.favoriteListId == this.activeUser.id)
  }

  checkIfInActiveUserWishList(book:Item):boolean{
    let wish: Wish = {
      wishListId: this.activeUser.id,
      isbn: this.getIsbn(book)
    }
    return this.activeUserWishList.some(w=> w.isbn == wish.isbn && w.wishListId == wish.wishListId)
  }

  checkIfInActiveUserDeniedList(book:Item):boolean{
    let denied: Denied = {
      deniedListId: this.activeUser.id,
      isbn: this.getIsbn(book)
    }
    return this.activeUserDeniedLists.some(d=> d.isbn == denied.isbn && d.deniedListId == denied.deniedListId)
  }


  toggleFavoriteList():any{
    this.displayFavoriteList = !this.displayFavoriteList;
    this.displayWishList = false;
    this.displayReadList = false;
    this.displayDeniedList = false;
    this.displayFollowers = false;
    this.displayWhoUserIsFollowing = false;
    this.displayRecommendationsByOthers = false;
    this.displayReviewsByUser = false;
  }

  toggleWishList():any{
    this.displayFavoriteList = false;
    this.displayWishList = !this.displayWishList;
    this.displayReadList = false;
    this.displayDeniedList = false;
    this.displayFollowers = false;
    this.displayWhoUserIsFollowing = false;
    this.displayRecommendationsByOthers = false;
    this.displayReviewsByUser = false;
  }

  toggleReadList():any{
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayReadList = !this.displayReadList;
    this.displayDeniedList = false;
    this.displayFollowers = false;
    this.displayWhoUserIsFollowing = false;
    this.displayRecommendationsByOthers = false;
    this.displayReviewsByUser = false;
  }

  toggleDeniedList():any{
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayReadList = false;
    this.displayDeniedList = ! this.displayDeniedList;
    this.displayFollowers = false;
    this.displayWhoUserIsFollowing = false;
    this.displayRecommendationsByOthers = false;
    this.displayReviewsByUser = false;
  }

  toggleFollowers():any{
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayReadList = false;
    this.displayDeniedList = false;
    this.displayFollowers = !this.displayFollowers;
    this.displayWhoUserIsFollowing = false;
    this.displayRecommendationsByOthers = false;
    this.displayReviewsByUser = false;
  }

  toggleBeingFollowedBy():any{
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayReadList = false;
    this.displayDeniedList = false;
    this.displayFollowers = false;
    this.displayWhoUserIsFollowing = !this.displayWhoUserIsFollowing;
    this.displayRecommendationsByOthers = false;
    this.displayReviewsByUser = false;
  }

  toggleRecommendationsByOtherUsers():any{
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayReadList = false;
    this.displayDeniedList = false;
    this.displayFollowers = false;
    this.displayWhoUserIsFollowing = false;
    this.displayRecommendationsByOthers = !this.displayRecommendationsByOthers;
    this.displayReviewsByUser = false;
  }

  toggleUserReviews():any{
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayReadList = false;
    this.displayDeniedList = false;
    this.displayFollowers = false;
    this.displayWhoUserIsFollowing = false;
    this.displayRecommendationsByOthers = false;
    this.displayReviewsByUser = !this.displayReviewsByUser;
  }

  followUser():any{
    if(!this.pageOwner){
      this.usersService.FollowUser(this.user.id, this.activeUser.id).subscribe((response:Follower) => {
        this.activeUserFollowedUsers.push(response.userFollowedId);
      })
    }
  }

  unfollowUser():any{
    if(!this.pageOwner){
      this.usersService.UnFollow(this.user.id, this.activeUser.id).subscribe((response:Follower) => {
        let i = this.activeUserFollowedUsers.indexOf(response.userFollowedId);
        this.activeUserFollowedUsers.splice(i, 1);
      })
    }
  }

  getPageOwnerFollowing():any{
    this.usersService.GetFollowing(this.user.id).subscribe((response:string[]) => {
      this.following = response;
      response.forEach(u => {
        this.usersService.GetUserById(u).subscribe((response:User) => {
          this.followingUsers.push(response);
    })})})
  }

  getPageOwnerFollowedUsers():any{
    this.usersService.GetFollowedUsers(this.user.id).subscribe((response:string[]) => {
      this.followedUsers = response;
      response.forEach(u => {
        this.usersService.GetUserById(u).subscribe((response:User) => {
          this.beingFollowedByUsers.push(response);
    })})})
  }

  getActiveUserFollowedUsers():any{
    this.usersService.GetFollowedUsers(this.activeUser.id).subscribe((response:string[]) => {
      this.activeUserFollowedUsers = response;
    })
  }

  followedByActiveUser():boolean{
    return this.activeUserFollowedUsers.some(f => f == this.user.id)
  }

  getUserRecommendation():any{
    this.usersService.GetUserRecommendations(this.user.id).subscribe((response:UserReccomendation[])=>{
      this.userRecommendations = response;
    })
  }
  getUserReview():any{
    this.reviewService.GetReviewsByUser(this.user.id).subscribe((response:Review[])=>{
      this.userReviews = response
    })
  }

  formatReviewDate(date:Date):string{
    return formatDate(date,'short',this.locale);
  }

  Upvote(review:Review):any{
    this.reviewService.UpVote(this.user.id, review.id).subscribe((response:Review) =>
      this.userReviews[this.userReviews.indexOf(review)] = response
    )
  }

  Downvote(review:Review):any{
    this.reviewService.DownVote(this.user.id, review.id).subscribe((response:Review) =>
    this.userReviews[this.userReviews.indexOf(review)] = response
    )
  }

  getPageOwnerTopAuthors():string[]{
    this.listsService.GetTopFavoriteAuthors(this.user.id).subscribe((response:string[]) => {
      this.pageOwnerTopAuthors = response;
    })
    return this.pageOwnerTopAuthors;
  }
}