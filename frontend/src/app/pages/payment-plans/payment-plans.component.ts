import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PaymentService } from 'src/app/services/payment.service';
import { SharedService } from 'src/app/services/shared.service';
import { TranslateModule } from '@ngx-translate/core';

type Currency = 'USD' | 'EUR' | 'HUF';

@Component({
  selector: 'app-payment-plans',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TablerIconsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './payment-plans.component.html',
  styleUrls: ['./payment-plans.component.scss']
})
export class PaymentPlansComponent {
  showYearly = false;
  selectedCurrency: Currency = 'USD';
  isLoading = false;

  paymentPlans = {
    currencies: ['USD', 'EUR', 'HUF'],
    plans: {
      USD: {
        monthly: 1,
        yearly: 10,
        description: "Enjoy full access to all premium content—subscribe today for exclusive videos and unlimited viewing!"
      },
      EUR: {
        monthly: 1,
        yearly: 10,
        description: "Genießen Sie vollen Zugang zu allen Premium-Inhalten—abonnieren Sie jetzt für exklusive Videos und unbegrenztes Ansehen!"
      },
      HUF: {
        monthly: 300,
        yearly: 3000,
        description: "Profitez d'un accès complet à tous les contenus premium—abonnez-vous dès aujourd'hui pour des vidéos exclusives et un visionnage illimité!"
      }
    }
  };

  constructor(
    private payementService: PaymentService,
    private sharedService: SharedService) { }

  get currentPlan() {
    return this.paymentPlans.plans[this.selectedCurrency];
  }

  purchaseSubscription() {
    this.isLoading = true;
    const jsonBody = {
      membershipType: this.showYearly ? 'yearly' : 'monthly',
      amount: this.showYearly ? this.currentPlan.yearly : this.currentPlan.monthly,
      currency: this.selectedCurrency
    }
    console.log(jsonBody)

    this.payementService.purchaseMembership(jsonBody).subscribe(
      (response) => {
        this.isLoading = true;
        // console.log(response);
        this.sharedService.openSnackBar("Plan Subscribed Successfully ", "Ok")
      },
      (error) => {
        // console.error(error.message);
        this.sharedService.openSnackBar(error.error.message, "Ok")
        this.isLoading = true;
      }
    );
  }
}
