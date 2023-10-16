export class ListItem{
    name:string;
    quantity:string
    image:string="" 
    constructor(name:string,quantity:string,image:string){
        this.name = name;
        this.quantity = quantity;
        this.image = image;
    }
}