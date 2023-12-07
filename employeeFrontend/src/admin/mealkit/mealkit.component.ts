import { Component, OnInit } from '@angular/core';
import { MealkitService } from './mealkit.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { IngredientComponent } from "./ingredient/ingredient.component";
import { IngredientsInterface } from './models/IngredientsInterface';
import { Ingredients } from './models/Ingredients';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-mealkit',
    templateUrl: './mealkit.component.html',
    styleUrls: ['./mealkit.component.css'],
})
export class MealkitComponent implements OnInit{
  recipeName:string=""
  recipeSteps:string[]=[]
  recipeIngredients:IngredientsInterface[]=[]
  recipeDescription:string=""
  units:string[]=[
    "none",
    "tsp",
    "tbsp",
    "c",
    "pt",
    "qt",
    "gal",
    "oz",
    "fl oz",
    "lb"
  ]
  currentStepsEditString=""
  currentStepsEditIndex:number
  quantity:string[]=["1","2","3","4","5","6","7","8","9","10","1/2","1/3","2/3","3/4","1/4","1/8","1 1/2", "1 1/4"]
  showStepsInput:boolean=false

  currentIngredientsEditString=""
  currentIngredientsEditIndex:number
  showIngredientsInput:boolean=false

  //forms
  ingredientsForm = new FormGroup({
    ingredientControl: new FormControl(''),
    unitControl: new FormControl(''),
    quantityControl: new FormControl('')
  });
  constructor(private mealkitService:MealkitService){}
  ngOnInit(){
    this.mealkitService.getRecipes().subscribe(d=>console.log(d))
  }

  setRecipeName(name:string){
    this.recipeName = name;
  }

  addToRecipeSteps(step:string){
    this.recipeSteps.push(step)
  }

  addToRecipeIngredients(quantity:string,ingredient:string, unit:string){
    if(unit != "none"){
      this.recipeIngredients.push(new Ingredients(ingredient,quantity,unit))
    }else{
      this.recipeIngredients.push(new Ingredients(ingredient,quantity,""))
    }

    this.ingredientsForm.reset()
  }

  setRecipeDescription(description:string){
    this.recipeDescription = description;
  }

  editSteps(index:number, instance:any){
      this.showStepsInput = true
      this.currentStepsEditString = this.recipeSteps[index]
      this.currentStepsEditIndex = index
  }

  finishStepsEdit(){
    this.recipeSteps[this.currentStepsEditIndex] = this.currentStepsEditString
    this.showStepsInput = false
  }

  editIngredients(index:number, instance:any){
    this.showIngredientsInput = true
    let test:Ingredients = this.recipeIngredients[index]
    this.currentIngredientsEditIndex = index
  }


  finishIngredientsEdit(quantity,unit,ingredient){
    this.recipeIngredients[this.currentIngredientsEditIndex] = new Ingredients(ingredient,quantity,unit)
    this.showIngredientsInput = false
  }
}
