export interface UserReccomendation {
    id:number;
    reccomendedTo:string;
    recommendBy:string;
    isbn:string;
    title:string;
    author:string;
    subject:string;
    averageRating:number;
    ratingsCount:number;
    bookThumbnailUrl:string;
}
