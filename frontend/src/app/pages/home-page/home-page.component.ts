import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullComponent } from 'src/app/layouts/full/full.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewsFeedComponent } from '../news-feed/news-feed.component';
import { TrendingVideosComponent } from '../trending-videos/trending-videos.component';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { VideosService } from 'src/app/services/videos.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
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
    TranslateModule
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  @ViewChild('customContentTemplate', { static: true }) customContentTemplate: TemplateRef<any>;

  searchQuery: string = ''; // Variable to bind to the search input
  filters: any;

  constructor(
    private router: Router,
    public videoService: VideosService,
    public dataHolderService: DataHolderService,
    public dialog: MatDialog) { }

  openFilterDialog() {
    const dialogRef = this.dialog.open(SearchFilterComponent, {
      height: '60%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filters = result.filters
        console.log("this.filters", this.filters)
        this.search()
      }
    });
  }

  search(): void {
    // Flatten the tags object into individual query parameters
    const queryParams = {
      searchPhrase: this.searchQuery,
      subjectarea: this.filters?.tags.subjectarea,
      branch: this.filters?.tags.branch,
      topic: this.filters?.tags.topic,
      subtopic: this.filters?.tags.subtopic,
      difficulty: this.filters?.tags.difficulty,
      interactivity: this.filters?.tags.interactivity,
      resource: this.filters?.tags.resource,
      concept: this.filters?.tags.concept,
      year: this.filters?.year,
      language: this.filters?.language,
      authors:this.filters?.authorIds
    };
    // console.log("queryParams", queryParams)

    this.router.navigate(['/search'], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }


}
