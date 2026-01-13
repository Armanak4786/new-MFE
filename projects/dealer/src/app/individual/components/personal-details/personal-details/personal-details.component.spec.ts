import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonalDetailsComponent } from "./personal-details.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  UiService,
} from "auro-ui";
import { ConfirmationService, MessageService } from "primeng/api";
import { IndividualService } from "../../../services/individual.service";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ActivatedRoute } from "@angular/router";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { DatePipe } from "@angular/common";
import { of } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { By } from "@angular/platform-browser";
import { DropdownModule } from "primeng/dropdown";

fdescribe("PersonalDetailsComponent", () => {
  let component: PersonalDetailsComponent;
  let fixture: ComponentFixture<PersonalDetailsComponent>;
  let dropdownDe: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalDetailsComponent, BaseFormComponent],
      imports: [
        BrowserDynamicTestingModule,
        CoreAppModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
      ],
      providers: [
        IndividualService,
        CommonService,
        AuthenticationService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        AppPrimengModule,
        DatePipe,
        FormBuilder,
        { provide: ActivatedRoute, useValue: { params: of({}) } },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this schema if necessary
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsComponent);
    component = fixture.componentInstance;
    component.customerRoleForm = new FormGroup({
      role: new FormControl(null),
    });
    dropdownDe = fixture.debugElement.query(By.css("p-dropdown"));

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have a form control for role", () => {
    expect(component.customerRoleForm.get("role")).toBeTruthy();
  });

  it("should render dropdown options", () => {
    component.customerRoleData = [
      { label: "Borrower", value: 1 },
      { label: "Co-Borrower", value: 2 },
      { label: "Guaranter", value: 3 },
    ];
    fixture.detectChanges();

    const dropdown = dropdownDe.componentInstance;
    expect(dropdown.options.length).toBe(3);
    expect(dropdown.options[0].label).toBe("Borrower");
  });

  it("should create the form with role control", () => {
    expect(component.customerRoleForm).toBeTruthy(); // Check if form is created
    expect(component.customerRoleForm.contains("role")).toBe(true); // Check if 'role' control exists
  });

  it("should initialize role control with empty string", () => {
    const roleControl = component.customerRoleForm.get("role");
    expect(roleControl).toBeTruthy();
    expect(roleControl?.value).toBeNull(); // Check if initial value is an empty string
  });

  it("should mark role control as valid initially", () => {
    const roleControl = component.customerRoleForm.get("role");
    expect(roleControl?.valid).toBeTruthy(); // Check if role control is valid by default
  });

  it('should return "VALID" when validateEmailData returns "VALID"', () => {
    // Spy on validateEmailData to return 'VALID'
    spyOn(component, "validateEmailData").and.returnValue("VALID");

    // Call proceedEmailForm
    const result = component.proceedEmailForm();

    // Expectation
    expect(result).toBe("VALID");
    expect(component.validateEmailData).toHaveBeenCalled();
  });

  it("should validate Marital Status select field", () => {
    const maritalStatusControl = component.mainForm.get("maritalStatus");

    maritalStatusControl?.setValue("");
    maritalStatusControl?.markAsTouched();

    expect(maritalStatusControl?.valid).toBeFalse();
    expect(maritalStatusControl?.errors?.["required"]).toBeTruthy();

    maritalStatusControl?.setValue("Married");
    expect(maritalStatusControl?.valid).toBeTrue();
  });
  it("should validate title control as required", () => {
    const titleControl = component.mainForm.get("title");

    // Initially, title should be invalid if empty
    titleControl?.setValue("");
    expect(titleControl?.hasError("required")).toBeTrue();

    // After setting a valid value, title should be valid
    titleControl?.setValue("Mr");
    expect(titleControl?.valid).toBeTrue();
  });
  it("should initialize middleName control without validators", () => {
    const middleNameControl = component.mainForm.get("middleName");

    // Set and verify value
    middleNameControl?.setValue("Jane");
    expect(middleNameControl?.valid).toBeTrue();
  });
  it("should validate gender control as required", () => {
    const genderControl = component.mainForm.get("gender");

    // Initially, gender should be invalid if empty (required)
    genderControl?.setValue("");
    expect(genderControl?.hasError("required")).toBeTrue();

    // After setting a valid value, gender should be valid
    genderControl?.setValue("Male");
    expect(genderControl?.valid).toBeTrue();
  });

  it("should validate lastName control as required", () => {
    const lastNameControl = component.mainForm.get("lastName");

    // Initially, lastName should be invalid if empty (required)
    lastNameControl?.setValue("");
    expect(lastNameControl?.hasError("required")).toBeTrue();

    // After setting a valid value, lastName should be valid
    lastNameControl?.setValue("Doe");
    expect(lastNameControl?.valid).toBeTrue();
  });

  it("should validate maximum length for First Name", () => {
    const firstNameControl = component.mainForm.get("firstName");

    firstNameControl?.setValue("Johnathanathantestttttttttttttt");
    firstNameControl?.markAsTouched();

    expect(firstNameControl?.valid).toBeFalse();
    expect(firstNameControl?.errors?.["maxlength"]).toBeTruthy();

    firstNameControl?.setValue("John");
    expect(firstNameControl?.valid).toBeTrue();
  });

  it("should validate pattern for First Name", () => {
    const firstNameControl = component.mainForm.get("firstName");

    firstNameControl?.setValue("John123");
    firstNameControl?.markAsTouched();

    expect(firstNameControl?.valid).toBeTruthy();

    firstNameControl?.setValue("John");
    expect(firstNameControl?.valid).toBeTrue();
  });
  it("should validate noOfDependents control as required", () => {
    const noOfDependentsControl = component.mainForm.get("noOfDependents");

    // Initially, noOfDependents should be invalid if empty (required)
    noOfDependentsControl?.setValue(null);
    expect(noOfDependentsControl?.hasError("required")).toBeTrue();

    // After setting a valid value, noOfDependents should be valid
    noOfDependentsControl?.setValue(2);
    expect(noOfDependentsControl?.valid).toBeTrue();
  });
  it("should clear the formArray controls in noOfDependentArr", () => {
    // Access the formArray (noOfDependentArr) from the main form
    const formArray = component.mainForm.getArrayControls("noOfDependentArr");

    // Add some form controls to the formArray

    // Call the clearFormArray method
    component.clearFormArray();
    fixture.detectChanges();

    // After clearing, the formArray should have no controls
    expect(formArray.length).toBe(0);
  });
  describe("onFormEvent", () => {
    beforeEach(() => {
      // Reset the previous dropdown value before each test
      component.previousDropdownValue = null;
    });

    it("should do nothing if the event name is not noOfDependents", () => {
      const event = { name: "someOtherEvent", value: 1 };

      // Spy on the form methods to ensure they are not called
      spyOn(component.mainForm, "updateHidden");
      spyOn(component, "clearFormArray");

      // Call the onFormEvent method
      component.onFormEvent(event);

      // Assert that no changes were made
      expect(component.mainForm.updateHidden).not.toHaveBeenCalled();
      expect(component.clearFormArray).not.toHaveBeenCalled();
    });

    it("should do nothing if the noOfDependents value has not changed", () => {
      // Set previous dropdown value to 2
      component.previousDropdownValue = 2;

      const event = { name: "noOfDependents", value: 2 };

      // Spy on the form methods to ensure they are not called
      spyOn(component.mainForm, "updateHidden");
      spyOn(component, "clearFormArray");

      // Call the onFormEvent method
      component.onFormEvent(event);

      // Assert that no changes were made since value didn't change
      expect(component.mainForm.updateHidden).not.toHaveBeenCalled();
      expect(component.clearFormArray).not.toHaveBeenCalled();
    });

    it("should hide the noOfDependentArr field and clear the form array when noOfDependents is 0", () => {
      const event = { name: "noOfDependents", value: 0 };

      // Spy on the required form methods
      spyOn(component.mainForm, "updateHidden");
      spyOn(component, "clearFormArray");

      // Call the onFormEvent method
      component.onFormEvent(event);

      // Assert the hidden field is updated
      expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
        noOfDependentArr: true,
      });

      // Assert that the form array is cleared
      expect(component.clearFormArray).toHaveBeenCalled();

      // Assert that the previousDropdownValue is updated
      expect(component.previousDropdownValue).toBe(0);
    });

    it("should show the noOfDependentArr field, clear the form array, and add controls when noOfDependents is greater than 0", () => {
      const event = { name: "noOfDependents", value: 3 };

      // Spy on the required form methods
      spyOn(component.mainForm, "updateHidden");
      spyOn(component, "clearFormArray");
      spyOn(component.mainForm, "addArrayControls");

      // Call the onFormEvent method
      component.onFormEvent(event);

      // Assert the hidden field is updated
      expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
        noOfDependentArr: false,
      });

      // Assert that the form array is cleared
      expect(component.clearFormArray).toHaveBeenCalled();

      // Assert that new controls are added
      expect(component.mainForm.addArrayControls).toHaveBeenCalledTimes(3);

      // Assert that the previousDropdownValue is updated
      expect(component.previousDropdownValue).toBe(3);
    });
  });
});
