import { ListItemInterface } from "./ListItemInterface";

export interface ActiveShopperOrder{
    list:ListItemInterface[]
    itemCount:number;
    isActive:boolean;  
}