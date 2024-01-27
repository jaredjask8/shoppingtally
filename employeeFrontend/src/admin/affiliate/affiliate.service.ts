import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AffiliateData } from './models/AffiliateData';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {
  //"http://localhost:8080"
  //"https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT"
  serverUrl = "https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT"
  constructor(private http:HttpClient) { }

  addAffiliateData(values):Observable<AffiliateData[]>{
    return this.http.post<AffiliateData[]>(this.serverUrl+"/api/v1/affiliate/add",values)
  }

  getAffiliateData():Observable<AffiliateData[]>{
    return this.http.get<AffiliateData[]>(this.serverUrl+"/api/v1/affiliate/get")
  }

  deleteAffiliateData(affiliateData:AffiliateData):Observable<AffiliateData[]>{
    return this.http.post<AffiliateData[]>(this.serverUrl+"/api/v1/affiliate/delete",affiliateData)

  }
}
