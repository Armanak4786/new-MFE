import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginatorReferenceComponent } from './originator-reference.component';

describe('OriginatorReferenceComponent', () => {
  let component: OriginatorReferenceComponent;
  let fixture: ComponentFixture<OriginatorReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginatorReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginatorReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
