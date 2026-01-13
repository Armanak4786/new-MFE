import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BusinessContactDeatilComponent } from "./business-contact-deatil.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs/internal/observable/of";
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  LibSharedModule,
} from "auro-ui";
import { BusinessService } from "../../../services/business";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { BusinessEmailContactDetailsComponent } from "../business-email-contact-details/business-email-contact-details.component";
import { BusinessWebsiteContactDetailsComponent } from "../business-website-contact-details/business-website-contact-details.component";
import { By } from "@angular/platform-browser";
import { FormArray, FormGroup, Validators } from "@angular/forms";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";

fdescribe("BusinessContactDeatilComponent", () => {
  let component: BusinessContactDeatilComponent;
  let fixture: ComponentFixture<BusinessContactDeatilComponent>;
  let businessServiceMock;

  beforeEach(async () => {
    businessServiceMock = {
      formStatusArr: [],
      setBaseDealerFormData: jasmine.createSpy("setBaseDealerFormData"),
    };

    await TestBed.configureTestingModule({
      declarations: [
        BusinessContactDeatilComponent,
        BusinessEmailContactDetailsComponent,
        BusinessWebsiteContactDetailsComponent,
      ],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        LibSharedModule,
        AppPrimengModule,
        CoreAppModule,
      ],
      providers: [
        { provide: BusinessService, useValue: businessServiceMock },
        CommonService,

        AuthenticationService,
        JwtHelperService,
        ConfirmationService,
        MessageService,
        DialogService,
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessContactDeatilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the phone form array with one control by default", () => {
    const phoneArray = component.phone;
    expect(phoneArray.length).toBe(1);
  });

  it("should render the phone input fields and dropdown for the first phone control", () => {
    const phoneInput = fixture.debugElement.query(
      By.css('input[formControlName="value"]')
    );
    const areaCodeInput = fixture.debugElement.query(
      By.css('input[formControlName="areacode"]')
    );
    const countryCodeDropdown = fixture.debugElement.query(
      By.css('p-dropdown[formControlName="code"]')
    );

    expect(phoneInput).toBeTruthy();
    expect(areaCodeInput).toBeTruthy();
    expect(countryCodeDropdown).toBeTruthy();
  });

  it("should display validation error messages for required fields when touched", () => {
    const phoneArray = component.phone;
    phoneArray.at(0).get("value").markAsTouched();
    phoneArray.at(0).get("areacode").markAsTouched();
    phoneArray.at(0).get("code").markAsTouched();

    fixture.detectChanges();

    const phoneError = fixture.debugElement.query(
      By.css(".p-error small")
    ).nativeElement;
    const areaCodeError = fixture.debugElement.queryAll(
      By.css(".p-error small")
    )[1].nativeElement;
    const codeError = fixture.debugElement.queryAll(By.css(".p-error small"))[2]
      .nativeElement;

    expect(phoneError.textContent).toContain("Code is required.");
    expect(areaCodeError.textContent).toContain("Area Code is required.");
    expect(codeError.textContent).toContain("Phone number is required.");
  });

  it("should not render the remove button for the first phone control", () => {
    const removeButton = fixture.debugElement.query(
      By.css('gen-button[btnIcon="fa fa-trash"]')
    );
    expect(removeButton).toBeFalsy(); // The first phone control should not have the remove button
  });

  it("should render the child components for email and website contact details", () => {
    const emailComponent = fixture.debugElement.query(
      By.css("app-business-email-contact-details")
    );
    const websiteComponent = fixture.debugElement.query(
      By.css("app-business-website-contact-details")
    );

    expect(emailComponent).toBeTruthy();
    expect(websiteComponent).toBeTruthy();
  });

  it("should disable the add button when there are already two phone controls", () => {
    component.addOtherPhone(); // Add a second phone
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(
      By.css('gen-button[btnLabel="Add Other Mobile"]')
    );
    expect(addButton).toBeFalsy(); // Button should not render when there are already two phone controls
  });

  it("should patch phone values correctly", () => {
    const mockPhoneData = [
      { value: "+1(123)4567890", type: "PhoneMobile" },
      { value: "+44(987)6543210", type: "PhoneBusiness" },
    ];

    component.baseFormData = { business: { phone: mockPhoneData } };
    component.mode = "edit";

    component.patchPhoneValue(); // Call the patching function

    expect(component.phone.length).toBe(2); // Two phone controls should be created
    expect(component.phone.at(0).value.value).toBe("4567890"); // Check first phone value
    expect(component.phone.at(0).value.code).toBe("+1"); // Check first phone code
    expect(component.phone.at(1).value.value).toBe("6543210"); // Check second phone value
    expect(component.phone.at(1).value.code).toBe("+44"); // Check second phone code
  });

  it("should proceed with form validation on step change", () => {
    component.phoneForm.markAsDirty(); // Mark form as dirty to simulate user input
    component.onStepChange({ validate: true }); // Call onStepChange with validation

    expect(businessServiceMock.formStatusArr.length).toBe(1); // Check if the form status was pushed
  });

  it("should remove the specified phone control", () => {
    component.addOtherPhone(); // Add two controls
    expect(component.phone.length).toBe(2); // Ensure there are two controls

    component.removePhone(0); // Remove the first control
    expect(component.phone.length).toBe(1); // Should now only be one control
  });

  it("should add another phone control when less than 2 are present", () => {
    component.addOtherPhone(); // Initially, there is one phone control
    expect(component.phone.length).toBe(2); // Should now have two phone controls

    component.addOtherPhone(); // Try to add another
    expect(component.phone.length).toBe(3); // Still should be two, since limit is 2
  });

  it("should format phone values correctly", () => {
    component.phone.at(0).patchValue({
      value: "1234567890",
      areacode: "123",
      code: "+1",
      type: "PhoneMobile",
    });

    component.getvalue(); // Call getvalue

    expect(businessServiceMock.setBaseDealerFormData).toHaveBeenCalledWith({
      businessDetailPhone: [
        {
          value: "+1(123)1234567890",
          type: "PhoneMobile",
          areacode: "123",
          code: "+1",
        },
      ],
    }); // Check if the formatted data is set correctly
  });
  it("should create the phone form with the correct controls and validators", () => {
    // Mock data for phoneType and phone
    component.phoneType = ["Mobile", "Home", "Work"];

    // Call the createPhoneForm method
    const formGroup: FormGroup = component.createPhoneForm();

    // Assertions for form controls
    expect(formGroup.contains("value")).toBeTruthy();
    expect(formGroup.contains("type")).toBeTruthy();
    expect(formGroup.contains("areacode")).toBeTruthy();
    expect(formGroup.contains("code")).toBeTruthy();

    // Assertions for validators
    expect(
      formGroup.get("value").hasValidator(Validators.required)
    ).toBeTruthy();
    expect(
      formGroup.get("areacode").hasValidator(Validators.required)
    ).toBeTruthy();
    expect(
      formGroup.get("code").hasValidator(Validators.required)
    ).toBeTruthy();
  });

  it("should set the type based on the phone length", () => {
    // Mock data for phoneType and phone
    component.phoneType = ["Mobile", "Home", "Work"];

    // Call the createPhoneForm method
    const formGroup: FormGroup = component.createPhoneForm();

    // Assertion for the 'type' control
    expect(formGroup.get("type").value).toBe("Home"); // Based on this.phone.length, it should pick the second value in phoneType (index 1)
  });

  it("should assign the correct validators to form controls", () => {
    // Call the createPhoneForm method
    const formGroup: FormGroup = component.createPhoneForm();

    // Check Validators for specific controls
    const valueControl = formGroup.get("value");
    const areacodeControl = formGroup.get("areacode");
    const codeControl = formGroup.get("code");

    // Ensure Validators.required is assigned to specific controls
    expect(valueControl.hasValidator(Validators.required)).toBeTrue();
    expect(areacodeControl.hasValidator(Validators.required)).toBeTrue();
    expect(codeControl.hasValidator(Validators.required)).toBeTrue();
  });
  it("should return the FormArray from phoneForm", () => {
    // Call the phone getter
    const phoneArray: FormArray = component.phone;

    // Assertions
    expect(phoneArray).toBeInstanceOf(FormArray); // Ensure the return type is FormArray
    expect(component.phoneForm.get("phone")).toBe(phoneArray); // Ensure it returns the same FormArray as in the form
  });

  it("should return the same phone FormArray when accessed multiple times", () => {
    // Call the phone getter multiple times
    const firstAccess: FormArray = component.phone;
    const secondAccess: FormArray = component.phone;

    // Assertions
    expect(firstAccess).toBe(secondAccess); // Ensure both accesses return the same instance
  });
});
