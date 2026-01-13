import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustContactDetailComponent } from './trust-contact-detail.component';
import { By } from '@angular/platform-browser';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { AuthenticationService, LibSharedModule } from 'auro-ui';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { TrustService } from '../../services/trust.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('TrustContactDetailComponent', () => {
  let component: TrustContactDetailComponent;
  let fixture: ComponentFixture<TrustContactDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrustContactDetailComponent],
      imports: [CoreAppModule, LibSharedModule],
      providers: [
        JwtHelperService,
        AuthenticationService,

        ConfirmationService,
        MessageService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render app-trust-contact-details-card component', () => {
    const cardComponent = fixture.debugElement.query(
      By.css('app-trust-contact-details-card')
    );
    expect(cardComponent).toBeTruthy();
  });

  it('should render app-trust-accountant-details component', () => {
    const accountantComponent = fixture.debugElement.query(
      By.css('app-trust-accountant-details')
    );
    expect(accountantComponent).toBeTruthy();
  });

  it('should render app-trust-solicitor-details component', () => {
    const solicitorComponent = fixture.debugElement.query(
      By.css('app-trust-solicitor-details')
    );
    expect(solicitorComponent).toBeTruthy();
  });

  it('should render app-trust-customer-reference component', () => {
    const customerReferenceComponent = fixture.debugElement.query(
      By.css('app-trust-customer-reference')
    );
    expect(customerReferenceComponent).toBeTruthy();
  });

  it('should render app-trust-details-confirmation component', () => {
    const confirmationComponent = fixture.debugElement.query(
      By.css('app-trust-details-confirmation')
    );
    expect(confirmationComponent).toBeTruthy();
  });

  it('should have five components wrapped with proper structure', () => {
    const divElements = fixture.debugElement.queryAll(By.css('.mb-2'));
    expect(divElements.length).toBe(4);
  });
});
