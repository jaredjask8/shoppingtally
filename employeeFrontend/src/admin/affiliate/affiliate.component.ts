import { Component, OnInit } from '@angular/core';
import { AffiliateService } from './affiliate.service';
import { AffiliateData } from './models/AffiliateData';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/global/components/loader.service';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css']
})
export class AffiliateComponent implements OnInit{
  affiliateForm = new FormGroup({
    name: new FormControl(''),
    link: new FormControl(''),
    image: new FormControl('')
  });

  // affiliateEditForm = new FormGroup({
  //   name: new FormControl(''),
  //   link: new FormControl(''),
  //   image: new FormControl('')
  // });

  formStatus:boolean =false
  affiliateArray:AffiliateData[]=[]

  // formEditStatus:boolean=false
  // editShown:boolean=false

  constructor(private affiliateService:AffiliateService, private loaderService:LoaderService){}
  ngOnInit(): void {
    this.getAffiliateData()
  }



  addAffiliateData(){
    this.loaderService.isLoading.next(true)
    this.affiliateService.addAffiliateData(this.affiliateForm.value).subscribe({
      next:d=>this.affiliateArray = d,
      complete:()=>this.loaderService.isLoading.next(false)
    })
    this.affiliateForm.reset()
  }

  getAffiliateData(){
    this.loaderService.isLoading.next(false)
    this.affiliateService.getAffiliateData().subscribe({
      next:d=>this.affiliateArray = d,
      complete:()=>this.loaderService.isLoading.next(false)
    })
  }

  checkFormStatus(){
    if(this.affiliateForm.status == "VALID"){
      this.formStatus = true
    }
    // if(this.affiliateEditForm.status == "VALID"){
    //   this.formEditStatus = true
    // }
  }

  // editAffiliateData(affiliateData:AffiliateData){
  //   this.affiliateEditForm.get("name").setValue(affiliateData.name)
  //   this.affiliateEditForm.get("link").setValue(affiliateData.link)
  //   this.affiliateEditForm.get("image").setValue(affiliateData.image)
  //   this.editShown = true
  //   this.checkFormStatus()
    
  // }

  deleteAffiliateData(affiliateData:AffiliateData){
    this.affiliateService.deleteAffiliateData(affiliateData).subscribe({
      next:d=>this.affiliateArray = d,
      complete:()=>this.loaderService.isLoading.next(false)
    })
  }
}
