import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatButtonModule } from '@angular/material/button';
import { TopNewsService } from 'src/app/services/top-news.service';
import { SharedService } from 'src/app/services/shared.service';
import { SafeUrl } from '@angular/platform-browser';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [MatCardModule, CommonModule, TablerIconsModule, MatButtonModule, NgxSkeletonLoaderModule, TranslateModule],
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit {
  slides: any[] = [];
  currentIndex = 0;

  constructor(private topNewsService: TopNewsService, public sharedService: SharedService) { }
  isLoading = true;
  ngOnInit(): void {
    this.topNewsService.getTopNews().subscribe(
      (data: any) => {
        this.slides = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching news:', error);
        this.isLoading = false;
      }
    );
  }

  // ngOnInit(): void {
  //   this.slides = [
  //     {
  //       _id: '1',
  //       title: 'Exciting Updates in Our Video Sharing Platform',
  //       content: '<p>We are thrilled to announce some exciting updates to our video sharing platform! Here are some of the highlights:</p><ul><li>New user interface improvements</li><li>Enhanced video quality options</li><li>Faster streaming capabilities</li></ul><p>Stay tuned for more updates!</p>',
  //       author: 'author_1',
  //       thumbnail: 'assets/video-thumbnail.webp',
  //       createdAt: '2024-07-24T19:14:44.606Z',
  //       updatedAt: '2024-07-24T19:14:44.606Z',
  //     },
  //     {
  //       _id: '2',
  //       title: 'New Features in Our Platform',
  //       content: '<p>We are excited to roll out new features to enhance your experience:</p><ul><li>Customizable profiles</li><li>Advanced analytics</li><li>Improved search functionality</li></ul><p>Check them out now!</p>',
  //       author: 'author_2',
  //       thumbnail: 'assets/video-thumbnail.webp',
  //       createdAt: '2024-07-24T19:14:44.606Z',
  //       updatedAt: '2024-07-24T19:14:44.606Z',
  //     },
  //     {
  //       _id: '3',
  //       title: 'Platform Maintenance Scheduled',
  //       content: '<p>Please note that our platform will undergo scheduled maintenance on:</p><ul><li>Saturday, July 27th</li><li>From 1:00 AM to 5:00 AM</li></ul><p>Thank you for your understanding.</p>',
  //       author: 'author_3',
  //       thumbnail: 'assets/video-thumbnail.webp',
  //       createdAt: '2024-07-24T19:14:44.606Z',
  //       updatedAt: '2024-07-24T19:14:44.606Z',
  //     },
  //     {
  //       _id: '4',
  //       title: 'Community Guidelines Update',
  //       content: '<p>We have updated our community guidelines to ensure a safe and respectful environment for all users:</p><ul><li>No hate speech or harassment</li><li>Respect others’ privacy</li><li>Follow our content policies</li></ul><p>Read the full guidelines on our website.</p>',
  //       author: 'author_4',
  //       thumbnail: 'assets/video-thumbnail.webp',
  //       createdAt: '2024-07-24T19:14:44.606Z',
  //       updatedAt: '2024-07-24T19:14:44.606Z',
  //     },
  //   ];
  // }

  getSanitizedUrl(url: string): SafeUrl {
    return this.sharedService.sanitizeNewsThumbnailUrl(url);
  }

  truncateText(text: string, limit: number): string {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
    }
  }

  getTransform() {
    const screenWidth = window.innerWidth;
    let visibleSlides = 1;

    if (screenWidth >= 414 && screenWidth <= 768) {
      visibleSlides = 2;
    } else if (screenWidth >= 769 && screenWidth <= 1024) {
      visibleSlides = 3;
    } else if (screenWidth > 1025) {
      visibleSlides = 4;
    }

    return `translateX(-${this.currentIndex * (100 / visibleSlides)}%)`;
  }

  isPrevDisabled(): boolean {
    return this.currentIndex === 0;
  }

  isNextDisabled(): boolean {
    return this.currentIndex >= this.slides.length - 1;
  }
}
