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

  constructor(private adminService:AdminService, private fb:FormBuilder){}
  ngOnInit(): void {
    this.myForm = this.fb.group({
      title:'',
      description:''
    })
  }

  submit(title:string,description:string){
    this.adminService.submitWhatsNew(new WhatsNew(1,title,description,this.imgUrl)).subscribe(d => console.log(d))
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

    
  }
}
