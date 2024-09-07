import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CreatorUserProfile, GeneralUserProfile, RegisterUser } from '../models/register.model';
import { LoginRequest, LoginResponse, ResetPassword, User, VerifyForgetEmail } from '../models/login.model';
import { BASE_API_URL } from './baseApiUrl';
import { News } from '../models/news.model';
import { UserData } from '../pages/tables/mix-table/mix-table.component';
import { DataHolderService } from './data-holder.service';
import { Router } from '@angular/router';

const enum UserModes {
  ADMIN_MODE = 0,
  CREATOR_MODE = 1,
  GENERAL_MODE = 2,
  GUEST_MODE = 3
}

@Injectable({
  providedIn: 'root'
})
export class userAutherizeService {
  private baseUrl: string = BASE_API_URL;

  constructor(
    public dataHolderService: DataHolderService,
    private http: HttpClient,
    public router: Router
  ) { }

  verifyEmail(user: RegisterUser): Observable<string> {
    const url = `${this.baseUrl}/api/auth/register`;
    return this.http.post<{ message: string }>(url, user).pipe(
      map(response => response.message)
    );
  }

  initiateResetPasswordRequest(user: VerifyForgetEmail): Observable<string> {
    const url = `${this.baseUrl}/api/auth/initiate-password-reset`;
    return this.http.post<{ message: string }>(url, user).pipe(
      map(response => response.message)
    );
  }

  registerUser(user: CreatorUserProfile | GeneralUserProfile): Observable<string> {
    const url = `${this.baseUrl}/api/auth/complete-profile`;
    return this.http.post<{ message: string }>(url, user).pipe(
      map(response => response.message)
    );
  }

  login(user: LoginRequest): Observable<LoginResponse> {
    const headers = this.dataHolderService.prepareHeader();

    const url = `${this.baseUrl}/api/auth/login`;
    return this.http.post<LoginResponse>(url, user, { headers }).pipe(
      tap((response: LoginResponse) => {
        this.dataHolderService.setAccessToken(response.tokens.accessToken);
        this.dataHolderService.setRefreshToken(response.tokens.refreshToken);
        this.dataHolderService.setAccessExpiresIn(response.tokens.accessExpiresIn);
        this.dataHolderService.setUser(response.user);
        this.dataHolderService.setIsLoggedIn(true);
      })
    );
  }

  resetPassword(newPassObj: ResetPassword): Observable<string> {
    const url = `${this.baseUrl}/api/auth/reset-password`;
    return this.http.post<{ message: string }>(url, newPassObj).pipe(
      map(response => response.message)
    );
  }

  getUserData(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.dataHolderService.getAccessToken()}`
    });

    return this.http.get<UserData>(`${this.baseUrl}/api/auth/user-data`, { headers });
  }

  updateProfile(updatedUser: any): Observable<string> {
    const url = `${this.baseUrl}/api/auth/update-profile`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.dataHolderService.getAccessToken()}`
    });

    return this.http.post<{ message: string }>(url, updatedUser, { headers }).pipe(
      map(response => response.message)
    );
  }

  uploadProfilePicture(file: File): Observable<{ message: string, url: string }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.dataHolderService.getAccessToken()}`
    });
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}/api/auth/upload-profile-picture`;
    return this.http.post<{ message: string, url: string }>(url, formData, { headers });
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/auth/confirm-email?token=${token}`);

  }

  logout(): void {
    this.dataHolderService.clearData();
    this.router.navigate(['/authentication/login']);
  }

}
