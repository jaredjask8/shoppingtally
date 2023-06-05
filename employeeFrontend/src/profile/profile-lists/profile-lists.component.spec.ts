import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileListsComponent } from './profile-lists.component';

describe('ProfileListsComponent', () => {
  let component: ProfileListsComponent;
  let fixture: ComponentFixture<ProfileListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileListsComponent]
    });
    fixture = TestBed.createComponent(ProfileListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
