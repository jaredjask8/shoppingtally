class Marker {
    name:string;
    lat:number;
    lng:number;

    constructor(name:string, lat:number, lng:number){
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }

}


export const markers:Marker[] = [
    new Marker('Publix at Bradfordville', 30.56344408460511, -84.21449691895742),
    new Marker('Publix at Village Square', 30.509248242320087, -84.24758860904745),
    new Marker('Publix at Bannerman', 30.589115337523737, -84.25140807373309),
]