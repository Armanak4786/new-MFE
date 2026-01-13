import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEsignDetailsComponent } from './document-esign-details.component';

describe('DocumentEsignDetailsComponent', () => {
  let component: DocumentEsignDetailsComponent;
  let fixture: ComponentFixture<DocumentEsignDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentEsignDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentEsignDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
