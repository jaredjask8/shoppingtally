import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
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
  imgUrl2:any;
  myForm: FormGroup; 
  title1:string='';
  description1:string='';
  title2:string='';
  description2:string='';
  whatsNewArray:WhatsNew[]

  constructor(private adminService:AdminService, private cdr: ChangeDetectorRef){}
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
    if(index == 0){
      this.adminService.submitWhatsNew(new WhatsNew(1,this.title1,this.description1,this.imgUrl)).subscribe(d => console.log(d))
    }else{
      this.adminService.submitWhatsNew(new WhatsNew(2,this.title2,this.description2,this.imgUrl2)).subscribe(d => console.log(d))
    }
    
  }
}
