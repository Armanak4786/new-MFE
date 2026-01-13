import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TrustDetailComponent } from "./trust-detail.component";
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  LibSharedModule,
} from "auro-ui";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, of } from "rxjs";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { TrustService } from "../../../services/trust.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { TrustContactDetailsComponent } from "../trust-contact-details/trust-contact-details.component";
import { TrustEmailContactDetailsComponent } from "../trust-email-contact-details/trust-email-contact-details.component";
import { CommonModule } from "@angular/common";
import { FormControl, Validators } from "@angular/forms";
import { BaseDealerService } from "../../../../base/base-dealer.service";
import { DealerModule } from "../../../../dealer.module";
import { BaseTrustClass } from "../../../base-trust.class";

fdescribe("TrustDetailComponent", () => {
  let component: TrustDetailComponent;
  let fixture: ComponentFixture<TrustDetailComponent>;
  let mockTrustService: any;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let baseSvc: jasmine.SpyObj<BaseDealerService>;
  let baseDealerFormDataSubject: BehaviorSubject<{ someData: string }>;

  beforeEach(async () => {
    baseDealerFormDataSubject = new BehaviorSubject<{ someData: string }>({
      someData: "mockData",
    });

    mockTrustService = {
      formStatusArr: [],
      setBaseDealerFormData: jasmine.createSpy("setBaseDealerFormData"),
    };

    const baseSvcSpy = jasmine.createSpyObj("BaseService", [
      "getBaseDealerFormData",
    ]);
    baseSvcSpy.getBaseDealerFormData.and.returnValue(baseDealerFormDataSubject);

    // Spying on formStatusArr.push method
    spyOn(mockTrustService.formStatusArr, "push");

    await TestBed.configureTestingModule({
      declarations: [
        TrustDetailComponent,
        TrustContactDetailsComponent,
        TrustEmailContactDetailsComponent,
      ],
      imports: [AppPrimengModule, CoreAppModule, LibSharedModule, DealerModule],
      providers: [
        JwtHelperService,
        AuthenticationService,
        { provide: TrustService, useValue: mockTrustService },
        { provide: BaseDealerService, useValue: baseSvcSpy }, // Provide the spy instead of real service

        ConfirmationService,
        MessageService,
        CommonService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustDetailComponent);
    component = fixture.componentInstance;

    baseSvcSpy.getBaseDealerFormData.and.returnValue(baseDealerFormDataSubject);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form group", () => {
    expect(component.customerRoleForm).toBeDefined();
    expect(component.customerRoleForm.get("role")).toBeTruthy();
  });

  it("should display required error message if role is not selected and form is touched", () => {
    const roleControl = component.customerRoleForm.get("role");
    roleControl.markAsTouched();
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector(".p-error");
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.textContent).toContain("Customer Role is required");
  });

  it("should call getvalue() when dropdown value changes", () => {
    spyOn(component, "getvalue");

    const dropdown = fixture.nativeElement.querySelector("p-dropdown");
    dropdown.dispatchEvent(new Event("onChange")); // Simulate dropdown change event

    fixture.detectChanges();

    expect(component.getvalue).toHaveBeenCalled();
  });

  it("should handle base-form component events", () => {
    spyOn(component, "onValueChanges");
    spyOn(component, "onFormEvent");
    spyOn(component, "onButtonClick");
    spyOn(component, "onFormReady");

    // Accessing the base-form instance using the template reference variable
    const baseForm = component.mainForm;

    baseForm.valueChanges.emit({}); // Simulate value changes
    baseForm.formEvent.emit({});
    baseForm.formButtonEvent.emit({});
    baseForm.formReady.emit();

    expect(component.onValueChanges).toHaveBeenCalled();
    expect(component.onFormEvent).toHaveBeenCalled();
    expect(component.onButtonClick).toHaveBeenCalled();
    expect(component.onFormReady).toHaveBeenCalled();
  });

  it("should render app-trust-contact-details component", () => {
    const trustContactComponent = fixture.nativeElement.querySelector(
      "app-trust-contact-details"
    );
    expect(trustContactComponent).toBeTruthy();
  });

  describe("onStepChange", () => {
    it("should validate and push form status if validate is true", () => {
      const stepperDetails = { validate: true };
      spyOn(component, "proceedEmailForm").and.returnValue("VALID");
      component.customerRoleForm = component.fb.group({
        role: ["Borrower"],
      });

      fixture.detectChanges();

      // Call the onStepChange function
      component.onStepChange(stepperDetails);

      // Assert that push has been called with 'VALID'
      expect(mockTrustService.formStatusArr.push).toHaveBeenCalledWith("VALID");
    });

    it("should not validate if validate is false", () => {
      const stepperDetails = { validate: false };
      spyOn(component, "proceedEmailForm");

      component.onStepChange(stepperDetails);
      expect(component.proceedEmailForm).not.toHaveBeenCalled();
    });
  });

  it('should return "valid" when the form is valid', () => {
    // Arrange: Set the form control value to a valid value and mark it as touched
    component.customerRoleForm.controls["role"].setValue("Borrower");
    component.customerRoleForm.controls["role"].markAsTouched();

    // Act: Call proceedEmailForm
    const result = component.proceedEmailForm();

    // Assert: Check that the returned value is valid
    expect(result).toBe("VALID");
  });

  it('should return "invalid" and show error when the form is invalid', () => {
    // Arrange: Set the form control value to an invalid value
    component.customerRoleForm.controls["role"].setValue("");
    component.customerRoleForm.controls["role"].markAsTouched();

    spyOn(component.svc.ui, "showError").and.callThrough();

    // Act: Call proceedEmailForm
    const result = component.proceedEmailForm();

    // Assert: Check that the returned value is invalid
    expect(result).toBe("INVALID");
    expect(component.svc.ui.showError).toHaveBeenCalledWith(
      "Please complete the form before submitting"
    );
  });

  describe("validateEmailData", () => {
    it("should mark all controls as touched and check form status", () => {
      const control = component.customerRoleForm.get("role");
      spyOn(control!, "markAsTouched");
      spyOn(control!, "updateValueAndValidity");

      component.validateEmailData();
      expect(control!.markAsTouched).toHaveBeenCalled();
      expect(control!.updateValueAndValidity).toHaveBeenCalled();
    });

    it("should mark all controls as touched and validate them in validateEmailData", () => {
      // Spy on showError method
      spyOn(component, "validateEmailData").and.callThrough();

      // Mock the form to be invalid
      component.customerRoleForm.setValue({
        role: "", // Missing role
      });

      spyOn(component.svc.ui, "showError").and.callThrough();

      // Call the proceedEmailForm
      const result = component.proceedEmailForm();

      // Expect all form controls to be marked as touched
      expect(component.customerRoleForm.get("role")?.touched).toBe(true);

      // Expect form to return 'INVALID'
      expect(result).toBe("INVALID");

      // Expect showError to be called
      expect(component.svc.ui.showError).toHaveBeenCalledWith(
        "Please complete the form before submitting"
      );
    });

    it('should return "INVALID" if form is invalid in validateEmailData', () => {
      // Mock the form as invalid
      component.customerRoleForm.setValue({
        role: "", // Invalid role
      });

      spyOn(component.svc.ui, "showError").and.callThrough();

      // Call validateEmailData
      const result = component.validateEmailData();

      component.svc.ui.showError("Please complete the form before submitting");
      fixture.detectChanges();

      // Expect showError to have been called
      expect(component.svc.ui.showError).toHaveBeenCalledWith(
        "Please complete the form before submitting"
      );

      // Expect result to be 'INVALID'
      expect(result).toBe("INVALID");
    });

    it("should return form status", () => {
      component.customerRoleForm.controls["role"].setValue("Borrower");
      const status = component.validateEmailData();
      expect(status).toBe("VALID");
    });
  });

  it("should call setBaseDealerFormData on getvalue", () => {
    const value = 1; // Example value for role

    component.getvalue(value);

    expect(mockTrustService.setBaseDealerFormData).toHaveBeenCalledWith({
      role: value,
    });
  });

  it("should have the correct form configuration", () => {
    const formConfig = component.formConfig;

    // Trust Type Field
    const trustTypeField = formConfig.fields.find(
      (field) => field.name === "trustType"
    );
    expect(trustTypeField).toBeDefined();
    expect(trustTypeField.type).toBe("select");
    expect(trustTypeField.label).toBe("Trust Type ");
    expect(trustTypeField["validators"]).toContain(Validators.required);

    // Trust Name Field
    const trustNameField = formConfig.fields.find(
      (field) => field.name === "trustName"
    );
    expect(trustNameField).toBeDefined();
    expect(trustNameField.type).toBe("text");
    expect(trustNameField.label).toBe("Trust Name ");
    expect(trustNameField["validators"]).toContain(Validators.required);
    expect(trustNameField["regexPattern"]).toBe("[^a-zA-Z ]*");
    expect(trustNameField["maxLength"]).toBe(30);

    // Trust Trading Name Field
    const trustTradingNameField = formConfig.fields.find(
      (field) => field.name === "trustTradingName"
    );
    expect(trustTradingNameField).toBeDefined();
    expect(trustTradingNameField.type).toBe("text");
    expect(trustTradingNameField.label).toBe("Trading Name ");
    expect(trustTradingNameField["validators"]).toContain(Validators.required);
    expect(trustTradingNameField["regexPattern"]).toBe("[^a-zA-Z ]*");
    expect(trustTradingNameField["maxLength"]).toBe(30);

    // Registered Number Field
    const trustRegNumField = formConfig.fields.find(
      (field) => field.name === "trustRegNum"
    );
    expect(trustRegNumField).toBeDefined();
    expect(trustRegNumField.type).toBe("text");
    expect(trustRegNumField.label).toBe("Registered Number ");
    expect(trustRegNumField["validators"]).toContain(Validators.required);
    expect(trustRegNumField["regexPattern"]).toBe("[^a-zA-Z0-9]*");
    expect(trustRegNumField["maxLength"]).toBe(15);

    // GST Number Field
    const trustGstNumField = formConfig.fields.find(
      (field) => field.name === "taxNumber"
    );
    expect(trustGstNumField).toBeDefined();
    expect(trustGstNumField.type).toBe("text");
    expect(trustGstNumField.label).toBe("GST Number ");
    expect(trustGstNumField["validators"]).toContain(Validators.required);
    expect(trustGstNumField["regexPattern"]).toBe("[^a-zA-Z0-9]*");
    expect(trustGstNumField["maxLength"]).toBe(15);

    // Trust Purpose Field
    const trustPurposeField = formConfig.fields.find(
      (field) => field.name === "trustPurpose"
    );
    expect(trustPurposeField).toBeDefined();
    expect(trustPurposeField.type).toBe("textArea");
    expect(trustPurposeField.label).toBe("Trust Purpose");
    expect(trustPurposeField["validators"]).toContain(Validators.required);

    // Primary Nature Of Business Field
    const primaryNatureTrustField = formConfig.fields.find(
      (field) => field.name === "primaryNatureTrust"
    );
    expect(primaryNatureTrustField).toBeDefined();
    expect(primaryNatureTrustField.type).toBe("select");
    expect(primaryNatureTrustField.label).toBe("Primary Nature Of Business");
    expect(primaryNatureTrustField["validators"]).toContain(
      Validators.required
    );

    // Source Of Wealth Field
    const sourceOfWealthField = formConfig.fields.find(
      (field) => field.name === "sourceOfWealth"
    );
    expect(sourceOfWealthField).toBeDefined();
    expect(sourceOfWealthField.type).toBe("select");
    expect(sourceOfWealthField.label).toBe("Source Of Wealth");

    // Total Assets Field
    const totalAssetField = formConfig.fields.find(
      (field) => field.name === "totalAsset"
    );
    expect(totalAssetField).toBeDefined();
    expect(totalAssetField.type).toBe("select");
    expect(totalAssetField.label).toBe("Total Assets");

    // Time In Trust Years Field
    const timeInTrustYearsField = formConfig.fields.find(
      (field) => field.name === "timeInTrustYears"
    );
    expect(timeInTrustYearsField).toBeDefined();
    expect(timeInTrustYearsField.type).toBe("number");
    expect(timeInTrustYearsField.label).toBe("Time In Trust");

    const validators = timeInTrustYearsField["validators"];

    const hasRequiredValidator = validators.some(
      (v) => v === Validators.required
    );
    const hasMaxValidator = validators.some((v) => v === Validators.max(99));

    expect(hasRequiredValidator).toBeTrue();
    expect(hasMaxValidator).toBeFalsy();
  });

  it("should set max and maxLength validators for timeInTrustMonths field", () => {
    const timeInTrustMonthsField = component.formConfig.fields.find(
      (field) => field.name === "timeInTrustMonths"
    );

    // Create a form control with validators
    const control = new FormControl("", timeInTrustMonthsField["validators"]);

    // Check if the control has the max validator
    const hasMaxValidator = control.hasValidator(Validators.max(11));
    expect(hasMaxValidator).toBeFalsy();

    // Check if the control has the maxLength validator
    const hasMaxLengthValidator = control.hasValidator(Validators.maxLength(2));
    expect(hasMaxLengthValidator).toBeFalsy();

    // Test if the validators work with invalid values
    control.setValue("12");
    expect(control.hasError("max")).toBeTrue();

    control.setValue("123");
    expect(control.hasError("maxlength")).toBeTrue();
  });

  // it('should call getBaseDealerFormData and handle the result', () => {
  //   component.ngOnInit(); // or any other method that calls getBaseDealerFormData
  //   baseSvc.getBaseDealerFormData();
  //   fixture.detectChanges();
  //   expect(baseSvc.getBaseDealerFormData).toHaveBeenCalled();
  //   expect(baseDealerFormDataSubject.getValue().someData).toBe('mockData');
  // });
});
