export class ListItemToDb{
    token:string;
    list:string;

    constructor(token,list){
        this.list = list;
        this.token = token;
    }
}