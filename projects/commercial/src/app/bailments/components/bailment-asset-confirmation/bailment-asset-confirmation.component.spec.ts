import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentAssetConfirmationComponent } from './bailment-asset-confirmation.component';

describe('BailmentAssetConfirmationComponent', () => {
  let component: BailmentAssetConfirmationComponent;
  let fixture: ComponentFixture<BailmentAssetConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BailmentAssetConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentAssetConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
