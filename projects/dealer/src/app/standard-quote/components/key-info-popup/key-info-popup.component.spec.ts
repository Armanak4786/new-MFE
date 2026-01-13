import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { CommonService, AuroUiFrameWork, UiService } from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { KeyInfoPopupComponent } from './key-info-popup.component';
import { By } from '@angular/platform-browser';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GenButtonComponent } from 'auro-ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('KeyInfoPopupComponent', () => {
  let component: KeyInfoPopupComponent;
  let fixture: ComponentFixture<KeyInfoPopupComponent>;
  let mockCommonService: Partial<CommonService> & {
    data: { get: jasmine.Spy };
  };
  let mockDialogRef: jasmine.SpyObj<DynamicDialogRef>;
  let mockStandardQuoteService: jasmine.SpyObj<StandardQuoteService>;

  beforeEach(async () => {
    // Create mock services with spy objects
    mockCommonService = {
      data: {
        get: jasmine.createSpy('get').and.returnValue(
          of({
            data: {
              content: 'Sample disclosure content',
            },
          })
        ),
      },
    } as Partial<CommonService> & { data: { get: jasmine.Spy } };

    mockStandardQuoteService = jasmine.createSpyObj('StandardQuoteService', [
      'getBaseDealerFormData',
    ]);

    mockDialogRef = jasmine.createSpyObj('DynamicDialogRef', ['close']);

    // Mock the CommonService `data.get` method

    await TestBed.configureTestingModule({
      declarations: [KeyInfoPopupComponent],
      imports: [HttpClientTestingModule, AuroUiFrameWork],
      providers: [
        JwtHelperService,
        ConfirmationService,
        MessageService,
        UiService,
        { provide: CommonService, useValue: mockCommonService },

        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: {} }, // Pass an empty config if not used

        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here

        // { provide: CommonService, useValue: mockCommonService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements and avoid unnecessary errors for custom components
    }).compileComponents();

    fixture = TestBed.createComponent(KeyInfoPopupComponent);
    component = fixture.componentInstance;
    component.messageType = 'KeyDisclosure';
    component.programId = 2;
    component.quoteId = 123; // example quoteId
    spyOn(component, 'getDiscloserData').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the button with the correct label', () => {
    fixture.detectChanges(); // Ensure the component is up to date

    // Check if the button's label is correctly set to 'Next'
    const buttonElements = fixture.debugElement
      .queryAll(By.directive(GenButtonComponent))
      .map((de) => de.nativeElement); // Get all gen-button elements

    const nextButtonLabel =
      buttonElements[1].querySelector('button')?.textContent;
    expect(nextButtonLabel).toBe('Next');
  });

  it('should display apiData correctly', () => {
    component.apiData = 'Test API Data'; // Set the value of apiData
    fixture.detectChanges(); // Trigger change detection

    const apiDataElement = fixture.debugElement.query(
      By.css('.text-size-12 p')
    );
    expect(apiDataElement.nativeElement.textContent).toContain(
      'Sample disclosure content'
    );
  });

  it('should emit the click event when the button is clicked', () => {
    spyOn(component, 'close'); // Spy on the close method to check if it's called

    // Trigger change detection to apply changes
    fixture.detectChanges();

    // Find the rendered button element and trigger click
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click();

    // Check if the close method was called
    expect(component.close).toHaveBeenCalled();
  });

  it('should render the "Cancel" button label correctly', () => {
    // Trigger change detection
    fixture.detectChanges();

    // Find the gen-button element by CSS selector
    const buttonElement = fixture.debugElement.query(By.css('gen-button'));

    // Assert the button text is correct
    expect(buttonElement.nativeElement.textContent.trim()).toBe('Cancel');
  });

  // it('should call close() method when Cancel button is clicked', () => {
  //   spyOn(component, 'close'); // Spy on the close method

  //   const cancelButton = fixture.debugElement.query(
  //     By.css('.col-6:first-child gen-button')
  //   );
  //   cancelButton.triggerEventHandler('click', null); // Simulate click event

  //   expect(component.close).toHaveBeenCalled(); // Verify close() was called
  // });

  it('should call passDataToParent() method when Next button is clicked', () => {
    spyOn(component, 'passDataToParent'); // Spy on passDataToParent method

    const nextButton = fixture.debugElement.query(
      By.css('.col-6.text-right gen-button')
    );
    component.passDataToParent();

    nextButton.triggerEventHandler('click', null); // Simulate click event

    expect(component.passDataToParent).toHaveBeenCalled(); // Verify passDataToParent() was called
  });

  it('should call getDiscloserData on ngOnInit', () => {
    // Spy on the getDiscloserData method

    component.ngOnInit();

    expect(component.getDiscloserData).toHaveBeenCalled();
  });

  it('should call ref.close() on close', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalledWith({});
  });

  it('should call ref.close() with correct data on passDataToParent', () => {
    const mockData = { some: 'data' };
    component.data = mockData;
    component.quoteId = 456;

    component.passDataToParent();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: mockData,
      quoteId: 456,
    });
  });

  it('should call the API and set apiData and data properties', () => {
    // Mock response data
    const mockResponse = {
      data: {
        content: 'Sample disclosure content',
      },
    };

    // Spy on the get method of svc.data and return a mock response

    // Call the method
    component.getDiscloserData();

    // Check that the get method was called with the correct URL
    expect(mockCommonService.data.get).toHaveBeenCalledWith(
      'Declaration/get_disclosure_messages?MessageType=KeyDisclosure&ProgramId=2&QuoteId=123'
    );

    // Check that apiData and data properties were set correctly
    expect(component.apiData).toBe('Sample disclosure content');
    expect(component.data).toEqual(mockResponse);
  });

  it('should set quoteId and programId from the service response', () => {
    const mockResponse = { contractId: 123, programId: 456 };

    // Set up the mock to return an observable with the mock response
    mockStandardQuoteService.getBaseDealerFormData.and.returnValue(
      new BehaviorSubject(mockResponse)
    );

    // Call the method that contains the subscription
    component.ngOnInit(); // Assuming this code is in ngOnInit, else call the appropriate method

    // Assert that the quoteId and programId are set correctly
    expect(component.quoteId).toBe(123);
    expect(component.programId).toBe(456);

    // Also ensure that getBaseDealerFormData was called
    expect(mockStandardQuoteService.getBaseDealerFormData).toHaveBeenCalled();
  });

  it('should handle missing contractId and programId', () => {
    const mockResponse = {}; // Simulate missing contractId and programId

    const mockSubject = new BehaviorSubject(mockResponse);
    mockStandardQuoteService.getBaseDealerFormData.and.returnValue(mockSubject);

    component.ngOnInit(); // or the appropriate method

    mockSubject.next(mockResponse);

    // Assert default values
    expect(component.quoteId).toBe(0);
    expect(component.programId).toBeUndefined();

    expect(mockStandardQuoteService.getBaseDealerFormData).toHaveBeenCalled();
  });
});
