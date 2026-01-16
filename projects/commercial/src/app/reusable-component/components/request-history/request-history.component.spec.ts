import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSecurityComponent } from './request-history.component';

describe('RequestSecurityComponent', () => {
  let component: RequestSecurityComponent;
  let fixture: ComponentFixture<RequestSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestSecurityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
