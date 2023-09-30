import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { WhatsNew } from 'src/models/WhatsNew';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  selectedFile:any;
  imgUrl:any;
  myForm: FormGroup; 
  title1:string='';
  description1:string='';

  constructor(private adminService:AdminService){}
  ngOnInit(): void {
    
  }


  
  onFileSelected(e){
    this.selectedFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.imgUrl = reader.result

    }

    
    
   }

  onSubmit(){
    this.adminService.submitWhatsNew(new WhatsNew(1,this.title1,this.description1,this.imgUrl)).subscribe(d => console.log(d))
    
  }
}
