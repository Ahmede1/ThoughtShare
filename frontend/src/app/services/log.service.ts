import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataHolderService } from './data-holder.service';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './baseApiUrl';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient, public dataHolderService: DataHolderService) { }

  submitVideoActivityLog(payload: any): Observable<any> {
    const url = `${BASE_API_URL}/api/logs/log-activity`;
    return this.http.post<any>(url, payload);
  }
}
