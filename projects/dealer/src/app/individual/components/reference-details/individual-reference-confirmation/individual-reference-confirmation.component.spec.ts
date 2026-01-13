import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IndividualReferenceConfirmationComponent } from "./individual-reference-confirmation.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from "auro-ui";
import { IndividualService } from "../../../services/individual.service";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { FormControl, Validators } from "@angular/forms";

fdescribe("IndividualReferenceConfirmationComponent", () => {
  let component: IndividualReferenceConfirmationComponent;
  let fixture: ComponentFixture<IndividualReferenceConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualReferenceConfirmationComponent],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        AuroUiFrameWork,
        AppPrimengModule,
      ],
      providers: [
        CommonService,
        IndividualService,
        JwtHelperService,
        AuthenticationService,
        MessageService,
        UiService,
        ConfirmationService,
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualReferenceConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should handle valueChanges event from BaseFormComponent", () => {
    // Spy on the event handler
    const valueChangeSpy = spyOn(component, "onValueChanges");

    // Find the base-form element and trigger the event
    const baseFormElement = fixture.debugElement.query(By.css("base-form"));
    baseFormElement.triggerEventHandler("valueChanges", { field: "new value" });

    // Verify the event handler was called
    expect(valueChangeSpy).toHaveBeenCalledWith({ field: "new value" });
  });

  it("should handle formEvent emitted by BaseFormComponent", () => {
    const formEventSpy = spyOn(component, "onFormEvent");

    // Trigger formEvent
    const baseFormElement = fixture.debugElement.query(By.css("base-form"));
    baseFormElement.triggerEventHandler("formEvent", { event: "submit" });

    expect(formEventSpy).toHaveBeenCalledWith({ event: "submit" });
  });

  it("should handle formButtonEvent emitted by BaseFormComponent", () => {
    const formButtonEventSpy = spyOn(component, "onButtonClick");

    // Trigger formButtonEvent
    const baseFormElement = fixture.debugElement.query(By.css("base-form"));
    baseFormElement.triggerEventHandler("formButtonEvent", { button: "save" });

    expect(formButtonEventSpy).toHaveBeenCalledWith({ button: "save" });
  });

  it("should handle formReady emitted by BaseFormComponent", () => {
    const formReadySpy = spyOn(component, "onFormReady");

    // Trigger formReady event
    const baseFormElement = fixture.debugElement.query(By.css("base-form"));
    baseFormElement.triggerEventHandler("formReady", null);

    expect(formReadySpy).toHaveBeenCalled();
  });

  it("should initialize formConfig with correct values", () => {
    expect(component.formConfig).toBeTruthy();
    expect(component.formConfig.fields.length).toBe(1);
    expect(component.formConfig.fields[0].name).toBe(
      "individualDetailsConfirmation"
    );
  });
  it("should have correct formConfig setup", () => {
    const formConfig = component.formConfig;

    // Validate the general properties of the formConfig
    expect(formConfig.autoResponsive).toBe(true);
    expect(formConfig.cardBgColor).toBe("--primary-light-color");
    expect(formConfig.api).toBe("");
    expect(formConfig.goBackRoute).toBe("");

    // Validate the structure of the fields array
    expect(formConfig.fields.length).toBe(1);

    const field = formConfig.fields[0];
    field.type = "checkbox";
    fixture.detectChanges();

    // Validate the field properties
    expect(field.type).toBe("checkbox");
    expect(field.label).toBe(
      "I confirm that all customer details are correct."
    );
    expect(field.name).toBe("individualDetailsConfirmation");

    //expect(field.validators[0]).toBeDefined();
    // Validate the specific required validator
  });
});
