export class WhatsNew{
    id:number;
    title:string;
    description:string;
    imageData:string;

    constructor(id,title,description,imageData){
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageData = imageData
    }
}