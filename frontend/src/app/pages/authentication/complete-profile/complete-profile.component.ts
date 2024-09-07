import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from '../../../material.module';
import { CreatorProfileData, CreatorUserProfile, GeneralProfileData, GeneralUserProfile } from 'src/app/models/register.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [RouterModule, MaterialModule, CommonModule, FormsModule, ReactiveFormsModule,
    MatDatepickerModule],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.scss'
})
export class CompleteProfileComponent implements OnInit {
  options = this.settings.getOptions();
  role: string = 'General'; // Default role
  creatorForm: FormGroup;
  generalForm: FormGroup;
  userId: string;
  isLoading: boolean = false; // Track loading state


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });
    this.initializeForms();
  }

  initializeForms() {
    this.creatorForm = new FormGroup({
      role: new FormControl('Creator', Validators.required),
      screenName: new FormControl('', Validators.required),
      uiLanguage: new FormControl('English', Validators.required),
      preferredLanguage: new FormControl('English', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      countryOfResidence: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      seniorityStatus: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      highestEducation: new FormControl('', Validators.required),
      brainDominance: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.generalForm = new FormGroup({
      role: new FormControl('General', Validators.required),
      screenName: new FormControl('', Validators.required),
      uiLanguage: new FormControl('English', Validators.required),
      preferredLanguage: new FormControl('English', Validators.required),
      gender: new FormControl('', Validators.required),
      highestEducation: new FormControl('', Validators.required),
      brainDominance: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  constructor(private settings: CoreService, private _snackBar: MatSnackBar,
    private _userAutherizeService: userAutherizeService, private router: Router,
    private route: ActivatedRoute,) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  submitCreatorForm() {
    if (this.creatorForm.valid) {
      this.isLoading = true; // Set loading state
      const creatorData: CreatorProfileData = new CreatorProfileData(
        this.creatorForm.value.role,
        this.creatorForm.value.screenName,
        this.creatorForm.value.uiLanguage,
        this.creatorForm.value.preferredLanguage,
        this.creatorForm.value.firstName,
        this.creatorForm.value.lastName,
        this.creatorForm.value.countryOfResidence,
        this.creatorForm.value.dateOfBirth,
        this.creatorForm.value.seniorityStatus,
        this.creatorForm.value.gender,
        this.creatorForm.value.highestEducation,
        this.creatorForm.value.brainDominance,
        this.creatorForm.value.password
      );

      const creatorUserProfile: CreatorUserProfile = new CreatorUserProfile(
        this.userId,
        creatorData
      );

      this._userAutherizeService.registerUser(creatorUserProfile).subscribe(
        response => {
          this.isLoading = false; // Reset loading state
          this.router.navigate(['/authentication/login']);
          this.openSnackBar(response, "Ok");
        },
        error => {
          this.isLoading = false; // Reset loading state
          this.openSnackBar(error.error.message, "Ok");
        }
      );
    }
  }

  submitGeneralForm() {
    if (this.generalForm.valid) {
      this.isLoading = true; // Set loading state
      const generalData: GeneralProfileData = new GeneralProfileData(
        this.generalForm.value.role,
        this.generalForm.value.screenName,
        this.generalForm.value.uiLanguage,
        this.generalForm.value.preferredLanguage,
        this.generalForm.value.gender,
        this.generalForm.value.highestEducation,
        this.generalForm.value.brainDominance,
        this.generalForm.value.password
      );

      const generalUserProfile: GeneralUserProfile = new GeneralUserProfile(
        this.userId,
        generalData
      );

      this._userAutherizeService.registerUser(generalUserProfile).subscribe(
        response => {
          this.isLoading = false; // Reset loading state
          this.router.navigate(['/authentication/login']);
          this.openSnackBar(response, "Ok");
        },
        error => {
          this.isLoading = false; // Reset loading state
          this.openSnackBar(error.error.message, "Ok");
        }
      );
    }
  }

}
