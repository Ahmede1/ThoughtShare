import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Note } from './note';
import { NoteService } from './note.service';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';
import { News } from 'src/app/models/news.model';
import { TopNewsService } from 'src/app/services/top-news.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CKEditorModule,
    TranslateModule
  ],
})
export class AppNotesComponent implements OnInit {
  public Editor = ClassicEditor;
  public noteForm: FormGroup;
  public thumbnailFile: File | null = null;
  profileImageUrl: string = '';

  sidePanelOpened = true;
  notes = this.noteService.getNotes();
  selectedNote: Note = Object.create(null);
  active = false;
  searchText = '';
  clrName = 'warning';
  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'accent' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];

  constructor(
    public noteService: NoteService,
    private snackBar: MatSnackBar,
    private topNewsService: TopNewsService
  ) {
    this.notes = this.noteService.getNotes();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.notes = this.filter(filterValue);
  }

  filter(v: string): Note[] {
    return this.noteService
      .getNotes()
      .filter((x) => x.title.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  ngOnInit(): void {
    this.onLoad();
    this.initializeForm();
  }

  onLoad(): void {
    this.selectedNote = this.notes[0];
  }

  onSelect(note: Note): void {
    this.selectedNote = note;
    this.clrName = this.selectedNote.color;
  }

  onSelectColor(colorName: string): void {
    this.clrName = colorName;
    this.selectedNote.color = this.clrName;
    this.active = !this.active;
  }

  removenote(note: Note): void {
    const index: number = this.notes.indexOf(note);
    if (index !== -1) {
      this.notes.splice(index, 1);
      this.selectedNote = this.notes[0];
    }
  }

  addNoteClick(): void {
    this.notes.unshift({
      color: this.clrName,
      title: 'this is New notes',
      datef: new Date(),
    });
  }

  initializeForm(): void {
    this.noteForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      thumbnail: new FormControl('', Validators.required),
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailFile = file;
        this.profileImageUrl = reader.result as string;
        this.noteForm.patchValue({
          thumbnail: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  resetImage() {
    this.thumbnailFile = null;
    this.profileImageUrl = '';
    this.noteForm.patchValue({
      thumbnail: '',
    });
  }

  submitForm() {
    if (this.noteForm.valid) {
      const news: News = {
        title: this.noteForm.get('title')?.value,
        content: this.noteForm.get('content')?.value,
        thumbnail: this.thumbnailFile!,
      };
      this.topNewsService.postNew(news).subscribe(
        (response: News) => {
          console.log('Response:', response);
          this.snackBar.open('News posted successfully', 'Ok', { duration: 3000 });
        },
        (error) => {
          console.error('Error:', error);
          this.snackBar.open('Failed to post news', 'Ok', { duration: 3000 });
        }
      );
    }
  }


}
