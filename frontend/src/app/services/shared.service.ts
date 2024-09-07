import { Injectable, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataHolderService } from './data-holder.service';
import { NavItem } from '../layouts/full/vertical/sidebar/nav-item/nav-item';
import { UserModes } from '../models/login.model';
import { adminNavItems, guestUserNavItems, normalUserNavItems } from '../layouts/full/vertical/sidebar/sidebar-data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    public sanitizer: DomSanitizer,
    public dataHolderService: DataHolderService,
    private snackBar: MatSnackBar
  ) {
  }

  sanitizeNewsThumbnailUrl(url: string): string | SafeUrl {
    return url ? this.extractUrl(this.sanitizer.bypassSecurityTrustUrl(url)) : 'assets/video-thumbnail.webp';
  }
  sanitizeUserProfilePicUrl(): SafeUrl | string {
    if (!this.dataHolderService.user?.profilePicture) {
      return this.dataHolderService.user?.gender == 'Female' ?
        '/assets/images/profile/user-9.jpg' : '/assets/images/profile/user-1.jpg'
    }

    const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.dataHolderService.user?.profilePicture);
    const url = this.extractUrl(sanitizedUrl);
    // console.log("sanitizeUserProfilePicUrl---->>", url);
    return url;
  }

  extractUrl(sanitizedUrl: any): string {
    return sanitizedUrl.changingThisBreaksApplicationSecurity;
  }

  isAdmin(): boolean {
    return this.dataHolderService.user?.role === UserModes.ADMIN_MODE
  }

  isGeneral(): boolean {
    return this.dataHolderService.user?.role === UserModes.GENERAL_MODE
  }

  isCreator(): boolean {
    return this.dataHolderService.user?.role === UserModes.CREATOR_MODE
  }

  isGuest(): boolean {
    return this.dataHolderService.user ? false : true;
  }

  getUserScreenName(): string {
    return this.truncateText(this.dataHolderService.user?.screenName, 15);
  }

  getUserEmail(): string {
    return this.truncateText(this.dataHolderService.user?.email, 15);
  }

  getUserRole(): string {
    return this.dataHolderService.user?.role;
  }

  truncateText(text: string, limit: number): string {
    if (text == null) return '';
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  }

  truncateTagName(tagName: string): string {
    const words = tagName.split(' ');
    if (words.length > 2) {
      return words.slice(0, 1).join(' ') + '...';
    }
    return tagName;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/video-thumbnail.webp';
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 5000 });
  }


}