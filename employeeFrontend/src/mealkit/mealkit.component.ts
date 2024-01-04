import { Component, OnInit } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { MealkitService } from 'src/admin/mealkit/mealkit.service';
import { Recipes } from 'src/admin/mealkit/models/Recipes';
import { NavService } from 'src/global/nav/nav.service';
import { ListService } from 'src/list/list_component/list.service';
import { ListItem } from 'src/list/models/ListItem';
import { ListItemInterface } from 'src/list/models/ListItemInterface';
import Fraction from 'fraction.js';
import { CurrentOrderUser } from 'src/list/models/CurrentOrderUser';
import { List } from 'src/list/models/List';


@Component({
  selector: 'app-mealkit',
  templateUrl: './mealkit.component.html',
  styleUrls: ['./mealkit.component.css']
})
export class MealkitComponent implements OnInit{
  recipeArray:Recipes[]=[]
  recipeArrayFeatures:Recipes[]=[]
  filterByTagsArray:Recipes[]=[]
  filterByNameArray:Recipes[]=[]
  servingSizeArray:number[]=[]
  setInitialCurrentRecipe:boolean=true
  convertedRecipeArray:Recipes
  currentServingSize:number
  currentRecipe:Recipes
  hasCurrentOrder:boolean
  isActive:boolean
  hasCartOrder:boolean
  itemsForCart:ListItem[]=[]
  isTagActive:boolean=false
  isNameActive:boolean=false

  //list states
  cart:List
  current:List
  active:CurrentOrderUser
  
  currentCartItems:ListItem[]=[]
  currentOrderItems:ListItem[]=[]
  currentActiveItems:ListItem[]=[]

  todo: ListItemInterface[]
  breakfast: ListItemInterface[]
  bread: ListItemInterface[]
  pet: ListItemInterface[]
  produce: ListItemInterface[]
  beverages: ListItemInterface[]
  international: ListItemInterface[]
  baking: ListItemInterface[]
  grains: ListItemInterface[]
  snacks: ListItemInterface[]
  deli: ListItemInterface[]
  bakery: ListItemInterface[]
  meat: ListItemInterface[]
  household: ListItemInterface[]
  health: ListItemInterface[]
  frozen: ListItemInterface[]
  dairy: ListItemInterface[]
  completed: ListItemInterface[]
  currentOrderDate:string
  
  
  constructor(private mealkitService : MealkitService, private navService:NavService, private listService:ListService){
    this.navService.cartVisibility$.subscribe(d => {
      if(!d.hasActive && !d.hasCurrentOrder){
        this.listService.getCurrentList().subscribe(d=>this.currentCartItems = d.list)
        
        this.hasCartOrder = true
        this.hasCurrentOrder = false
        this.isActive = false
      }else if(d.hasCurrentOrder && !d.hasActive){
        this.listService.getUserList().subscribe(d=>this.currentOrderItems = d.list)
        this.hasCartOrder = false
        this.hasCurrentOrder = true
        this.isActive = false
        
      }else{
        this.listService.getActiveOrder().subscribe(e => {
          this.todo = e.todo
          this.deli = e.deli
          this.health = e.health
          this.dairy = e.dairy
          this.breakfast = e.breakfast
          this.international = e.international
          this.baking = e.baking;
          this.grains = e.grains
          this.snacks = e.snacks
          this.pet = e.pet
          this.household = e.household
          this.beverages = e.beverages
          this.bread = e.bread
          this.frozen = e.frozen
          this.meat = e.meat
          this.produce = e.produce
          this.bakery = e.bakery
          this.completed = e.completed
          this.currentOrderDate = e.date
        })
        this.hasCartOrder = false
        this.hasCurrentOrder = false
        this.isActive = true
      }
    })
  }

  
  
  ngOnInit(): void {
    this.mealkitService.getRecipes().subscribe(d=>{
      this.recipeArray = d
      this.recipeArrayFeatures = d.filter(e=>e.featured == true)
    })
    
  }

  convert(size:number){
    let servingSizeToInt = parseInt(this.currentRecipe.servingSize)
    let doMath = size - servingSizeToInt;
    this.currentServingSize = size
    if(this.currentServingSize == parseInt(this.currentRecipe.servingSize)){
      this.setInitialCurrentRecipe = true
    }else{
      this.setInitialCurrentRecipe = false
      this.convertedRecipeArray = this.currentRecipe
      this.currentRecipe.ingredients.forEach((d,index)=>{
        var x = new Fraction(d.initialQuantity);
        this.convertedRecipeArray.ingredients[index].quantity = x.mul(doMath+1).toFraction(true)
        
        
      })
    }
    
  }

