import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { RegisterService } from "src/register/register.service";

export const adminGuard:CanActivateFn = (route,state) => {
    const registerService = inject(RegisterService);
    const router = inject(Router);
    console.log(registerService.isAdmin)
    if(sessionStorage.getItem("admin")){
        return true;
    }else{
        router.navigateByUrl('home')
        return false;
    }
}

