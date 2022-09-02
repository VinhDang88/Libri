import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  url: string = "https://www.googleapis.com/books/v1/volumes?q="
  urlId: string = "https://www.googleapis.com/books/v1/volumes/"

  //Changes queries string based on user input
  getBooks(title:string,author:string,subject:string):any{
    let route:string = this.url;
    if(title.length > 0)
    {
      route = route+`intitle:${title}`;
    }
    if (author.length > 0)
    {
      route = route+`+inauthor:${author}`;
    }
    if (subject.length >0)
    {
      route = route+`+subject:${subject}`;
    }

    return this.http.get(`${route}&maxResults=40`);
  }

  getBooksByIsbn(isbn:string):any{
    return this.http.get(`${this.url}isbn:${isbn}`);
  }

  searchByDescription(description:string):any{
    return this.http.get(`${this.url}${description}`);
  }

  getBooksById(id:string):any{
    return this.http.get(`${this.urlId}${id}`);
  }
  
  
}


