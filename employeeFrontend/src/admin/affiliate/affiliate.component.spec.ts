import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateComponent } from './affiliate.component';

describe('AffiliateComponent', () => {
  let component: AffiliateComponent;
  let fixture: ComponentFixture<AffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateComponent]
    });
    fixture = TestBed.createComponent(AffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
