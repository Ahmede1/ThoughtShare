import { Injectable, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router'; 
import { DataHolderService } from './services/data-holder.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnInit {
  
  constructor(private router: Router, private dataHolderService: DataHolderService) { }

  ngOnInit(): void {
    const accessToken = localStorage.getItem('accessToken');
    const accessExpiresIn = localStorage.getItem('accessExpiresIn');

    if (accessToken && accessExpiresIn) {
      const expiresIn = Number(accessExpiresIn);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000); 
      this.dataHolderService.setIsLoggedIn(currentTimeInSeconds < expiresIn)
    }
  }

  canActivate(): boolean {
    if (this.dataHolderService.isLoggedIn) return true;

    this.router.navigate(['/authentication/login']);
    return false;
  }
}
