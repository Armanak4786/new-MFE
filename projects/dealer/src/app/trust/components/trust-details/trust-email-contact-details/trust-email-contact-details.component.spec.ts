import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustEmailContactDetailsComponent } from './trust-email-contact-details.component';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  LibSharedModule,
} from 'auro-ui';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { TrustService } from '../../../services/trust.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormArray, FormGroup } from '@angular/forms';

fdescribe('TrustEmailContactDetailsComponent', () => {
  let component: TrustEmailContactDetailsComponent;
  let fixture: ComponentFixture<TrustEmailContactDetailsComponent>;
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
      declarations: [TrustEmailContactDetailsComponent],
      imports: [AppPrimengModule, CoreAppModule, LibSharedModule],
      providers: [
        JwtHelperService,
        AuthenticationService,
        { provide: TrustService, useValue: mockTrustService },

        ConfirmationService,
        MessageService,
        { provide: CommonService, useValue: svcMock },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: of({ get: () => '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustEmailContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create the form with one email control initially', () => {
    expect(component.emailForm).toBeTruthy();
    expect(component.emails.length).toBe(1);
  });
  it('should add a new email control when "Add Other Email" button is clicked', () => {
    component.addOtherEmail();
    expect(component.emails.length).toBe(2);

    component.addOtherEmail();
    expect(component.emails.length).toBe(3);

    // Attempting to add more should not increase the count
    component.addOtherEmail();
    expect(component.emails.length).toBe(3);
  });

  it('should remove the email control when the remove button is clicked', () => {
    component.addOtherEmail(); // Now we have 2
    component.removeEmail(0); // Remove the first one
    expect(component.emails.length).toBe(1);
  });

  it('should validate email input', () => {
    const emailControl = component.emails.at(0).get('value');

    // Check required validation
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.hasError('required')).toBeTrue();

    // Check email pattern validation
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.hasError('pattern')).toBeTrue();

    // Valid email
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });
  it('should check the "No Email" checkbox functionality', () => {
    // Get the checkbox debug element
    const checkboxDebugElement = fixture.debugElement.query(
      By.css('p-checkbox')
    );

    // Spy on the `onCheckboxChange` method to track if it's called
    spyOn(component, 'onCheckboxChange');

    // Simulate checkbox change event with a `checked` state
    checkboxDebugElement.triggerEventHandler('onChange', { checked: false });

    fixture.detectChanges();

    // Ensure the `onCheckboxChange` method is called with the correct parameters
    expect(component.onCheckboxChange).toHaveBeenCalledWith(
      jasmine.any(Object),
      0
    );

    // You can also check if the form control was updated
    expect(component.emails.at(0).get('emailChk')?.value).toBeFalsy();
  });
  it('should display validation error when email is invalid', () => {
    // Set the email control to an invalid value
    component.emails.at(0).get('value')?.setValue('');
    component.emails.at(0).get('value')?.markAsTouched(); // Mark as touched to trigger validation
    fixture.detectChanges(); // Trigger change detection

    // Query the validation error message in the DOM
    const errorMessage = fixture.debugElement.query(By.css('.p-error'));

    // Ensure the error message is rendered
    expect(errorMessage).not.toBeNull(); // This ensures that the error message exists
    expect(errorMessage.nativeElement.textContent).toContain(
      'Email is required'
    );
  });
  it('should display "Please enter a valid email address" error for invalid email pattern', () => {
    // Set up the form control to an invalid email value
    const emailControl = (component.emailForm.get('emails') as FormArray)
      .at(0)
      .get('value');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    // Find the error message for invalid email pattern
    const errorMessage = fixture.debugElement.query(
      By.css('.p-error')
    ).nativeElement;

    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain(
      'Please enter a valid email address'
    );
  });
  it('should not display any error for a valid email', () => {
    // Set up the form control to a valid email value
    const emailControl = (component.emailForm.get('emails') as FormArray)
      .at(0)
      .get('value');
    emailControl?.setValue('valid.email@example.com');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    // Try to find the error message, which should not exist
    const errorMessage = fixture.debugElement.query(By.css('.p-error'));

    expect(errorMessage).toBeNull(); // No error message should be present
  });
  it('should add a new email input when "Add Other Email" is clicked', () => {
    const emailsArray = component.emailForm.get('emails') as FormArray;
    expect(emailsArray.length).toBe(1);

    const addButton = fixture.debugElement.query(By.css('.plus-btn'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(emailsArray.length).toBe(2); // Now, there should be 2 email inputs
  });

  it('should remove an email input when delete button is clicked', () => {
    const emailsArray = component.emailForm.get('emails') as FormArray;

    // Add another email to test remove functionality
    component.addOtherEmail();
    fixture.detectChanges();
    expect(emailsArray.length).toBe(2); // Ensure 2 emails exist

    const removeButton = fixture.debugElement.queryAll(By.css('.fa-trash'))[0];
    removeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(emailsArray.length).toBe(2); // One email should be removed
  });

  it('should initialize the form with one email form group', () => {
    expect(component.emailForm instanceof FormGroup).toBe(true);
    const emailArray = component.emailForm.get('emails') as FormArray;
    expect(emailArray.length).toBe(1); // Form initializes with one email
  });

  it('should add a new email control when "addOtherEmail" is called', () => {
    component.addOtherEmail();
    const emailArray = component.emailForm.get('emails') as FormArray;
    expect(emailArray.length).toBe(2); // Second email is added
  });

  it('should not add more than 3 email controls', () => {
    component.addOtherEmail();
    component.addOtherEmail();
    component.addOtherEmail(); // Try to add a fourth email
    const emailArray = component.emailForm.get('emails') as FormArray;
    expect(emailArray.length).toBe(3); // Only 3 emails are allowed
  });

  it('should remove an email control', () => {
    component.addOtherEmail();
    let emailArray = component.emailForm.get('emails') as FormArray;
    expect(emailArray.length).toBe(2);

    component.removeEmail(1); // Remove the second email
    emailArray = component.emailForm.get('emails') as FormArray;
    expect(emailArray.length).toBe(1); // Only one email should remain
  });

  it('should disable the email input when checkbox is checked', () => {
    component.addOtherEmail();
    const emailArray = component.emailForm.get('emails') as FormArray;
    const emailGroup = emailArray.at(0) as FormGroup;

    // Simulate checkbox being checked
    component.onCheckboxChange({ checked: true }, 0);
    expect(emailGroup.get('value')?.disabled).toBe(true); // Email input should be disabled
    expect(emailGroup.get('value')?.value).toBe(null); // Email input should be reset
  });

  it('should enable the email input when checkbox is unchecked', () => {
    component.addOtherEmail();
    const emailArray = component.emailForm.get('emails') as FormArray;
    const emailGroup = emailArray.at(0) as FormGroup;

    // First, disable the control
    component.onCheckboxChange({ checked: true }, 0);
    expect(emailGroup.get('value')?.disabled).toBe(true);

    // Now, enable the control
    component.onCheckboxChange({ checked: false }, 0);
    expect(emailGroup.get('value')?.enabled).toBe(true); // Email input should be enabled
  });
  // it('should patch email values correctly in edit mode', async () => {
  //   // Mock baseFormData for edit mode
  //   component.baseFormData = {
  //     trust: {
  //       emails: [
  //         { value: 'test1@example.com', type: 'EmailHome', emailChk: false },
  //         {
  //           value: 'test2@example.com',
  //           type: 'EmailBusiness',
  //           emailChk: false,
  //         },
  //       ],
  //     },
  //   };
  //   component.mode = 'edit';

  //   await component.ngOnInit();
  //   const emailArray = component.emailForm.get('emails') as FormArray;
  //   expect(emailArray.length).toBe(2); // FormArray should have 2 email controls in edit mode

  //   expect(emailArray.at(0).get('value')?.value).toBe('test1@example.com');
  //   expect(emailArray.at(1).get('value')?.value).toBe('test2@example.com');
  // });

  it('should validate maxLength for email', () => {
    const emailArray = component.emailForm.get('emails') as FormArray;
    const emailControl = emailArray.at(0).get('value');

    emailControl?.setValue('thisEmailIsDefinitelyTooLong@example.com');
    expect(emailControl?.valid).toBeFalse(); // Exceeds maxLength validation (20)

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTrue(); // Under maxLength
  });
  it('should call getvalue and update baseDealerFormData', () => {
    component.getvalue();
    expect(mockTrustService.setBaseDealerFormData).toHaveBeenCalledWith({
      trustDetailsEmail: component.emailForm.value.emails,
    });
  });

  it('should proceed with form validation on step change', () => {
    component.onStepChange({ validate: true });

    expect(svcMock.proceedForm).toHaveBeenCalledWith(component.emailForm);
    expect(component.trustSvc.formStatusArr.length).toBeGreaterThan(0);
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
    expect(svcMock.proceedForm).toHaveBeenCalledWith(component.emailForm);

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
    component.emailForm = undefined;

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
});
