import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Denied } from '../denied';
import { Favorites } from '../favorites';
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
  toggleUserRecommendations:boolean = false;
  notRecommendedTo:User[] = [];
  topAuthors:string[] = [];
  topAuthorBooks: Books = {} as Books;
  topAuthorBooks2: Books = {} as Books;
  topAuthorBooks3: Books = {} as Books;
  searchType:string = "Books";
  searchDropdownToggle:boolean = false;
  
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      this.getFavoriteList();
      this.getWishList();
      this.getReadList();
      this.getDeniedList();
      this.getUserFollowing();
      this.getFavoriteAuthor();
      this.CheckForDuplicates();
    });
    
  }

  //Queries a book based on the users form and gives back top result.
  SearchBooks(form:NgForm):void{
    this.title = form.form.value.title
    this.author = form.form.value.author
    this.subject = form.form.value.subject

    this.bookService.getBooks(this.title,this.author,this.subject).subscribe((response:Books)=>{
      this.books = response;
      // console.log(this.books)
      this.CheckForDuplicateSearch();
      // console.log(this.books)
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
    if(bookIds != undefined){
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
    if(book.volumeInfo.description == undefined){
      book.volumeInfo.description = "";
    }
    this.listsService.addToFavoriteBooks(this.user.id, <string>this.getIsbn(book), book.volumeInfo.title, book.volumeInfo.authors.toString(),
    book.volumeInfo.categories.toString(), <number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount, book.volumeInfo.description, this.getThumbnail(book)).subscribe((response: Favorites)=>{
      this.favoritesArray.push(response)
      console.log(response);
    });
  }

  getFavoriteAuthor():any{
    this.listsService.GetTopFavoriteAuthors(this.user.id).subscribe((response:string[]) => {
      console.log(response);
      this.topAuthors = response;
      this.getRecommendations(this.user.id);
      this.CheckForDuplicates();
    })
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
    // console.log(result);
    this.recommendations.forEach((r:Item) => {
      if(this.CheckIfInDeniedList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        // console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInFavoriteList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        // console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInReadList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        // console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInWishList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        // console.log(r.volumeInfo.title)
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
        // console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInFavoriteList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        // console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInReadList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        // console.log(r.volumeInfo.title)
      } 
      else if(this.CheckIfInWishList(r)) {
        let i = result.indexOf(r)
        result.splice(i,1);
        // console.log(r.volumeInfo.title)
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
      response.forEach((f:string) => {
         //gets a list of user objects from the ids that are following the current user
        this.usersService.GetUserById(f).subscribe((response:User) => {
          this.userFollowing.push(response);
        })
      });
    })
    console.log(this.userFollowing)
    return this.userFollowing;
  }

  toggleUserRecommendation():boolean{
    if(this.toggleUserRecommendations){
      this.notRecommendedTo = [];
    }
    return this.toggleUserRecommendations = !this.toggleUserRecommendations;
  }

  sendRecommendation(book:Item, reccomendedTo:User):any{
    if(book.volumeInfo.categories == undefined){
      book.volumeInfo.categories = [];
    }
    if(book.volumeInfo.authors == undefined){
      book.volumeInfo.authors = [];
    }
    if(book.volumeInfo.title == undefined){
      book.volumeInfo.title = "";
    }
    if(book.volumeInfo.averageRating == undefined)
    {
      book.volumeInfo.averageRating = 0;
    }
    if(book.volumeInfo.ratingsCount == undefined)
    {
      book.volumeInfo.ratingsCount = 0;
    }
    this.usersService.SendRecommendation(reccomendedTo.id, this.user.id.trim().toString(), this.getIsbn(book), book.volumeInfo.title.trim().toString(), book.volumeInfo.authors.toString(),
    book.volumeInfo.categories.toString(),<number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount, this.getThumbnail(book)).subscribe(
      (response:UserReccomendation) => {
        let i = this.notRecommendedTo.indexOf(reccomendedTo)
        this.notRecommendedTo.splice(i,1);
      })
  }

  getNotRecommendedTo(followers:User[], book:Item):User[]
  {
    this.notRecommendedTo = [];
    followers.forEach(u => {
      this.usersService.GetUserRecommendations(u.id).subscribe((response:UserReccomendation[]) => {
        let notRecommended:boolean = (response.some((r:UserReccomendation) => r.isbn == this.getIsbn(book)) == false)
        if(notRecommended){
          this.notRecommendedTo.push(u)
        }
      })
    })
    return this.notRecommendedTo;
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

  previousRecommendation():number{
    console.log(this.recommendations.length)
    if(this.recommendationCount > 0){
      console.log(this.recommendationCount)
      return this.recommendationCount--;
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
        // Going to get description here
        if(f.description != undefined){
          this.bookService.searchByDescription(f.description).subscribe((response:Books) => {
            //add books from descriptions search 
            response.items.forEach((i:Item) => {
              if(!this.recommendations.includes(i)){
                this.recommendations.push(i);
              }
            })
            //remove duplicate titles
          this.CheckForDuplicates();
          })
        }
      })
      //search based on author
      this.topAuthors.forEach(t => {
        this.bookService.getBooks("", t, "").subscribe((response:Books) => {
          if(this.topAuthors.indexOf(t) == 0)
          {
            this.topAuthorBooks = response;
          }
          if(this.topAuthors.indexOf(t) == 1)
          {
            this.topAuthorBooks2 = response;
          }
          if(this.topAuthors.indexOf(t) == 2)
          {
            this.topAuthorBooks3 = response;
          }
          //remove duplicate titles
          this.CheckForDuplicates();
          console.log(this.recommendations);
        })
      })
    })
  }
}
