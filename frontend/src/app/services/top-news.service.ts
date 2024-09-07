import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BASE_API_URL } from './baseApiUrl';
import { News, NewsResponse } from '../models/news.model';
import { DataHolderService } from './data-holder.service';


@Injectable({
  providedIn: 'root'
})
export class TopNewsService {
  private baseUrl: string = BASE_API_URL;

  constructor(private http: HttpClient,
    private dataHolderService: DataHolderService) { }


    getTopNews(): Observable<any> {
      let headers = new HttpHeaders();
      headers = headers.set('ngrok-skip-browser-warning', 'true');
      const url = `${this.baseUrl}/api/news`;
      return this.http.get<any>(url, { headers });
    }

  postNew(news: News): Observable<News> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.dataHolderService.getAccessToken()}`
    });

    const formData = new FormData();
    formData.append('title', news.title);
    formData.append('content', news.content);
    formData.append('thumbnail', news.thumbnail);
    return this.http.post<News>(this.baseUrl + '/api/news', formData, { headers });

  }

}
