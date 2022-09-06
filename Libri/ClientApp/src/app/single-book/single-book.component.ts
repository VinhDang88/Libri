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
    showReviews: boolean = false;

    constructor(private authService: SocialAuthService, private listsService: ListsService, private bookService: BooksService,
       private reviewsService: ReviewsService, private route:ActivatedRoute, @Inject(LOCALE_ID) private locale: string) { }

    ngOnInit(): void {
      //displayed book's isbn is stored from the page url
      const routeParams = this.route.snapshot.paramMap;
      let isbn:string = String(routeParams.get("isbn"))
      //gets the book to display using the isbn from the route
      this.bookService.getBooksByIsbn(isbn).subscribe((response:Books) => {
        //if book had an isbn return will be an array containing a single item
        if(response.totalItems != 0){
          this.displayBook = response.items[0];
          this.getReviews();
        }
        else{
          //if book id was used because of missing isbn return will be a single item
          this.bookService.getBooksById(isbn).subscribe((response:Item) =>{
            this.displayBook = response;  
            this.getReviews(); 
          })
        }
      })
      //logs in user
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        //gets current users lists so they can be added to
        this.getWishList();
        this.getFavoriteList();
        this.getReadList();
        this.getDeniedList();
    })
    
  }

  getIsbn(book: Item):string{
    // Contains book identifiers
    let bookIds: IndustryIdentifier[] = book.volumeInfo.industryIdentifiers;
    let isbn: string = "";
    // Check for isbn_10 and assign it if found
    bookIds.forEach((id) => {
      if(id.type == "ISBN_10"){
        isbn = id.identifier
      }
    })
    // check for isbn_13 and assign it if no isbn_10
    if(isbn == ""){
      bookIds.forEach((id) => {
        if(id.type == "ISBN_13"){
          isbn = id.identifier
        }
      })
    }
    //if no isbn assign id instead
    if(isbn == ""){
      isbn = book.id
    }
    return isbn;
  }

  addFavorite(book:Item):any{
    //sets empty category of categories is missing
    if(book.volumeInfo.categories == undefined){
      book.volumeInfo.categories = [];
    }
    //sets empty author if author is missing
    if(book.volumeInfo.authors == undefined){
      book.volumeInfo.authors = [];
    }
    //sets empty title if title is missing
    if(book.volumeInfo.title == undefined){
      book.volumeInfo.title = "";
    }
    //gathers info need to add a book and calls list service to add to favorites
    this.listsService.addToFavoriteBooks(this.user.id, <string>this.getIsbn(book), book.volumeInfo.title, book.volumeInfo.authors.toString(),
    book.volumeInfo.categories.toString(), <number>book.volumeInfo.averageRating, <number>book.volumeInfo.ratingsCount, book.volumeInfo.description, this.getThumbnail(book)).subscribe((response: Favorites)=>{
      //push response to favorites array to update on page
      this.favoritesArray.push(response)
      console.log(response);
    });
  }

  addToWishList(book:Item):any{
    this.listsService.addToWishList(this.getIsbn(book), this.user.id).subscribe((response:Wish) => {
      console.log(response);
      //push response to wish array to update on page
      this.wish.push(response);
    });
  }

  addToReadList(book:Item):any{
    this.listsService.addToReadList(this.getIsbn(book), this.user.id).subscribe((response:Read) => {
      console.log(response);
      //push response to read array to update on page
      this.read.push(response);
    });
  }

  addToDeniedList(book:Item):any{
    this.listsService.addToDeniedList(this.getIsbn(book), this.user.id).subscribe((response:Denied) => {
      console.log(response);
      //push response to denied list to update on page
      this.denied.push(response);
    });
  }
  
  //determines if book is already favorited
  CheckIfInFavoriteList(book:Item):boolean{
      return this.favoritesArray.some(f => f.isbn.trim().toString() == this.getIsbn(book))
  }
  
  //determines if book is already in wishlist
  CheckIfInWishList(book:Item):boolean{
    let wish: Wish = {
      wishListId: this.user.id,
      isbn: this.getIsbn(book)
    }
    return this.wish.some(w=> w.isbn == wish.isbn && w.wishListId == wish.wishListId)
    }

  //determines if book is already in readlist
  CheckIfInReadList(book:Item):boolean{
    let read: Read = {
      readListId: this.user.id,
      isbn: this.getIsbn(book)
    }
    return this.read.some(r=> r.isbn == read.isbn && r.readListId == read.readListId)
    }

  //determines if book is already in denied list
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
    this.getReviews();
  }

  toggleReviews():void{
    this.showReviews = !this.showReviews;
  }

  //gets all reviews for displayed book
  getReviews():any{
    this.reviewsService.GetReviewsByBook(this.getIsbn(this.displayBook)).subscribe((response:Review[]) => {
      if(response != undefined){
      this.reviews = response;
      }
    })
  }
  
  //orders reviews by most votes
  getTopReviews():any{
    this.reviewsService.GetTopReviewsByBook(this.getIsbn(this.displayBook)).subscribe((response:Review[]) => {
      if(response != undefined){
      this.reviews = response;
      }
    })
  }

  //formats date of review for better display
  formatReviewDate(date:Date):string{
    return formatDate(date,'short',this.locale);
  }

  Upvote(review:Review):any{
    this.reviewsService.UpVote(this.user.id, review.id).subscribe((response:Review) =>
      this.reviews[this.reviews.indexOf(review)] = response
    )
  }

  Downvote(review:Review):any{
    this.reviewsService.DownVote(this.user.id, review.id).subscribe((response:Review) =>
    this.reviews[this.reviews.indexOf(review)] = response
    )
  }
}
