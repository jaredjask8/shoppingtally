import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WhatsNew } from 'src/models/WhatsNew';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getWhatsNew() {
    return this.http.get<WhatsNew[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/whatsNew/list")
  }

  constructor(private http:HttpClient) { }

  submitWhatsNew(whatsNew:WhatsNew):Observable<WhatsNew>{
   return this.http.post<WhatsNew>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/whatsNew/push", whatsNew)
  }
}
