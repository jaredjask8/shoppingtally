import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WhatsNew } from 'src/models/WhatsNew';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  //http://localhost:8080
  getWhatsNew() {
    return this.http.get<WhatsNew[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/admin/whatsNew/list")
  }

  constructor(private http:HttpClient) { }

  submitWhatsNew(whatsNew:WhatsNew):Observable<WhatsNew>{
   return this.http.post<WhatsNew>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/admin/whatsNew/push", whatsNew)
  }
}