  loadRecipeData(recipe:Recipes){
    this.setInitialCurrentRecipe = true
    this.servingSizeArray = []
    this.itemsForCart = []
    this.currentRecipe = recipe
    this.currentRecipe.ingredients.forEach(d=>{
      this.itemsForCart.push(new ListItem(d.basicIngredient,"1",null))
    })
    this.currentServingSize = parseInt(this.currentRecipe.servingSize)
    for(let i = this.currentServingSize; i <= 10; i++){
      this.servingSizeArray.push(i)
    }
    
  }

  addRecipeToCart(){
    let filteredList:ListItem[]=[]
    this.listService.getCurrentList().subscribe(d=>{
      this.currentCartItems = d.list
      this.itemsForCart.forEach(e=>{
        if(this.checkItemValidity(e.name)){
          console.log(e.name)
          filteredList.push(e)
        }
      })
      this.listService.addFullList(filteredList).subscribe(d=>{
        this.navService.cartCount.next(d.itemCount.toString())
        this.currentCartItems = d.list
      })

    })
    
  }

  addRecipeToOrderState(){
    let filteredList:ListItem[]=[]
    this.itemsForCart.forEach(d=>{
      if(this.checkItemValidity(d.name)){
        filteredList.push(d)
      }
    })
    if(this.hasCurrentOrder && !this.isActive){
      if(filteredList.length){
        this.listService.addFullListToCurrentOrder(filteredList).subscribe(d=>console.log(d))
      }
      
      //this.snackBar.open("Items added")
      //setTimeout(()=>{this.snackBar.dismiss()},2000)

    }else{
      if(filteredList.length){
        this.listService.addFullListToActiveOrder(filteredList).subscribe(d=>console.log(d))
      }
      console.log("in active")
      
    }
  }

  checkItemValidity(item:string):boolean{
    let tempArray:ListItemInterface[] = [];
    let activeListArray:ListItemInterface[] = tempArray.concat(
      this.todo,
      this.deli,
      this.health,
      this.dairy,
      this.breakfast,
      this.international,
      this.baking,
      this.grains,
      this.snacks,
      this.pet,
      this.household,
      this.beverages,
      this.bread,
      this.frozen,
      this.meat,
      this.produce,
      this.bakery,
      this.completed  
    )
    var itemFound:boolean=true;
    
    if(!this.hasCurrentOrder && !this.isActive){
      //cart state
      this.currentCartItems.forEach(d=>{
        if(d.name === item){
          itemFound = false;
        }
      })
    }else if(this.hasCurrentOrder && !this.isActive){
      //current order state
      this.currentOrderItems.forEach(d=>{
        if(d.name === item){
          itemFound = false;
        }
      })
    }else{
      //active order state
      activeListArray.forEach(d=>{
        //console.log(d.name)
        if(d.name === item){
          itemFound = false;
        }
      })
    }

    return itemFound;
    
  }

  searchForRecipe(userInput:string){
    this.filterByTagsArray = []
    let tempArray:string[]=[]
    let filteredArray:number[]=[]
    
    if(userInput.charAt(0) == "/"){
      this.isNameActive = false
      this.isTagActive = true
      tempArray = userInput.split("/")
      tempArray.shift()

      //console.log(tempArray)
      for(let i = 0;i<this.recipeArray.length;i++){
        let count = 0
        for(let k = 0;k < this.recipeArray[i].tags.length;k++){
          
          for(let j = 0;j< tempArray.length;j++){
            if(this.recipeArray[i].tags[k] == tempArray[j]){
              count++;
            }
            //console.log(i + " " +count + "   " + tempArray[j])
          }

          
        }
        filteredArray.push(count)
      }

      //console.log(filteredArray)
      var largest = Math.max.apply(Math, filteredArray);
      filteredArray.forEach((d,index)=>{
        if(d == largest){
          this.filterByTagsArray.push(this.recipeArray[index])
        }
      })
    }else{
      this.isTagActive = false
      this.isNameActive = true
      this.filterByNameArray = this.search(userInput)
    }

    
    
    console.log(this.filterByNameArray)
  }

  search(value: string) {
    let filter = this.recipeArray.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    return [...filter];
  }

}
