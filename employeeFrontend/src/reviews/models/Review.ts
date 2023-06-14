export class Review{
    title:string;
    review:string;
    rating:number;

    constructor(title:string,review:string,rating:number){
        this.title = title;
        this.review = review;
        this.rating = rating;
    }
}