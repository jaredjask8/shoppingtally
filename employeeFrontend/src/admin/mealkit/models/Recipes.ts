import { IngredientsInterface } from "./IngredientsInterface";

export class Recipes{
    ingredients:IngredientsInterface[]
    steps:string[]
    name:string
    description:string
    image:string
    tags:string[]
    servingSize:string
    featured:boolean

    constructor(ingredients:IngredientsInterface[],steps:string[],name:string,description:string,image:string,tags:string[],servingSize:string,featured:boolean){
        this.ingredients = ingredients;
        this.description = description;
        this.name = name;
        this.steps = steps;
        this.image = image   
        this.tags = tags
        this.servingSize = servingSize
        this.featured = featured
    }
}