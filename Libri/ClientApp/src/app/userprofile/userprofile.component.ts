import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Denied } from '../denied';
import { Favorites } from '../favorites';
import { Follower } from '../follower';
import { ListsService } from '../lists.service';
import { Read } from '../read';
import { User } from '../user';
import { UsersService } from '../users.service';
import { Wish } from '../wish';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})

export class UserprofileComponent implements OnInit {
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
  displayFavoriteList:boolean = true;
  displayWishList:boolean = false;
  displayReadList:boolean = false;
  displayDeniedList:boolean = false;
  pageOwner:boolean = false;
  following:string[] = [];
  activeUserFollowedUsers:string[] = [];
  followedUsers:string[] = [];
 

  constructor(private authService: SocialAuthService, private listsService: ListsService, private bookService: BooksService,
     private route:ActivatedRoute, private usersService: UsersService,) { }
     

  ngOnInit(): void {
    this.authService.authState.subscribe((response:SocialUser) => {
      this.activeUser = response;
      this.loggedIn = (response != null); 
      this.getActiveUserFollowedUsers();
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
      })
  });
    
    console.log(this.activeUser)
    console.log(this.user)
  }
  

  checkIfPageOwner():boolean{
    if(this.activeUser == null){
      this.pageOwner = false
    }
    else if(this.loggedIn && this.activeUser.id == this.user.id){
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

  toggleFavoriteList():any{
    this.displayFavoriteList = !this.displayFavoriteList;
    this.displayDeniedList = false;
    this.displayWishList = false;
    this.displayReadList = false;
  }

  toggleWishList():any{
    this.displayWishList = !this.displayWishList;
    this.displayFavoriteList = false;
    this.displayDeniedList = false;
    this.displayReadList = false;
  }

  toggleReadList():any{
    this.displayReadList = !this.displayReadList;
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayDeniedList = false;
  }

  toggleDeniedList():any{
    this.displayDeniedList = !this.displayDeniedList;
    this.displayFavoriteList = false;
    this.displayWishList = false;
    this.displayReadList = false;
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
    })
  }

  getPageOwnerFollowedUsers():any{
    this.usersService.GetFollowedUsers(this.user.id).subscribe((response:string[]) => {
      this.followedUsers = response;
    })
  }

  getActiveUserFollowedUsers():any{
    this.usersService.GetFollowedUsers(this.activeUser.id).subscribe((response:string[]) => {
      this.activeUserFollowedUsers = response;
    })
  }

  followedByActiveUser():boolean{
    return this.activeUserFollowedUsers.some(f => f == this.user.id)
  }
}