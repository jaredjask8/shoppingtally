import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WhatsNew } from 'src/models/WhatsNew';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getWhatsNew() {
    return this.http.get<WhatsNew[]>(environment.apiUrl+"/api/v1/admin/whatsNew/list")
  }

  constructor(private http:HttpClient) { }

  submitWhatsNew(whatsNew:WhatsNew):Observable<WhatsNew>{
   return this.http.post<WhatsNew>(environment.apiUrl+"/api/v1/admin/whatsNew/push", whatsNew)
  }
}
