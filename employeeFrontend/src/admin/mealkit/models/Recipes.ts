import { IngredientsInterface } from "./IngredientsInterface";

export interface Recipes{
    id:string;
    ingredients:IngredientsInterface[]
    directions:string[]
    name:string
    description:string
}