import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TrustAccountantDetailsComponent } from "./trust-accountant-details.component";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import { AuthenticationService, AuroUiFrameWork } from "auro-ui";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { AbstractControl, Validators } from "@angular/forms";
import { By } from "@angular/platform-browser";

fdescribe("TrustAccountantDetailsComponent", () => {
  let component: TrustAccountantDetailsComponent;
  let fixture: ComponentFixture<TrustAccountantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrustAccountantDetailsComponent],
      imports: [CoreAppModule, AuroUiFrameWork],
      providers: [
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        MessageService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustAccountantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should define the formConfig with correct structure", () => {
    expect(component.formConfig).toBeDefined();
    expect(component.formConfig.headerTitle).toBe("Accountant Details");
    expect(component.formConfig.autoResponsive).toBeTrue();
    expect(component.formConfig.fields.length).toBe(6);
  });

  it("should have correct configuration for the First Name field", () => {
    const firstNameField = component.formConfig.fields.find(
      (f) => f.name === "trustAccountfirstName"
    );
    expect(firstNameField).toBeDefined();
    expect(firstNameField.label).toBe("First Name");
    expect(firstNameField.type).toBe("text");
    expect(firstNameField["validators"]).toContain(Validators.required);
    expect(firstNameField["maxLength"]).toBe(20);
    expect(firstNameField["regexPattern"]).toBe("[^a-zA-Z]*");
  });
  it("should have correct configuration for the Last Name field", () => {
    const lastNameField = component.formConfig.fields.find(
      (f) => f.name === "trustAccountlastName"
    );
    expect(lastNameField).toBeDefined();
    expect(lastNameField.label).toBe("Last Name");
    expect(lastNameField.type).toBe("text");
    expect(lastNameField["validators"]).toContain(Validators.required);
    expect(lastNameField["maxLength"]).toBe(20);
    expect(lastNameField["regexPattern"]).toBe("[^a-zA-Z]*");
  });

  it("should have correct configuration for the Mobile Number select field", () => {
    const phoneCodeField = component.formConfig.fields.find(
      (f) => f.name === "trustAccountPhoneCode"
    );
    expect(phoneCodeField).toBeDefined();
    expect(phoneCodeField.label).toBe("Mobile Number");
    expect(phoneCodeField.type).toBe("select");
    expect(phoneCodeField["options"].length).toBe(239);
    expect(phoneCodeField["validators"]).toContain(Validators.required);
  });

  it("should have correct configuration for the Area Code field", () => {
    const areaCodeField = component.formConfig.fields.find(
      (f) => f.name === "trustAccountAreaCode"
    );
    expect(areaCodeField).toBeDefined();
    expect(areaCodeField.type).toBe("number");
    expect(areaCodeField["placeholder"]).toBe("Area Code");
    expect(areaCodeField["maxLength"]).toBe(4);
    const mockControl: AbstractControl = { value: "12345" } as any;

    const hasPatternValidator = areaCodeField["validators"].some(
      (validator) => {
        const result = validator(mockControl);
        return result && result["requiredPattern"] === "^[0-9]{1,5}$";
      }
    );

    expect(hasPatternValidator).toBeFalse();
  });

  it("should have correct configuration for the Phone Number field", () => {
    const phoneNumberField = component.formConfig.fields.find(
      (f) => f.name === "trustAccountNumber"
    );
    expect(phoneNumberField).toBeDefined();
    expect(phoneNumberField.type).toBe("number");
    expect(phoneNumberField["placeholder"]).toBe("Number");
    expect(phoneNumberField["maxLength"]).toBe(10);
    const mockControl: AbstractControl = { value: "12345" } as any;

    const hasPatternValidator = phoneNumberField["validators"].some(
      (validator) => {
        const result = validator(mockControl);
        return result && result["requiredPattern"] === "^[0-9]{1,5}$";
      }
    );

    expect(hasPatternValidator).toBeFalse();
  });

  it("should have correct configuration for the Email field", () => {
    const emailField = component.formConfig.fields.find(
      (f) => f.name === "trustAccountemail"
    );
    expect(emailField).toBeDefined();
    expect(emailField.label).toBe("Email");
    expect(emailField.type).toBe("text");
    expect(emailField["validators"]).toContain(Validators.required);
  });

  it("should validate email address", () => {
    const emailControl = component.mainForm.get("trustAccountemail");
    expect(emailControl).toBeTruthy(); // Check if the control exists

    // Set invalid email (missing '@')
    emailControl?.setValue("invalidEmail");
    expect(emailControl?.valid).toBeFalse(); // Should be invalid due to pattern
    expect(emailControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

    // Set invalid email (missing domain)
    emailControl?.setValue("invalid@");
    expect(emailControl?.valid).toBeFalse(); // Should be invalid due to pattern
    expect(emailControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

    // Set invalid email (wrong format)
    emailControl?.setValue("invalid@domain");
    expect(emailControl?.valid).toBeFalse(); // Should be invalid due to pattern
    expect(emailControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

    // Set valid email
    emailControl?.setValue("valid.email@example.com");
    expect(emailControl?.valid).toBeTrue(); // Should be valid
    expect(emailControl?.hasError("pattern")).toBeFalse(); // Should not have pattern error

    // Set invalid email (too long)
    emailControl?.setValue("invalid.email@example.com.longtld");
    expect(emailControl?.valid).toBeFalse(); // Should be invalid due to pattern
    expect(emailControl?.hasError("pattern")).toBeTrue(); // Check for pattern error
  });
  it("should render the base-form component", () => {
    let baseFormDebugElement = fixture.debugElement.query(By.css("base-form"));

    expect(baseFormDebugElement).toBeTruthy();
  });

  it("should bind the correct input values to base-form", () => {
    let baseFormDebugElement = fixture.debugElement.query(By.css("base-form"));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    expect(baseFormInstance.formConfig).toEqual(component.formConfig);
    expect(baseFormInstance.mode).toEqual(component.mode);
    expect(baseFormInstance.id).toEqual("");
    expect(baseFormInstance.data).toEqual(component.data);
  });

  it("should call onValueChanges when base-form emits valueChanges", () => {
    spyOn(component, "onValueChanges");
    let baseFormDebugElement = fixture.debugElement.query(By.css("base-form"));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    const mockValueChanges = { testKey: "testValue" };
    baseFormInstance.valueChanges.emit(mockValueChanges);

    expect(component.onValueChanges).toHaveBeenCalledWith(mockValueChanges);
  });

  it("should call onFormEvent when base-form emits formEvent", () => {
    spyOn(component, "onFormEvent");
    let baseFormDebugElement = fixture.debugElement.query(By.css("base-form"));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    const mockFormEvent = { event: "submit", data: { key: "value" } };
    baseFormInstance.formEvent.emit(mockFormEvent);

    expect(component.onFormEvent).toHaveBeenCalledWith(mockFormEvent);
  });

  it("should call onButtonClick when base-form emits formButtonEvent", () => {
    spyOn(component, "onButtonClick");
    let baseFormDebugElement = fixture.debugElement.query(By.css("base-form"));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    const mockButtonEvent = { button: "save", data: {} };
    baseFormInstance.formButtonEvent.emit(mockButtonEvent);

    expect(component.onButtonClick).toHaveBeenCalledWith(mockButtonEvent);
  });

  it("should call onFormReady when base-form emits formReady", () => {
    spyOn(component, "onFormReady");
    let baseFormDebugElement = fixture.debugElement.query(By.css("base-form"));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    baseFormInstance.formReady.emit();

    expect(component.onFormReady).toHaveBeenCalled();
  });
});
