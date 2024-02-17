import { CurrentOrderUserClass } from "./CurrentOrderUserClass";
import { ListItemInterface } from "./ListItemInterface";

export class CurrentOrderUserClassWithUpdateMessage{
    token:string;
    date:string;
    updateMessage:string;

    todo:ListItemInterface[] = [];
    breakfast:ListItemInterface[]= [];
    bread:ListItemInterface[]= [];
    pet:ListItemInterface[]= [];
    produce:ListItemInterface[]= [];
    beverages:ListItemInterface[]= [];
    international:ListItemInterface[]= [];
    baking:ListItemInterface[]= [];
    grains:ListItemInterface[]= [];
    snacks:ListItemInterface[]= [];
    deli:ListItemInterface[]= [];
    bakery:ListItemInterface[]= [];
    meat:ListItemInterface[]= [];
    household:ListItemInterface[]= [];
    health:ListItemInterface[]= [];
    frozen:ListItemInterface[]= [];
    dairy:ListItemInterface[]= [];
    completed:ListItemInterface[]= [];

    constructor(
        token:string,
        date:string,
        updateMessage:string,
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
    ){
        this.token = token
        this.date = date;
        this.updateMessage = updateMessage;
        this.todo = todo;
        this.breakfast = breakfast;
        this.bread = bread;
        this.pet = pet;
        this.produce = produce;
        this.beverages = beverages;
        this.international = international;
        this.baking = baking;
        this.grains = grains;
        this.snacks = snacks;
        this.deli = deli;
        this.bakery = bakery;
        this.meat = meat;
        this.household = household;
        this.health = health;
        this.frozen = frozen;
        this.dairy = dairy;
        this.completed = completed;
    }
}