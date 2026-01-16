import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyLinkComponent } from './easy-link.component';

describe('EasyLinkComponent', () => {
  let component: EasyLinkComponent;
  let fixture: ComponentFixture<EasyLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
