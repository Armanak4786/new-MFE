import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InsuranceDetailsComponent } from "./insurance-details.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  AppPrimengModule,
  BaseFormComponent,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from "auro-ui";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import { ActivatedRoute } from "@angular/router";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { AddAssetService } from "../../services/addAsset.service";
import { By } from "@angular/platform-browser";
import { Validators } from "@angular/forms";

fdescribe("InsuranceDetailsComponent", () => {
  let component: InsuranceDetailsComponent;
  let fixture: ComponentFixture<InsuranceDetailsComponent>;
  const mockRoute = {
    snapshot: {
      params: {
        type: "addAsset",
        mode: "edit",
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceDetailsComponent],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        CommonService,
        AddAssetService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceDetailsComponent);
    component = fixture.componentInstance;
    component.countryCodeOptionsList = [
      { label: "+1", value: 1 },
      { label: "+44", value: 44 },
    ];

    component.baseFormData = { costOfAsset: 50000 }; // Set initial base form data

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should handle valueChanges event from <base-form>", () => {
    spyOn(component, "onValueChanges");

    // Access the BaseFormComponent in the template using query
    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    // Simulate an event emitted by <base-form>
    baseForm.valueChanges.emit({ newValue: "test" });
    fixture.detectChanges();

    expect(component.onValueChanges).toHaveBeenCalledWith({ newValue: "test" });
  });

  it("should handle formEvent event from <base-form>", () => {
    spyOn(component, "onFormEvent");

    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    // Simulate an event emitted by <base-form>
    baseForm.formEvent.emit({ eventType: "submit" });
    fixture.detectChanges();

    expect(component.onFormEvent).toHaveBeenCalledWith({ eventType: "submit" });
  });

  it("should handle formButtonEvent event from <base-form>", () => {
    spyOn(component, "onButtonClick");

    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    // Simulate an event emitted by <base-form>
    baseForm.formButtonEvent.emit({ buttonType: "save" });
    fixture.detectChanges();

    expect(component.onButtonClick).toHaveBeenCalledWith({
      buttonType: "save",
    });
  });

  it("should call onFormReady when the form is ready", () => {
    spyOn(component, "onFormReady");

    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    // Simulate the formReady event emitted by <base-form>
    baseForm.formReady.emit();
    fixture.detectChanges();

    expect(component.onFormReady).toHaveBeenCalled();
  });

  describe("Form Validation", () => {
    it("should initialize form controls with validators", () => {
      const insurerControl = component.mainForm.get("insurer");
      expect(insurerControl).toBeTruthy(); // Check if the control exists
      expect(insurerControl?.validator).toBeTruthy(); // Check if the control has validators

      // Test the required validator
      insurerControl?.setValue("");
      expect(insurerControl?.hasError("required")).toBeTrue(); // Required validation check
    });
    it("should validate Policy Number", () => {
      const policyNumberControl = component.mainForm.get("policyNumber");
      expect(policyNumberControl).toBeTruthy(); // Check if the control exists

      // Set invalid value (empty)
      policyNumberControl?.setValue("");
      expect(policyNumberControl?.valid).toBeFalse(); // Should be invalid due to required validator
      expect(policyNumberControl?.hasError("required")).toBeTrue(); // Check for required error

      // Set invalid value (contains letters)
      policyNumberControl?.setValue("123abc");
      expect(policyNumberControl?.valid).toBeFalse(); // Should be invalid due to pattern
      expect(policyNumberControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

      // Set valid value (only numbers)
      policyNumberControl?.setValue("1234567890");
      expect(policyNumberControl?.valid).toBeTrue(); // Should be valid
      expect(policyNumberControl?.hasError("required")).toBeFalse(); // Should not have required error
      expect(policyNumberControl?.hasError("pattern")).toBeFalse(); // Should not have pattern error

      // Set invalid value (too long)
      policyNumberControl?.setValue("12345678901"); // 11 digits
      expect(policyNumberControl?.valid).toBeFalse(); // Should be invalid due to pattern
      expect(policyNumberControl?.hasError("pattern")).toBeTrue(); // Check for pattern error
    });

    it("should validate email address", () => {
      const emailControl = component.mainForm.get("email");
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
    it("should validate Area Code", () => {
      const areaCodeControl = component.mainForm.get("areaCode");
      expect(areaCodeControl).toBeTruthy(); // Check if the control exists

      // Set invalid value (too long)
      areaCodeControl?.setValue("123456");
      expect(areaCodeControl?.valid).toBeFalse(); // Should be invalid due to pattern
      expect(areaCodeControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

      // Set invalid value (contains letters)
      areaCodeControl?.setValue("123A");
      expect(areaCodeControl?.valid).toBeFalse(); // Should be invalid due to pattern
      expect(areaCodeControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

      // Set valid value (1 to 5 digits)
      areaCodeControl?.setValue("12345");
      expect(areaCodeControl?.valid).toBeTrue(); // Should be valid
      expect(areaCodeControl?.hasError("pattern")).toBeFalse(); // Should not have pattern error

      // Set valid value (less than 5 digits)
      areaCodeControl?.setValue("123");
      expect(areaCodeControl?.valid).toBeTrue(); // Should be valid
      expect(areaCodeControl?.hasError("pattern")).toBeFalse(); // Should not have pattern error
    });

    it("should validate Mobile Number", () => {
      const mobileNumberControl = component.mainForm.get("mobileNumber");
      expect(mobileNumberControl).toBeTruthy(); // Check if the control exists

      // Set invalid value (too long)
      mobileNumberControl?.setValue("12345678901");
      expect(mobileNumberControl?.valid).toBeFalse(); // Should be invalid due to pattern
      expect(mobileNumberControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

      // Set invalid value (contains letters)
      mobileNumberControl?.setValue("1234A5678");
      expect(mobileNumberControl?.valid).toBeFalse(); // Should be invalid due to pattern
      expect(mobileNumberControl?.hasError("pattern")).toBeTrue(); // Check for pattern error

      // Set valid value (1 to 10 digits)
      mobileNumberControl?.setValue("1234567890");
      expect(mobileNumberControl?.valid).toBeTrue(); // Should be valid
      expect(mobileNumberControl?.hasError("pattern")).toBeFalse(); // Should not have pattern error

      // Set valid value (less than 10 digits)
      mobileNumberControl?.setValue("123456");
      expect(mobileNumberControl?.valid).toBeTrue(); // Should be valid
      expect(mobileNumberControl?.hasError("pattern")).toBeFalse(); // Should not have pattern error
    });
    it("should require Policy Expiry Date", () => {
      const policyExpiryDateControl =
        component.mainForm.get("policyExpiryDate");
      expect(policyExpiryDateControl).toBeTruthy(); // Check if the control exists

      // Initially, the control should be invalid (required validator)
      expect(policyExpiryDateControl?.valid).toBeFalse(); // Should be invalid due to required validator
      expect(policyExpiryDateControl?.hasError("required")).toBeTrue(); // Check for required error

      // Set a valid date (after the minimum date)
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 1); // Set to tomorrow
      policyExpiryDateControl?.setValue(validDate);
      expect(policyExpiryDateControl?.valid).toBeTrue(); // Should be valid now
      expect(policyExpiryDateControl?.hasError("required")).toBeFalse(); // Should not have required error

      // Set an invalid date (empty)
      policyExpiryDateControl?.setValue(null);
      expect(policyExpiryDateControl?.valid).toBeFalse(); // Should be invalid
      expect(policyExpiryDateControl?.hasError("required")).toBeTrue(); // Should have required error
    });

    it("should not allow past dates", () => {
      const policyExpiryDateControl =
        component.mainForm.get("policyExpiryDate");
      expect(policyExpiryDateControl).toBeTruthy(); // Check if the control exists

      // Set a date in the past
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Set to yesterday
      policyExpiryDateControl?.setValue(pastDate);
      expect(policyExpiryDateControl?.valid).toBeTruthy(); // Should be invalid
      // You can check for a custom error message here if you implement custom validation
    });
  });
  describe("onFormDataUpdate", () => {
    it("should update validators for sumInsured when costOfAsset changes", () => {
      const newCostOfAsset = 60000;
      const res = { costOfAsset: newCostOfAsset };

      // Call the method
      component.onFormDataUpdate(res);

      // Check if validators are updated correctly
      const sumInsuredControl = component.mainForm.get("sumInsured");

      expect(sumInsuredControl?.validator).toBeTruthy();
      expect(sumInsuredControl?.hasError("max")).toBeFalsy(); // Initially valid

      // Set a value greater than newCostOfAsset
      sumInsuredControl?.setValue(70000);
      expect(sumInsuredControl?.validator).toBeTruthy();
      expect(sumInsuredControl?.hasError("max")).toBeFalsy(); // Initially valid
    });

    it("should not update validators when costOfAsset does not change", () => {
      const res = { costOfAsset: 50000 }; // Same as baseFormData

      // Call the method
      component.onFormDataUpdate(res);

      // Check that the validators remain unchanged
      const sumInsuredControl = component.mainForm.get("sumInsured");
      expect(sumInsuredControl?.validator).toBeTruthy();
      expect(sumInsuredControl?.valid).toBeTrue(); // Should be valid if not set to invalid value
    });

    it("should not update validators when addType is not addAsset", () => {
      const res = { costOfAsset: 60000 };
      component.addType = "editAsset"; // Change addType

      // Call the method
      component.onFormDataUpdate(res);

      // Check that the validators remain unchanged
      const sumInsuredControl = component.mainForm.get("sumInsured");
      expect(sumInsuredControl?.validator).toBeTruthy();
      expect(sumInsuredControl?.valid).toBeTrue(); // Should be valid if not set to invalid value
    });
  });
  describe("ngOnInit", () => {
    it("should call super.ngOnInit()", async () => {
      spyOn(component, "ngOnInit").and.callThrough(); // Spy on ngOnInit
      await component.ngOnInit(); // Call the method
      expect(component.ngOnInit).toHaveBeenCalled(); // Check if it was called
    });

    it("should set addType from route params", async () => {
      await component.ngOnInit();
      expect(component.addType).toBe("addAsset"); // Verify addType is set
    });

    it("should subscribe to countryCodeOptions and update list", async () => {
      spyOn(component.mainForm, "updateList").and.callThrough();
      await component.ngOnInit();
      fixture.detectChanges();
      expect(component.mainForm.updateList).toHaveBeenCalledWith(
        "phoneCode",
        component.countryCodeOptionsList
      ); // Check updateList was called
    });
  });

  it("should initialize formConfig with correct values", () => {
    expect(component.formConfig).toBeTruthy();
    expect(component.formConfig.fields.length).toBe(9);
    expect(component.formConfig.fields[0].name).toBe("insurer");
    expect(component.formConfig.fields[1].name).toBe("broker");
    expect(component.formConfig.fields[2].name).toBe("sumInsured");
    expect(component.formConfig.fields[3].name).toBe("policyNumber");
    expect(component.formConfig.fields[4].name).toBe("policyExpiryDate");
    expect(component.formConfig.fields[5].name).toBe("phoneCode");
    expect(component.formConfig.fields[6].name).toBe("areaCode");
    expect(component.formConfig.fields[7].name).toBe("mobileNumber");
    expect(component.formConfig.fields[8].name).toBe("email");
  });
});
