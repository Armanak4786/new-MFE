import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAssetDetailsComponent } from './individual-asset-details.component';

describe('IndividualAssetDetailsComponent', () => {
  let component: IndividualAssetDetailsComponent;
  let fixture: ComponentFixture<IndividualAssetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualAssetDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
