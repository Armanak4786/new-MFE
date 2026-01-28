import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BorrowerSearchResultComponent } from './borrower-search-result.component';
import { ActivatedRoute } from '@angular/router';
import {
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  Mode,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { IndividualService } from '../../../individual/services/individual.service';
import { TrustService } from '../../../trust/services/trust.service';
import { BusinessService } from '../../../business/services/business';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { By } from '@angular/platform-browser';
import { GenTableComponent } from 'auro-ui';

fdescribe('BorrowerSearchResultComponent', () => {
  let component: BorrowerSearchResultComponent;
  let fixture: ComponentFixture<BorrowerSearchResultComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockStandardQuoteService: jasmine.SpyObj<StandardQuoteService>;
  let mockIndividualService: jasmine.SpyObj<IndividualService>;
  let mockTrustService: jasmine.SpyObj<TrustService>;
  let mockBusinessService: jasmine.SpyObj<BusinessService>;
  let baseSvcMock: any;

  beforeEach(async () => {
    baseSvcMock = {
      searchCustomerData: [
        {
          FirstName: 'John',
          LastName: 'Doe',
          Address: '123 Street',
          TradingName: 'John Traders',
          DriversLicenceNo: 'DL123456',
          UDCCustomerNo: 'UDC123',
          CustomerType: 'individual',
          DateOfBirth: '1990-01-01T00:00:00Z',
          CustomerContracts: [{ id: 1, name: 'Contract1' }],
        },
      ],
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockActivatedRoute = {
      snapshot: {
        params: {
          customerType: 'individual',
        },
      },
    };

    mockCommonService = jasmine.createSpyObj('CommonService', ['router']);
    mockCommonService.router = mockRouter;

    mockStandardQuoteService = jasmine.createSpyObj('StandardQuoteService', [
      'activeStep',
    ]);
    mockIndividualService = jasmine.createSpyObj('IndividualService', [
      'resetBaseDealerFormData',
    ]);
    mockTrustService = jasmine.createSpyObj('TrustService', [
      'resetBaseDealerFormData',
    ]);
    mockBusinessService = jasmine.createSpyObj('BusinessService', [
      'resetBaseDealerFormData',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BorrowerSearchResultComponent],
      imports: [AuroUiFrameWork],
      providers: [
        AuthenticationService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CommonService, useValue: mockCommonService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: IndividualService, useValue: mockIndividualService },
        { provide: TrustService, useValue: mockTrustService },
        { provide: BusinessService, useValue: mockBusinessService },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BorrowerSearchResultComponent);
    component = fixture.componentInstance;
    component.searchType = 'individual'; // Set initial searchType

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to add customer URL on addCustomer', () => {
    const customerId = '12345';
    component.addCustomer(customerId);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      `individual/${Mode.create}/${customerId}`
    );
  });

  it('should reset services and navigate to new customer URL on newCustomer', () => {
    component.newCustomer();

    expect(mockIndividualService.activeStep).toEqual(0);
    expect(mockBusinessService.activeStep).toEqual(0);
    expect(mockTrustService.activeStep).toEqual(0);

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/individual');

    expect(mockIndividualService.resetBaseDealerFormData).toHaveBeenCalled();
    expect(mockBusinessService.resetBaseDealerFormData).toHaveBeenCalled();
    expect(mockTrustService.resetBaseDealerFormData).toHaveBeenCalled();
  });

  it('should redirect to standard quote home on redirectToHome', () => {
    component.redirectToHome();
    expect(mockStandardQuoteService.activeStep).toEqual(1);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
      '/dealer/standard-quote'
    );
  });
});
