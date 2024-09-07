import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FullComponent } from 'src/app/layouts/full/full.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewsFeedComponent } from '../news-feed/news-feed.component';
import { TrendingVideosComponent } from '../trending-videos/trending-videos.component';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { MatDialog } from '@angular/material/dialog';
import { VideosService } from 'src/app/services/videos.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginDialogComponent } from './dialog/login-dialog/login-dialog.component';
import { RatingDialogComponent } from './dialog/rating-dialog/rating-dialog.component';
import { ReportDialogComponent } from './dialog/report-dialog/report-dialog.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { delay } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ElementRef, AfterViewInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';



@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    FullComponent,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    NewsFeedComponent,
    TrendingVideosComponent,
    RouterModule,
    MatCardModule,
    MatMenuModule,
    TablerIconsModule,
    MatChipsModule,
    MatTooltipModule,
    CommonModule,
    MatIconModule,
    NgxSkeletonLoaderModule,
    TranslateModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('customContentTemplate', { static: true }) customContentTemplate: TemplateRef<any>;
  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;

  private videoPlayedPercentage: number[] = [];
  private hasStartedPlaying: boolean = false;


  videoId: string = '';
  from: string = '';
  video: any = null;
  isLoading = true;
  areReviewsLoading = true;
  isPostingReview = false;
  userInputReview: string = ''
  userInputRating: number
  allReviews: any;


  // video: any = {
  //   year: null,
  //   mandatoryTags: ['Physics', 'Thermodynamics', 'Heat Transfer'],
  //   optionalTags: [],
  //   deletionRequested: false,
  //   isPremium: false,
  //   _id: '66ae1c95ce5a861950340c62',
  //   creator: {
  //     _id: '66a52d2400b15c5b301840dc',
  //     screenName: 'Sajeel'
  //   },
  //   title: 'An essay from my early days in the field',
  //   description: 'a dummy description',
  //   language: 'English',
  //   thumbnail: null,
  //   video: 'http://172.26.5.170:5000/video/66ae1c93ce5a861950340c4f',
  //   createdAt: '2024-08-03T12:03:33.352Z',
  //   updatedAt: '2024-08-03T12:03:33.352Z'
  // };

  // safeVideoUrl: SafeUrl;

  ngAfterViewInit() {
    const videoElement = this.videoPlayer.nativeElement;

    videoElement.addEventListener('play', this.onPlay.bind(this));
    videoElement.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
  }

  constructor(
    public sharedService: SharedService,
    private router: Router,
    public videoService: VideosService,
    public dataHolderService: DataHolderService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private logService: LogService
  ) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoId = params['id'] || '';
      this.from = params['from'] || '';
    });

    //in case of refresh the dataHolderService will be empty so we will fecth video from backend
    if (!this.dataHolderService.myVideos && this.from == 'my-video') {
      this.videoService.getVideoById(this.videoId).subscribe(
        (video: any) => {
          this.video = video
          this.isLoading = false;
          console.log("this.video", this.video)
        },
        (error) => {
          this.isLoading = false;
        });
    }
    else if (!this.dataHolderService.searchedVideos && this.from == 'search-results') {
      this.videoService.getVideoById(this.videoId).subscribe(
        (video: any) => {
          this.video = video
          this.isLoading = false;
          console.log("this.video", this.video)
        },
        (error) => {
          this.isLoading = false;
        });
    }
    else{
      this.videoService.getVideoById(this.videoId).subscribe(
        (video: any) => {
          this.video = video
          this.isLoading = false;
          console.log("this.video", this.video)
        },
        (error) => {
          this.isLoading = false;
        });
    }

    //in case if navigate to this page
    if (this.dataHolderService.myVideos && this.from == 'my-video') {
      this.video = this.dataHolderService.myVideos.find((v: any) => v._id == this.videoId);
      console.log("this.video", this.video)
    }
    else if (this.dataHolderService.searchedVideos && this.from == 'search-results') {
      this.video = this.dataHolderService.searchedVideos.find((v: any) => v._id == this.videoId);
      console.log("this.video", this.video)
    }
    this.isLoading = false;

    setTimeout(() => {
      this.fetchVideoRating();
    }, 3000);
  }

  fetchVideoRating() {
    this.videoService.getVideoRating(this.videoId)
      .pipe(delay(0)) // Optional: Use delay operator to handle any async delays
      .subscribe(
        response => {
          this.allReviews = response.reverse();
          this.areReviewsLoading = false;
        },
        error => {
          console.error('Error fetching video rating:', error);
          this.areReviewsLoading = false;
        }
      );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }


  updateVoting(action: string): void {
    if (!this.dataHolderService.isLoggedIn) {
      this.openLoginDialog();
      return;
    }
    if (action === 'upvote') {
      if (this.video.voteStatus === null) {
        this.video.totalUpVotes++;
        this.video.voteStatus = 'upvote';
      } else if (this.video.voteStatus === 'upvote') {
        // If the user already liked, remove the like
        this.video.totalUpVotes--;
        this.video.voteStatus = null;
      } else if (this.video.voteStatus === 'downvote') {
        // If the user disliked, switch to like
        this.video.totalDownVotes--;
        this.video.totalUpVotes++;
        this.video.voteStatus = 'upvote';
      }
    } else if (action === 'downvote') {
      if (this.video.voteStatus === null) {
        this.video.totalDownVotes++;
        this.video.voteStatus = 'downvote';
      } else if (this.video.voteStatus === 'downvote') {
        // If the user already disliked, remove the dislike
        this.video.totalDownVotes--;
        this.video.voteStatus = null;
      } else if (this.video.voteStatus === 'upvote') {
        // If the user liked, switch to dislike
        this.video.totalUpVotes--;
        this.video.totalDownVotes++;
        this.video.voteStatus = 'downvote';
      }
    }

    const jsonBody = {
      videoId: this.video._id,
      action: action
    };

    this.videoService.toggleVoting(jsonBody).subscribe(
      (response: any) => {
        // console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  toggleFollow(): void {
    if (!this.dataHolderService.isLoggedIn) {
      this.openLoginDialog();
      return;
    }
    var action = this.video.isFollowingAuthor ? 'unfollow' : 'follow'
    const jsonBody = {
      id: this.video.creator._id,
      action: action
    };
    this.video.isFollowingAuthor = !this.video.isFollowingAuthor;
    this.videoService.toggleAuthorFollowing(jsonBody).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );

  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result.choice == true) {
        this.router.navigate(['/authentication/login'])
      }
    });
  }

  askForRating(): void {
    if (!this.dataHolderService.isLoggedIn) {
      this.openLoginDialog();
      return;
    }
    const dialogRef = this.dialog.open(RatingDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result.ratingInput) {
        this.userInputRating = result.ratingInput
        this.submitReviewNRating()
      }
    });
  }

  submitReviewNRating(): void {
    this.isPostingReview = true;
    const jsonBody = {
      videoId: this.videoId,
      rating: this.userInputRating,
      review: this.userInputReview
    }
    this.videoService.rateNReviewVideo(jsonBody).subscribe(
      (response: any) => {
        this.isPostingReview = false;
        this.userInputReview = '';
        this.fetchVideoRating();
      },
      (error) => {
        console.error(error);
      }
    );
  }


  openReportDialog(): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.reportFrom) {
        this.submitReport(result.reportFrom)
      }
    });
  }

  submitReport(reportFrom: any): void {
    const jsonBody = {
      videoId: this.video._id,
      reason: reportFrom.reason,
      timestamp: reportFrom.timestamp,
      details: reportFrom.details
    }
    this.videoService.reportVideo(jsonBody).subscribe(
      (response: any) => {
        this.sharedService.openSnackBar(response.message, "Ok")
      },
      (error) => {
        console.error(error);
      }
    );

  }

  onPlay() {
    if (!this.hasStartedPlaying) {
      this.hasStartedPlaying = true;
      this.performActionOnStart();
    }
  }
  onTimeUpdate(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    const percentagePlayed = (currentTime / duration) * 100;

    if (percentagePlayed >= 25 && !this.videoPlayedPercentage.includes(25)) {
      this.videoPlayedPercentage.push(25);
      this.performActionAt(25);
    }

    if (percentagePlayed >= 50 && !this.videoPlayedPercentage.includes(50)) {
      this.videoPlayedPercentage.push(50);
      this.performActionAt(50);
    }

    if (percentagePlayed >= 75 && !this.videoPlayedPercentage.includes(75)) {
      this.videoPlayedPercentage.push(75);
      this.performActionAt(75);
    }

    if (percentagePlayed >= 100 && !this.videoPlayedPercentage.includes(100)) {
      this.videoPlayedPercentage.push(100);
      this.performActionAt(100);
    }
  }

  performActionOnStart() {
    // 'video_watch_start',  // When a user starts watching a video
    const activityPayload = {
      userId: this.dataHolderService.user.userId || null,
      activity: 'video_watch_start',
      details: {
        videoId: this.videoId
      }
    }

    this.logService.submitVideoActivityLog(activityPayload).subscribe(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    )
  }

  performActionAt(percentage: number) {
    // 'video_watch_25',     // Watched less than 25%
    // 'video_watch_50',     // Watched between 25% and 50%
    // 'video_watch_75',     // Watched between 50% and 75%
    // 'video_watch_100'     // Watched full length
    const activityPayload = {
      userId: this.dataHolderService.user.userId || null,
      activity: '',
      details: {
        videoId: this.videoId
      }
    }
    if (percentage == 25) {
      activityPayload.activity = 'video_watch_25'
    }
    else if (percentage == 50) {
      activityPayload.activity = 'video_watch_50'
    }
    else if (percentage == 75) {
      activityPayload.activity = 'video_watch_75'
    }
    else if (percentage == 100) {
      activityPayload.activity = 'video_watch_100'
    }
    this.logService.submitVideoActivityLog(activityPayload).subscribe(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    )
  }





}
