import { Component, ChangeDetectorRef } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { RegisterUser } from 'src/app/models/register.model';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();
  isEmailSent: boolean = false;
  isLoading: boolean = false;
  

  constructor(private settings: CoreService, private router: Router, private cdr: ChangeDetectorRef,
    private userAutherizeService: userAutherizeService, private _snackBar: MatSnackBar
  ) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    updates: new FormControl(false),
    termsAccepted: new FormControl(false, [Validators.requiredTrue])
  });

  get f() {
    return this.form.controls;
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  submit() {
    this.isLoading = true;
    this.cdr.detectChanges(); // Force change detection

    if (this.form.valid) {
      const formData: RegisterUser = new RegisterUser(
        this.form.value.email!,
        this.form.value.updates!,
        this.form.value.termsAccepted!
      );

      this.userAutherizeService.verifyEmail(formData).subscribe(
        response => {
          this.isEmailSent = true;
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection after successful response
          
        },
        error => {
          this.openSnackBar(error.error.message, "Ok");
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection after error response
        }
      );
    } else {
      this.isLoading = false;
      this.cdr.detectChanges(); // Force change detection if form is invalid
    }
  }
}
