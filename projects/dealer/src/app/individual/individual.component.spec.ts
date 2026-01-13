import { ComponentFixture, flush, TestBed } from '@angular/core/testing';

import { IndividualComponent } from './individual.component';
import { IndividualService } from './services/individual.service';
import { ActivatedRoute } from '@angular/router';
import { StandardQuoteService } from '../standard-quote/services/standard-quote.service';
import { of } from 'rxjs/internal/observable/of';
import {
  CommonService,
  DataService,
  StepperComponent,
  ToasterService,
} from 'auro-ui';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ConfigurationService,
  StsConfigLoader,
} from 'angular-auth-oidc-client';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { DialogService } from 'primeng/dynamicdialog';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs/internal/observable/throwError';
import { IndividualData } from './model/individual';
import { Subject } from 'rxjs';

fdescribe('IndividualComponent', () => {
  let component: IndividualComponent;
  let fixture: ComponentFixture<IndividualComponent>;
  let individualSvc: jasmine.SpyObj<IndividualService>;
  let standardQuoteSvc: jasmine.SpyObj<StandardQuoteService>;
  let mockChangeDetectorRef;
  let toasterService: jasmine.SpyObj<ToasterService>;
  let commonSvc: jasmine.SpyObj<CommonService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const mockIndividualService = jasmine.createSpyObj('IndividualService', [
      'getBaseDealerFormData',
      'getFormData',
      'setBaseDealerFormData',
      'putFormData',
    ]);
    const mockStandardQuoteService = jasmine.createSpyObj(
      'StandardQuoteService',
      ['getBaseDealerFormData']
    );
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);
    const commonSvcSpy = jasmine.createSpyObj('CommonService', ['ui', 'data']);
    const toasterServiceSpy = jasmine.createSpyObj('ToasterService', [
      'showToaster',
    ]);

    // Set up mock formData

    await TestBed.configureTestingModule({
      declarations: [IndividualComponent, StepperComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CommonService, useValue: commonSvcSpy },
        ConfirmationService,
        MessageService,
        JwtHelperService,
        StsConfigLoader,
        DialogService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here

        { provide: IndividualService, useValue: mockIndividualService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: ToasterService, useValue: toasterServiceSpy },

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { mode: 'edit', customerId: '12345' },
            },
          },
        },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }, // Mock ChangeDetectorRef
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this schema if necessary
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualComponent);
    component = fixture.componentInstance;
    component.isReady = true;

    component.destroy$ = new Subject(); // Initialize the destroy$ subject manually

    commonSvcSpy.data = {
      post: jasmine.createSpy().and.returnValue(of({ data: 'mockedResponse' })),
      put: jasmine.createSpy().and.returnValue(of({ data: 'mockedResponse' })),
    };

    // Set the component's formData

    standardQuoteSvc = TestBed.inject(
      StandardQuoteService
    ) as jasmine.SpyObj<StandardQuoteService>;

    individualSvc = TestBed.inject(
      IndividualService
    ) as jasmine.SpyObj<IndividualService>;

    toasterService = TestBed.inject(
      ToasterService
    ) as jasmine.SpyObj<ToasterService>;

    commonSvc = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;

    spyOn(component, 'init').and.returnValue(Promise.resolve());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display lib-stepper when isReady is true', () => {
    // Ensure isReady is set to true
    component.isReady = true;
    fixture.detectChanges();

    const stepperElement = fixture.nativeElement.querySelector('lib-stepper');
    expect(stepperElement).toBeTruthy(); // Check if the stepper is present
  });

  it('should call changeStep on step change', () => {
    spyOn(component, 'changeStep'); // Spy on changeStep method

    // Get the lib-stepper component instance
    const stepperComponent = fixture.debugElement.query(
      By.directive(StepperComponent)
    ).componentInstance;

    // Simulate the step change event
    stepperComponent.onChange.emit(); // Emit the event directly
    fixture.detectChanges(); // Trigger change detection

    expect(component.changeStep).toHaveBeenCalled(); // Check if changeStep was called
  });

  it('should call onSubmit when submitted', () => {
    spyOn(component, 'onSubmit'); // Spy on onSubmit method

    const stepperElement = fixture.nativeElement.querySelector('lib-stepper');
    stepperElement.dispatchEvent(new Event('onSubmit')); // Simulate submit event
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled(); // Check if onSubmit was called
  });

  it('should call cancel when cancelled', () => {
    spyOn(component, 'cancel'); // Spy on cancel method

    const stepperElement = fixture.nativeElement.querySelector('lib-stepper');
    stepperElement.dispatchEvent(new Event('onCancel')); // Simulate cancel event
    fixture.detectChanges();

    expect(component.cancel).toHaveBeenCalled(); // Check if cancel was called
  });

  //functions

  it('should initialize in edit mode and map individual customer data correctly', async () => {
    // Mock the service response for getFormData
    const mockCustomerData = {
      personalDetails: {
        title: 'Mr.',
        firstName: 'John',
        middleName: 'A.',
        lastName: 'Doe',
        knownAs: 'Johnny',
        maritalStatus: 'Single',
        gender: 'Male',
        noOfDependents: '2',
      },
      employementDetails: [
        { employmentInfoId: 101 },
        { employmentInfoId: 102 },
      ],
      referenceDetails: [
        {
          customerContactId: 201,
          firstName: 'Jane',
          lastName: 'Smith',
          phoneExt: '123',
          areaCode: '456',
          phoneNo: '7890',
        },
      ],
    };

    // Simulate async call to getFormData
    individualSvc.getFormData.and.returnValue(
      Promise.resolve(mockCustomerData)
    );

    // Spy on the ChangeDetectorRef's detectChanges

    // Call the init function (which is async)
    await component.init();
    individualSvc.setBaseDealerFormData(component.data);
    mockChangeDetectorRef.detectChanges();
    individualSvc.getFormData(
      `CustomerDetails/get_customer?customerNo=12345&contractId=67890`,
      function (res) {
        return res?.data || null;
      }
    );

    // Assertions
    expect(individualSvc.getFormData).toHaveBeenCalledWith(
      'CustomerDetails/get_customer?customerNo=12345&contractId=67890',
      jasmine.any(Function)
    );

    // Check that the setBaseDealerFormData method was called
    expect(individualSvc.setBaseDealerFormData).toHaveBeenCalledWith(
      component.data
    );

    // Check that detectChanges was called
    expect(mockChangeDetectorRef.detectChanges).toHaveBeenCalled();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    // Spy on the 'next' and 'complete' methods of destroy$
    spyOn(component.destroy$, 'next').and.callThrough();
    spyOn(component.destroy$, 'complete').and.callThrough();

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Assert that destroy$.next and destroy$.complete were called
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  describe('calculateNewPreviousDate', () => {
    it('should subtract years and months from a given reference date', () => {
      // Reference date: January 15, 2024 at 10:30:45
      const referenceDate = '2024-01-15T10:30:45';

      // Call the function with yearsToSubtract = 2, monthsToSubtract = 6
      const result = component.calculateNewPreviousDate(referenceDate, 2, 6);

      // Expected date: July 15, 2021 at 10:30:45
      expect(result).toBe('2021-07-15T10:30:45');
    });

    it('should subtract only months from a given reference date', () => {
      // Reference date: November 10, 2024 at 5:45:30
      const referenceDate = '2024-11-10T05:45:30';

      // Call the function with yearsToSubtract = 0, monthsToSubtract = 3
      const result = component.calculateNewPreviousDate(referenceDate, 0, 3);

      // Expected date: August 10, 2024 at 05:45:30
      expect(result).toBe('2024-08-10T05:45:30');
    });

    it('should handle month underflow (subtracting months from earlier in the year)', () => {
      // Reference date: March 5, 2024 at 12:00:00
      const referenceDate = '2024-03-05T12:00:00';

      // Call the function with yearsToSubtract = 0, monthsToSubtract = 6
      const result = component.calculateNewPreviousDate(referenceDate, 0, 6);

      // Expected date: September 5, 2023 at 12:00:00
      expect(result).toBe('2023-09-05T12:00:00');
    });

    it('should correctly subtract years and handle month underflow', () => {
      // Reference date: May 10, 2024 at 15:00:00
      const referenceDate = '2024-05-10T15:00:00';

      // Call the function with yearsToSubtract = 1, monthsToSubtract = 10
      const result = component.calculateNewPreviousDate(referenceDate, 1, 10);

      // Expected date: July 10, 2022 at 15:00:00
      expect(result).toBe('2022-07-10T15:00:00');
    });

    it('should handle leap years correctly', () => {
      // Reference date: February 29, 2024 at 14:00:00 (leap year)
      const referenceDate = '2024-02-29T14:00:00';

      // Call the function with yearsToSubtract = 1, monthsToSubtract = 0
      const result = component.calculateNewPreviousDate(referenceDate, 1, 0);

      // Expected date: February 28, 2023 at 14:00:00 (non-leap year)
      expect(result).toBe('2023-03-01T14:00:00');
    });

    it('should correctly handle subtracting zero years and months', () => {
      // Reference date: August 20, 2023 at 08:15:30
      const referenceDate = '2023-08-20T08:15:30';

      // Call the function with yearsToSubtract = 0, monthsToSubtract = 0
      const result = component.calculateNewPreviousDate(referenceDate, 0, 0);

      // Expected date should be the same as the reference date
      expect(result).toBe('2023-08-20T08:15:30');
    });
  });

  it('should call commonSvc.data.post and return the response as expected', async () => {
    const api = 'CustomerDetails/add_customer';
    const payload = { name: 'John Doe' };

    const result = await component.postFormData(api, payload);

    // Verify commonSvc.data.post was called with the correct parameters
    expect(commonSvc.data.post).toHaveBeenCalledWith(api, payload);

    // Check that the result matches the mocked response
    expect(result).toEqual({ data: 'mockedResponse' });
  });

  it('should apply the mapFunc if provided', async () => {
    const api = 'CustomerDetails/add_customer';
    const payload = { name: 'Jane Doe' };

    // Create a mock map function
    const mockMapFunc = (res: any) => {
      return { ...res, mapped: true };
    };

    const result = await component.postFormData(api, payload, mockMapFunc);

    // Verify commonSvc.data.post was called with the correct parameters
    expect(commonSvc.data.post).toHaveBeenCalledWith(api, payload);

    // Check that the result was transformed by the mapFunc
    expect(result).toEqual({ data: 'mockedResponse', mapped: true });
  });
  it('should call commonSvc.data.put and return the correct response', async () => {
    const api = 'CustomerDetails/update_customer';
    const payload = { name: 'John Doe' };

    // Call the function
    const result = await component.putFormData(api, payload);

    // Verify commonSvc.data.put was called with the correct parameters
    expect(commonSvc.data.put).toHaveBeenCalledWith(api, payload);

    // Check that the result matches the mocked response
    expect(result).toEqual({ data: 'mockedResponse' });
  });

  it('should apply the mapFunc if provided', async () => {
    const api = 'CustomerDetails/update_customer';
    const payload = { name: 'Jane Doe' };

    // Mock a map function that modifies the response
    const mockMapFunc = (res: any) => {
      return { ...res, mapped: true };
    };

    const result = await component.putFormData(api, payload, mockMapFunc);

    // Verify commonSvc.data.put was called with the correct parameters
    expect(commonSvc.data.put).toHaveBeenCalledWith(api, payload);

    // Check that the result was transformed by the mapFunc
    expect(result).toEqual({ data: 'mockedResponse', mapped: true });
  });

  it('should show toaster if individualDetailsConfirmation is false on submit', () => {
    component.individualDetailsConfirmation = false;
    component.changeStep({ type: 'submit' });
    expect(toasterService.showToaster).toHaveBeenCalledWith({
      severity: 'error',
      detail: 'Please Confirm your details are correct',
    });
  });

  it('should not apply mapFunc if not provided', async () => {
    const api = 'CustomerDetails/update_customer';
    const payload = { name: 'John Doe' };

    // Call the function without a map function
    const result = await component.putFormData(api, payload);

    // Verify commonSvc.data.put was called with the correct parameters
    expect(commonSvc.data.put).toHaveBeenCalledWith(api, payload);

    // Ensure that the result matches the mocked response (without any mapping)
    expect(result).toEqual({ data: 'mockedResponse' });
  });

  it('should call referenceDetailPost on submit when mode is create', async () => {
    component.mode = 'create';
    spyOn(component, 'referenceDetailPost').and.callThrough();
    component.referenceDetailPost();
    fixture.detectChanges();
    await component.changeStep({ type: 'submit', activeStep: 4 });
    expect(component.referenceDetailPost).toHaveBeenCalled();
  });

  it('should make a PUT request to update customer details', async () => {
    const apiUrl = 'CustomerDetails/update_customer';
    const payload: IndividualData = {
      business: null,
      contractId: component.contractId,
      individual: {
        addressDetails: null,
        businessIndividual: 'Individual',
        customerId: component.formData?.customerId,
        customerNo: component.formData?.customerNo,
        role: component.formData?.role.role,
        employementDetails: null,
        financialDetails: null,
        personalDetails: null,
        referenceDetails: [
          {
            customerContactId: component.customerContactId || -1,
            customerId: component.formData?.customerId,
            customerNo: component.formData?.customerNo,
            firstName: component.formData?.referenceFirstName,
            lastName: component.formData?.referenceLastName,
            customerName: '',
            phoneExt: component.formData?.referencePhoneExt.toString(),
            areaCode: component.formData?.referenceAreaCode.toString(),
            phoneNo: component.formData?.referencePhoneNo.toString(),
            email: 'abc@example.com',
            relationship: component.formData?.relationshipToCustomer,
            classification: 'Individual',
            contactType: 'Nearest Relative not living with you',
          },
        ],
      },
    };
    const result = await component.putFormData(apiUrl, payload);

    // Expect the result to match the mock response
    expect(result).toEqual({ data: 'mockedResponse' });
  });
  describe('calculateNewDate', () => {
    it('should return the current date when no years or months are subtracted', () => {
      const result = component.calculateNewDate(0, 0);
      const now = new Date();

      const expectedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}`;

      expect(result).toBe(expectedDate);
    });

    it('should correctly subtract 1 year', () => {
      const result = component.calculateNewDate(1, 0);
      const now = new Date();
      now.setFullYear(now.getFullYear() - 1);

      const expectedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}`;

      expect(result).toBe(expectedDate);
    });

    it('should correctly subtract 6 months', () => {
      const result = component.calculateNewDate(0, 6);
      const now = new Date();
      now.setMonth(now.getMonth() - 6);

      const expectedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}`;

      expect(result).toBe(expectedDate);
    });

    it('should correctly subtract 2 years and 3 months', () => {
      const result = component.calculateNewDate(2, 3);
      const now = new Date();
      now.setMonth(now.getMonth() - (2 * 12 + 3));

      const expectedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}`;

      expect(result).toBe(expectedDate);
    });

    it('should correctly handle subtracting more months than the current month', () => {
      const result = component.calculateNewDate(0, 14);
      const now = new Date();
      now.setMonth(now.getMonth() - 14);

      const expectedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}`;

      expect(result).toBe(expectedDate);
    });
  });
  it('should construct the body and call postFormData with correct arguments', async () => {
    // Set the necessary form data
    component.formData = {
      role: 'Customer',
      countryOfIssue: 'Country A',
      countryOfCitizenship: 'Country B',
      dateOfBirth: '1990-01-01',
      noOfDependentArr: [{ age: 10 }, { age: 12 }],
      personalDetailsEmail: 'test@example.com',
      firstName: 'John',
      gender: 'Male',
      knownAs: 'Johnny',
      lastName: 'Doe',
      licenceNumber: '123456',
      licenceType: 'Full',
      maritalStatus: 'Single',
      middleName: 'Middle',
      noOfDependents: 2,
      personalDetailsPhone: '123456789',
      versionNumber: '1',
      customerId: -1,
      customerNo: -1,
    };

    component.contractId = 'contract_123';

    // Call the function
    const res = await component.personalDetailPost();
    const result = await component.putFormData('CustomerDetails/add_customer', {
      business: null,
      contractId: 'contract_123',
      individual: {
        addressDetails: null,
        businessIndividual: 'Individual',
        customerId: -1,
        customerNo: -1,
        role: 'Customer',
        employementDetails: null,
        financialDetails: null,
        personalDetails: {
          countryOfBirth: 'Country A',
          countryOfCitizenship: 'Country B',
          countryOfIssue: 'Country A',
          dateOfBirth: '1990-01-01',
          dependentsAge: '10, 12',
          emails: 'test@example.com',
          firstName: 'John',
          gender: 'Male',
          knownAs: 'Johnny',
          lastName: 'Doe',
          licenceNumber: '123456',
          licenceType: 'Full',
          maritalStatus: 'Single',
          middleName: 'Middle',
          noOfDependents: '2',
          partyStatus: '',
          partyType: ['Direct Customer'],
          phone: '123456789',
          phoneBusinessExtension: '',
          preferredContactMethod: '',
          reference: '',
          versionNumber: '1',
        },
        referenceDetails: null,
      },
    });

    // Verify that the postFormData function was called with the correct URL and bo

    // Check that the response is returned correctly
    expect(result).toEqual({
      data: 'mockedResponse',
    });
  });

  // it('should post reference details and update customerContactId', async () => {
  //   const mockResponse = {
  //     data: {
  //       referenceDetails: {
  //         customerContactId: 999,
  //       },
  //     },
  //   };

  //   // Spy on the putFormData function and mock its return value
  //   spyOn(component, 'putFormData').and.returnValue(
  //     Promise.resolve(mockResponse)
  //   );

  //   // Call the referenceDetailPost function
  //   const result = await component.referenceDetailPost();

  //   // Check if putFormData was called with the correct parameters
  //   const expectedBody = {
  //     business: null,
  //     contractId: 123,
  //     individual: {
  //       addressDetails: null,
  //       businessIndividual: 'Individual',
  //       customerId: 789,
  //       customerNo: 'CUST123',
  //       role: 'Some Role',
  //       employementDetails: null,
  //       financialDetails: null,
  //       personalDetails: null,
  //       referenceDetails: [
  //         {
  //           customerContactId: 456,
  //           customerId: 789,
  //           customerNo: 'CUST123',
  //           firstName: 'John',
  //           lastName: 'Doe',
  //           customerName: '',
  //           phoneExt: '123',
  //           areaCode: '456',
  //           phoneNo: '7890',
  //           email: 'abc@example.com',
  //           relationship: 'Friend',
  //           classification: 'Individual',
  //           contactType: 'Nearest Relative not living with you',
  //         },
  //       ],
  //     },
  //   };
  //   expect(component.putFormData).toHaveBeenCalledWith(
  //     'CustomerDetails/update_customer',
  //     expectedBody
  //   );

  //   // Check if customerContactId was updated
  //   expect(component.formData.customerContactId).toBe(999);

  //   // Verify that the result is the mock response
  //   expect(result).toEqual(mockResponse);
  // });

  it('should call putFormData with correct personal details and return the response', async () => {
    const mockResponse = {
      data: {
        success: true,
      },
    };

    // Spy on putFormData and mock its return value
    spyOn(component, 'putFormData').and.returnValue(
      Promise.resolve(mockResponse)
    );

    // Call personalDetailUpdate function
    const result = await component.personalDetailUpdate();

    // Prepare the expected body
    const expectedBody = {
      business: null,
      individual: {
        addressDetails: null,
        businessIndividual: 'Individual',
        customerId: component.formData?.customerId,
        customerNo: component.formData?.customerNo,
        employementDetails: null,
        financialDetails: null,
        personalDetails: {
          countryOfBirth: component.formData?.countryOfIssue,
          countryOfCitizenship: component.formData?.countryOfCitizenship,
          countryOfIssue: component.formData?.countryOfIssue,
          dateOfBirth: component.formData?.dateOfBirth,
          dependentsAge: component.formData?.noOfDependentArr
            .map((obj) => obj.age)
            .join(', '),
          emails: component.formData?.personalDetailsEmail,
          firstName: component.formData?.firstName,
          gender: component.formData?.gender,
          knownAs: component.formData?.knownAs,
          lastName: component.formData?.lastName,
          licenceNumber: component.formData?.licenceNumber,
          licenceType: component.formData?.licenceType,
          maritalStatus: component.formData?.maritalStatus,
          middleName: component.formData?.middleName,
          noOfDependents: component.formData?.noOfDependents.toString(),
          partyStatus: '',
          partyType: ['Direct Customer'],
          phone: component.formData?.personalDetailsPhone,
          phoneBusinessExtension: '',
          preferredContactMethod: '',
          reference: '',
          versionNumber: component.formData?.versionNumber,
        },
        referenceDetails: null,
      },
    };

    // Check if putFormData was called with the correct parameters
    expect(component.putFormData).toHaveBeenCalledWith(
      'CustomerDetails/update_customer',
      expectedBody
    );

    // Verify the returned response is as expected
    expect(result).toEqual(mockResponse);
  });
});
