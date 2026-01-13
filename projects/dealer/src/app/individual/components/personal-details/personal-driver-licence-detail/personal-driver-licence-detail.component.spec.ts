import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonalDriverLicenceDetailComponent } from "./personal-driver-licence-detail.component";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { IndividualService } from "../../../services/individual.service";
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  UiService,
} from "auro-ui";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { DatePipe } from "@angular/common";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { of } from "rxjs";

fdescribe("PersonalDriverLicenceDetailComponent", () => {
  let component: PersonalDriverLicenceDetailComponent;
  let fixture: ComponentFixture<PersonalDriverLicenceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalDriverLicenceDetailComponent, BaseFormComponent],
      imports: [BrowserDynamicTestingModule, CoreAppModule],
      providers: [
        IndividualService,
        FormBuilder,
        CommonService,
        AuthenticationService,
        JwtHelperService,
        AuthenticationService,
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

    fixture = TestBed.createComponent(PersonalDriverLicenceDetailComponent);
    component = fixture.componentInstance;

    // Mock baseFormData to simulate an edit scenario
    component.baseFormData = {
      personalDetails: {
        licenceType: "Class 1",
        countryOfIssue: "New Zealand",
        licenceNumber: "ABC123",
        versionNumber: "001",
      },
    };
    // Mock countryList data
    // component.countryList = [
    //   { label: 'New Zealand', value: 'New Zealand' },
    //   { label: 'Australia', value: 'Australia' },
    // ];
    fixture.detectChanges();
  });

  it("should not patch values if mode is not edit", async () => {
    // Set the mode to 'view' (not 'edit')
    component.mode = "view";

    // Call ngOnInit
    await component.ngOnInit();

    // Assert that form controls have not been patched
    expect(component.mainForm.get("licenseType")?.value).toBeNull();
    expect(component.mainForm.get("countryOfIssue")?.value).toBeNull();
    expect(component.mainForm.get("licenceNumber")?.value).toBeNull();
    expect(component.mainForm.get("versionNumber")?.value).toBeNull();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have the required and pattern validators for licenceNumber", () => {
    const licenceNumberControl = component.mainForm.get("licenceNumber");
    expect(licenceNumberControl?.validator).toBeDefined();

    // Trigger validation manually by setting a value
    licenceNumberControl?.setValue("ABC#123");
    const errors = licenceNumberControl?.errors || {};

    // Pattern error should appear due to invalid characters
    expect(errors["pattern"]).toBeTruthy();
  });
  it("should have a max length of 3 for versionNumber", () => {
    const versionNumberControl = component.mainForm.get("versionNumber");
    expect(versionNumberControl?.validator).toBeDefined();

    // Set an invalid value exceeding the max length
    versionNumberControl?.setValue("1234");
    const errors = versionNumberControl?.errors || {};

    expect(errors["maxlength"]).toBeTruthy();
  });
  it("should have default countryOfIssue set to New Zealand in createData", () => {
    expect(component.formConfig.createData?.countryOfIssue).toBe("New Zealand");
  });
});
