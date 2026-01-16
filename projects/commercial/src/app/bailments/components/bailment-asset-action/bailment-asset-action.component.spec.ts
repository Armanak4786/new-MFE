import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailmentAssetActionComponent } from './bailment-asset-action.component';

describe('BailmentAssetActionComponent', () => {
  let component: BailmentAssetActionComponent;
  let fixture: ComponentFixture<BailmentAssetActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BailmentAssetActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BailmentAssetActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
