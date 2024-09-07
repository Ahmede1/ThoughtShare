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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    TranslateModule,
    TablerIconsModule],
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.scss'
})
export class ReportDialogComponent {
  reportForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      reason: ['', Validators.required],
      timestamp: ['', [Validators.required, Validators.pattern(/^([0-5][0-9]):([0-5][0-9])$/)]],
      details: ['', Validators.required]
    });

  }


  onSubmit() {
    if (this.reportForm.valid) {
      this.dialogRef.close({ reportFrom: this.reportForm.value });
    }
  }


}
