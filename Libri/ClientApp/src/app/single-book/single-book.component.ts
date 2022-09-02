import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Books, Item } from '../books';
import { BooksService } from '../books.service';
import { ListsService } from '../lists.service';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})

export class SingleBookComponent implements OnInit {

    user: SocialUser = {} as SocialUser;
    loggedIn: boolean = false;
    displayBook:Item = {} as Item;

    constructor(private authService: SocialAuthService, private listsService: ListsService, private bookService: BooksService, private route:ActivatedRoute) { }

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

  
}
