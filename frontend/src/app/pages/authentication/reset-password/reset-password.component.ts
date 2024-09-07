import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service'; // Ensure the correct path to your service
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResetPassword } from 'src/app/models/login.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, TablerIconsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  options = this.settings.getOptions();
  token: string | null = null;
  isEmailSent: boolean = false;
  isLoading: boolean = false;

  // Custom validator to check if passwords match
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  };


  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  constructor(
    private route: ActivatedRoute,
    private settings: CoreService,
    private router: Router,
    private userAuthService: userAutherizeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      console.log("token", this.token);
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid && this.token) {
      this.isLoading = true;
      const newPassword = this.form.value.password!;
      const resetPassword = new ResetPassword(this.token, newPassword);

      this.userAuthService.resetPassword(resetPassword).subscribe(
        response => {
          this.isLoading = false;
          this.snackBar.open('Password reset successfully', 'Close', {
            duration: 2000
          });
          this.router.navigate(['authentication/login']);
        },
        error => {
          this.isLoading = false;
          this.snackBar.open(error.error.message, 'Close');
        }
      );
    }
  }


}
