import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string
  ) { }

  url: string = "https://www.googleapis.com/books/v1/volumes?q="


  //endpoint for searching by a book title
  getByTitle(title:string):any{
    return this.http.get(`${this.url}intitle:${title}&maxResults=1`)
  }

  //endpoint for searching by author
  getByAuthor(author:string):any{
    return this.http.get(`${this.url}inauthor:${author}&maxResults=1`)
  }

  //endpoint for searching by subject
  getBySubject(subject:string):any{
    return this.http.get(`${this.url}subject:${subject}&maxResults=1`)
  }

}


