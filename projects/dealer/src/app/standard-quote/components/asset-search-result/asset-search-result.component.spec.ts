import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSearchResultComponent } from './asset-search-result.component';

describe('AssetSearchResultComponent', () => {
  let component: AssetSearchResultComponent;
  let fixture: ComponentFixture<AssetSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetSearchResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
