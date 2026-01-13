import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustAssetsComponent } from './trust-assets.component';

describe('TrustAssetsComponent', () => {
  let component: TrustAssetsComponent;
  let fixture: ComponentFixture<TrustAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
