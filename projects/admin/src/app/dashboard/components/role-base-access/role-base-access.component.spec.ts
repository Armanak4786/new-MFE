import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBaseAccessComponent } from './role-base-access.component';

describe('RoleBaseAccessComponent', () => {
  let component: RoleBaseAccessComponent;
  let fixture: ComponentFixture<RoleBaseAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleBaseAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleBaseAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
