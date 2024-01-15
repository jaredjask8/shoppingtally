import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavService } from 'src/global/nav/nav.service';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { RegisterService } from 'src/register/register.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ListService } from 'src/list/list_component/list.service';
import { UserOrderInfo } from 'src/list/models/UserOrderInfo';


@Component({
  selector: 'app-login-modal',
  standalone:true,
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
  encapsulation:ViewEncapsulation.None,
  imports:[
    MatFormFieldModule, 
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule
  ]
})
export class LoginModalComponent implements OnInit{
  showBadCred: boolean;
  showLoginSuccess:boolean;
  modalReference:any;
  constructor(private service: EnvironmentService, private registerService:RegisterService, private modalService: NgbModal, private navService:NavService, private cdr:ChangeDetectorRef, private listService:ListService, private router:Router){}
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl()
  token:string;
  @ViewChild('content', { static: true }) content;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  checkToken(token:string){
    if(token === "Bad credentials"){
      this.showBadCred = true;
      setTimeout(() =>{
        this.showBadCred = false;
      },2000)
      
    }else{
      this.showLoginSuccess = true;
      setTimeout(() =>{
        this.showLoginSuccess = false;
        this.modalReference.close();
      },1000)
      this.service.setEnvironment(token);
      this.service.setLogin();
      this.service.userLoggedIn.next(true)
      this.registerService.getUser().subscribe( (d) => {
        this.registerService.setAdmin(d);
      });

      this.listService.getUserHasOrder(token).subscribe(d => {
        this.navService.cartVisibility.next(new UserOrderInfo(d.hasActive,d.hasCurrentOrder))
      })

      this.navService.getCartCount().subscribe(d=>{
        this.navService.cartCount.next(d)
      })
      
      
    }

  }

  setEnvironment(email:string,password:string){
    this.registerService.authLogin(email,password).subscribe(d => {
      this.checkToken(d.token)
      this.cdr.detectChanges()
    });

    //this.router.navigateByUrl("/home")
  }

  

  ngOnInit(): void {
    this.navService.loginClicked$.subscribe(d => {
      if(d == true){
        console.log("in")
        this.modalReference = this.modalService.open(this.content, { backdropClass: 'light-blue-backdrop' });
      }
    })
  }


  
}
