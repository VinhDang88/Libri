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


  constructor(private authService: SocialAuthService, private listsService: ListsService, private bookService: BooksService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
  });
  this.getWishList();

}
//Gives the User back a list of books they want to read in the future
getWishList():any{
  this.listsService.getWishList(this.user.id).subscribe((response:Wish[]) => {
    this.wishList = response;
    this.getWishListByIsbn();
  });
}
//Gives the User back a list of books they have read
getReadList():any{
  this.listsService.getReadList(this.user.id).subscribe((response:Read[]) => {
    this.readLists = response;
    this.getReadListByIsbn();
  });
}
//Gives the User back a list of books they don't want to read
getDeniedList():any{
  this.listsService.getDeniedList(this.user.id).subscribe((response:Denied[]) => {
    this.deniedLists = response;
    this.getDeniedListByIsbn();
  })
}
getFavoriteList():any{
  this.listsService.getUserFavorites(this.user.id).subscribe((response:Favorites[]) => {
    this.favoriteList = response;
    this.getFavoriteListByIsbn();
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

getReadListByIsbn():any{
  this.readLists.forEach((r:Read)=>{
    this.bookService.getBooksByIsbn(r.isbn).subscribe((response:Books)=>{
      response.items.forEach((i:Item)=>{
        this.readListItems.push(i);
      })
    })
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

getFavoriteListByIsbn():any{
  this.favoriteList.forEach((f:Favorites)=>{
    this.bookService.getBooksByIsbn(f.isbn).subscribe((response:Books)=>{
      response.items.forEach((i:Item)=>{
        this.favListItems.push(i);
      })
    })
  })
}


}
