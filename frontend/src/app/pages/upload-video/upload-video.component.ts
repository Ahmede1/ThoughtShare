import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VideosService } from 'src/app/services/videos.service';
import { Tags } from 'src/app/models/tags.model';
import { AppDialogContentComponent } from '../ui-components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule,
    MatAutocompleteModule,
    TranslateModule
  ]
})
export class UploadVideoComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  uploadForm: FormGroup;
  thumbnailPreview: string | ArrayBuffer | null = null;
  videoPreview: string | ArrayBuffer | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  LanguageOptions: string[] = ['English', 'Spanish', 'French', 'German', 'Chinese'];
  filteredLanguageOptions!: Observable<string[]>;

  YearOptionsMendatoryList: Tags[] = [
    { id: '60af8846f93a2b6c5d8e8d46', name: '2020' },
    { id: '60af8846f93a2b6c5d8e8d47', name: '2021' },
    { id: '60af8846f93a2b6c5d8e8d48', name: '2022' },
    { id: '60af8846f93a2b6c5d8e8d49', name: '2023' },
    { id: '60af8846f93a2b6c5d8e8d4a', name: '2024' }
  ];

  difficultyLevelOptionalList: any[] = [];
  interactivityOptionalList: any[] = [];
  resourceTypeOptionalList: any[] = [];

  subjectAreaMendatoryList: any[] = [];
  branchMendatoryList: any[] = [];
  topicMendatoryList: any[] = [];
  subtopicMendatoryList: any[] = [];
  conceptMendatoryList: any[] = [];

  selectedYear: string = '';
  selectedConcept: string = '';
  selectedSubjectArea: string = '';
  selectedBranch: string = '';
  selectedTopic: string = '';
  selectedSubtopic: string = '';
  selectedDifficultyLevel: string = '';
  selectedInteractivity: string = '';
  selectedResourceType: string = '';


  mandatoryTagsSelected: string[] = [];
  optionalTagsSelected: string[] = [];

  tags: any | null = null;


  constructor(
    private fb: FormBuilder,
    private videoService: VideosService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public dataHolderService: DataHolderService) {

    this.uploadForm = this.fb.group({
      thumbnail: [null],
      video: [null, Validators.required],
      title: ['', Validators.required],
      language: ['', Validators.required],
      description: ['', Validators.required],
      YearOptionsMendatory: ['', Validators.required],
      subjectAreaMendatory: ['', Validators.required],
      branchMendatory: ['', Validators.required],
      topicMendatory: ['', Validators.required],
      subtopicMendatory: ['', Validators.required],
      conceptMendatory: ['', Validators.required],
      difficultyLevelOptional: [''],
      interactivityOptional: [''],
      resourceTypeOptional: ['']
    });
  }

  ngOnInit(): void {
    const tags = this.dataHolderService.tags;
    if (tags) {
      this.subjectAreaMendatoryList = tags.SubjectArea;
      this.difficultyLevelOptionalList = tags.DifficultyLevel;
      this.interactivityOptionalList = tags.Interactivity;
      this.resourceTypeOptionalList = tags.ResourceType;
    }
  }

  onSubjectAreaChange(event: MatSelectChange): void {
    const subjectAreaId = event.value.id;
    this.updateMandatoryTags(event.value)

    if (this.dataHolderService.tags) {
      this.selectedSubjectArea = subjectAreaId;
      this.branchMendatoryList = this.dataHolderService.tags.Branch.filter((branch: any) => branch.parent === subjectAreaId);
      this.topicMendatoryList = [];
      this.subtopicMendatoryList = [];
    }
  }

  onBranchChange(event: MatSelectChange): void {
    const branchId = event.value.id;
    this.updateMandatoryTags(event.value)

    if (this.dataHolderService.tags) {
      this.selectedBranch = branchId;
      this.topicMendatoryList = this.dataHolderService.tags.Topic.filter((topic: any) => topic.parent === branchId);
      this.subtopicMendatoryList = [];
    }
  }

  onTopicChange(event: MatSelectChange): void {
    const topicId = event.value.id;
    this.updateMandatoryTags(event.value);

    if (this.dataHolderService.tags) {
      this.selectedTopic = topicId;
      this.subtopicMendatoryList = this.dataHolderService.tags.Subtopic.filter((subtopic: any) => subtopic.parent === topicId);
      this.conceptMendatoryList = [];
    }
  }

  onSubtopicChange(event: MatSelectChange): void {
    const subtopicId = event.value.id;
    this.updateMandatoryTags(event.value);

    if (this.dataHolderService.tags) {
      this.selectedSubtopic = subtopicId;
      this.conceptMendatoryList = this.dataHolderService.tags.Concept.filter((concept: any) => concept.parent === subtopicId);
    }
  }


  updateMandatoryTags(tag: Tags): void {
    if (tag && tag.id.match(/^[0-9a-fA-F]{24}$/)) {
      const index = this.mandatoryTagsSelected.indexOf(tag.id);
      if (index === -1) {
        this.mandatoryTagsSelected.push(tag.id);
      } else {
        this.mandatoryTagsSelected.splice(index, 1);
      }
    } else {
      console.error('Invalid tag ID:', tag.id);
    }
    // console.log("mandatoryTagsSelected", this.mandatoryTagsSelected)
  }

  updateOptionalTags(tag: Tags): void {
    if (tag && tag.id.match(/^[0-9a-fA-F]{24}$/)) {
      const index = this.optionalTagsSelected.indexOf(tag.id);
      if (index === -1) {
        this.optionalTagsSelected.push(tag.id);
      } else {
        this.optionalTagsSelected.splice(index, 1);
      }
    } else {
      console.error('Invalid tag ID:', tag.id);
    }
    // console.log("updateOptionalTags", this.optionalTagsSelected)

  }

  onThumbnailChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.uploadForm.patchValue({ thumbnail: file });
      this.uploadForm.get('thumbnail')!.updateValueAndValidity();
    }
  }

  onVideoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.videoPreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.uploadForm.patchValue({ video: file });
      this.uploadForm.get('video')!.updateValueAndValidity();
    }
  }

  getTagsNames(selectedTags: string[], allTags: Tags[]): string[] {
    return selectedTags.map(tagId => {
      const tag = allTags.find(tag => tag.id === tagId);
      return tag ? tag.name : '';
    }).filter(name => name);
  }

  captureThumbnailFromVideo(): Promise<string | null> {
    return new Promise((resolve) => {
      const videoElement = this.videoElement.nativeElement;
      const canvasElement = this.canvasElement.nativeElement;
      const context = canvasElement.getContext('2d');

      if (!context) {
        resolve(null);
        return;
      }

      videoElement.onloadedmetadata = () => {
        videoElement.currentTime = videoElement.duration / 2;
      };

      videoElement.onseeked = () => {
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const thumbnail = canvasElement.toDataURL('image/jpeg');
        resolve(thumbnail);
      };

      if (typeof this.videoPreview === 'string') {
        videoElement.src = this.videoPreview;
      } else {
        resolve(null);
      }
    });
  }

  async openHeaderDialog() {
    if (!this.thumbnailPreview && this.videoPreview) {
      this.thumbnailPreview = await this.captureThumbnailFromVideo();
    }

    const mandatoryTagsNames = this.getTagsNames(this.mandatoryTagsSelected, [
      ...this.YearOptionsMendatoryList,
      ...this.subjectAreaMendatoryList,
      ...this.branchMendatoryList,
      ...this.topicMendatoryList,
      ...this.subtopicMendatoryList,
      ...this.conceptMendatoryList
    ]);

    const optionalTagsNames = this.getTagsNames(this.optionalTagsSelected, [
      ...this.difficultyLevelOptionalList,
      ...this.interactivityOptionalList,
      ...this.resourceTypeOptionalList
    ]);

    const dialogRef = this.dialog.open(AppDialogContentComponent, {
      width: '70%', // Set the width of the dialog
      data: {
        title: this.uploadForm.get('title')!.value,
        language: this.uploadForm.get('language')!.value,
        description: this.uploadForm.get('description')!.value,
        thumbnail: this.thumbnailPreview,
        video: this.videoPreview,
        mandatoryTags: mandatoryTagsNames,
        optionalTags: optionalTagsNames
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.submit();
      }
    });
  }

  submit(): void {
    if (this.uploadForm.valid) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append("thumbnail", this.uploadForm.get('thumbnail')!.value);
      formData.append("video", this.uploadForm.get('video')!.value);
      formData.append("title", this.uploadForm.get('title')!.value);
      formData.append("language", this.uploadForm.get('language')!.value);
      formData.append("description", this.uploadForm.get('description')!.value);
      formData.append("mandatoryTags", JSON.stringify(this.mandatoryTagsSelected));
      formData.append("optionalTags", JSON.stringify(this.optionalTagsSelected));
      this.videoService.uploadVideo(formData).subscribe(response => {
        // Handle the response from the server
        this.isUploading = false;
        this
        console.log('Upload successful', response);
        this.snackBar.open("Upload successful", 'Ok', { duration: 2000 });

      }, error => {
        // Handle error
        this.isUploading = false;
        console.error('Upload failed', error);
      });
    }
  }
}


