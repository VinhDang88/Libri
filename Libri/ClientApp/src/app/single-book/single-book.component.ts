import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Books, IndustryIdentifier, Item } from '../books';
import { BooksService } from '../books.service';
import { Denied } from '../denied';
import { Favorites } from '../favorites';
import { ListsService } from '../lists.service';
import { Read } from '../read';
import { Review } from '../review';
import { ReviewsService } from '../reviews.service';
import { Wish } from '../wish';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})

export class SingleBookComponent implements OnInit {

    user: SocialUser = {} as SocialUser;
    loggedIn: boolean = false;
    displayBook:Item = {} as Item;
    favoritesArray: Favorites[] = [];
    wish: Wish[] = [];
    read: Read[] = [];
    denied: Denied[] = [];  
    showReviewForm:boolean = false;
    newReview:Review = {} as Review;
    reviews:Review[] = [];

    constructor(private authService: SocialAuthService, private listsService: ListsService, private bookService: BooksService,
       private reviewsService: ReviewsService, private route:ActivatedRoute, @Inject(LOCALE_ID) private locale: string) { }

    ngOnInit(): void {
      const routeParams = this.route.snapshot.paramMap;
      let isbn:string = String(routeParams.get("isbn"))
      this.bookService.getBooksByIsbn(isbn).subscribe((response:Books) => {
        if(response.totalItems != 0){
          this.displayBook = response.items[0];
        }
        else{
          this.bookService.getBooksById(isbn).subscribe((response:Item) =>{
            this.displayBook = response;   
          })
        }
      })
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        this.getWishList();
        this.getFavoriteList();
        this.getReadList();
        this.getDeniedList();
        this.getReviews();
    })
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
      bookIds.forEach((id) => {
        if(id.type == "ISBN_13"){
          isbn = id.identifier
        }
      })
    }
    if(isbn == ""){
      isbn = book.id
    }
    return isbn;
  }

  getId(book:Item):string{
    return book.id;
  }

  addFavorite(book:Item):any{
    if(book.volumeInfo.categories == undefined){
      book.volumeInfo.categories = [];
    }
    if(book.volumeInfo.authors == undefined){
      book.volumeInfo.authors = [];
    }
    if(book.volumeInfo.title == undefined){
      book.volumeInfo.title = "";
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

  toggleReviewForm():boolean{
    this.showReviewForm = !this.showReviewForm;
    return this.showReviewForm;
  }

  PostReview(form:NgForm):any{
    let review:string = form.form.value.review;
    this.reviewsService.PostReview(this.user.id, this.getIsbn(this.displayBook),this.displayBook.volumeInfo.title, this.displayBook.volumeInfo.authors.toString(),
    this.user.name, review).subscribe((response:Review) => {
      console.log(response);
      this.newReview = response;
    })
  }

  getReviews():any{
    this.reviewsService.GetReviewsByBook(this.getIsbn(this.displayBook)).subscribe((response:Review[]) => {
      if(response != undefined){
      this.reviews = response;
      }
    })
  }

  formatReviewDate(date:Date):string{
    // return date.toLocaleString();
    return formatDate(date,'short',this.locale);
  }
}
