import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealkitComponent } from './mealkit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderComponent } from '../../global/components/loader.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

describe('MealkitComponent', () => {
  let component: MealkitComponent;
  let fixture: ComponentFixture<MealkitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MealkitComponent, ],
      imports:[
        HttpClientTestingModule, 
        LoaderComponent,MatSnackBarModule, 
        MatFormFieldModule, 
        BrowserAnimationsModule, 
        MatSelectModule, 
        ReactiveFormsModule, 
        MatInputModule
      ]
    });
    fixture = TestBed.createComponent(MealkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
