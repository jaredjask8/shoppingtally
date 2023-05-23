import { Photo } from "./Photo";

export interface Common{
    food_name:string;
    serving_unit:string;
    tag_name:string;
    serving_qty:number;
    common_type:null;
    tag_id:string;
    photo:Photo;
    locale:string;
}
