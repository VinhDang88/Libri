import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Denied } from '../denied';
import { Favorites } from '../favorites';
import { Follower } from '../follower';
import { ListsService } from '../lists.service';
import { Read } from '../read';
import { User } from '../user';
import { UserReccomendation } from '../user-reccomendation';
import { UsersService } from '../users.service';
import { Wish } from '../wish';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  constructor(private bookService: BooksService, private listsService: ListsService, private authService: SocialAuthService, private usersService:UsersService) {}
  books: Books = {} as Books;
  title: string ="";
  author: string ="";
  subject: string ="";
  favorite: Favorites = {} as Favorites;
  recommendations: Item[] = [];
  listTitles: string[] = [];
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  favoritesArray: Favorites[] = [];
  wish: Wish[] = [];
  read: Read[] = [];
  denied: Denied[] = [];
  recommendationCount:number = 0;
  recommendedHasBooks:boolean = false;
  searchedUsers:User[] = [];
  searchedUsername:string = "";
  following:string[] = [];
  userFollowing:User[] = [];
  
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      this.getFavoriteList();
      this.getWishList();
      this.getReadList();
      this.getDeniedList();
      this.getRecommendations(this.user.id);
      this.CheckForDuplicates();
      this.getUserFollowing();
    });
  }

  //Queries a book based on the users form and gives back top result.
  SearchBooks(form:NgForm):void{
    this.title = form.form.value.title
    this.author = form.form.value.author
    this.subject = form.form.value.subject

    this.bookService.getBooks(this.title,this.author,this.subject).subscribe((response:Books)=>{
      this.books = response;
      this.CheckForDuplicateSearch();
    })
  }

  SearchUsers(form:NgForm):void{
    this.searchedUsername = form.form.value.username;
    console.log(this.searchedUsername);
    this.usersService.GetUsersByName(this.searchedUsername).subscribe((response:User[]) => {
      console.log(response)
      this.searchedUsers = response;
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

  showRecommended():boolean{
    return this.recommendations.length > 0;
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
    book.volumeInfo.categories.toString(), <number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount).subscribe((response: Favorites)=>{
      this.favoritesArray.push(response)
      console.log(response);
    });
  }

  addToWishList(book:Item):any{
    this.listsService.addToWishList(this.getIsbn(book), this.user.id).subscribe((response:Wish) => {
      console.log(response);
      this.wish.push(response);
    });
  }

  addToReadList(book:Item):any{
    this.listsService.addToReadList(this.getIsbn(book), this.user.id).subscribe((response:Read) => {
      console.log(response);
      this.read.push(response);
    });
  }

  addToDeniedList(book:Item):any{
    this.listsService.addToDeniedList(this.getIsbn(book), this.user.id).subscribe((response:Denied) => {
      console.log(response);
      this.denied.push(response);
    });
  }
  
  //Create a toggle that will hide Favorite list button after user clicks on the button
  CheckIfInFavoriteList(book:Item):boolean{
      return this.favoritesArray.some(f => f.isbn.trim().toString() == this.getIsbn(book))
  }
  
  //Create a toggle that will hide Wish list button after user clicks on the button
  CheckIfInWishList(book:Item):boolean{
    let wish: Wish = {
      wishListId: this.user.id,
      isbn: this.getIsbn(book)
    }
    return this.wish.some(w=> w.isbn == wish.isbn && w.wishListId == wish.wishListId)
  }

  CheckIfInReadList(book:Item):boolean{
    let read: Read = {
      readListId: this.user.id,
      isbn: this.getIsbn(book)
    }
    return this.read.some(r=> r.isbn == read.isbn && r.readListId == read.readListId)
  }

  CheckIfInDeniedList(book:Item):boolean{
    let denied: Denied = {
      deniedListId: this.user.id,
      isbn: this.getIsbn(book)
    }
    return this.denied.some(d=> d.isbn == denied.isbn && d.deniedListId == denied.deniedListId)
  }

  CheckForDuplicates():void{
    //remove dups based on book title
    let result:Item[] = this.recommendations.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.volumeInfo.title.trim() == value.volumeInfo.title.trim()
    ))
    )
  
    console.log(result);
    this.recommendations.forEach((r:Item) => {
      if(this.CheckIfInDeniedList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInFavoriteList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInReadList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInWishList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
    })
    console.log(result);
    this.recommendations = result;
  }

  CheckForDuplicateSearch():void{
    //remove dups based on book title
    let result:Item[] = this.books.items.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.volumeInfo.title.trim() == value.volumeInfo.title.trim()
    ))
    )
    this.books.items.forEach((r:Item) => {
      if(this.CheckIfInDeniedList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInFavoriteList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInReadList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInWishList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        console.log(r.volumeInfo.title)
      } 
    })
    // console.log(result);
    this.books.items = result;
  }

  getWishList():any{
    this.listsService.getWishList(this.user.id).subscribe((response:Wish[]) => {
      this.wish = response;
    });
    // console.log(this.wish);
  }

  getReadList():any{
    this.listsService.getReadList(this.user.id).subscribe((response:Read[]) => {
      this.read = response;
    });
    // console.log(this.read);
  }

  getDeniedList():any{
    this.listsService.getDeniedList(this.user.id).subscribe((response:Denied[]) => {
      this.denied = response;
    })
  }
  getFavoriteList():any{
    this.listsService.getUserFavorites(this.user.id).subscribe((response:Favorites[]) =>{
      this.favoritesArray = response;
      // console.log(response)
    })
  }

  //fills list with users that are following the current user
  getUserFollowing():any{
    //gets the list of string ids of users that are following the current user
    this.usersService.GetFollowing(this.user.id).subscribe((response:string[]) => {
      this.following = response;
    })
    //gets a list of user objects from the ids that are following the current user
    this.following.forEach((f:string) => {
      //for each string/id gets the user that matches 
      this.usersService.GetUserById(f).subscribe((response:User) => {
        this.userFollowing.push(response);
      })
    })
  }

  sendReccomendation(book:Item, reccomendedTo:User):any{
    if(book.volumeInfo.categories == undefined){
      book.volumeInfo.categories = [];
    }
    if(book.volumeInfo.authors == undefined){
      book.volumeInfo.authors = [];
    }
    if(book.volumeInfo.title == undefined){
      book.volumeInfo.title = "";
    }
    this.usersService.SendReccomendation(reccomendedTo.id, this.user.id, this.getIsbn(book), book.volumeInfo.title, book.volumeInfo.authors.toString(),
    book.volumeInfo.categories.toString(),<number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount, this.getThumbnail(book)).subscribe(
      (response:UserReccomendation) => {
        return response;
      })
  }

  nextRecommendation():number{
    console.log(this.recommendations.length)
    if(this.recommendationCount < this.recommendations.length - 1){
      console.log(this.recommendationCount)
      return this.recommendationCount++;
    }
    else{
      console.log(this.recommendationCount)
      return this.recommendationCount;
    }
  }

  nextFromFavorite(book:Item):number{
    if(this.CheckIfInReadList(book) && this.recommendationCount < this.recommendations.length - 1){
        console.log(this.recommendationCount)
        return this.recommendationCount++;
    }
    else{
      console.log(this.recommendationCount)
      return this.recommendationCount;
    }
  }
  

  nextFromReadList(book:Item):number{
    if(this.CheckIfInFavoriteList(book) && this.recommendationCount < this.recommendations.length - 1){
      console.log(this.recommendationCount)
      return this.recommendationCount++;
    }
    else{
      console.log(this.recommendationCount)
      return this.recommendationCount;
    }
  }

  getRecommendations(userId: string):any{
    
    //get list of favorites
    this.listsService.getUserFavorites(userId).subscribe((response:Favorites[]) => {
      response.forEach((f:Favorites) => {
          //search by isbn to get favorites as book objects
          this.bookService.getBooksByIsbn(f.isbn).subscribe((response:Books) => {
            //after getting favorites as book objects, search by description to get possible recommendations
            if(response.items != undefined){
              response.items.forEach((i:Item) => {
                // if no description, won't use it for search
                if(i.volumeInfo.description != undefined)
                {
                  this.bookService.searchByDescription(i.volumeInfo.description).subscribe((response:Books) => {
                    //add books from descriptions search 
                    response.items.forEach((i:Item) => {
                        this.recommendations.push(i);
                    })
                    //remove duplicate titles
                    this.CheckForDuplicates();
                  })
                }             
                //search based on author
                this.bookService.getBooks("", i.volumeInfo.authors.toString(), "").subscribe((response:Books) => {
                  response.items.forEach((i:Item) => {
                    //add result from author search
                    if(!this.recommendations.includes(i))
                    {
                      this.recommendations.push(i)
                    }
                  })
                  //remove duplicate titles
                  this.CheckForDuplicates();
                })
            })
          }
        })
      })
    })
    console.log(this.recommendations);
  };
}
