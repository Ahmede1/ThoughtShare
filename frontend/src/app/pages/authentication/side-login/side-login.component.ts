import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { LoginRequest } from 'src/app/models/login.model'; // Ensure you have these models in the specified path
import { userAutherizeService } from 'src/app/services/userAutherizeService.service'; // Ensure the correct path to your service
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  isLoading = false; // To manage loading state

  constructor(
    private settings: CoreService,
    private router: Router,
    private userAuthService: userAutherizeService,
    private snackBar: MatSnackBar
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      const loginData: LoginRequest = new LoginRequest(
        this.form.value.email!,
        this.form.value.password!
      );

      this.userAuthService.login(loginData).subscribe(
        response => {
          this.isLoading = false;
          this.router.navigate(['']);
        },
        error => {
          this.isLoading = false;
          console.log(error)
          this.snackBar.open(error.error.message, 'Ok');
        }
      );
    }
  }
}
