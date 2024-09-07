import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTagRequestComponent } from './general-tag-request.component';

describe('GeneralTagRequestComponent', () => {
  let component: GeneralTagRequestComponent;
  let fixture: ComponentFixture<GeneralTagRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralTagRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralTagRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
