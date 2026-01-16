import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginatorAccountComponent } from './originator-account.component';

describe('OriginatorAccountComponent', () => {
  let component: OriginatorAccountComponent;
  let fixture: ComponentFixture<OriginatorAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginatorAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OriginatorAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
