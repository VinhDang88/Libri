import { Component } from '@angular/core';
import { Books } from '../books';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private bookService: BooksService) {}

  booksByTitle: Books = {} as Books;
  booksByAuthor: Books = {} as Books;
  booksBySubject: Books = {} as Books;

//temporary, get books to display on init, change to call with user input later
ngOnInit(): void {
  this.displayByTitle();
  this.displayByAuthor();
  this.displayBySubject();
}

  //method for calling book service to get one book by title
  displayByTitle(){
  this.bookService.getByTitle("harry potter").subscribe((response:Books) => {
    this.booksByTitle = response;
    console.log(response.items);
  })
  }

  //method for calling book service to get one book by author
  displayByAuthor(){
    this.bookService.getByAuthor("rowling").subscribe((response:Books) => {
      this.booksByAuthor = response;
      console.log(response.items);
    })
    }

  //method for calling book service to get one book by subject
  displayBySubject(){
    this.bookService.getBySubject("weather").subscribe((response:Books) => {
      this.booksBySubject = response;
      console.log(response.items);
    })
    }
  
}




