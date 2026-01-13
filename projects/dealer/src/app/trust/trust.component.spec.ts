import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustComponent } from './trust.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AppPrimengModule,
  CommonService,
  AuroUiFrameWork,
  ToasterService,
  UiService,
} from 'auro-ui';
import { CoreAppModule } from '../../../app-core.module';
import { ActivatedRoute, Router } from '@angular/router';
import { TrustService } from './services/trust.service';
import { StandardQuoteService } from '../standard-quote/services/standard-quote.service';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, of, Subject, takeUntil } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TrustDetailComponent } from './components/trust-details/trust-detail/trust-detail.component';
import { TrustAddressDetailsComponent } from './components/trust-address-details/trust-address-details.component';

fdescribe('TrustComponent', () => {
  let component: TrustComponent;
  let fixture: ComponentFixture<TrustComponent>;
  let trustService: jasmine.SpyObj<TrustService>;
  let standardQuoteService: jasmine.SpyObj<StandardQuoteService>;
  let commonService: jasmine.SpyObj<CommonService>;
  let toasterService: jasmine.SpyObj<ToasterService>;
  let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let trustDataSubject: BehaviorSubject<any>;
  let standardQuoteDataSubject: BehaviorSubject<any>;
  let router: jasmine.SpyObj<Router>;
  const mockRoute = {
    snapshot: {
      params: {
        type: 'addAsset',
        mode: 'edit',
      },
    },
  };

  beforeEach(async () => {
    const stepperSubject = new BehaviorSubject<any>(null); // Initialize with a default value if needed
    stepperSubject.next = jasmine
      .createSpy('next')
      .and.callFake((value: any) => {
        stepperSubject.next(value); // Call the original next method
      });

    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    trustDataSubject = new BehaviorSubject<any>({
      detailsConfirmation: true,
      formData: {},
    });
    standardQuoteDataSubject = new BehaviorSubject<any>({
      contractId: 12345,
    });

    trustService = jasmine.createSpyObj('BusinessService', [
      'getBaseDealerFormData',
      'stepper',
      'activeStep',
      'formStatusArr',
      'getFormData',
    ]);
    standardQuoteService = jasmine.createSpyObj('StandardQuoteService', [
      'getBaseDealerFormData',
      'trustData',
      'trustDataSubject',
      'activeStep',
    ]);

    // commonService = jasmine.createSpyObj('CommonService', [
    //   'router',
    //   'data',
    //   'ui',
    // ]);

    commonService = jasmine.createSpyObj('CommonService', [], {
      router: jasmine.createSpyObj('Router', ['navigateByUrl']),
      data: jasmine.createSpyObj('DataService', ['getData', 'setData']),
      ui: jasmine.createSpyObj('UIService', ['showOkDialog']),
    });

    commonService.ui = jasmine.createSpyObj('ui', ['showOkDialog']);
    commonService.data = jasmine.createSpyObj('data', ['put']);

    toasterService = jasmine.createSpyObj('ToasterService', ['showToaster']);
    changeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TrustComponent],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        {
          provide: TrustService,
          useValue: { ...trustService, stepper: stepperSubject },
        },
        { provide: StandardQuoteService, useValue: standardQuoteService },
        { provide: CommonService, useValue: { commonService, router } },
        { provide: ToasterService, useValue: toasterService },
        { provide: ChangeDetectorRef, useValue: changeDetectorRef },
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustComponent);
    component = fixture.componentInstance;
    component.isReady = true;
    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;

    trustService = TestBed.inject(TrustService) as jasmine.SpyObj<TrustService>;
    standardQuoteService = TestBed.inject(
      StandardQuoteService
    ) as jasmine.SpyObj<StandardQuoteService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render TrustDetailComponent for step 0', () => {
    component.activeStep = 0;
    fixture.detectChanges(); // Trigger change detection

    const trustDetailComponent = fixture.debugElement.query(
      By.css('app-trust-detail')
    );
    expect(trustDetailComponent).toBeTruthy();
  });

  it('should render TrustAddressDetailsComponent for step 1', () => {
    component.activeStep = 1;
    fixture.detectChanges();
    const trustAddressDetails = fixture.debugElement.query(
      By.css('app-trust-address-details')
    );
    expect(trustAddressDetails).toBeTruthy();
  });

  it('should render TrustFinancialDetailsComponent for step 2', () => {
    component.activeStep = 2;
    fixture.detectChanges();
    const trustFinancialDetails = fixture.debugElement.query(
      By.css('app-trust-financial-details')
    );
    expect(trustFinancialDetails).toBeTruthy();
  });

  it('should render TrusteeDetailsComponent for step 3', () => {
    component.activeStep = 3;
    fixture.detectChanges();
    const trusteeDetails = fixture.debugElement.query(
      By.css('app-trustee-details')
    );
    expect(trusteeDetails).toBeTruthy();
  });

  it('should render TrustContactDetailComponent for step 4', () => {
    component.activeStep = 4;
    fixture.detectChanges();
    const trustContactDetail = fixture.debugElement.query(
      By.css('app-trust-contact-detail')
    );
    expect(trustContactDetail).toBeTruthy();
  });
  it('should emit onChange event when step changes', () => {
    spyOn(component, 'changeStep');
    const stepper = fixture.debugElement.query(By.css('lib-stepper'));
    stepper.triggerEventHandler('onChange', 1);
    fixture.detectChanges();
    expect(component.changeStep).toHaveBeenCalledWith(1);
  });

  it('should emit onSubmit event when form is submitted', () => {
    spyOn(component, 'onSubmit');
    const stepper = fixture.debugElement.query(By.css('lib-stepper'));
    stepper.triggerEventHandler('onSubmit', null);
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should emit onCancel event when cancel is triggered', () => {
    spyOn(component, 'cancel');
    const stepper = fixture.debugElement.query(By.css('lib-stepper'));
    stepper.triggerEventHandler('onCancel', null);
    fixture.detectChanges();
    expect(component.cancel).toHaveBeenCalled();
  });

  describe('ngOnDestroy()', () => {
    it('should call next() and complete() on destroy$', () => {
      const destroyNextSpy = spyOn(
        component.destroy$,
        'next'
      ).and.callThrough();
      const destroyCompleteSpy = spyOn(
        component.destroy$,
        'complete'
      ).and.callThrough();

      component.ngOnDestroy();

      expect(destroyNextSpy).toHaveBeenCalledTimes(1);
      expect(destroyCompleteSpy).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe observables using takeUntil with destroy$', () => {
      // Create a mock observable and track if it gets unsubscribed
      const mockObservable$ = new Subject();
      const subscription = mockObservable$
        .pipe(takeUntil(component.destroy$))
        .subscribe();

      // Trigger ngOnDestroy
      component.ngOnDestroy();

      // Check if the subscription is closed (unsubscribed)
      expect(subscription.closed).toBeTrue();
    });
  });
  it('should post data and return the response without mapFunc', async () => {
    let mockResponse = { data: 'test data' };

    commonService.data = {
      post: jasmine.createSpy('post').and.returnValue(of(mockResponse)), // Option 4: Directly return observable
    } as any; // Casting to 'any' to prevent TypeScript issues

    // Mock the return value of post method

    const payload = { id: 1 };
    const api = 'test/api';

    // Call the function
    const result = await component.postFormData(api, payload);

    // Verify that the post method was called with correct parameters
    expect(commonService.data.post).toHaveBeenCalledWith(api, payload);

    // Verify the returned result
    expect(result).toEqual(mockResponse);
  });

  it('should call put and return the processed response', async () => {
    const payload = { id: 1 };
    const api = 'test/api';

    const mockResponse = { data: 'test data' }; // Example response

    commonService.data = {
      put: jasmine.createSpy('put').and.returnValue(of(mockResponse)),
    } as any;

    // Optional: define a map function if needed
    const mapFunc = (res: any) => {
      return { ...res, additionalData: 'extra info' };
    };

    // Call the method
    const result = await component.putFormData(api, payload, mapFunc);

    // Verify that the put method was called with correct parameters
    expect(commonService.data.put).toHaveBeenCalledWith(api, payload);

    // Verify that the result is as expected after mapping
    expect(result).toEqual({ ...mockResponse, additionalData: 'extra info' });
  });
  // it('should call showOkDialog with correct parameters', () => {
  //   component.cancel();
  //   expect(commonService.ui.showOkDialog).toHaveBeenCalledWith(
  //     'Are you sure you want to cancel?',
  //     'Customer',
  //     jasmine.any(Function) // Expecting a callback function as the third argument
  //   );
  // });
});
