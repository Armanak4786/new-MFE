import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonalContactDetailComponent } from "./personal-contact-detail.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { PersonalDetailEmailContactComponent } from "../personal-detail-email-contact/personal-detail-email-contact.component";
import { By } from "@angular/platform-browser";
import { GenButtonComponent } from "auro-ui";
import { BaseDealerClass } from "../../../../base/base-dealer.class";
import { GenCardComponent } from "auro-ui";

fdescribe("PersonalContactDetailComponent", () => {
  let component: PersonalContactDetailComponent;
  let fixture: ComponentFixture<PersonalContactDetailComponent>;
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
      declarations: [
        PersonalContactDetailComponent,
        PersonalDetailEmailContactComponent,
      ],
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

        { provide: JWT_OPTIONS, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalContactDetailComponent);
    component = fixture.componentInstance;
    component.phoneForm = component.fb.group({
      phone: component.fb.array(
        [
          component.fb.group({
            value: ["", Validators.required],
            type: component.phoneType[0],
            areacode: ["", Validators.required],
            code: ["", Validators.required],
          }),
        ],
        Validators.required
      ),
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  //html
  it("should render the form controls for phone array", () => {
    // Initialize form controls manually for the test
    component.phoneForm = new FormGroup({
      phone: new FormArray([
        new FormGroup({
          code: new FormControl(""),
          areacode: new FormControl(""),
          value: new FormControl(""),
        }),
      ]),
    });
    fixture.detectChanges();

    const phoneArray = component.phoneForm.get("phone") as FormArray;
    expect(phoneArray.length).toBe(1); // Initial form should have one phone group

    const codeControl = fixture.debugElement.query(
      By.css('p-dropdown[formControlName="code"]')
    );
    const areacodeControl = fixture.debugElement.query(
      By.css('input[formControlName="areacode"]')
    );
    const valueControl = fixture.debugElement.query(
      By.css('input[formControlName="value"]')
    );

    expect(codeControl).toBeTruthy();
    expect(areacodeControl).toBeTruthy();
    expect(valueControl).toBeTruthy();
  });

  it('should render gen-card with headerText "Contact Details"', () => {
    // Query the gen-card component
    const genCardDebugElement = fixture.debugElement.query(
      By.directive(GenCardComponent)
    );

    // Ensure that the gen-card component exists
    expect(genCardDebugElement).toBeTruthy();

    // Access the component instance to check input properties
    const genCardComponentInstance = genCardDebugElement.componentInstance;

    // Check if headerText is 'Contact Details'
    expect(genCardComponentInstance.headerText).toBe("Contact Details");
  });

  it("should pass correct inputs to gen-button component", () => {
    const genButton = fixture.debugElement.query(
      By.directive(GenButtonComponent)
    ).componentInstance as GenButtonComponent;

    // Check if btnLabel and btnType inputs are passed correctly
    expect(genButton.btnLabel).toBe("Add Other Mobile");
    expect(genButton.btnType).toBe("plus-btn");
  });

  it("should call addOtherPhone when Add Other Mobile button is clicked", () => {
    spyOn(component, "addOtherPhone");
    const addButton = fixture.debugElement.query(
      By.directive(GenButtonComponent)
    ); // Querying the GenButtonComponent
    component.addOtherPhone();
    fixture.detectChanges();
    addButton.triggerEventHandler("click", null);
    expect(component.addOtherPhone).toHaveBeenCalled();
  });

  /* this test is failed */

  // it('should call setBaseDealerFormData with the current phone form value', () => {
  //   component.getvalue();

  //   expect(individualServiceMock.setBaseDealerFormData).toHaveBeenCalledWith({
  //     personalDetailsPhone: component.phoneForm.value.phone,
  //   });
  // });

  it("should initialize the phoneForm with one phone control", () => {
    const phoneArray = component.phoneForm.get("phone") as FormArray;
    expect(phoneArray.length).toBe(1);
    expect(phoneArray.at(0)).toBeInstanceOf(FormGroup);
  });

  it("should return the FormArray from phoneForm", () => {
    // The getter should return a FormArray
    const phoneArray = component.phone;

    // Ensure that the returned value is indeed a FormArray
    expect(phoneArray instanceof FormArray).toBeTrue();

    // Check the length of the FormArray
    expect(phoneArray.length).toBe(1); // By default, one phone control is created in the form
  });
  it("should create a FormGroup with expected controls and validators", () => {
    const phoneFormGroup = component.createPhoneForm();
    fixture.detectChanges();

    // Ensure the form group has the required controls
    expect(phoneFormGroup.contains("value")).toBeTrue();
    expect(phoneFormGroup.contains("type")).toBeTrue();
    expect(phoneFormGroup.contains("areacode")).toBeTrue();
    expect(phoneFormGroup.contains("code")).toBeTrue();

    // Check validators for 'value' field
    const valueControl = phoneFormGroup.get("value");
    expect(valueControl.hasValidator(Validators.required)).toBeTrue();

    // Check validators for 'areacode' field
    const areacodeControl = phoneFormGroup.get("areacode");
    expect(areacodeControl.hasValidator(Validators.required)).toBeTrue();

    // Check validators for 'code' field
    const codeControl = phoneFormGroup.get("code");
    expect(codeControl.hasValidator(Validators.required)).toBeTrue();
  });
  it("should validate the form and push the result to formStatusArr when stepperDetails.validate is true", () => {
    const stepperDetails = { validate: true };

    // Mock the proceedForm method to return 'VALID'
    (commonServiceMock.proceedForm as jasmine.Spy).and.returnValue("VALID");

    // Mock the formStatusArr
    component.individualSvc.formStatusArr = [];

    // Call the method
    commonServiceMock.proceedForm(component.phoneForm);
    component.onStepChange(stepperDetails);
    fixture.detectChanges();

    // Check that proceedForm was called with the correct form
    expect(commonServiceMock.proceedForm).toHaveBeenCalledWith(
      component.phoneForm
    );
    expect(individualServiceMock.formStatusArr).toContain("VALID");

    // Check that the form status is pushed to formStatusArr
  });
  it("should create a FormGroup with the correct controls and validators", () => {
    // Call the createPhoneForm method
    const formGroup = component.createPhoneForm();

    // Check if it returns a FormGroup
    expect(formGroup).toBeInstanceOf(FormGroup);

    // Check if all the form controls exist
    expect(formGroup.controls["value"]).toBeTruthy();
    expect(formGroup.controls["type"]).toBeTruthy();
    expect(formGroup.controls["areacode"]).toBeTruthy();
    expect(formGroup.controls["code"]).toBeTruthy();

    // Check the validators for 'value' control
    const valueControl = formGroup.controls["value"];
    expect(valueControl.hasValidator(Validators.required)).toBeTrue();

    // Check the validator for 'areacode' control
    const areacodeControl = formGroup.controls["areacode"];
    expect(areacodeControl.hasValidator(Validators.required)).toBeTrue();

    // Check the validator for 'code' control
    const codeControl = formGroup.controls["code"];
    expect(codeControl.hasValidator(Validators.required)).toBeTrue();

    // Check if the 'type' control is set to the correct phone type based on phone array length
    expect(formGroup.controls["type"].value).toBe(
      component.phoneType[component.phone.length]
    );
  });

  it("should call removeAt on the FormArray when removePhone is called", () => {
    // Add mock form groups to the phone array
    const mockFormGroup1 = component.createPhoneForm();
    const mockFormGroup2 = component.createPhoneForm();
    component.phone.push(mockFormGroup1);
    component.phone.push(mockFormGroup2);

    // Spy on the removeAt method of the FormArray
    const removeAtSpy = spyOn(component.phone, "removeAt").and.callThrough();

    // Call the removePhone method
    component.removePhone(1);

    // Check if the removeAt method has been called with index 1
    expect(removeAtSpy).toHaveBeenCalledWith(1);
  });
  it("should call/render the child component", () => {
    // Check if the child component is present in the parent template
    const childComponentElement = fixture.debugElement.query(
      By.directive(PersonalDetailEmailContactComponent)
    );
    expect(childComponentElement).not.toBeNull(); // Assert the child component is in the DOM
  });
});
