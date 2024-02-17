import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AffiliateData } from './models/AffiliateData';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {
  constructor(private http:HttpClient) { }

  addAffiliateData(values):Observable<AffiliateData[]>{
    return this.http.post<AffiliateData[]>(environment.apiUrl+"/api/v1/affiliate/add",values)
  }

  getAffiliateData():Observable<AffiliateData[]>{
    return this.http.get<AffiliateData[]>(environment.apiUrl+"/api/v1/affiliate/get")
  }

  deleteAffiliateData(affiliateData:AffiliateData):Observable<AffiliateData[]>{
    return this.http.post<AffiliateData[]>(environment.apiUrl+"/api/v1/affiliate/delete",affiliateData)

  }
}
