import { ListItem } from "./ListItem";
import { ListItemInterface } from "./ListItemInterface";

export interface List{
    list:ListItemInterface[]
    itemCount:number;  
    date:string;
}