import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WhatsNewComponent } from './whats-new.component';

describe('WhatsNewComponent', () => {
  let component: WhatsNewComponent;
  let fixture: ComponentFixture<WhatsNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WhatsNewComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(WhatsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
