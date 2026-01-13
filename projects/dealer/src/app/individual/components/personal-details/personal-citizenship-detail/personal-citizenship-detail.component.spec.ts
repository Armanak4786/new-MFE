import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonalCitizenshipDetailComponent } from "./personal-citizenship-detail.component";
import { AuthenticationService, CommonService, UiService } from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import { ActivatedRoute } from "@angular/router";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import { AppPrimengModule, AuroUiFrameWork } from "auro-ui";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { FormArray, FormGroup, Validators } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { GenButtonComponent } from "auro-ui";

fdescribe("PersonalCitizenshipDetailComponent", () => {
  let component: PersonalCitizenshipDetailComponent;
  let fixture: ComponentFixture<PersonalCitizenshipDetailComponent>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockIndividualService: jasmine.SpyObj<IndividualService>;

  beforeEach(async () => {
    mockIndividualService = jasmine.createSpyObj("IndividualService", [
      "setBaseDealerFormData",
    ]);
    mockCommonService = jasmine.createSpyObj("CommonService", [
      "showError",
      "ui",
      "proceedForm",
    ]);
    await TestBed.configureTestingModule({
      declarations: [PersonalCitizenshipDetailComponent],
      imports: [
        BrowserDynamicTestingModule,
        CoreAppModule,
        AppPrimengModule,
        AuroUiFrameWork,
      ],
      providers: [
        AuthenticationService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: CommonService, useValue: mockCommonService },
        { provide: IndividualService, useValue: mockIndividualService },
        { provide: JWT_OPTIONS, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalCitizenshipDetailComponent);
    component = fixture.componentInstance;
    component.citizenshipForm = component.fb.group({
      citizenships: component.fb.array([
        component.fb.group({
          isResident: true,
          countryOfCitizenship: ["NZ", Validators.required],
          countryOfBirth: ["NZ", Validators.required],
        }),
      ]),
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should initialize the citizenshipForm with default values", () => {
    component.ngOnInit(); // Trigger ngOnInit
    expect(component.citizenshipForm).toBeDefined();
    expect(component.citizenships.length).toBe(1); // One default entry
    expect(component.citizenships.at(0).get("countryOfCitizenship").value).toBe(
      "NZ"
    );
    expect(component.citizenships.at(0).get("countryOfBirth").value).toBe("NZ");
  });
  it("should update the citizenship form values based on switch change", () => {
    component.onSwitchChange({ checked: false });
    expect(component.citizenships.at(0).get("isResident").value).toBe(false);
    expect(component.citizenships.at(0).get("countryOfBirth").value).toBe("");
    expect(component.citizenships.at(0).get("countryOfCitizenship").value).toBe(
      ""
    );

    component.onSwitchChange({ checked: true });
    expect(component.citizenships.at(0).get("isResident").value).toBe(true);
    expect(component.citizenships.at(0).get("countryOfBirth").value).toBe("NZ");
    expect(component.citizenships.at(0).get("countryOfCitizenship").value).toBe(
      "NZ"
    );
  });
  it("should call setBaseDealerFormData with correct value", () => {
    // Arrange: Set up the form values to be used in the test

    // Act: Call the getvalue method
    component.getvalue();

    expect(mockIndividualService.setBaseDealerFormData).toHaveBeenCalledWith({
      personalDetailsCitizenship: component.citizenshipForm.value.phone,
    });
  });

  it("should validate the form and push the result to formStatusArr when stepperDetails.validate is true", () => {
    const stepperDetails = { validate: true };

    // Mock the proceedForm method to return 'VALID'
    (mockCommonService.proceedForm as jasmine.Spy).and.returnValue("VALID");

    // Mock the formStatusArr
    component.individualSvc.formStatusArr = [];

    // Call the method
    mockCommonService.proceedForm(component.citizenshipForm);
    component.onStepChange(stepperDetails);
    fixture.detectChanges();

    // Check that proceedForm was called with the correct form
    expect(mockCommonService.proceedForm).toHaveBeenCalledWith(
      component.citizenshipForm
    );
    expect(mockIndividualService.formStatusArr).toContain("VALID");

    // Check that the form status is pushed to formStatusArr
  });
  it("should create a citizenship form group with the correct structure", () => {
    // Act
    const citizenshipFormGroup = component.createCitizenshiForm();

    // Assert
    expect(citizenshipFormGroup instanceof FormGroup).toBeTrue();
    expect(citizenshipFormGroup.contains("countryOfCitizenship")).toBeTrue();
    expect(citizenshipFormGroup.contains("countryOfBirth")).toBeTrue();
    expect(citizenshipFormGroup.get("countryOfCitizenship").value).toBeNull();
    expect(citizenshipFormGroup.get("countryOfBirth").value).toBeNull();
  });

  it("should return the citizenships FormArray", () => {
    // Arrange
    const citizenshipsArray = component.citizenships;

    // Assert
    expect(citizenshipsArray instanceof FormArray).toBeTrue();
    expect(citizenshipsArray.length).toBe(1); // Initially, there is one form group in the citizenships FormArray
  });

  it('should render gen-card with header text "Citizenship Details"', () => {
    const genCardElement = fixture.debugElement.query(By.css("gen-card"));
    expect(genCardElement).toBeTruthy();
    expect(genCardElement.componentInstance.headerText).toBe(
      "Citizenship Details"
    );
  });

  it("should render the citizenship form with correct controls", () => {
    const formArray = component.citizenships;
    expect(formArray.length).toBe(1); // Initial length of citizenships

    const countryOfBirthControl = formArray.at(0).get("countryOfBirth");
    const countryOfCitizenshipControl = formArray
      .at(0)
      .get("countryOfCitizenship");

    expect(countryOfBirthControl).toBeTruthy();
    expect(countryOfCitizenshipControl).toBeTruthy();
  });
  it("should validate required fields", () => {
    const formArray = component.citizenships;
    const countryOfBirthControl = formArray.at(0).get("countryOfBirth");
    const countryOfCitizenshipControl = formArray
      .at(0)
      .get("countryOfCitizenship");

    countryOfBirthControl.setValue(null);
    countryOfCitizenshipControl.setValue(null);

    expect(countryOfBirthControl.invalid).toBeTrue();
    expect(countryOfCitizenshipControl.invalid).toBeTrue();
  });

  it("should pass correct inputs to gen-button component", () => {
    const genButton = fixture.debugElement.query(
      By.directive(GenButtonComponent)
    ).componentInstance as GenButtonComponent;

    // Check if btnLabel and btnType inputs are passed correctly
    expect(genButton.btnLabel).toBe("Add Citizenship");
    expect(genButton.btnType).toBe("plus-btn");
  });

  it("should toggle isResident value when input switch changes", () => {
    const inputSwitch = fixture.debugElement.query(By.css("p-inputSwitch"));
    const citizenshipsControl = component.citizenships.at(0);

    // Initial value should be true
    expect(citizenshipsControl.get("isResident")?.value).toBeTrue();

    // Simulate change event to set it to false
    inputSwitch.triggerEventHandler("onChange", { checked: false });
    expect(citizenshipsControl.get("isResident")?.value).toBeFalse();
  });
});
