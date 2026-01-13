import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfvAssetTypesComponent } from './afv-asset-types.component';

describe('AfvAssetTypesComponent', () => {
  let component: AfvAssetTypesComponent;
  let fixture: ComponentFixture<AfvAssetTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfvAssetTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfvAssetTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
