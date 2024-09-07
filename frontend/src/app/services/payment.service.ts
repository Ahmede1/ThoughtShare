import { Injectable } from '@angular/core';
import { DataHolderService } from './data-holder.service';
import { BASE_API_URL } from './baseApiUrl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private dataHolderServcie: DataHolderService,
    private http: HttpClient) { }

  purchaseMembership(jsonBody: any): Observable<any> {
    let headers = this.dataHolderServcie.prepareHeader();
    const url = `${BASE_API_URL}/api/payment/purchase-membership`;
    return this.http.post<any>(url, jsonBody, { headers });
  }
}
