import { ListItemInterface } from "./ListItemInterface";

export interface CurrentOrderUser{
    shopper_firstname:string;
    shopper_lastname:string;
    shopper_phone:string;
    date:string;

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
    completed:ListItemInterface[]

    
}