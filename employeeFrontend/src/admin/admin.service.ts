import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WhatsNew } from 'src/models/WhatsNew';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getWhatsNew() {
    return this.http.get<WhatsNew[]>("http://localhost:8080/api/v1/admin/whatsNew/list")
  }

  constructor(private http:HttpClient) { }

  submitWhatsNew(whatsNew:WhatsNew):Observable<WhatsNew>{
   return this.http.post<WhatsNew>("http://localhost:8080/api/v1/admin/whatsNew/push", whatsNew)
  }
}
