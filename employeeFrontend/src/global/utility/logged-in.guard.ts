import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EnvironmentService } from './environment.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  
  if(sessionStorage.getItem("log") == "1"){
    return true;
  }else{
    router.navigateByUrl('home')
    return false;
  }
  
};
