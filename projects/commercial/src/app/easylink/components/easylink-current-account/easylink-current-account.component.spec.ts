import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasylinkCurrentAccountComponent } from './easylink-current-account.component';

describe('EasylinkCurrentAccountComponent', () => {
  let component: EasylinkCurrentAccountComponent;
  let fixture: ComponentFixture<EasylinkCurrentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasylinkCurrentAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EasylinkCurrentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
