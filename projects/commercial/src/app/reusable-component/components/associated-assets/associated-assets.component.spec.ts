import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedAssetsComponent } from './associated-assets.component';

describe('AssociatedAssetsComponent', () => {
  let component: AssociatedAssetsComponent;
  let fixture: ComponentFixture<AssociatedAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociatedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
