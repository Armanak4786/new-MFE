import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BusinessDetailsComponent } from "./business-details.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  GenericFormConfig,
  LibSharedModule,
  UiService,
} from "auro-ui";
import { IndividualService } from "../../../../individual/services/individual.service";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormControlStatus, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { BusinessContactDeatilComponent } from "../business-contact-deatil/business-contact-deatil.component";
import { BusinessService } from "../../../services/business";

fdescribe("BusinessDetailsComponent", () => {
  let component: BusinessDetailsComponent;
  let fixture: ComponentFixture<BusinessDetailsComponent>;
  let businessService;

  beforeEach(async () => {
    businessService = {
      formStatusArr: [],
      setBaseDealerFormData: jasmine.createSpy("setBaseDealerFormData"),
    };

    const svcMock = {
      ui: {
        showError: jasmine.createSpy("showError"),
      },
    };

    await TestBed.configureTestingModule({
      declarations: [BusinessDetailsComponent, BusinessContactDeatilComponent],
      imports: [
        BrowserDynamicTestingModule,
        CoreAppModule,
        LibSharedModule,
        AppPrimengModule,
      ],
      providers: [
        { provide: BusinessService, useValue: businessService }, // Provide the mock for BaseService
        CommonService,
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        UiService,
        MessageService,
        DatePipe,
        FormBuilder,
        { provide: ActivatedRoute, useValue: { params: of({}) } },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessDetailsComponent);
    component = fixture.componentInstance;
    component.customerRoleForm = component.fb.group({
      role: ["", Validators.required],
    });

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should create the form with default values", () => {
    expect(component.customerRoleForm).toBeTruthy();
    expect(component.customerRoleForm.get("role").value).toBe(""); // or whatever the default value is
  });

  it("should mark role as required", () => {
    const roleControl = component.customerRoleForm.get("role");
    roleControl.setValue(null); // Simulate empty value
    roleControl.markAsTouched();

    expect(roleControl.invalid).toBeTruthy();
    expect(roleControl.errors).toEqual({ required: true });
  });
  it("should call getvalue() on dropdown change", () => {
    spyOn(component, "getvalue");

    const dropdown = fixture.debugElement.query(By.css("p-dropdown"));
    dropdown.triggerEventHandler("onChange", { value: "newValue" });

    expect(component.getvalue).toHaveBeenCalled();
  });
  it("should render base-form and app-business-contact-detail components", () => {
    const baseForm = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    );
    const businessContactDetail = fixture.debugElement.query(
      By.directive(BusinessContactDeatilComponent)
    );

    expect(baseForm).toBeTruthy();
    expect(businessContactDetail).toBeTruthy();
  });

  describe("Organisation Type Field", () => {
    it("should have an organisation type field with correct properties", () => {
      const field = component.formConfig.fields.find(
        (f) => f.name === "organisationType"
      );
      expect(field).toBeTruthy();
      expect(field.type).toBe("select");
      expect(field.label).toBe("Organisation Type");
      expect(field["list$"]).toBe(
        "LookUpServices/lookups?LookupSetName=BusinessEntityType"
      );
      expect(field["validators"]).toEqual([Validators.required]);
    });

    describe("Legal Name Field", () => {
      it("should have a legal name field with correct properties", () => {
        const field = component.formConfig.fields.find(
          (f) => f.name === "legalName"
        );
        expect(field).toBeTruthy();
        expect(field.type).toBe("text");
        expect(field.label).toBe("Legal Name");
        expect(field["regexPattern"]).toBe("[^a-zA-Z ]*");
        expect(field["maxLength"]).toBe(30);
        expect(field["validators"]).toEqual([Validators.required]);
      });
    });

    describe("Trading Name Field", () => {
      it("should have a trading name field with correct properties", () => {
        const field = component.formConfig.fields.find(
          (f) => f.name === "tradingName"
        );
        expect(field).toBeTruthy();
        expect(field.type).toBe("text");
        expect(field.label).toBe("Trading Name");
        expect(field["regexPattern"]).toBe("[^a-zA-Z ]*");
        expect(field["maxLength"]).toBe(30);
        expect(field["validators"]).toEqual([Validators.required]);
      });
    });

    describe("Registered Company Number Field", () => {
      it("should have a registered company number field with correct properties", () => {
        const field = component.formConfig.fields.find(
          (f) => f.name === "registeredCompanyNumber"
        );
        expect(field).toBeTruthy();
        expect(field.type).toBe("text");
        expect(field.label).toBe("Registered Company Number");
        expect(field["regexPattern"]).toBe("[^a-zA-Z0-9]*");
        expect(field["maxLength"]).toBe(15);
        expect(field["validators"]).toEqual([Validators.required]);
      });
    });

    describe("New Zealand Business Number Field", () => {
      it("should have a New Zealand business number field with correct properties", () => {
        const field = component.formConfig.fields.find(
          (f) => f.name === "newZealandBusinessNumber"
        );
        expect(field).toBeTruthy();
        expect(field.type).toBe("text");
        expect(field.label).toBe("New Zealand Business Number");
        expect(field["regexPattern"]).toBe("[^a-zA-Z0-9]*");
        expect(field["maxLength"]).toBe(15);
        expect(field["validators"]).toEqual([Validators.required]);
      });
    });

    describe("GST Number Field", () => {
      it("should have a GST number field with correct properties", () => {
        const field = component.formConfig.fields.find(
          (f) => f.name === "gstNumber"
        );
        expect(field).toBeTruthy();
        expect(field.type).toBe("text");
        expect(field.label).toBe("GST Number");
        expect(field["regexPattern"]).toBe("[^a-zA-Z0-9]*");
        expect(field["maxLength"]).toBe(15);
        expect(field["validators"]).toEqual([Validators.required]);
      });
    });

    describe("Business Description Field", () => {
      it("should have a business description field with correct properties", () => {
        const field = component.formConfig.fields.find(
          (f) => f.name === "businessDescription"
        );
        expect(field).toBeTruthy();
        expect(field.type).toBe("textArea");
        expect(field.label).toBe("Business Description");
        expect(field["validators"]).toEqual([Validators.required]);
        expect(field.cols).toBe(4);
        expect(field["textAreaRows"]).toBe(4);
      });
    });

    describe("Nature Of Business Field", () => {
      it("should have a nature of business field with correct options and properties", () => {
        const field = component.formConfig.fields.find(
          (f) => f.name === "natureOfBusiness"
        );
        expect(field).toBeTruthy();
        expect(field.type).toBe("select");
        expect(field.label).toBe("Primary Nature Of Business");
        expect(field["options"].length).toBeGreaterThan(0);
        expect(field["validators"]).toEqual([Validators.required]);
      });
    });
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

  it("should render app-business-contact-detail component", () => {
    const businessContactDetailEl = fixture.nativeElement.querySelector(
      "app-business-contact-deatil"
    );
    expect(businessContactDetailEl).toBeTruthy(); // Check if the component is in the DOM
  });

  it("should call setBaseDealerFormData with the correct value", () => {
    const testValue = "Dealer"; // Define a test value
    component.getvalue(testValue); // Call the function with the test value

    // Expect the service method to be called with the correct argument
    expect(businessService.setBaseDealerFormData).toHaveBeenCalledWith({
      role: testValue,
    });
  });

  it("should call proceedEmailForm and push formStatus when stepperDetails.validate is true", () => {
    const stepperDetails = { validate: true }; // Mock stepperDetails with validate = true
    const formStatus: FormControlStatus = "VALID"; // Use a valid FormControlStatus value

    // Spy on the proceedEmailForm method to return a mock form status
    spyOn(component, "proceedEmailForm").and.returnValue(formStatus);

    // Call the onStepChange function
    component.onStepChange(stepperDetails);

    // Expect proceedEmailForm to have been called
    expect(component.proceedEmailForm).toHaveBeenCalled();

    // Expect formStatus to be pushed to formStatusArr
    expect(businessService.formStatusArr).toContain(formStatus);
  });
  it("should not call proceedEmailForm or push when stepperDetails.validate is false", () => {
    const stepperDetails = { validate: false }; // Mock stepperDetails with validate = false

    // Spy on the proceedEmailForm method but expect it not to be called
    spyOn(component, "proceedEmailForm");

    // Call the onStepChange function
    component.onStepChange(stepperDetails);

    // Expect proceedEmailForm not to have been called
    expect(component.proceedEmailForm).not.toHaveBeenCalled();

    // Expect formStatusArr.push not to have been called (or not modified)
    expect(businessService.formStatusArr.length).toBe(0);
  });
  it("should call validateEmailData and return the form status when proceedEmailForm is called", () => {
    // Spy on the validateEmailData method
    spyOn(component, "validateEmailData").and.callThrough();

    // Set the form to a valid state
    component.customerRoleForm.setValue({
      role: "admin",
    });

    // Call the proceedEmailForm method
    const result = component.proceedEmailForm();

    // Expect validateEmailData to have been called
    expect(component.validateEmailData).toHaveBeenCalled();

    // Expect the form to return 'VALID'
    expect(result).toBe("VALID");
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
});
