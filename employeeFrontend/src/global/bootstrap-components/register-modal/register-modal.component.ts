import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    MatButtonModule
  ]
})
export class RegisterModalComponent implements OnInit{
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl();
  firstname = new FormControl();
  lastname = new FormControl();
  phone = new FormControl();
  address = new FormControl();
  modalReference:any;
  @ViewChild('content', { static: true }) content;
  showSuccess:boolean;
  
  constructor(private modalService: NgbModal, private navService:NavService, private service:RegisterService){}
  ngOnInit(): void {
    this.navService.registerClicked$.subscribe(d => {
      if(d == true){
        console.log("in")
        this.modalReference = this.modalService.open(this.content, { backdropClass: 'light-blue-backdrop' });
      }
    })
  }

  submit(email:string, firstname:string, lastname:string,  password:string, phone:string, address:string){
    this.service.registerUser(new User(email,firstname,lastname,password,phone,address)).subscribe(x => {
      if(x){
        this.showSuccess = true;
      setTimeout(() =>{
        this.showSuccess = false;
        this.modalReference.close();
      },1000)
      }
    })
  }
}
