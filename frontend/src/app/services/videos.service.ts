import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './baseApiUrl';
import { DataHolderService } from './data-holder.service';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor(private http: HttpClient, public dataHolderService: DataHolderService) { }

  getMyVideos(): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/my-videos`;
    return this.http.get<any>(url, { headers });
  }

  uploadVideo(videoForm: FormData): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/upload-video`;
    return this.http.post<any>(url, videoForm, { headers });
  }

  requestVideoDelete(jsonData: any): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/request-video-deletion`;
    return this.http.post<any>(url, jsonData, { headers });
  }

  searcVideos(jsonData: any): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/search`;
    return this.http.post<any>(url, jsonData, { headers });
  }

  getVideoById(videoId: string): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/${videoId}`;
    return this.http.get<any>(url, { headers });
  }

  toggleVoting(jsonBody: any): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/toggleVoting`;
    return this.http.post<any>(url, jsonBody, { headers });
  }
  toggleAuthorFollowing(jsonBody: any): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/users/toggleFollowings`;
    return this.http.post<any>(url, jsonBody, { headers });
  }

  rateNReviewVideo(jsonBody: any): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/rate`;
    return this.http.post<any>(url, jsonBody, { headers });
  }

  reportVideo(jsonBody: any): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/report/submitReport`;
    return this.http.post<any>(url, jsonBody, { headers });
  }

  getVideoRating(videoId: string): Observable<any> {
    const url = `${BASE_API_URL}/api/videos/${videoId}/get-ratings`;
    return this.http.get<any>(url);
  }

  getVideoStatistics(videoPayload: any): Observable<any> {
    let headers = this.dataHolderService.prepareHeader();
    const url = `${BASE_API_URL}/api/videos/${videoPayload.videoId}/statistics?period=${videoPayload.period}`;
    return this.http.get<any>(url, { headers });
  }
  getTrendingVideos(): Observable<any> {
    const url = `${BASE_API_URL}/api/videos/trending`
    return this.http.get<any>(url);
  }


}
