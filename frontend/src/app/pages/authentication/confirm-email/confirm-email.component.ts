import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'jquery';
import { userAutherizeService } from 'src/app/services/userAutherizeService.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  token: string;
  isLoading: boolean = true;

  constructor(private router: Router, private userAuthService: userAutherizeService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.userAuthService.confirmEmail(this.token).subscribe(
        response => {
          let userId = response["userId"];
          this.router.navigate([`authentication/complete-profile`], { queryParams: { userId: userId } });
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
        }
      )
    });
  }
}
