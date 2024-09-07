import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FullComponent } from 'src/app/layouts/full/full.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewsFeedComponent } from '../news-feed/news-feed.component';
import { TrendingVideosComponent } from '../trending-videos/trending-videos.component';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { VideosService } from 'src/app/services/videos.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';



@Component({
  selector: 'app-search-results',
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
    MatButtonModule,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  @ViewChild('customContentTemplate', { static: true }) customContentTemplate: TemplateRef<any>;

  searchFilterObj: any;

  constructor(
    public sharedService: SharedService,
    private router: Router,
    public videoService: VideosService,
    public dataHolderService: DataHolderService,
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  searchPhrase: string = '';
  tags: string = '';
  year: string = '';
  language: string = '';
  isLoading = true;

  ngOnInit(): void {
    this.dataHolderService.searchedVideos = null;
    this.route.queryParams.subscribe(params => {
      this.searchPhrase = params['searchPhrase'] || '';
      this.tags = params['tags'] || '';
      this.year = params['year'] || '';
      this.language = params['language'] || '';
    });

    this.searchFilterObj = {
      searchPhrase: this.searchPhrase,
      tags: this.tags,
      year: this.year,
      language: this.language
    }
    // console.log("SearchResultsComponent-->  searchFilter", this.searchFilterObj)
    this.videoService.searcVideos(this.searchFilterObj).subscribe(
      videos => {
        this.dataHolderService.searchedVideos = videos
        this.isLoading = false;

        // console.log("this.videos==>>", this.videos)
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
    this.searchFilterObj = null;
    console.log(this.dataHolderService.user)
  }

  playVideo(videoId: string) {
    this.router.navigate(['video'], {
      queryParams: {
        id: videoId,
        from: 'search-results'
      }
    });
  }

  openFilterDialog() {
    const dialogRef = this.dialog.open(SearchFilterComponent, {
      height: '60%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.searchFilterObj = result.filters
        // console.log("this.searchFilterObj", this.searchFilterObj)
        this.search()
      }
    });
  }

  search(): void {
    // Construct the query parameters in the desired format
    const queryParams = {
      searchPhrase: this.searchPhrase,
      year: this.searchFilterObj?.year || '',
      language: this.searchFilterObj?.language || '',
      subjectarea: this.searchFilterObj?.tags?.subjectarea || '',
      branch: this.searchFilterObj?.tags?.branch || '',
      topic: this.searchFilterObj?.tags?.topic || '',
      subtopic: this.searchFilterObj?.tags?.subtopic || '',
      difficulty: this.searchFilterObj?.tags?.difficulty || '',
      interactivity: this.searchFilterObj?.tags?.interactivity || '',
      resource: this.searchFilterObj?.tags?.resource || '',
      concept: this.searchFilterObj?.tags?.concept || '',
      authors: this.searchFilterObj?.authorIds || ''
    };

    // Log queryParams for debugging purposes
    // console.log("queryParams", queryParams);

    // Navigate to a dummy route and then navigate to the desired route with the constructed query parameters
    this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/search'], {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      });
    });
  }

}
