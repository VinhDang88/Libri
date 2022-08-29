import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Favorites } from '../favorites';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private bookService: BooksService, private favoriteService: FavoritesService, private authService: SocialAuthService) {}
  books: Books = {} as Books;
  title: string ="";
  author: string ="";
  subject: string ="";
  favorite: Favorites = {} as Favorites;
  recommendations: Item[] = [];
  favoriteTitles: string[] = [];
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;

ngOnInit(): void {
  this.authService.authState.subscribe((user) => {
    this.user = user;
    this.loggedIn = (user != null);
    this.getRecommendations(this.user.id);
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
      return <string>book.volumeInfo.imageLinks?.thumbnail;
    }

    getIsbn(book: Item):string{
      let bookIds: IndustryIdentifier[] = book.volumeInfo.industryIdentifiers;
      let isbn: string[] = [];
      bookIds.forEach((id) => isbn.push(id.identifier))
      return <string>isbn[0];
    }

    addFavorite(book:Item):any{
      this.favoriteService.addToFavoriteBooks(this.user.id, <string>this.getIsbn(book), book.volumeInfo.title, book.volumeInfo.authors.toString(),
      book.volumeInfo.categories.toString(), <number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount).subscribe((response: Favorites)=>{
        this.favorite = response;
      });
      console.log(this.favorite);
    }

    getRecommendations(userId: string):any{
      //get list of favorites
      this.favoriteService.getUserFavorites(userId).subscribe((response:Favorites[]) => {
        response.forEach((f:Favorites) => {
          //set subject to compare for recommendation results
          let subject = f.subject;
          //gather titles to exclude from reccomendations
          this.favoriteTitles.push(f.title);
          //search by isbn to get favorites as book objects
          this.bookService.getBooksByIsbn(f.isbn).subscribe((response:Books) => {
          //after getting favorites as book objects, search by description to get possible recommendations
          response.items.forEach((i:Item) => {
            this.bookService.searchByDescription(i.volumeInfo.description).subscribe((response:Books) => {
              //filter recommendations by category and add them to recommended list if the title is not already favorited
              response.items.forEach((i:Item) => {
                if(!this.favoriteTitles.includes(i.volumeInfo.title)){
                  this.recommendations.push(i);
                }
                // if((i.volumeInfo.categories.toString().includes(subject) || subject.includes(i.volumeInfo.categories.toString())) 
                // && !this.favoriteTitles.includes(i.volumeInfo.title)){
                //   this.recommendations.push(i);
                // }
              })
            })
            //search based on author
            this.bookService.getBooks("", i.volumeInfo.authors.toString(), "").subscribe((response:Books) => {
              response.items.forEach((i:Item) => {
                //add result from author search if book is not in reccomendations
                if(!this.recommendations.includes(i) && !this.favoriteTitles.includes(i.volumeInfo.title)){
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




