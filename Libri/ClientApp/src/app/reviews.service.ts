import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  endpoint: string = "api/Review";

  PostReview(userId:string, isbn:string, bookTitle:string, author:string, username:string, review1:string):any{
    return this.http.post(`${this.baseUrl}${this.endpoint}/PostReview?userId=${userId}&isbn=${isbn}&bookTitle=${bookTitle}
    &author=${author}&username=${username}&review1=${review1}`, {});
  }

  GetReviewsByBook(isbn:string)
  {
    return this.http.get(`${this.baseUrl}${this.endpoint}/GetReviewsByBook?isbn=${isbn}`);
  }

  GetReviewsByUser(userId:string)
  {
    return this.http.get(`${this.baseUrl}${this.endpoint}/GetReviewsByUser?userId=${userId}`);
  }

  DeleteReview(userId:string, isbn:string, datePosted:Date)
  {
    return this.http.delete(`${this.baseUrl}${this.endpoint}/DeleteReview?userId=${userId}&isbn=${isbn}&datePosted=${datePosted}`);
  }

  EditReview(userId:string, isbn:string, datePosted:Date, review1:string)
  {
    return this.http.put(`${this.baseUrl}${this.endpoint}/EditReview?userId=${userId}&isbn=${isbn}&datePosted=${datePosted}&review1=${review1}`, {});
  }

  UpVote(userId:string, isbn:string, datePosted:Date)
  {
    return this.http.put(`${this.baseUrl}${this.endpoint}/UpVote?userId=${userId}&isbn=${isbn}&datePosted=${datePosted}`, {});
  }

  DownVote(userId:string, isbn:string, datePosted:Date)
  {
    return this.http.put(`${this.baseUrl}${this.endpoint}/DownVote?userId=${userId}&isbn=${isbn}&datePosted=${datePosted}`, {});
  }
}
