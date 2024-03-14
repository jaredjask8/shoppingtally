import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksComponent } from './how-it-works.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HowItWorksComponent', () => {
  let component: HowItWorksComponent;
  let fixture: ComponentFixture<HowItWorksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HowItWorksComponent],
      imports:[
        HttpClientTestingModule
      ]
    });
    fixture = TestBed.createComponent(HowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
