import { Component, ViewChild, TemplateRef, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GeneralService } from 'src/app/services/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-general-tag-request',
  standalone: true,
  imports: [
    FullComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    NgxSkeletonLoaderModule,
    TranslateModule
  ],
  templateUrl: './general-tag-request.component.html',
  styleUrls: ['./general-tag-request.component.scss']
})
export class GeneralTagRequestComponent implements OnInit {
  @ViewChild('customContentTemplate', { static: true }) customContentTemplate: TemplateRef<any>;
  emailForm: FormGroup;
  isSending: boolean = false;
  instructionsText: string;
  placeholder: string;

  constructor(
    private fb: FormBuilder,
    public dataHolderService: DataHolderService,
    public generalService: GeneralService,
    public snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.placeholder = `
          Dear Customer Support!
          I would like to create a video that does not fit into the current list of selectable topics. Please make it possible by adding the following descriptors:
              
                Subject Area:
                Branch:
                Topic:
                Subtopic:
                Concept:
                Difficulty Level:
                Interactivity:
                Resource Type:  
              
          * Please mark with NEW the lines for which you are requesting a new category
          Thank you,`;

    this.setPlaceholderText();
    this.emailForm = this.fb.group({
      email: [{ value: this.dataHolderService.user.email, disabled: true }, Validators.required], // Email is disabled
      description: [this.placeholder, Validators.required]
    });

  }

  setPlaceholderText() {
    this.translate.get(this.placeholder).subscribe((translatedText: string) => {
      this.placeholder = `${translatedText} ${this.dataHolderService.user.screenName}`;
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.isSending = true;
      const emailControl = this.emailForm.get('email');
      const descriptionControl = this.emailForm.get('description');

      if (emailControl && descriptionControl) {
        const emailData = {
          email: emailControl.value,
          body: descriptionControl.value
        };

        this.generalService.sendEmail(emailData).subscribe(
          response => {
            this.snackBar.open(response.message, 'Ok', { duration: 5000 });
            this.isSending = false;
          },
          error => {
            this.snackBar.open(error.error.message, 'Ok', { duration: 5000 });
            this.isSending = false;
          }
        );
      }
    }
  }
}
