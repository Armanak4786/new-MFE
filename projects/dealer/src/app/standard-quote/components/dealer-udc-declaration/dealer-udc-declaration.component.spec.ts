import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerUdcDeclarationComponent } from './dealer-udc-declaration.component';

describe('DealerUdcDeclarationComponent', () => {
  let component: DealerUdcDeclarationComponent;
  let fixture: ComponentFixture<DealerUdcDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerUdcDeclarationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerUdcDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
