import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Books } from '../books';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private bookService: BooksService) {}
  books: Books = {} as Books;
  title: string ="";
  author: string ="";
  subject: string ="";

ngOnInit(): void {
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
  
}




