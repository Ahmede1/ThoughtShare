import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterUser } from 'src/app/models/register.model';
import { VerifyForgetEmail } from 'src/app/models/login.model';


@Component({
  selector: 'app-side-forgot-password',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-forgot-password.component.html',
})
export class AppSideForgotPasswordComponent {
  options = this.settings.getOptions();
  isEmailSent: boolean = false;
  isLoading: boolean = false;



  constructor(private settings: CoreService, private router: Router,
    private userAutherizeService: userAutherizeService, private _snackBar: MatSnackBar) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  submit() {
    this.isLoading = true;
    const formData: VerifyForgetEmail = new VerifyForgetEmail(
      this.form.value.email!);

    if (this.form.valid) {
      this.userAutherizeService.initiateResetPasswordRequest(formData).subscribe(
        response => {
          this.isEmailSent = true;
          this.isLoading = false;
        },
        error => {
          this.openSnackBar(error.error.message, "Ok");
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
    }
  }
}
