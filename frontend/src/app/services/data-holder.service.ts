import { Injectable } from '@angular/core';
import { News } from '../models/news.model';
import { User, UserModes } from '../models/login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { BASE_API_URL } from './baseApiUrl';

@Injectable({
  providedIn: 'root'
})
export class DataHolderService {
  // public user: any | null = this.getUserFromLocalStorage();
  public user: any | null = null
  public tags: any | null = null
  public searchedVideos: any | null = null
  public myVideos: any | null = null
  public news: News[] = this.getNewsFromLocalStorage();
  public isLoggedIn: boolean = this.getIsLoggedInFromLocalStorage();

  constructor(private http: HttpClient) {
    if (this.isLoggedIn) {
      this.fetchUserData();
      this.getTags().subscribe(
        (data) => {
          this.tags = data;
          // console.log('Tags fetched successfully:', data);
        },
        (error) => {
          console.error('Error fetching tags:', error);
        }
      );
    }
  }

  getTags(): Observable<any> {
    const url = `${BASE_API_URL}/api/tags`;
    return this.http.get<any>(url);
  }

  prepareHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
    // headers = headers.set('ngrok-skip-browser-warning', 'true');
    return headers;
  }

  fetchUserData(): void {
    const headers = this.prepareHeader();
    this.http.get<any>(`${BASE_API_URL}/api/auth/user-data`, { headers }).subscribe(
      data => {
        this.user = data
      },
      error => {
        console.error("Error fetching user data", error);
      }
    );
  }


  getUserData(): Observable<any> {
    const headers = this.prepareHeader();
    return this.http.get<any>(`${BASE_API_URL}/api/auth/user-data`, { headers }).pipe(
      tap(data => {
        this.user = data;
      }),
      catchError(error => {
        console.error("Error fetching user data", error);
        return of(null); // Return null or some default data
      })
    );
  }

  private getUserFromLocalStorage(): any | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  private getNewsFromLocalStorage(): News[] {
    const newsJson = localStorage.getItem('news');
    return newsJson ? JSON.parse(newsJson) : [];
  }

  private getIsLoggedInFromLocalStorage(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    const accessExpiresIn = localStorage.getItem('accessExpiresIn');
    if (accessToken && accessExpiresIn) {
      const expiresIn = Number(accessExpiresIn);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      return currentTimeInSeconds < expiresIn;
    }
    return false;
  }

  public setUser(user: any | null): void {
    this.user = user;
    // localStorage.setItem('user', JSON.stringify(user));
  }

  public setNews(news: News[]): void {
    this.news = news;
    localStorage.setItem('news', JSON.stringify(news));
  }

  public setIsLoggedIn(isLoggedIn: boolean): void {
    this.isLoggedIn = isLoggedIn;
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public setAccessToken(token: string | null): void {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public setRefreshToken(token: string | null): void {
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }

  public getAccessExpiresIn(): number | null {
    const expiresIn = localStorage.getItem('accessExpiresIn');
    return expiresIn ? Number(expiresIn) : null;
  }

  public setAccessExpiresIn(expiresIn: number | null): void {
    if (expiresIn) {
      localStorage.setItem('accessExpiresIn', String(expiresIn));
    } else {
      localStorage.removeItem('accessExpiresIn');
    }
  }

  public clearData(): void {
    this.user = null
    this.news = [];
    this.isLoggedIn = false;
    localStorage.removeItem('user');
    localStorage.removeItem('news');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessExpiresIn');
  }
}
