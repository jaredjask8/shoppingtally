export class Ingredients{
    quantity:string;
    initialQuantity:string
    unit:string;
    basicIngredient:string
    recipeIngredient:string

    constructor(quantity,unit,basicIngredient,recipeIngredient,initialQuantity){
        this.basicIngredient = basicIngredient;
        this.recipeIngredient = recipeIngredient
        this.quantity = quantity;
        this.unit = unit
        this.initialQuantity = initialQuantity
    }
}