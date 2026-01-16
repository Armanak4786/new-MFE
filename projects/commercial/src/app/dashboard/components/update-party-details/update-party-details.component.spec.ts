import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePartyDetailsComponent } from './update-party-details.component';

describe('UpdatePartyDetailsComponent', () => {
  let component: UpdatePartyDetailsComponent;
  let fixture: ComponentFixture<UpdatePartyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatePartyDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePartyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
