import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  endpoint: string = "api/UserProfile";

    // allows user to add favorite book to their profile once logged in
    addToFavoriteBooks(favoriteListId:string, isbn:string, title:string, author:string, subject:string,averageRating:number, ratingsCount:number):any{
      // console.log(averageRating)
      if(subject == undefined){
        subject = "";
      }
      if(averageRating == undefined){
        averageRating = 0;
      }
      if(ratingsCount == undefined){
        ratingsCount = 0;
      }
      return this.http.post(`${this.baseUrl}${this.endpoint}/AddFavorite?favoriteListId=${favoriteListId}&isbn=${isbn}
      &title=${title}&author=${author}&subject=${subject}&averageRating=${averageRating}&ratingsCount=${ratingsCount}`, {});
    }
  
    getUserFavorites(userId: string): any{
      return this.http.get(`${this.baseUrl}${this.endpoint}/GetUserFavorites?userId=${userId}`)
    }
  
    getWishList(userId: string):any{
      return this.http.get(`${this.baseUrl}${this.endpoint}/GetWishList?userId=${userId}`)
    }

    getReadList(userId:string):any{
      return this.http.get(`${this.baseUrl}${this.endpoint}/GetReadList?userId=${userId}`)
    }

    getDeniedList(userId:string):any{
      return this.http.get(`${this.baseUrl}${this.endpoint}/GetDeniedList?userId=${userId}`)
    }

    addToWishList(isbn:string, wishListId:string):any{
      return this.http.post(`${this.baseUrl}${this.endpoint}/AddToWishList?isbn=${isbn}&wishListId=${wishListId}`, {})
    }

    addToReadList(isbn:string, readListId:string):any{
      return this.http.post(`${this.baseUrl}${this.endpoint}/AddToReadList?isbn=${isbn}&readListId=${readListId}`, {})
    }

    addToDeniedList(isbn:string, deniedListId:string):any{
      return this.http.post(`${this.baseUrl}${this.endpoint}/AddToDeniedList?isbn=${isbn}&deniedListId=${deniedListId}`, {})
    }

    deleteWishListObject(isbn:string, wishListId:string):any{
      return this.http.delete(`${this.baseUrl}${this.endpoint}/DeleteWishListObject?isbn=${isbn}&wishListId=${wishListId}`)
    }

    deleteReadListObject(isbn:string, readListId:string):any{
      return this.http.delete(`${this.baseUrl}${this.endpoint}/DeleteReadListObject?isbn=${isbn}&readListId=${readListId}`)
    }

    deleteDeniedListObject(isbn:string, deniedListId:string):any{
      return this.http.delete(`${this.baseUrl}${this.endpoint}/DeleteDeniedListObject?isbn=${isbn}&deniedListId=${deniedListId}`)
    }

    deleteFavoriteListObject(isbn:string, favoriteListId:string):any{
      return this.http.delete(`${this.baseUrl}${this.endpoint}/DeleteFavoriteListObject?isbn=${isbn}&favoriteListId=${favoriteListId}`)
    }

    GetTopFavoriteAuthors(userId:string):any{
      return this.http.get(`${this.baseUrl}${this.endpoint}/GetTopFavoriteAuthors?userId=${userId}`);
    }
}
