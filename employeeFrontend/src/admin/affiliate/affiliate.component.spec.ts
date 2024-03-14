import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateComponent } from './affiliate.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderComponent } from '../../global/components/loader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AffiliateComponent', () => {
  let component: AffiliateComponent;
  let fixture: ComponentFixture<AffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateComponent],
      imports:[HttpClientTestingModule,LoaderComponent, MatFormFieldModule, ReactiveFormsModule, MatInputModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(AffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
