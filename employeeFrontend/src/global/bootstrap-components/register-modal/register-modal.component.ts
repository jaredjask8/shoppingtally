import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { min } from 'rxjs';
import { NavService } from 'src/global/nav/nav.service';
import { User } from 'src/models/User';
import { RegisterService } from 'src/register/register.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css'],
  standalone:true,
  encapsulation:ViewEncapsulation.None,
  imports:[
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class RegisterModalComponent implements OnInit{
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required, Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10)]),
    address: new FormControl('',[Validators.required])
  });
  //form status
  controlErrors: ValidationErrors
  formStatus:boolean=false
  passwordStatus:boolean=false
  emailStatus:boolean=false
  firstnameStatus:boolean=false
  lastnameStatus:boolean=false
  phoneStatus:boolean=false
  addressStatus:boolean=false

  modalReference:any;
  @ViewChild('content', { static: true }) content;
  showSuccess:boolean;
  
  constructor(private modalService: NgbModal, private navService:NavService, private service:RegisterService, private userFoundNotification:MatSnackBar){}
  ngOnInit(): void {
    this.navService.registerClicked$.subscribe(d => {
      if(d == true){
        console.log("in")
        this.modalReference = this.modalService.open(this.content, { backdropClass: 'light-blue-backdrop' });
      }
    })
  }

  submit(){
    this.service.checkUser(this.registerForm.controls.email.value).subscribe(d => {
      if(d.found){
        //user found
        this.userFoundNotification.open("Email already in use, please try a different email","",{duration:2000})
      }else{
        this.service.registerUser(new User(this.registerForm.controls.email.value,this.registerForm.controls.firstname.value,this.registerForm.controls.lastname.value,this.registerForm.controls.password.value,this.registerForm.controls.phone.value,this.registerForm.controls.address.value)).subscribe(x => {
          if(x){
            this.showSuccess = true;
            setTimeout(() =>{
              this.showSuccess = false;
              this.modalReference.close();
            },1000)
          }
        })
      }
    })
  } 
      

  checkFormStatus(){
    if(this.registerForm.get("password").errors == null){
      this.passwordStatus = true
    }else{
      this.passwordStatus = false
    }

    if(this.registerForm.get("email").errors == null){
      this.emailStatus = true
    }else{
      this.emailStatus = false
    }

    if(this.registerForm.get("firstname").errors == null){
      this.firstnameStatus = true
    }else{
      this.firstnameStatus = false
    }

    if(this.registerForm.get("lastname").errors == null){
      this.lastnameStatus = true
    }else{
      this.lastnameStatus = false
    }

    if(this.registerForm.get("phone").errors == null){
      this.phoneStatus = true
    }else{
      this.phoneStatus = false
    }

    if(this.registerForm.get("address").errors == null){
      this.addressStatus = true
    }else{
      this.addressStatus = false
    }

    if(this.registerForm.status == "VALID"){
      this.formStatus = true
    }else{
      this.formStatus = false
    }
  }
}
