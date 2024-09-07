import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlansComponent } from './payment-plans.component';

describe('PaymentPlansComponent', () => {
  let component: PaymentPlansComponent;
  let fixture: ComponentFixture<PaymentPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPlansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
