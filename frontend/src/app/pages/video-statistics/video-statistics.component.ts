import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { VideosService } from 'src/app/services/videos.service';
import { MatSelectChange } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-video-statistics',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './video-statistics.component.html',
  styleUrls: ['./video-statistics.component.scss']
})
export class VideoStatisticsComponent implements OnInit {
  isLoading = true;
  videoId: string | null = null;
  statistics: any = null

  periods: string[] = ['Day', 'Month','Year','Lifetime']

  constructor(
    private route: ActivatedRoute,
    public myVideosService: VideosService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoId = params['id'] || null;
      this.getVideoStatistics('day')
    });

  }

  onPeriodChange(event: MatSelectChange) {
    this.getVideoStatistics(event.value.toLowerCase());
  }

  getVideoStatistics(period: string): void {
    const videoStatPayLoad = {
      videoId: this.videoId,
      period: period.toLowerCase()
    }
    this.myVideosService.getVideoStatistics(videoStatPayLoad).subscribe(
      response => {
        this.statistics = response
        // console.log(this.statistics)
        this.isLoading = false;
      },
      error => {
        // console.error(error)
        this.isLoading = false;
      }
    )
  }
}
