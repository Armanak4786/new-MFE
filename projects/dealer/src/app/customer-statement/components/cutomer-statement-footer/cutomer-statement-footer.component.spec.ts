import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CutomerStatementFooterComponent } from './cutomer-statement-footer.component';

describe('CutomerStatementFooterComponent', () => {
  let component: CutomerStatementFooterComponent;
  let fixture: ComponentFixture<CutomerStatementFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CutomerStatementFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CutomerStatementFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
