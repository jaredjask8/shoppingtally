import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileListsComponent } from './profile-lists.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileListsComponent', () => {
  let component: ProfileListsComponent;
  let fixture: ComponentFixture<ProfileListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileListsComponent],
      imports:[
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    });
    fixture = TestBed.createComponent(ProfileListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
