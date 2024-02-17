import { IngredientsInterface } from "./IngredientsInterface";

export interface RecipesInterface{
    id:string;
    ingredients:IngredientsInterface[]
    directions:string[]
    name:string
    description:string
}