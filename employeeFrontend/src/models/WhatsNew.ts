export class WhatsNew{
    id:number;
    title:string;
    description:string;
    imageData:Blob;

    constructor(id,title,description,imageData){
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageData = imageData
    }
}