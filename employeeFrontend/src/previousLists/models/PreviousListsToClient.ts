import { ListItem } from "src/list/models/ListItem";

export class PreviousListsToClient{
    id:number;
    item:ListItem[];
    date:string;

    constructor(id:number, item:ListItem[], date:string){
        this.item = item;
        this.date = date;
        this.id = id;
    }
}