import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatButtonModule, CommonModule, MatIconModule, TablerIconsModule,TranslateModule],
  templateUrl: './rating-dialog.component.html',
  styleUrl: './rating-dialog.component.scss'
})
export class RatingDialogComponent {
  stars = [1, 2, 3, 4, 5];
  rating = 0;
  showError = false
    ;
  constructor(public dialogRef: MatDialogRef<RatingDialogComponent>) { }

  setRating(selectedRating: number): void {
    this.rating = selectedRating;
    this.showError = false;

  }

  submitRating(): void {
    if (this.rating === 0) {
      this.showError = true;
      return;
    }
    this.dialogRef.close({ ratingInput: this.rating });
  }
}