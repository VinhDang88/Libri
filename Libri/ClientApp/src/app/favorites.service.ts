import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  endpoint: string = "api/UserProfile";

  // allows user to add favorite book to their profile once logged in
  addToFavoriteBooks(favoriteListId:string, isbn:string, title:string, author:string, subject:string, averageRating:number, ratingsCount:number):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/AddFavorites?favoriteListId=${favoriteListId}&isbn=${isbn}&title=${title}&author=${author}&subject=${subject}&averageRating=${averageRating}&ratingsCount=${ratingsCount}`, {});
  } // still need to link to site for functionality

}
