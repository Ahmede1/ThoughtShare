import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatChipsModule } from '@angular/material/chips';
import { blogService } from '../apps/blogs/blogService.service';
import { VideosService } from 'src/app/services/videos.service';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [
    MatCardModule,
    MatMenuModule,
    TablerIconsModule,
    MatChipsModule,
    MatTooltipModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    NgxSkeletonLoaderModule],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss'
})
export class MyVideosComponent implements OnInit {
  // videos = [
  //   {
  //     mandatoryTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     optionalTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     _id: "66a683b2afe05217a4dc001a",
  //     creator: {
  //       _id: "669a585a46d8d09b188d427c",
  //       screenName: "john_doe_123"
  //     },
  //     title: "Benefits of clickworthy",
  //     description: "This is video description",
  //     language: "English",
  //     thumbnail: "assets/video-thumbnail.webp",
  //     video: " https://b9b4-111-68-105-82.ngrok-free.app/video/66a683b1afe05217a4dc0016",
  //     uploadTimestamp: "2024-07-28T17:45:22.333Z"
  //   },
  //   {
  //     mandatoryTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     optionalTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     _id: "66a683cb12ac9f52fc102fc7",
  //     creator: {
  //       _id: "669a585a46d8d09b188d427c",
  //       screenName: "john_doe_123"
  //     },
  //     title: "Benefits of clickworthy",
  //     description: "This is video description",
  //     language: "English",
  //     thumbnail: "assets/video-thumbnail.webp",
  //     video: " https://b9b4-111-68-105-82.ngrok-free.app/video/66a683ca12ac9f52fc102fc3",
  //     uploadTimestamp: "2024-07-28T17:45:47.266Z"
  //   },
  //   {
  //     mandatoryTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     optionalTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     _id: "66a6852fe00c3d38b438dcda",
  //     creator: {
  //       _id: "669a585a46d8d09b188d427c",
  //       screenName: "john_doe_123"
  //     },
  //     title: "Benefits of clickworthy",
  //     description: "This is video description",
  //     language: "English",
  //     thumbnail: "assets/video-thumbnail.webp",
  //     video: " https://b9b4-111-68-105-82.ngrok-free.app/video/66a6852ee00c3d38b438dcd6",
  //     uploadTimestamp: "2024-07-28T17:51:43.842Z"
  //   },
  //   {
  //     mandatoryTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     optionalTags: [
  //       {
  //         _id: "66a63f298fcc1f4dd8e82fa1",
  //         name: "English",
  //         category: "Language"
  //       },
  //       {
  //         _id: "66a63f328fcc1f4dd8e82fa4",
  //         name: "2024",
  //         category: "Year"
  //       }
  //     ],
  //     _id: "66a6852fe00c3d38b438dcda",
  //     creator: {
  //       _id: "669a585a46d8d09b188d427c",
  //       screenName: "john_doe_123"
  //     },
  //     title: "Benefits of clickworthy",
  //     description: "This is video description",
  //     language: "English",
  //     thumbnail: "assets/video-thumbnail.webp",
  //     video: " https://b9b4-111-68-105-82.ngrok-free.app/video/66a6852ee00c3d38b438dcd6",
  //     uploadTimestamp: "2024-07-28T17:51:43.842Z"
  //   }
  // ];

  mandatoryTags = ["tag1", "tag2", "tag3",]

  constructor(
    public router: Router,
    public blogService: blogService,
    public myVideosService: VideosService,
    public sharedService: SharedService,
    public dataHolderService: DataHolderService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  // videos = [
  //   {
  //     _id: "60af8846f93a2b6c5d8e8d69",
  //     title: 'Awesome Product',
  //     description: 'This is a great product that you will love to use!',
  //     rating: 4,
  //     imageUrl: 'assets/video-thumbnail.webp'
  //   },
  //   {
  //     _id: "60af8846f93a2b6c5d8e8d6a",
  //     title: 'Another Great Product',
  //     description: 'This product is also fantastic and worth checking out!',
  //     rating: 5,
  //     imageUrl: 'assets/video-thumbnail.webp'
  //   }
  // ];


  isLoading = true;
  ngOnInit(): void {
    this.myVideosService.getMyVideos().subscribe(
      (videos: any) => {
        this.dataHolderService.myVideos = videos;
        // console.log("MyVideosComponent--->>", this.dataHolderService.myVideos)
        this.isLoading = false;

      },
      (error) => {
        console.error('Error fetching videos', error);
        this.isLoading = false;
      }
    );

  }
  showStatistics(videoId: string): void {
    this.router.navigate(['dashboard/video-statistics'], {
      queryParams: {
        id: videoId,
      }
    });
  }

  playVideo(videoId: string) {
    this.router.navigate(['video'], {
      queryParams: {
        id: videoId,
        from: 'my-video'
      }
    });
  }

  openDeleteDialog(targetVideoId: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reason = result.reason;
        const requestData = {
          videoId: targetVideoId,
          description: reason
        };

        this.myVideosService.requestVideoDelete(requestData).subscribe(
          response => {
            const video = this.dataHolderService.myVideos.find((v: any) => v._id === targetVideoId);
            video.deletionRequested = true;
            this.snackBar.open(response.message, 'Ok', { duration: 3000 });
          },
          error => {
            this.snackBar.open(error.error.message, 'Ok', { duration: 3000 });
            console.error(error);
          }
        );
      }
    });
  }

}





@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './delete-video-dialog-content.component.html',
  styleUrl: './my-videos.component.scss'

})

export class ConfirmDeleteDialog {

  deleteReason: string = ''

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialog>) { }

  doAction(): void {
    this.dialogRef.close();
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  requestDeletion(): void {
    if (this.deleteReason) {
      this.dialogRef.close({ reason: this.deleteReason });
    }
  }
}

