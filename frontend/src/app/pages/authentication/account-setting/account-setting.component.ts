import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';
import { CommonModule } from '@angular/common';
import { UserData } from '../../tables/mix-table/mix-table.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    TablerIconsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AppAccountSettingComponent implements OnInit {
  creatorForm: FormGroup;
  generalForm: FormGroup
  originalProfileImageUrl: string = '';
  selectedFile: File | null = null;
  isProcessing: boolean = false;
  isPhotoChanged: boolean = false;

  constructor(public _userAuthService: userAutherizeService, public dataHolderService: DataHolderService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initializeForms();
    if (this.dataHolderService.user?.role === 'Creator') {
      this.patchCreatorForm(this.dataHolderService.user);
    } else if (this.dataHolderService.user?.role === 'General') {
      this.patchGeneralForm(this.dataHolderService.user);
    }
  }

  initializeForms() {
    this.creatorForm = new FormGroup({
      screenName: new FormControl('', Validators.required),
      uiLanguage: new FormControl('', Validators.required),
      preferredLanguage: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      countryOfResidence: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      seniorityStatus: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      highestEducation: new FormControl('', Validators.required),
      brainDominance: new FormControl('', Validators.required),
      password: new FormControl('', Validators.minLength(6))
    });

    this.generalForm = new FormGroup({
      screenName: new FormControl('', Validators.required),
      uiLanguage: new FormControl('', Validators.required),
      preferredLanguage: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      highestEducation: new FormControl('', Validators.required),
      brainDominance: new FormControl('', Validators.required),
      password: new FormControl('', Validators.minLength(6))
    });
  }

  isCreator(): boolean {
    return this.dataHolderService.user?.role === 'Creator';
  }

  isGeneral(): boolean {
    return this.dataHolderService.user?.role === 'General';
  }

  patchCreatorForm(data: any) {
    this.creatorForm.patchValue({
      screenName: data.screenName,
      uiLanguage: data.uiLanguage,
      preferredLanguage: data.preferredLanguage,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      countryOfResidence: data.countryOfResidence || '',
      dateOfBirth: data.dateOfBirth || '',
      seniorityStatus: data.seniorityStatus || '',
      gender: data.gender,
      highestEducation: data.highestEducation,
      brainDominance: data.brainDominance,
      password: ''
    });
    this.originalProfileImageUrl = data.profilePicture

  }

  patchGeneralForm(data: any) {
    this.generalForm.patchValue({
      screenName: data.screenName,
      uiLanguage: data.uiLanguage,
      preferredLanguage: data.preferredLanguage,
      gender: data.gender,
      highestEducation: data.highestEducation,
      brainDominance: data.brainDominance,
      password: ''
    });
    this.originalProfileImageUrl = data.profilePicture;
    console.log(this.originalProfileImageUrl)

  }

  getNonEmptyValues(form: FormGroup): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.value) {
        result[key] = control.value;
      }
    });
    return result;
  }

  submitCreatorForm() {
    if (this.creatorForm.valid) {
      this.isProcessing = true;
      const creatorData = this.getNonEmptyValues(this.creatorForm);
      this._userAuthService.updateProfile(creatorData).subscribe(message => {
        this.isProcessing = false;
        this.snackBar.open(message, 'Ok');
      });
    }
  }

  submitGeneralForm() {
    if (this.generalForm.valid) {
      this.isProcessing = true;
      const generalData = this.getNonEmptyValues(this.generalForm);
      this._userAuthService.updateProfile(generalData).subscribe(message => {
        this.isProcessing = false;
        this.snackBar.open(message, 'Ok');
      });
    }
  }

  getUserImage(): string {
    var userImage = '/assets/images/profile/user-1.jpg'
    if (this.dataHolderService.user?.profilePicture) {
      userImage = this.dataHolderService.user?.profilePicture;
    }
    if (this.dataHolderService.user?.gender == 'Female') {
      userImage = '/assets/images/profile/user-9.jpg';
    }
    return userImage;
  }


  onFileSelected(event: any) {
    this.isPhotoChanged = true;
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.originalProfileImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  resetImage() {
    this.originalProfileImageUrl = this.originalProfileImageUrl;
    this.selectedFile = null; // Clear the selected file
  }

  uploadImage() {
    this.isProcessing = true;
    if (this.selectedFile) {
      this._userAuthService.uploadProfilePicture(this.selectedFile).subscribe(response => {
        this.originalProfileImageUrl = response.url;
        this.snackBar.open(response.message, 'Ok');
        this.isProcessing = false;
        this.isPhotoChanged = false;
      });
    }
  }
}
