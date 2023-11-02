import { ListItemInterface } from "./ListItemInterface";
import { OrderData } from "./OrderData";

export interface ShopperOrder{
    date:string;
    list:ListItemInterface[];
    data:OrderData;
    isActive:string;
    isCompleted:string;
}