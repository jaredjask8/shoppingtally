import { ListItemInterface } from "./ListItemInterface";

export interface CurrentOrder{
    todo:ListItemInterface[],
    breakfast:ListItemInterface[],
    bread:ListItemInterface[],
    pet:ListItemInterface[],
    produce:ListItemInterface[],
    beverages:ListItemInterface[],
    international:ListItemInterface[],
    baking:ListItemInterface[],
    grains:ListItemInterface[],
    snacks:ListItemInterface[],
    deli:ListItemInterface[],
    bakery:ListItemInterface[],
    meat:ListItemInterface[],
    household:ListItemInterface[],
    health:ListItemInterface[],
    frozen:ListItemInterface[],
    dairy:ListItemInterface[],
    
    customer_address:string,
    customer_firstname:string,
    customer_lastname:string,
    customer_email:string,
    date:string

}