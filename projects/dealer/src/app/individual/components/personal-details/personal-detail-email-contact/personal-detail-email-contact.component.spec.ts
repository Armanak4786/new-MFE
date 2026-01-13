import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonalDetailEmailContactComponent } from "./personal-detail-email-contact.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { IndividualService } from "../../../services/individual.service";
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from "auro-ui";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { BaseIndividualClass } from "../../../base-individual.class";

fdescribe("PersonalDetailEmailContactComponent", () => {
  let component: PersonalDetailEmailContactComponent;
  let fixture: ComponentFixture<PersonalDetailEmailContactComponent>;
  let individualServiceMock: jasmine.SpyObj<IndividualService>;
  let commonServiceMock: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    individualServiceMock = jasmine.createSpyObj("IndividualService", [
      "setBaseDealerFormData",
    ]);
    commonServiceMock = jasmine.createSpyObj("CommonService", [
      "showError",
      "ui",
      "proceedForm",
    ]);

    await TestBed.configureTestingModule({
      declarations: [PersonalDetailEmailContactComponent, BaseIndividualClass],
      imports: [
        BrowserDynamicTestingModule,
        CoreAppModule,
        ReactiveFormsModule,
        FormsModule,
        AuroUiFrameWork,
      ],
      providers: [
        { provide: IndividualService, useValue: individualServiceMock },
        { provide: CommonService, useValue: commonServiceMock },
        AuthenticationService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        AppPrimengModule,
        FormBuilder,
        { provide: ActivatedRoute, useValue: { params: of({}) } },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailEmailContactComponent);
    component = fixture.componentInstance;
    component.emailForm = component.fb.group({
      emails: component.fb.array([
        component.fb.group({
          value: [
            "",
            [
              Validators.required,
              Validators.pattern(
                "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              ),
              Validators.maxLength(20),
              Validators.email,
            ],
          ],
          type: component.emailType[0],
          emailChk: false,
        }),
      ]),
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should create a form with a single emails array", () => {
    expect(component.emailForm).toBeTruthy();
    expect(component.emailForm.get("emails").value.length).toBe(1);
  });

  it("should remove an email control from the FormArray", () => {
    // Add an email to the FormArray
    component.addOtherEmail();
    component.addOtherEmail(); // Add another email
    expect(component.emailForm.get("emails").value.length).toBe(3);

    // Call the removeEmail method to remove the first email
    component.removeEmail(0);
    fixture.detectChanges();

    // Check if the emails array length decreased
    expect(component.emailForm.get("emails").value.length).toBe(2);
  });
  // Test case for removeEmail
  it("should remove an email form at the specified index", () => {
    // Add three emails to the form array
    component.addOtherEmail(); // First email
    component.addOtherEmail(); // Second email
    component.addOtherEmail(); // Third email

    expect(component.emails.length).toBe(3); // Check the length before removal

    // Now, remove the second email (index 1)
    component.removeEmail(1);

    expect(component.emails.length).toBe(2); // Length should now be 2
    expect(component.emails.at(0).get("value")?.value).toBe(""); // First email remains
    expect(component.emails.at(1).get("value")?.value).toBe(""); // Third email moves to index 1
  });

  it("should reset and disable email control when checkbox is checked", () => {
    const emailControl = component.emails.at(0);
    const checkboxControl = emailControl.get("emailChk");

    checkboxControl.setValue(true); // Check the checkbox
    component.onCheckboxChange({ checked: true }, 0); // Simulate checkbox change

    expect(emailControl.get("value").disabled).toBeTrue(); // Email control should be disabled
    expect(emailControl.get("value").value).toBeNull(); // Value should be reset
  });

  it("should handle getvalue correctly", () => {
    component.getvalue(); // Call getvalue method
    expect(individualServiceMock.setBaseDealerFormData).toHaveBeenCalledWith({
      personalDetailsEmail: component.emailForm.value.emails,
    });
  });

  // Test case for the emails getter
  it("should get emails as FormArray", () => {
    expect(component.emails).toBeDefined(); // Ensure emails is defined
    expect(component.emails instanceof FormArray).toBe(true); // Check if it is an instance of FormArray
    expect(component.emails.length).toBe(1); // Check initial length (assuming one email control is created)
  });

  it("should not add more than 3 email controls", () => {
    component.addOtherEmail();
    component.addOtherEmail(); // Add two more to reach the limit
    fixture.detectChanges();

    expect(component.emails.length).toBe(3); // Ensure it does not exceed 3
    component.addOtherEmail(); // Attempt to add one more
    expect(component.emails.length).toBe(3); // Still should be 3
  });

  it("should enable email control when checkbox is unchecked", () => {
    const emailControl = component.emails.at(0);
    emailControl.get("value").disable(); // Start as disabled
    const checkboxControl = emailControl.get("emailChk");

    checkboxControl.setValue(false); // Uncheck the checkbox
    component.onCheckboxChange({ checked: false }, 0); // Simulate checkbox change

    expect(emailControl.get("value").enabled).toBeTrue(); // Email control should be enabled
  });

  it("should not call proceedEmailForm if validate is false", () => {
    // Arrange
    const mockStepperDetails = { validate: false };

    // Act
    component.onStepChange(mockStepperDetails);

    // Assert
    expect(component.svc.proceedForm).not.toHaveBeenCalled(); // Check that proceedEmailForm was not called
  });

  // it('should initialize the form correctly in non-edit mode', async () => {
  //   // Arrange
  //   component.mode = 'add'; // Or any mode other than 'edit'
  //   component.baseFormData = {
  //     personalDetailsEmail: [
  //       { value: 'first@example.com', type: 'EmailHome', emailChk: false },
  //       { value: 'second@example.com', type: 'EmailBusiness', emailChk: true },
  //     ],
  //   };

  //   // Act
  //   await component.ngOnInit();

  //   // Assert
  //   expect(component.emails.length).toBe(2); // Two emails should be added
  //   expect(component.emails.at(0).get('value')?.value).toBe(
  //     'first@example.com'
  //   );
  //   expect(component.emails.at(1).get('value')?.value).toBe(
  //     'second@example.com'
  //   );
  // });
  // it('should initialize the form correctly in edit mode', async () => {
  //   // Arrange
  //   component.mode = 'edit';
  //   component.baseFormData = {
  //     personalDetails: {
  //       emails: [
  //         { value: 'test@example.com', type: 'EmailHome', emailChk: false },
  //         {
  //           value: 'another@example.com',
  //           type: 'EmailBusiness',
  //           emailChk: false,
  //         },
  //       ],
  //     },
  //   };

  //   // Act
  //   await component.ngOnInit();

  //   // Assert
  //   expect(component.emails.length).toBe(2); // Two emails should be added
  //   expect(component.emails.at(0).get('value')?.value).toBe('test@example.com');
  //   expect(component.emails.at(1).get('value')?.value).toBe(
  //     'another@example.com'
  //   );
  //   expect(component.emails.at(0).get('type')?.value).toBe('EmailHome');
  //   expect(component.emails.at(1).get('type')?.value).toBe('EmailBusiness');
  //   expect(component.emails.at(1).get('emailChk')?.value).toBe(false);
  // });
  it("should create a form group with the correct structure and validators", () => {
    // Act
    const emailFormGroup = component.createEmailForm();

    // Assert
    expect(emailFormGroup).toBeDefined(); // Check if the form group is created
    expect(emailFormGroup instanceof FormGroup).toBe(true); // Check that it's an instance of FormGroup

    // Check controls
    const valueControl = emailFormGroup.get("value");
    const typeControl = emailFormGroup.get("type");
    const emailChkControl = emailFormGroup.get("emailChk");

    // Check the presence of controls
    expect(valueControl).toBeTruthy();
    expect(typeControl).toBeTruthy();
    expect(emailChkControl).toBeTruthy();

    // Check validators for value control
    expect(valueControl?.validator).toBeTruthy();
    const validators = valueControl?.validator(valueControl);
    expect(validators).toEqual({ required: true }); // Initially, it should be valid

    // Check type control default value
    expect(typeControl?.value).toBe("EmailBusiness"); // The first call to createEmailForm should set the type to 'EmailHome'

    // Check emailChk default value
    expect(emailChkControl?.value).toBe(false); // emailChk should default to false
  });
});
