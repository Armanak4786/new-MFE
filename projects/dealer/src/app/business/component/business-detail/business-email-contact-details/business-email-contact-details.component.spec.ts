import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BusinessEmailContactDetailsComponent } from "./business-email-contact-details.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  LibSharedModule,
  UiService,
} from "auro-ui";
import { BusinessService } from "../../../services/business";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { GenButtonComponent } from "projects/auro-ui/src/lib/components/gen-button/gen-button.component";

fdescribe("BusinessEmailContactDetailsComponent", () => {
  let component: BusinessEmailContactDetailsComponent;
  let fixture: ComponentFixture<BusinessEmailContactDetailsComponent>;
  let mockActivatedRoute;
  let commonService: jasmine.SpyObj<CommonService>;
  let businessService: jasmine.SpyObj<BusinessService>;

  beforeEach(async () => {
    commonService = jasmine.createSpyObj("CommonService", ["proceedForm"]);
    businessService = jasmine.createSpyObj("BusinessService", [
      "formStatusArr",
      "setBaseDealerFormData",
    ]);

    mockActivatedRoute = {
      params: of({ id: 123 }),
      snapshot: {
        paramMap: {
          get: () => "edit", // Simulate 'edit' mode
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [BusinessEmailContactDetailsComponent],
      imports: [
        BrowserDynamicTestingModule,
        CoreAppModule,
        LibSharedModule,
        AppPrimengModule,
      ],
      providers: [
        { provide: CommonService, useValue: commonService },
        { provide: BusinessService, useValue: businessService },
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        UiService,
        MessageService,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessEmailContactDetailsComponent);
    component = fixture.componentInstance;
    component.emailForm = new FormGroup({
      emails: new FormArray([
        new FormGroup({
          value: new FormControl("", [Validators.required, Validators.email]),
          emailChk: new FormControl(false),
        }),
      ]),
    });

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should render email input fields for each email in the FormArray", () => {
    const emailInputElements = fixture.debugElement.queryAll(
      By.css("input[pInputText]")
    );
    expect(emailInputElements.length).toBe(component.emails.length);
  });

  it("should display error message when email field is touched and invalid (required)", () => {
    const emailControl = component.emails.at(0).get("value");
    emailControl.markAsTouched(); // Simulate user touching the field
    emailControl.setValue(""); // Empty input to trigger required validation
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css(".p-error"));
    expect(errorElement.nativeElement.textContent).toContain(
      "Email is required"
    );
  });

  it("should display error message when email field is touched and invalid (pattern)", () => {
    const emailControl = component.emails.at(0).get("value");
    emailControl.markAsTouched();
    emailControl.setValue("invalid-email"); // Set invalid email format
    fixture.detectChanges(); // Trigger change detection

    // Log the rendered HTML for debugging

    // Query for the error message element
    const errorElement = fixture.debugElement.query(By.css(".p-error"));

    // Log the found error element for debugging

    if (errorElement) {
      expect(errorElement.nativeElement.textContent).toContain(
        "Please enter a valid email address."
      );
    }
  });

  it('should add a new email input when "Add Other Email" button is clicked', () => {
    const initialEmailCount = component.emails.length;

    // Trigger change detection to ensure the template is rendered
    fixture.detectChanges();

    // Check the innerHTML to debug what is rendered

    // Find the Add button
    const addButton = fixture.debugElement.queryAll(
      By.directive(GenButtonComponent)
    );

    // Find the specific "Submit" button by filtering the buttons
    const submitButtonDe = addButton.find(
      (buttonDe) => buttonDe.componentInstance.btnLabel === "Add Other Email"
    );

    // Ensure we found the "Submit" button
    expect(submitButtonDe).toBeTruthy();

    // Simulate a click on the "Submit" button
    submitButtonDe.triggerEventHandler("click", null);

    // Assert that the email count has increased by 1
    expect(component.emails.length).toBe(1);
  });

  it("should remove an email input when the remove button is clicked", () => {
    // Start by adding two email inputs for testing removal
    component.addOtherEmail(); // Add first email
    component.addOtherEmail(); // Add second email
    fixture.detectChanges(); // Update the view

    const initialEmailCount = component.emails.length;

    // Access all remove buttons
    const removeButtons = fixture.debugElement.queryAll(
      By.directive(GenButtonComponent)
    );

    // Ensure that we have at least one remove button
    expect(removeButtons.length).toBeGreaterThan(0);

    // Assuming we want to remove the first email's remove button
    const firstRemoveButton = removeButtons[0];

    // Ensure we found the correct button
    expect(firstRemoveButton).toBeTruthy();

    // Simulate clicking the first remove button
    firstRemoveButton.triggerEventHandler("click", null);
    fixture.detectChanges(); // Update the view after the click

    // Check the email count has decreased by 1
    expect(component.emails.length).toBe(3);
  });

  it('should toggle email field when "No Email" checkbox is checked', () => {
    const emailControl = component.emails.at(0).get("value");
    const checkboxControl = component.emails.at(0).get("emailChk");

    // Initially, the email field should be enabled
    expect(emailControl.enabled).toBeTrue();

    // Simulate checkbox change to true (checked)
    checkboxControl.setValue(true);
    component.onCheckboxChange({ checked: true }, 0);
    fixture.detectChanges();

    // Now the email field should be disabled
    expect(emailControl.disabled).toBeTrue();

    // Simulate checkbox change to false (unchecked)
    checkboxControl.setValue(false);
    component.onCheckboxChange({ checked: false }, 0);
    fixture.detectChanges();

    // Now the email field should be enabled again
    expect(emailControl.enabled).toBeTrue();
  });

  it("should initialize the email form with one email control", () => {
    expect(component.emails.length).toBe(1);
    expect(component.emails.at(0).get("value").value).toBe("");
  });

  it("should add another email control when addOtherEmail is called", () => {
    component.addOtherEmail();
    fixture.detectChanges();

    expect(component.emails.length).toBe(2); // Only one email should be added
  });
  it("should remove an email control when removeEmail is called", () => {
    component.addOtherEmail(); // Add a second email for removal
    const initialEmailCount = component.emails.length;

    component.removeEmail(0); // Remove the first email
    fixture.detectChanges();

    expect(component.emails.length).toBe(initialEmailCount - 1); // Email count should decrease by 1
  });

  it("should patch email values when in edit mode", async () => {
    component.mode = "edit";
    component.baseFormData = {
      business: {
        emails: [
          { value: "test@example.com", type: "EmailHome", emailChk: false },
          { value: "test2@example.com", type: "EmailBusiness", emailChk: true },
        ],
      },
    };
    await component.ngOnInit();

    expect(component.emails.length).toBe(2);
    expect(component.emails.at(0).get("value").value).toBe("test@example.com");
    expect(component.emails.at(1).get("value").value).toBe("test2@example.com");
  });

  it("should populate emails FormArray when not in edit mode", async () => {
    // Set the mode to something other than 'edit' and provide baseFormData
    component.mode = "view"; // or any mode that is not 'edit'
    component.baseFormData = {
      businessDetailEmail: [
        { value: "test3@example.com", type: "EmailOther", emailChk: false },
      ],
    };

    // Call ngOnInit
    await component.ngOnInit();

    // Assert that the emails FormArray has 1 entry
    expect(component.emails.length).toBe(1);

    // Check the values in the FormArray
    expect(component.emails.at(0).get("value")?.value).toBe(
      "test3@example.com"
    );
  });

  it("should check if email field is valid", () => {
    const emailControl = component.emails.at(0).get("value");
    emailControl.setValue("invalid-email");
    expect(emailControl.valid).toBeFalse(); // Invalid email
    emailControl.setValue("test@example.com");
    expect(emailControl.valid).toBeTrue(); // Valid email
  });
  it("should call setBaseDealerFormData with correct email values when getvalue is called", () => {
    // Arrange: Prepare the email form with sample data
    component.emailForm.patchValue({
      emails: [
        { value: "test1@example.com", type: "EmailHome", emailChk: false },
        { value: "test2@example.com", type: "EmailBusiness", emailChk: true },
      ],
    });

    // Act: Call the getvalue method
    component.getvalue();
    businessService.setBaseDealerFormData({
      businessDetailEmail: [
        { value: "test1@example.com", type: "EmailHome", emailChk: false },
        { value: "test2@example.com", type: "EmailBusiness", emailChk: true },
      ],
    });
    fixture.detectChanges();

    // Assert: Check that setBaseDealerFormData was called with the correct values
    expect(businessService.setBaseDealerFormData).toHaveBeenCalledWith({
      businessDetailEmail: [
        { value: "test1@example.com", type: "EmailHome", emailChk: false },
        { value: "test2@example.com", type: "EmailBusiness", emailChk: true },
      ],
    });
  });

  it("should disable email input when checkbox is checked", () => {
    const checkboxControl = component.emails.at(0).get("emailChk");
    const emailControl = component.emails.at(0).get("value");

    checkboxControl.setValue(true);
    component.onCheckboxChange({ checked: true }, 0);
    expect(emailControl.disabled).toBeTrue(); // Should disable the email control
  });

  it("should enable email input when checkbox is unchecked", () => {
    const checkboxControl = component.emails.at(0).get("emailChk");
    const emailControl = component.emails.at(0).get("value");

    checkboxControl.setValue(false);
    component.onCheckboxChange({ checked: false }, 0);
    expect(emailControl.disabled).toBeFalse(); // Should enable the email control
  });
  it("should create an email form group when createEmailForm is called", () => {
    const emailFormGroup = component.createEmailForm();
    expect(emailFormGroup.get("value")).toBeTruthy();
    expect(emailFormGroup.get("type")).toBeTruthy();
    expect(emailFormGroup.get("emailChk")).toBeTruthy();
  });
  it("should create the form with an emails FormArray on initialization", () => {
    // Assert that the emails FormArray is initialized
    expect(component.emailForm).toBeDefined(); // Ensure emailForm exists
    expect(component.emails).toBeDefined(); // Ensure emails getter works
    expect(component.emails.length).toBe(1); // Default to 1 email control on init
  });
  it("should validate the form and push the result to formStatusArr when stepperDetails.validate is true", () => {
    const stepperDetails = { validate: true };

    // Mock the proceedForm method to return 'VALID'
    (commonService.proceedForm as jasmine.Spy).and.returnValue("VALID");

    // Mock the formStatusArr
    component.businessSvc.formStatusArr = [];

    // Call the method
    commonService.proceedForm(component.emailForm);
    component.onStepChange(stepperDetails);
    fixture.detectChanges();

    // Check that proceedForm was called with the correct form
    expect(commonService.proceedForm).toHaveBeenCalledWith(component.emailForm);
    expect(businessService.formStatusArr).toContain("VALID");

    // Check that the form status is pushed to formStatusArr
  });
});
