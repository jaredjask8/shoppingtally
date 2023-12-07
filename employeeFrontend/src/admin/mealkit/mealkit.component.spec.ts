import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealkitComponent } from './mealkit.component';

describe('MealkitComponent', () => {
  let component: MealkitComponent;
  let fixture: ComponentFixture<MealkitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MealkitComponent]
    });
    fixture = TestBed.createComponent(MealkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
