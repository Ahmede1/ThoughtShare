import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './baseApiUrl';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  sendEmail(jsonData: any): Observable<any> {
    const url = `${BASE_API_URL}/api/general/send-email`;
    return this.http.post<any>(url, jsonData);
  }
}