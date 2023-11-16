export class UserOrderInfo{
    hasActive:boolean=false;
    hasCurrentOrder:boolean=false;

    constructor(isActive:boolean,hasCurrentOrder:boolean){
        this.hasActive=isActive;
        this.hasCurrentOrder=hasCurrentOrder
    }
}