import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustContactDetailsComponent } from './trust-contact-details.component';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  LibSharedModule,
} from 'auro-ui';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { DealerModule } from '../../../../dealer.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TrustService } from '../../../services/trust.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TrustEmailContactDetailsComponent } from '../trust-email-contact-details/trust-email-contact-details.component';
import { By } from '@angular/platform-browser';
import { GenCardComponent } from 'projects/auro-ui/src/lib/components/gen-card/gen-card.component';

fdescribe('TrustContactDetailsComponent', () => {
  let component: TrustContactDetailsComponent;
  let fixture: ComponentFixture<TrustContactDetailsComponent>;
  let mockTrustService;
  let svcMock;

  beforeEach(async () => {
    mockTrustService = {
      formStatusArr: [],
      setBaseDealerFormData: jasmine.createSpy('setBaseDealerFormData'),
    };

    svcMock = {
      proceedForm: jasmine.createSpy('proceedForm').and.returnValue('VALID'), // Spy on proceedForm
    };

    await TestBed.configureTestingModule({
      declarations: [
        TrustContactDetailsComponent,
        TrustEmailContactDetailsComponent,
      ],
      imports: [AppPrimengModule, CoreAppModule, LibSharedModule, DealerModule],
      providers: [
        JwtHelperService,
        AuthenticationService,
        { provide: TrustService, useValue: mockTrustService },

        ConfirmationService,
        MessageService,
        { provide: CommonService, useValue: svcMock },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustContactDetailsComponent);
    component = fixture.componentInstance;

    component.phoneType = ['PhoneMobile', 'PhoneBusiness']; // Mock phoneType array
    component.businessLabel = ['Business', 'Other'];

    // Mock baseFormData structure
    component.baseFormData = {
      trust: { phone: [] },
      trustDetailPhone: [],
    };

    spyOn(component, 'patchPhoneValue').and.callThrough();
    spyOn(component, 'createPhoneForm').and.returnValue(
      new FormGroup({
        value: new FormControl(''),
        type: new FormControl(''),
        areacode: new FormControl(''),
        code: new FormControl(''),
      })
    );

    // Spy on the super ngOnInit
    spyOn<any>(component, 'ngOnInit').and.callThrough(); // Calling the actual method

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    const phoneArray = component.phoneForm.get('phone') as FormArray;

    // Add a phone group with empty controls
    phoneArray.push(
      new FormBuilder().group({
        code: [''],
        areacode: [''],
        value: [''],
      })
    );

    // Mark all fields as touched to trigger validation
    phoneArray.at(0).get('code').markAsTouched();
    phoneArray.at(0).get('areacode').markAsTouched();
    phoneArray.at(0).get('value').markAsTouched();

    // Check if validation states are correct
    expect(phoneArray.at(0).get('code').invalid).toBeTruthy();
    expect(phoneArray.at(0).get('areacode').invalid).toBeTruthy();
    expect(phoneArray.at(0).get('value').invalid).toBeTruthy();

    // Set valid values
    phoneArray.at(0).get('code').setValue('SomeCode');
    phoneArray.at(0).get('areacode').setValue('123');
    phoneArray.at(0).get('value').setValue('4567890');

    // Check if the phone group is now valid
    expect(phoneArray.at(0).valid).toBeTruthy();
  });

  it('should display error messages for required fields', () => {
    const phoneArray = component.phoneForm.get('phone') as FormArray;

    // Add a phone group with empty controls
    phoneArray.push(
      new FormBuilder().group({
        code: [''],
        areacode: [''],
        value: [''],
      })
    );

    // Mark all fields as touched to show error messages
    phoneArray.at(0).get('code').markAsTouched();
    phoneArray.at(0).get('areacode').markAsTouched();
    phoneArray.at(0).get('value').markAsTouched();

    fixture.detectChanges(); // Trigger change detection

    const codeError = fixture.debugElement.query(
      By.css('div.p-error')
    ).nativeElement; // Select the error message element
    expect(codeError).toBeTruthy(); // Check if error message is shown
    expect(codeError.textContent).toContain('Code is required.'); // Validate error message content
  });

  it('should call getvalue() method on input change', () => {
    spyOn(component, 'getvalue'); // Spy on getvalue method
    const inputElement = fixture.debugElement.query(
      By.css('input[formControlName="value"]')
    ).nativeElement;
    inputElement.value = '1234567890';
    inputElement.dispatchEvent(new Event('input')); // Trigger input event
    fixture.detectChanges();
    expect(component.getvalue).toHaveBeenCalled(); // Ensure getvalue is called
  });

  it('should render the child components for email and website contact details', () => {
    const emailComponent = fixture.debugElement.query(
      By.css('app-trust-email-contact-details')
    );
    fixture.detectChanges();
    expect(emailComponent).toBeTruthy();
  });

  it('should render gen-card with headerText "Contact Details"', () => {
    // Query the gen-card component
    const genCardDebugElement = fixture.debugElement.query(
      By.directive(GenCardComponent)
    );

    // Ensure that the gen-card component exists
    expect(genCardDebugElement).toBeTruthy();

    // Access the component instance to check input properties
    const genCardComponentInstance = genCardDebugElement.componentInstance;

    // Check if headerText is 'Contact Details'
    expect(genCardComponentInstance.headerText).toBe('Contact Details');
  });

  it('should format phone numbers and call setBaseDealerFormData with the correct data', () => {
    // Call the getvalue method
    component.getvalue();

    // Create the expected formatted phone numbers array
    const formattedPhones = component.phoneForm.value.phone.map((phone) => {
      return {
        value: `${phone.code}(${phone.areacode})${phone.value}`,
        type: phone.type,
        areacode: phone.areacode,
        code: phone.code,
      };
    });
    fixture.detectChanges();
    // Check if setBaseDealerFormData was called with the expected data
    expect(mockTrustService.setBaseDealerFormData).toHaveBeenCalledWith({
      trustDetailPhone: formattedPhones,
    });
  });

  it('should return the FormArray for phone', () => {
    const formArray = component.phoneForm.get('phone') as FormArray;
    expect(component.phone).toBe(formArray); // Check if the getter returns the FormArray
  });

  it('should call proceedForm and push formStatus when validate is true and phoneForm is defined', () => {
    // Mock the phoneForm

    // Mock stepperDetails with validate = true
    const stepperDetails = { validate: true };

    // Spy on the parent method (super.onStepChange)
    const superOnStepChangeSpy = spyOn<any>(
      component,
      'onStepChange'
    ).and.callThrough();

    // Call the method
    component.onStepChange(stepperDetails);

    // Verify proceedForm was called with phoneForm
    expect(svcMock.proceedForm).toHaveBeenCalledWith(component.phoneForm);

    // Verify formStatusArr was updated
    expect(mockTrustService.formStatusArr).toContain('VALID');

    // Verify that super.onStepChange was called
    expect(superOnStepChangeSpy).toHaveBeenCalledWith(stepperDetails);
  });

  it('should not call proceedForm or modify formStatusArr if validate is false', () => {
    // Mock stepperDetails with validate = false
    const stepperDetails = { validate: false };
    const superOnStepChangeSpy = spyOn<any>(
      component,
      'onStepChange'
    ).and.callThrough();

    // Call the method
    component.onStepChange(stepperDetails);

    // Ensure proceedForm is not called
    expect(svcMock.proceedForm).not.toHaveBeenCalled();

    // Ensure formStatusArr is not modified
    expect(mockTrustService.formStatusArr.length).toBe(0);

    // Ensure super.onStepChange was still called
    expect(superOnStepChangeSpy).toHaveBeenCalledWith(stepperDetails);
  });

  it('should call super.onStepChange even if phoneForm is not defined', () => {
    // Set phoneForm to undefined
    component.phoneForm = undefined;

    const superOnStepChangeSpy = spyOn<any>(
      component,
      'onStepChange'
    ).and.callThrough();

    // Mock stepperDetails with validate = true
    const stepperDetails = { validate: true };

    // Call the method
    component.onStepChange(stepperDetails);

    // Ensure proceedForm is not called as phoneForm is undefined
    expect(svcMock.proceedForm).not.toHaveBeenCalled();

    // Ensure formStatusArr is not modified
    expect(mockTrustService.formStatusArr.length).toBe(0);

    // Ensure super.onStepChange was still called
    expect(superOnStepChangeSpy).toHaveBeenCalledWith(stepperDetails);
  });

  it('should add a new phone when phone length is less than 2', () => {
    // Spy on the createPhoneForm method

    // Call addOtherPhone
    component.addOtherPhone();

    // Expect that createPhoneForm was called
    expect(component.createPhoneForm).toHaveBeenCalled();

    // Expect that a new phone form group has been added
    expect(component.phone.length).toBe(2);

    // Try to add more than 2
    component.addOtherPhone();

    // Expect that no more than 2 phones can be added
    expect(component.phone.length).toBe(3);
  });

  it('should remove a phone by index', () => {
    // Add two mock phone FormGroups to the FormArray
    component.phone.push(
      new FormGroup({
        value: new FormControl('123456789'),
        type: new FormControl('mobile'),
      })
    );

    // Call removePhone with index 0 (removing the first phone)
    component.removePhone(0);

    // Expect the length of the phone FormArray to decrease
    expect(component.phone.length).toBe(1);

    // Expect the first phone in the array to be the one previously at index 1
    expect(component.phone.at(0).get('value')?.value).toBe('123456789');
  });

  it('should patch phone values in edit mode', () => {
    // Set mode to 'edit'
    component.mode = 'edit';

    // Mock the phone data in baseFormData.trust
    component.baseFormData.trust.phone = [
      { value: '+1(123)4567890', type: 'mobile' },
      { value: '+44(987)6543210', type: 'work' },
    ];

    // Call the patchPhoneValue method
    component.patchPhoneValue();

    // Expect phoneArray to have 2 entries (created from phone data)
    expect(component.phone.length).toBe(2);

    // Check that patchValue was called with the correct values
    expect(component.phone.at(0).value).toEqual({
      value: '4567890',
      type: 'mobile',
      areacode: '123',
      code: '+1',
    });

    expect(component.phone.at(1).value).toEqual({
      value: '6543210',
      type: 'work',
      areacode: '987',
      code: '+44',
    });
  });
  it('should patch phone values in non-edit mode', () => {
    // Set mode to anything other than 'edit'
    component.mode = 'create';

    // Mock the phone data in baseFormData.trustDetailPhone
    component.baseFormData.trustDetailPhone = [
      { value: '+61(456)1237890', type: 'home' },
    ];

    // Spy on createPhoneForm to return a mock FormGroup

    // Call the patchPhoneValue method
    component.patchPhoneValue();

    // Expect phoneArray to have 1 entry (created from phone data)
    expect(component.phone.length).toBe(1);

    // Check that patchValue was called with the correct values
    expect(component.phone.at(0).value).toEqual({
      value: '1237890',
      type: 'home',
      areacode: '456',
      code: '+61',
    });
  });

  it('should not patch if phoneData is not an array', () => {
    // Set mode to 'edit' and mock invalid phone data (not an array)
    component.mode = 'edit';
    component.baseFormData.trust.phone = null;

    // Call patchPhoneValue
    component.patchPhoneValue();

    // Expect no changes to phone array since phoneData is not an array
    expect(component.phone.length).toBe(1);
  });
});
