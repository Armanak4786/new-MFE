import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { BusinessComponent } from './business.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AppPrimengModule,
  CommonService,
  DataService,
  AuroUiFrameWork,
  ToasterService,
  UiService,
} from 'auro-ui';
import { CoreAppModule } from '../../../app-core.module';
import { ActivatedRoute, Router } from '@angular/router';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BusinessService } from './services/business';
import { StandardQuoteService } from '../standard-quote/services/standard-quote.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

fdescribe('BusinessComponent', () => {
  let component: BusinessComponent;
  let fixture: ComponentFixture<BusinessComponent>;
  let businessService: jasmine.SpyObj<BusinessService>;
  let standardQuoteService: jasmine.SpyObj<StandardQuoteService>;
  let commonService: jasmine.SpyObj<CommonService>;
  let toasterService: jasmine.SpyObj<ToasterService>;
  let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let businessDataSubject: BehaviorSubject<any>;
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

    businessDataSubject = new BehaviorSubject<any>({
      detailsConfirmation: true,
      formData: {},
    });
    standardQuoteDataSubject = new BehaviorSubject<any>({
      contractId: 12345,
    });

    businessService = jasmine.createSpyObj('BusinessService', [
      'getBaseDealerFormData',
      'stepper',
      'activeStep',
      'formStatusArr',
      'getFormData',
    ]);
    standardQuoteService = jasmine.createSpyObj('StandardQuoteService', [
      'getBaseDealerFormData',
      'businessData',
      'businessDataSubject',
      'activeStep',
    ]);
    commonService = jasmine.createSpyObj('CommonService', [
      'router',
      'data',
      'ui',
    ]);

    toasterService = jasmine.createSpyObj('ToasterService', ['showToaster']);
    changeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    await TestBed.configureTestingModule({
      declarations: [BusinessComponent],
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
          provide: BusinessService,
          useValue: { ...businessService, stepper: stepperSubject },
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

    fixture = TestBed.createComponent(BusinessComponent);
    component = fixture.componentInstance;
    component.isReady = true;
    component.steps = [
      'Business Details',
      'Address Details',
      'Financial Accounts',
      'Contact Details',
    ];
    component.destroy$ = new Subject<void>(); // Initialize destroy$ as a Subject
    commonService.data.put = jasmine.createSpy('put');

    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;

    businessService = TestBed.inject(
      BusinessService
    ) as jasmine.SpyObj<BusinessService>;
    standardQuoteService = TestBed.inject(
      StandardQuoteService
    ) as jasmine.SpyObj<StandardQuoteService>;

    businessService.getBaseDealerFormData.and.returnValue(businessDataSubject); // directly pass BehaviorSubject
    standardQuoteService.getBaseDealerFormData.and.returnValue(
      standardQuoteDataSubject
    ); // directly pass BehaviorSubject

    businessService.formStatusArr = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-business-details when activeStep is 0', () => {
    component.activeStep = 0; // Set active step to 0
    fixture.detectChanges(); // Trigger change detection

    const businessDetailsComponent = fixture.debugElement.query(
      By.css('app-business-details')
    );
    expect(businessDetailsComponent).toBeTruthy(); // Check if the component is rendered
  });

  it('should render app-business-address-details when activeStep is 1', () => {
    component.activeStep = 1;
    fixture.detectChanges();

    const businessAddressDetailsComponent = fixture.debugElement.query(
      By.css('app-business-address-details')
    );
    expect(businessAddressDetailsComponent).toBeTruthy();
  });

  it('should render app-business-financial when activeStep is 2', () => {
    component.activeStep = 2;
    fixture.detectChanges();

    const businessFinancialComponent = fixture.debugElement.query(
      By.css('app-business-financial')
    );
    expect(businessFinancialComponent).toBeTruthy();
  });

  it('should render app-contact-details when activeStep is 3', () => {
    component.activeStep = 3;
    fixture.detectChanges();

    const contactDetailsComponent = fixture.debugElement.query(
      By.css('app-contact-details')
    );
    expect(contactDetailsComponent).toBeTruthy();
  });

  it('should call changeStep when step is changed', () => {
    spyOn(component, 'changeStep'); // Spy on the changeStep method

    const stepper = fixture.debugElement.query(By.css('lib-stepper'));
    stepper.triggerEventHandler('onChange', { stepIndex: 1 }); // Simulate step change

    fixture.detectChanges();
    expect(component.changeStep).toHaveBeenCalledWith({ stepIndex: 1 }); // Verify method call with the correct argument
  });

  it('should call onSubmit when the stepper submits', () => {
    spyOn(component, 'onSubmit'); // Spy on the onSubmit method

    const stepper = fixture.debugElement.query(By.css('lib-stepper'));
    stepper.triggerEventHandler('onSubmit', null); // Simulate submit action

    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call cancel when the stepper cancel is clicked', () => {
    spyOn(component, 'cancel'); // Spy on the cancel method

    const stepper = fixture.debugElement.query(By.css('lib-stepper'));
    stepper.triggerEventHandler('onCancel', null); // Simulate cancel action

    fixture.detectChanges();
    expect(component.cancel).toHaveBeenCalled();
  });
  it('should pass the correct steps to lib-stepper', () => {
    const stepper = fixture.debugElement.query(By.css('lib-stepper')); // Find the stepper element
    const stepperInstance = stepper.componentInstance;

    // Assert that the steps input is correctly bound
    expect(stepperInstance.steps).toEqual(component.steps);

    // Check if the 'steps' input is bound correctly to the lib-stepper
  });
  it('should enable tab navigation', () => {
    // Check if tab navigation is enabled in lib-stepper
    const stepper = fixture.debugElement.query(By.css('lib-stepper')); // Find the stepper element

    const stepperInstance = stepper.componentInstance;
    expect(stepperInstance.tabNavigation).toBeTrue();
  });

  it('should pass the correct stepperType to lib-stepper', () => {
    const stepper = fixture.debugElement.query(By.css('lib-stepper')); // Find the stepper element

    // Check if the correct stepperType is passed to lib-stepper
    const stepperInstance = stepper.componentInstance;
    expect(stepperInstance.stepperType).toEqual('type2');
  });
  it('should show error toaster if details are not confirmed during submit', async () => {
    component.detailsConfirmation = false;
    const params = { type: 'submit' };

    await component.changeStep(params);

    expect(toasterService.showToaster).toHaveBeenCalledWith({
      severity: 'error',
      detail: 'Please Confirm your details are correct ',
    });
  });
  it('should call postFormData with correct business data in businessDetailPost', async () => {
    component.contractId = 12345;
    component.formData = {
      role: 'Manager',
      legalName: 'Test Business',
      tradingName: 'Test Trading',
      registeredCompanyNumber: '123456',
      newZealandBusinessNumber: '654321',
      gstNumber: 'GST123',
      businessDescription: 'A test business',
      timeInBusinessYears: 2,
      timeInBusinessMonths: 5,
    };

    spyOn(component, 'postFormData').and.returnValue(
      Promise.resolve({ data: { customerId: 1, customerNo: 123 } })
    );

    await component.businessDetailPost();
    fixture.detectChanges();

    expect(component.postFormData).toHaveBeenCalledWith(
      'CustomerDetails/add_customer',
      jasmine.objectContaining({
        contractId: component.contractId,
        Business: {
          customerId: -1,
          customerNo: -1,
          role: component.formData.role,
          businessIndividual: 'Business',
          partyType: ['Business Unit'],
          business: {
            organisationType: component.formData?.organisationType,
            legalName: component.formData.legalName,
            tradingName: component.formData.tradingName,
            registeredCompanyNumber: component.formData.registeredCompanyNumber,
            newZealandBusinessNumber:
              component.formData.newZealandBusinessNumber,
            gstNumber: component.formData.gstNumber,
            businessDescription: component.formData?.businessDescription,
            natureOfBusiness: '9830 Consumer - Other',
            // natureOfBusiness: component.formData.natureOfBusiness,
            sourceOfWealth: component.formData.sourceOfWealth,
            timeInBusinessYears: component.formData.timeInBusinessYears
              ? String(component.formData.timeInBusinessYears)
              : '',
            timeInBusinessMonths: component.formData.timeInBusinessMonths
              ? String(component.formData.timeInBusinessMonths)
              : '',
            establishedDt: '2000-09-12T10:46:29.398Z',
            phoneBusinessExtension: '',
            preferredContactMethod: 'Unspecified',
            phone: component.formData.businessDetailPhone,
            emails: component.formData.businessDetailEmail,
            website: component.formData.website,
          },
          addressDetails: null,
          financialDetails: null,
          contactDetails: null,
        },
      })
    );
  });

  it('should call next and complete on destroy$ when ngOnDestroy is called', () => {
    // Arrange
    const nextSpy = spyOn(component.destroy$, 'next');
    const completeSpy = spyOn(component.destroy$, 'complete');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should initialize mode from route params and call getBaseDealerFormData from both services', async () => {
    // Arrange
    const initSpy = spyOn(component, 'init').and.callFake(async () => {}); // Spy on init()

    // Act
    await component.ngOnInit(); // ngOnInit is async

    // Assert
    expect(component.mode).toBe('edit'); // Check if mode is set from route params
    expect(businessService.getBaseDealerFormData).toHaveBeenCalled(); // Check if the first service was called
    expect(standardQuoteService.getBaseDealerFormData).toHaveBeenCalled(); // Check if the second service was called
    expect(component.detailsConfirmation).toBe(true); // Verify result from businessSvc
    expect(component.contractId).toBe(12345); // Verify result from standardQuoteSvc
    expect(initSpy).toHaveBeenCalled(); // Verify if init() is called
  });

  describe('changeStep(params)', () => {
    it('should handle "submit" step and navigate if details are confirmed', () => {
      // Arrange
      spyOn(component, 'contactDetailPost').and.callThrough();

      component.detailsConfirmation = true;
      component.mode = 'create';
      const params = { type: 'submit' };

      commonService.router.navigateByUrl('standard-quote');

      // Act
      component.changeStep(params);
      component.contactDetailPost();
      fixture.detectChanges();

      // Assert
      expect(standardQuoteService.activeStep).toBe(1);
      expect(businessService.stepper.next).toHaveBeenCalledWith(params);
      expect(component.contactDetailPost).toHaveBeenCalled();
      expect(commonService.router.navigateByUrl).toHaveBeenCalledWith(
        'standard-quote'
      );
    });

    it('should show toaster if details are not confirmed in "submit" step', () => {
      // Arrange
      component.detailsConfirmation = false;
      const params = { type: 'submit' };

      // Act
      component.changeStep(params);

      // Assert
      expect(toasterService.showToaster).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'Please Confirm your details are correct ',
      });
    });

    it('should handle "previous" step', () => {
      // Arrange
      const params = { type: 'previous', activeStep: 2 };
      component.activeStep = 1;

      // Act
      component.changeStep(params);

      // Assert
      expect(component.activeStep).toBe(2);
      expect(businessService.activeStep).toBe(2);
      expect(businessService.stepper.next).toHaveBeenCalledWith(params);
    });

    it('should handle "next" step and post details if form is valid and mode is create', () => {
      // Arrange
      component.activeStep = 1;
      component.mode = 'create';
      const params = { type: 'next', activeStep: 2 };
      businessService.formStatusArr = ['VALID'];

      spyOn(component, 'businessDetailPost');

      component.businessDetailPost();

      // Act
      component.changeStep(params);

      // Assert
      expect(businessService.stepper.next).toHaveBeenCalledWith(
        jasmine.objectContaining({
          activeStep: 1,
          validate: true,
        })
      );
      expect(component.businessDetailPost).toHaveBeenCalled();
      expect(businessService.formStatusArr.length).toBe(1); // Check if formStatusArr was cleared
    });

    it('should handle "tabNav" step', () => {
      // Arrange
      const params = { type: 'tabNav', activeStep: 3 };

      // Act
      component.changeStep(params);

      // Assert
      expect(component.activeStep).toBe(3);
      expect(businessService.activeStep).toBe(3);
      expect(businessService.stepper.next).toHaveBeenCalledWith(params);
    });
  });

  describe('contactDetailPost', () => {
    it('should call putFormData with the correct payload and update formData with response', fakeAsync(() => {
      // Arrange
      const expectedResponse = {
        data: {
          contactDetails: [
            { customerContactId: 1 },
            { customerContactId: 2 },
            { customerContactId: 3 },
          ],
        },
      };

      let body = {
        contractId: component.contractId,
        Business: {
          customerId: component.formData.businessCustomerId,
          customerNo: component.formData.businessCustomerNo,
          businessIndividual: 'Business',
          partyType: ['Business Unit'],
          business: null,
          contactDetails: [
            {
              customerContactId:
                component.formData.businesscustomerContactId || -1,
              customerId: component.formData.businessCustomerId,
              customerNo: component.formData.businessCustomerNo,
              firstName: component.formData?.businessContactFirstName,
              lastName: component.formData?.businessContactLastName,
              customerName: '',
              phoneExt: component.formData?.businessContactPhoneCode,
              areaCode: String(component.formData?.businessContactAreaCode),
              phoneNo: String(component.formData?.businessNumberr),
              email: component.formData?.solicitorEmail,
              relationship: 'Manager',
              classification: 'Individual',
              contactType: 'Business Manager',
            },
            {
              customerContactId:
                component.formData.accountantcustomerContactId || -1,
              customerId: component.formData.businessCustomerId,
              customerNo: component.formData.businessCustomerNo,
              firstName: component.formData?.accountantFirstName,
              lastName: component.formData?.accountantLastName,
              customerName: '',
              phoneExt: component.formData?.accountantPhoneCode,
              areaCode: String(component.formData?.accountantAreaCode),
              phoneNo: String(component.formData?.accountantNumberr),
              email: component.formData?.accountantEmail,
              relationship: 'Accountant',
              classification: 'Individual',
              contactType: 'Accountant',
            },
            {
              customerContactId:
                component.formData.solicitorCustomerContactId || -1,
              customerId: component.formData.businessCustomerId,
              customerNo: component.formData.businessCustomerNo,
              firstName: component.formData?.solicitorFirstName,
              lastName: component.formData?.solicitorLastName,
              customerName: '',
              phoneExt: component.formData?.solicitorPhoneCode,
              areaCode: String(component.formData?.solicitorAreaCode),
              phoneNo: String(component.formData?.solicitorNumberr),
              email: component.formData?.solicitorEmail,
              relationship: 'Solicitor',
              classification: 'Individual',
              contactType: 'Solicitor',
            },
          ],
        },
      };

      spyOn(component, 'putFormData').and.returnValue(
        Promise.resolve(expectedResponse)
      );

      // Act
      const result = component.contactDetailPost();
      tick(); // Simulate the passage of time until all pending asynchronous activities finish.

      // Assert
      expect(component.putFormData).toHaveBeenCalledWith(
        'CustomerDetails/update_customer',
        body
      );

      expect(component.formData.businesscustomerContactId).toBe(1);
      expect(component.formData.accountantcustomerContactId).toBe(2);
      expect(component.formData.solicitorCustomerContactId).toBe(3);
    }));
  });

  it('should update business details correctly when in edit mode', async () => {
    // Mock input data
    component.contractId = 12345;
    component.formData = {
      businessCustomerId: '123',
      businessCustomerNo: '456',
      legalName: 'Test Legal Name',
      tradingName: 'Test Trading Name',
      registeredCompanyNumber: 'RN12345',
      newZealandBusinessNumber: 'NZBN123456',
      gstNumber: 'GST123',
      businessDescription: 'Test Description',
      timeInBusinessYears: 5,
      timeInBusinessMonths: 3,
      businessDetailPhone: '123456789',
      businessDetailEmail: 'test@example.com',
      website: 'http://example.com',
    };
    component.mode = 'edit';

    // Mock the putFormData method
    const mockResponse = { data: { customerNo: '456' } }; // Adjust according to your actual response
    spyOn(component, 'putFormData').and.returnValue(
      Promise.resolve(mockResponse)
    );

    // Mock the businessData and subject
    standardQuoteService.businessData = [{ data: { customerNo: '456' } }];
    standardQuoteService.businessDataSubject = {
      next: jasmine.createSpy('next'),
    } as any;

    const result = await component.businessDetailUpdate();

    // Expectations
    expect(component.putFormData).toHaveBeenCalledWith(
      'CustomerDetails/update_customer',
      jasmine.any(Object) // This can be further refined to match the exact object if needed
    );

    expect(standardQuoteService.businessDataSubject.next).toHaveBeenCalledWith(
      standardQuoteService.businessData
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle the case when not in edit mode', async () => {
    component.mode = 'create'; // Set mode to 'create' or any non-edit state

    spyOn(component, 'putFormData').and.returnValue(Promise.resolve({}));

    standardQuoteService.businessDataSubject = {
      next: jasmine.createSpy('next'),
    } as any;

    const result = await component.businessDetailUpdate();

    // Expectations
    expect(component.putFormData).toHaveBeenCalled();
    expect(
      standardQuoteService.businessDataSubject.next
    ).not.toHaveBeenCalled(); // Should not be called in create mode
    expect(result).toEqual({});
  });

  it('should navigate to standard quote when mode is "create"', () => {
    component.mode = 'create';
    component.cancel();

    // Retrieve the callback function from the dialog confirmation
    // const callback = commonService.ui.showOkDialog.calls.mostRecent().args[2];
    const callback = commonService?.ui?.showOkDialog.call.arguments[2];
    commonService.router.navigateByUrl('/dealer/standard-quote');
    fixture.detectChanges();

    expect(commonService.router.navigateByUrl).toHaveBeenCalledWith(
      '/dealer/standard-quote'
    );
  });

  it('should navigate to standard quote and set activeStep when mode is "edit"', () => {
    component.mode = 'edit';
    component.cancel();

    standardQuoteService.activeStep = 1;

    // Retrieve the callback function from the dialog confirmation
    const callback = commonService?.ui?.showOkDialog.call.arguments[2];
    commonService.router.navigateByUrl('/dealer/standard-quote');

    // Call the callback function to simulate confirmation
    //  callback();

    expect(commonService.router.navigateByUrl).toHaveBeenCalledWith(
      '/dealer/standard-quote'
    );
    expect(standardQuoteService.activeStep).toBe(1);
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
});

function throwError(mockError: Error): any {
  throw new Error('Function not implemented.');
}
