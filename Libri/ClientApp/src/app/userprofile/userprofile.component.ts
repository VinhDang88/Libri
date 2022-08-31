import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Denied } from '../denied';
import { Favorites } from '../favorites';
import { ListsService } from '../lists.service';
import { Read } from '../read';
import { Wish } from '../wish';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})

export class UserprofileComponent implements OnInit {
  user: SocialUser = {} as SocialUser;
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

  constructor(private authService: SocialAuthService, private listsService: ListsService, private bookService: BooksService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      this.getWishList();
      this.getReadList();
      this.getFavoriteList();
      this.getDeniedList();
    });
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
        response.items.forEach((i:Item)=>{
          this.favListItems.push(i);
        })
      })
    })
  }

  getThumbnail(book:Item):string{
    return <string>book.volumeInfo.imageLinks?.thumbnail;
  }

  getIsbn(book: Item):string{
    // Contains ISBN-10 from the books
    let bookIds: IndustryIdentifier[] = book.volumeInfo.industryIdentifiers;
    let isbn: string[] = [];
    // Puts ISBNs from industry identifier into empty string array
    bookIds.forEach((id) => isbn.push(id.identifier))
    // Grabbing first string out of the array that matches ISBN
    return <string>isbn[0];
  }

  deleteFavoriteListObject(book:Item):any{
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
    this.listsService.addToFavoriteBooks(this.user.id, <string>this.getIsbn(book), book.volumeInfo.title, book.volumeInfo.authors.toString(),
    book.volumeInfo.categories.toString(), <number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount).subscribe((response: Favorites)=>{
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
    //Still needs to be updated
    return this.readListItems.some(r => this.getIsbn(r) == this.getIsbn(book) ) || this.readLists.some(r => r.isbn == read.isbn && r.readListId == read.readListId)
  }

  checkIfInFavoriteList(book:Item):boolean{
    
    //Still needs to be updated
    return this.favListItems.some(f => this.getIsbn(f) == this.getIsbn(book) ) || this.favoriteList.some(f => f.favoriteListId  == this.getIsbn(book) )
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
}