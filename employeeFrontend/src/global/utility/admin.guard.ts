import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { RegisterService } from "src/register/register.service";

export const adminGuard:CanActivateFn = (route,state) => {
    const registerService = inject(RegisterService);
    const router = inject(Router);
    console.log(registerService.isAdmin)
    if(registerService.isAdmin){
        console.log("true")
        return true;
    }else{
        console.log("not admin")
        router.navigateByUrl('home')
        return false;
    }
}

