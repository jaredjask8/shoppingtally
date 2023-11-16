import { ListItemInterface } from "./ListItemInterface";

export class CategoryUpdates{
    toCategory:string;
    fromCategory:string;
    currentCategoryList:ListItemInterface[]
    previousCategoryList:ListItemInterface[]


    constructor(toCategory:string,currentCategoryList:ListItemInterface[],fromCategory:string,previousCategoryList:ListItemInterface[]){
        this.currentCategoryList = currentCategoryList;
        this.previousCategoryList = previousCategoryList;
        this.fromCategory = fromCategory;
        this.toCategory = toCategory;
    }
}