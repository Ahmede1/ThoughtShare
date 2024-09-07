import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { VideosService } from 'src/app/services/videos.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trending-videos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    TranslateModule,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './trending-videos.component.html',
  styleUrls: ['./trending-videos.component.scss']
})
export class TrendingVideosComponent {
  // videos = [
  //   {
  //     title: 'Awesome Product',
  //     description: 'This is a great product that you will love to use!',
  //     rating: 4,
  //     imageUrl: 'assets/video-thumbnail.webp'
  //   },
  //   {
  //     title: 'Another Great Product',
  //     description: 'This product is also fantastic and worth checking out!',
  //     rating: 5,
  //     imageUrl: 'assets/video-thumbnail.webp'
  //   }
  // ];
  trendingVideo: any[] = []
  isLoading = true;

  constructor(private videosService: VideosService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.videosService.getTrendingVideos().subscribe(
      (data: any) => {
        this.trendingVideo = data;
        this.isLoading = false;
        console.log(this.trendingVideo)
      },
      (error) => {
        console.error('Error fetching news:', error);
        this.isLoading = false;
      }
    );
  }

  playVideo(videoId: string) {
    this.router.navigate(['video'], {
      queryParams: {
        id: videoId
      }
    });
  }

}