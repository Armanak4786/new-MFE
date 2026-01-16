import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetlinkComponent } from './assetlink.component';

describe('AssetlinkComponent', () => {
  let component: AssetlinkComponent;
  let fixture: ComponentFixture<AssetlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetlinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
