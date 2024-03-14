import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MealkitComponent } from './mealkit.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderComponent } from '../global/components/loader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('MealkitComponent', () => {
  let component: MealkitComponent;
  let fixture: ComponentFixture<MealkitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MealkitComponent],
      imports:[MatSnackBarModule, MatInputModule, HttpClientTestingModule,LoaderComponent, MatFormFieldModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(MealkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
