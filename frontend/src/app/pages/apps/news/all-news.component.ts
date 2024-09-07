import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TablerIconsModule } from 'angular-tabler-icons';
import { News } from 'src/app/models/news.model';
import { TopNewsService } from 'src/app/services/top-news.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-all-news',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, TablerIconsModule, MatButtonModule, CommonModule],
  templateUrl: './all-news.component.html',
  styleUrl: './all-news.component.scss',
  providers: [DatePipe],
})
export class AllNewsComponent implements OnInit {
  slides: News[] = [];

  constructor(private topNewsService: TopNewsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.topNewsService.getTopNews().subscribe(
      (data: any) => {
        this.slides = data;
        // console.log("News...", this.slides)
      },
      (error) => {
        console.error('Error fetching news:', error);
      }
    );
  }

  truncateText(text: string, limit: number): string {
    const truncatedText = text.replace(/<[^>]+>/g, ''); // Strip HTML tags
    if (truncatedText.length > limit) {
      return truncatedText.substring(0, limit) + '...';
    }
    return truncatedText;
  }
  formatDate(date: string | undefined): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
