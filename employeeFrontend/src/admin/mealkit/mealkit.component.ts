import { Component, OnInit, ViewChild } from '@angular/core';
import { MealkitService } from './mealkit.service';
import { IngredientsInterface } from './models/IngredientsInterface';
import { Ingredients } from './models/Ingredients';
import { FormControl, FormGroup } from '@angular/forms';
import { Recipes } from './models/Recipes';

@Component({
    selector: 'app-mealkit',
    templateUrl: './mealkit.component.html',
    styleUrls: ['./mealkit.component.css'],
})
export class MealkitComponent implements OnInit{
  recipeName:string=""
  recipeArray:Recipes[] = []
  recipeSteps:string[]=[]
  recipeIngredients:IngredientsInterface[]=[]
  recipeTags:string[]=[];
  recipeServingSize:string=""
  recipeDescription:string=""
  currentEditRecipe:Recipes
  isEditRecipeShown:boolean=true
  isCreateRecipeShown:boolean=true
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

  tags:string[]=[
    "pork",
    "chicken",
    "fish",
    "beef",
    "vegetarian",
    "gluten free",
    "keto",
    "healthy"
  ]

  currentStepsEditString=""
  currentStepsEditIndex:number
  currentRecipeIndex:number
  quantity:string[]=["1","2","3","4","5","6","7","8","9","10","1/2","1/3","2/3","3/4","1/4","1/8","1 1/2", "1 1/4"]
  showStepsInput:boolean=false
  currentIngredientsEditString=""
  currentIngredientsEditIndex:number
  currentIngredientsFinalEditIndex:number
  currentStepsFinalEditIndex:number
  showIngredientsInput:boolean=false
  showIngredientsFinalInput:boolean=false
  showStepsFinalInput:boolean=false
  showDescriptionFinalInput:boolean=false

  //forms
  ingredientsForm = new FormGroup({
    basicIngredientControl: new FormControl(''),
    trueIngredientControl: new FormControl(''),
    unitControl: new FormControl(''),
    quantityControl: new FormControl('')
  });

  servingSizeForm = new FormGroup({
    servingSizeControl: new FormControl('')
  });

  featuredForm = new FormGroup({
    featuredControl: new FormControl('')
  });

  constructor(private mealkitService:MealkitService){}
  ngOnInit(){
    this.mealkitService.getRecipes().subscribe(d=>this.recipeArray = d)
  }

  setRecipeName(name:string){
    this.recipeName = name;
  }

  setServingSize(size:string){
    this.recipeServingSize = size;
  }

  addToRecipeSteps(step:string){
    this.recipeSteps.push(step)
  }

  addToRecipeIngredients(quantity:string,basicIngredient:string,recipeIngredient:string, unit:string){
    if(unit != "none"){
      this.recipeIngredients.push(new Ingredients(quantity,unit,basicIngredient,recipeIngredient,quantity))
    }else{
      this.recipeIngredients.push(new Ingredients(quantity,"",basicIngredient,recipeIngredient,quantity))
    }

    this.ingredientsForm.reset()
  }

  addToRecipeTags(tag:string){
    this.recipeTags.push(tag)
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

  editFinalIngredients(index:number){
    this.currentIngredientsFinalEditIndex = index
    this.showIngredientsFinalInput = true
    //create new ingredient with data
    //overwrite new data in currentEditRecipe

  }

  editFinalSteps(index:number){
    this.showStepsFinalInput = true
    this.currentStepsFinalEditIndex = index
  }

  editFinalDescription(){
    this.showDescriptionFinalInput = true
  }


  finishIngredientsEdit(quantity,unit,basicIngredient,recipeIngredient){
    if(unit != "none"){
      this.recipeIngredients[this.currentIngredientsEditIndex] = new Ingredients(quantity,unit,basicIngredient,recipeIngredient,quantity)
    }else{
      this.recipeIngredients[this.currentIngredientsEditIndex] = new Ingredients(quantity,"",basicIngredient,recipeIngredient,quantity)
    }
    
    this.showIngredientsInput = false
  }

  finishFinalIngredientEdit(quantity:string,unit:string,recipeIngredient:string,basicIngredient:string){
    let newIngredient:Ingredients

    if(unit != "none"){
      newIngredient= new Ingredients(quantity,unit,basicIngredient,recipeIngredient,quantity)
    }else{
      newIngredient= new Ingredients(quantity,"",basicIngredient,recipeIngredient,quantity)
    }
    
    this.currentEditRecipe.ingredients[this.currentIngredientsFinalEditIndex] = newIngredient
    this.showIngredientsFinalInput = false
  }

  finishFinalStepEdit(step:string){
    this.currentEditRecipe.steps[this.currentStepsFinalEditIndex] = step
    this.showStepsFinalInput = false
  }

  finishFinalDescriptionEdit(newDescription:string){
    this.currentEditRecipe.description = newDescription
    this.showDescriptionFinalInput = false
  }

  addRecipe(){
    //let test:Recipes = new Recipes(this.recipeIngredients,this.recipeSteps,this.recipeName,this.recipeDescription)
    //console.log(test)
    let image:string = "";
    this.recipeName.split(" ").forEach((d,index)=>{
      if(index == 0){
        image += d.toLowerCase()
      }else{
        image += d.charAt(0).toUpperCase() + d.slice(1);
      }
    })

    let finalImage:string = "https://shoppingtally.click/images/"+image+".png"
    console.log(finalImage)
    this.mealkitService.addRecipe(new Recipes(this.recipeIngredients,this.recipeSteps,this.recipeName,this.recipeDescription,finalImage,this.recipeTags,this.recipeServingSize,false)).subscribe(d=>this.recipeArray = d)
  }

  loadRecipeData(recipe:Recipes,index:number){
    //set UI for edit recipe
    this.showIngredientsFinalInput = false
    this.isCreateRecipeShown = false
    this.servingSizeForm.reset()
    this.currentEditRecipe = recipe
    this.currentRecipeIndex = index
    
  }

  finishRecipeEdit(){
    this.mealkitService.updateRecipe(this.currentEditRecipe).subscribe(d=>this.recipeArray = d)
    this.currentEditRecipe = null
    this.isCreateRecipeShown = true
  }

  deleteRecipe(){
    this.mealkitService.deleteRecipe(this.currentEditRecipe).subscribe(d => {
      this.recipeArray = d
      this.currentEditRecipe = null
      this.isCreateRecipeShown = true
      
    })
  }

  changeServingSizeFinal(newServingSize:string){
    this.currentEditRecipe.servingSize = newServingSize
    this.servingSizeForm.reset()
  }

  changeFeaturedFinal(newChoice:boolean){
    this.currentEditRecipe.featured = newChoice
    this.featuredForm.reset()
  }

}
