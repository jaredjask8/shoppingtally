export interface JwtUserResponse{
    id:string;
    password:string
    email:string;
    firstname:string;
    lastname:string;
    role:string;
    currentCart:string;
    accountNonLocked:boolean;
    authorities:[{authority:string}],
    username:string;
    accountNonExpired:boolean;
    credentialsNonExpired:boolean;
    enabled:boolean;
}