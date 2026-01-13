import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { PaymentSummaryDeatilsComponent } from './payment-summary-deatils.component';
import { BaseStandardQuoteClass } from '../../base-standard-quote.class';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';

fdescribe('PaymentSummaryDeatilsComponent', () => {
  let component: PaymentSummaryDeatilsComponent;
  let fixture: ComponentFixture<PaymentSummaryDeatilsComponent>;
  let standardQuoteServiceMock: any;
  let commonServiceMock: any;
  let activatedRouteMock: any;

  const mockFormData = {
    cashPriceValue: 1000,
    data: {
      interestRate: 5,
      term: 12,
    },
  };

  beforeEach(async () => {
    activatedRouteMock = {
      snapshot: {
        params: {},
      },
    };

    commonServiceMock = {
      someCommonMethod: jasmine.createSpy('someCommonMethod'),
    };

    standardQuoteServiceMock = {
      getBaseDealerFormData: jasmine
        .createSpy('getBaseDealerFormData')
        .and.returnValue(of(mockFormData)),
    };

    await TestBed.configureTestingModule({
      declarations: [PaymentSummaryDeatilsComponent],
      imports: [AuroUiFrameWork],
      providers: [
        AuthenticationService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,

        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: CommonService, useValue: commonServiceMock },
        { provide: StandardQuoteService, useValue: standardQuoteServiceMock },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSummaryDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize with form data', () => {
  //   component.ngOnInit();
  //   standardQuoteServiceMock.getBaseDealerFormData();
  //   expect(standardQuoteServiceMock.getBaseDealerFormData).toHaveBeenCalled();
  //   expect(component.formData).toEqual(mockFormData);
  //   expect(component.cashPriceValue).toEqual(mockFormData.cashPriceValue);
  //   expect(component.paymentSummary).toEqual(mockFormData.data);
  // });

  // it('should handle case when formData has no "data" property', () => {
  //   const mockFormDataWithoutData = {
  //     cashPriceValue: 2000,
  //   };

  //   standardQuoteServiceMock.getBaseDealerFormData.and.returnValue(
  //     of(mockFormDataWithoutData)
  //   );

  //   component.ngOnInit();
  //   expect(component.paymentSummary).toEqual(mockFormDataWithoutData);
  // });

  it('should unsubscribe from observable on component destroy', () => {
    spyOn(component.destroy$, 'next').and.callThrough();
    spyOn(component.destroy$, 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
