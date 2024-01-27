import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AffiliateData } from './models/AffiliateData';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {

  constructor(private http:HttpClient) { }

  addAffiliateData(values):Observable<AffiliateData[]>{
    return this.http.post<AffiliateData[]>("http://localhost:8080/api/v1/affiliate/add",values)
  }

  getAffiliateData():Observable<AffiliateData[]>{
    return this.http.get<AffiliateData[]>("http://localhost:8080/api/v1/affiliate/get")
  }

  deleteAffiliateData(affiliateData:AffiliateData):Observable<AffiliateData[]>{
    return this.http.post<AffiliateData[]>("http://localhost:8080/api/v1/affiliate/delete",affiliateData)

  }
}
