import { Component } from '@angular/core';
import { AdminService } from './admin.service';
import { WhatsNew } from 'src/models/WhatsNew';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  selectedFile:any;
  imgUrl:any;

  constructor(private adminService:AdminService){}
  
  onFileSelected(e){
    this.selectedFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.imgUrl = reader.result

    }

    //let objectURL = URL.createObjectURL(blob);       
    //this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);

    
    
   }

  onSubmit(){
    this.adminService.submitWhatsNew(new WhatsNew(1,'test','description',this.imgUrl)).subscribe(d => console.log(d))
  }
}
