import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Denied } from '../denied';
import { Favorites } from '../favorites';
import { ListsService } from '../lists.service';
import { Read } from '../read';
import { Wish } from '../wish';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  constructor(private bookService: BooksService, private listsService: ListsService, private authService: SocialAuthService) {}
  books: Books = {} as Books;
  title: string ="";
  author: string ="";
  subject: string ="";
  favorite: Favorites = {} as Favorites;
  recommendations: Item[] = [];
  favoriteTitles: string[] = [];
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  favoritesArray: Favorites[] = [];
  wish: Wish[] = [];
  read: Read[] = [];
  denied: Denied[] = [];
  recommendationCount:number = 0;
  recommendedHasBooks:boolean = false;
  


ngOnInit(): void {
  this.authService.authState.subscribe((user) => {
    this.user = user;
    this.loggedIn = (user != null);
    this.getRecommendations(this.user.id);
    this.getWishList();
    this.getFavoriteList();
    this.getReadList();
    this.getDeniedList();
  });
}

//Queries a book based on the users form and gives back top result.
  SearchBooks(form:NgForm):void{
    this.title = form.form.value.title
    this.author = form.form.value.author
    this.subject = form.form.value.subject

    this.bookService.getBooks(this.title,this.author,this.subject).subscribe((response:Books)=>{
      this.books = response;
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
    // Contains ISBN-10 from the books
    let bookIds: IndustryIdentifier[] = book.volumeInfo.industryIdentifiers;
    let isbn: string = "";
    // Puts ISBNs from industry identifier into empty string array
    bookIds.forEach((id) => {
      if(id.type == "ISBN_10"){
        isbn = id.identifier
      }
    })
    // Grabbing first string out of the array that matches ISBN
    if(isbn == ""){
      isbn = bookIds[0].type
    }
    return isbn;
  }

  addFavorite(book:Item):any{
    if(book.volumeInfo.categories == undefined){
      book.volumeInfo.categories = [];
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
    
  getWishList():any{
    this.listsService.getWishList(this.user.id).subscribe((response:Wish[]) => {
      this.wish = response;
    });
    console.log(this.wish);
  }

  getReadList():any{
    this.listsService.getReadList(this.user.id).subscribe((response:Read[]) => {
      this.read = response;
    });
    console.log(this.read);
  }

  getDeniedList():any{
    this.listsService.getDeniedList(this.user.id).subscribe((response:Denied[]) => {
      this.denied = response;
    })
  }
  getFavoriteList():any{
    this.listsService.getUserFavorites(this.user.id).subscribe((response:Favorites[]) =>{
      this.favoritesArray = response;
      console.log(response)
    })
  }

  nextRecommendation():number{
    console.log(this.recommendations.length)
    if(this.recommendationCount < this.recommendations.length){
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
        //gather titles to exclude from reccomendations
        this.favoriteTitles.push(f.title);
          //search by isbn to get favorites as book objects
          this.bookService.getBooksByIsbn(f.isbn).subscribe((response:Books) => {
            //after getting favorites as book objects, search by description to get possible recommendations
            response.items.forEach((i:Item) => {
              // if no description, won't use it for search
              if(i.volumeInfo.description != undefined)
              {
                this.bookService.searchByDescription(i.volumeInfo.description).subscribe((response:Books) => {
                  //filter recommendations by category and add them to recommended list if the title is not already favorited
                  response.items.forEach((i:Item) => {
                    if(!this.favoriteTitles.includes(i.volumeInfo.title))
                    {
                      this.recommendations.push(i);
                    }
                  })
                })
              }
              //search based on author
              this.bookService.getBooks("", i.volumeInfo.authors.toString(), "").subscribe((response:Books) => {
              response.items.forEach((i:Item) => {
              //add result from author search if book is not in reccomendations
              if(!this.recommendations.includes(i) && !this.favoriteTitles.includes(i.volumeInfo.title))
              {
                this.recommendations.push(i)
              }
              })
              })
            })
          console.log(this.recommendations);
        })
      })
    })
  };
}




