import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WhatsNew } from '../../../src/models/WhatsNew';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderComponent } from '../../../src/global/components/loader.component';
import { LoaderService } from '../../../src/global/components/loader.service';

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.css'],
  standalone:true,
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    LoaderComponent,

  ]
})
export class WhatsNewComponent implements OnInit{
  selectedFile:any;
  imgUrl:any;
  imgUrl2:any;
  myForm: FormGroup; 
  title1:string='';
  description1:string='';
  title2:string='';
  description2:string='';
  whatsNewArray:WhatsNew[]

  constructor(private adminService:AdminService, private cdr: ChangeDetectorRef, private uploadMessage:MatSnackBar, private loaderService:LoaderService){}
  ngOnInit(): void {
    this.adminService.getWhatsNew().subscribe(d => {
      this.whatsNewArray = d;
    })
  }


  
  onFileSelected(e, index){
    this.selectedFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      index == 0 ? this.imgUrl = reader.result : this.imgUrl2 = reader.result
      

    }
    
   }

  onSubmit(index){
    this.loaderService.isLoading.next(true)
    if(index == 0){
      this.adminService.submitWhatsNew(new WhatsNew(1,this.title1,this.description1,this.imgUrl)).subscribe({
        next:data => {
          console.log(data)
        },
        error:err=>{
          this.loaderService.isLoading.next(false)
          this.uploadMessage.open("Failed to upload : " +err,"",{duration:1000})
          
        },
        complete:()=>{
          this.loaderService.isLoading.next(false)
          this.uploadMessage.open("Uploaded successfully","",{duration:1000})
        }
      })
    }else{
      this.adminService.submitWhatsNew(new WhatsNew(2,this.title2,this.description2,this.imgUrl2)).subscribe({
        next:data => {
          console.log(data)
        },
        error:err=>{
          this.loaderService.isLoading.next(false)
          this.uploadMessage.open("Failed to upload : " +err,"",{duration:1000})
          
        },
        complete:()=>{
          this.loaderService.isLoading.next(false)
          this.uploadMessage.open("Uploaded successfully","",{duration:1000})
        }
      })
    }
    
  }
}
