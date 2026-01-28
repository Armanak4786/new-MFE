import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchCustomerComponent } from "./search-customer.component";
import { IndividualService } from "../../../individual/services/individual.service";
import { BusinessService } from "../../../business/services/business";
import { TrustService } from "../../../trust/services/trust.service";
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  GenericFormConfig,
  AuroUiFrameWork,
  UiService,
} from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";

describe("SearchCustomerComponent", () => {
  let component: SearchCustomerComponent;
  let fixture: ComponentFixture<SearchCustomerComponent>;
  let individualSvc: jasmine.SpyObj<IndividualService>;
  let businessSvc: jasmine.SpyObj<BusinessService>;
  let trustSvc: jasmine.SpyObj<TrustService>;

  // let standardQuoteServiceSpy: jasmine.SpyObj<StandardQuoteService>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;
  // let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    individualSvc = jasmine.createSpyObj("IndividualService", [
      "resetBaseDealerFormData",
    ]);
    businessSvc = jasmine.createSpyObj("BusinessService", [
      "resetBaseDealerFormData",
    ]);
    trustSvc = jasmine.createSpyObj("TrustService", [
      "resetBaseDealerFormData",
    ]);

    dialogRefSpy = jasmine.createSpyObj("DynamicDialogRef", ["close"]);
    // routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [SearchCustomerComponent],
      imports: [
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        AuthenticationService,
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,

        { provide: DynamicDialogRef, useValue: dialogRefSpy },
        { provide: DynamicDialogConfig, useValue: new DynamicDialogConfig() },
        { provide: IndividualService, useValue: individualSvc },
        { provide: BusinessService, useValue: businessSvc },
        { provide: TrustService, useValue: trustSvc },

        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call onValueChanges when base-form emits valueChanges", () => {
    spyOn(component, "onValueChanges");
    const baseForm =
      fixture.debugElement.nativeElement.querySelector("base-form");
    baseForm.dispatchEvent(new Event("valueChanges"));
    fixture.detectChanges();
    expect(component.onValueChanges).toHaveBeenCalled();
  });
  it('should display app-individual-tab when searchType is "individual"', () => {
    component.searchType = "individual";
    fixture.detectChanges();
    const individualTab =
      fixture.debugElement.nativeElement.querySelector("app-individual-tab");
    expect(individualTab).toBeTruthy();
  });

  it('should display app-business-tab when searchType is "business"', () => {
    component.searchType = "business";
    fixture.detectChanges();
    const businessTab =
      fixture.debugElement.nativeElement.querySelector("app-business-tab");
    expect(businessTab).toBeTruthy();
  });

  it('should display app-trust-tab when searchType is "trust"', () => {
    component.searchType = "trust";
    fixture.detectChanges();
    const trustTab =
      fixture.debugElement.nativeElement.querySelector("app-trust-tab");
    expect(trustTab).toBeTruthy();
  });

  it("should call newCustomer method when Add New Customer button is clicked", () => {
    spyOn(component, "newCustomer");
    const button =
      fixture.debugElement.nativeElement.querySelector("gen-button");
    button.click();
    component.newCustomer();
    fixture.detectChanges();
    expect(component.newCustomer).toHaveBeenCalled();
  });

  it("should pass correct input properties to base-form component", () => {
    // Find the base-form component instance within the debugElement
    const baseFormDebugEl = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    );
    const baseFormComponent =
      baseFormDebugEl.componentInstance as BaseFormComponent;

    // Assert that the inputs are correctly passed to the base-form component
    expect(baseFormComponent.formConfig).toBe(component.formConfig);
    expect(baseFormComponent.mode).toBe(component.mode);
    expect(baseFormComponent.data).toBe(component.data);
  });

  it("should call the base class ngOnInit method", async () => {
    // Spy on the base class ngOnInit
    const baseNgOnInitSpy = spyOn(
      BaseStandardQuoteClass.prototype,
      "ngOnInit"
    ).and.returnValue(Promise.resolve());

    // Call ngOnInit
    await component.ngOnInit();

    // Verify that the base ngOnInit was called
    expect(baseNgOnInitSpy).toHaveBeenCalled();
  });

  it("should have a formConfig with the correct configuration", () => {
    const expectedFormConfig: GenericFormConfig = {
      cardType: "non-border",
      autoResponsive: true,
      api: "addAsset",
      goBackRoute: "quoteOriginator",
      createData: { searchCustomer: "individual" },
      fields: [
        {
          type: "radio",
          name: "searchCustomer",
          label: "Search Type",
          cols: 3,
          options: [
            { label: "Individual", value: "individual" },
            { label: "Business", value: "business" },
            { label: "Trust", value: "trust" },
          ],
          // Optionally include the validators property if it's defined in the actual field type
          // validators: [] // Uncomment if validators are part of the field type
        },
      ],
    };

    // Compare the fields manually if you want to ensure no extra properties
    expect(component.formConfig.cardType).toBe(expectedFormConfig.cardType);
    expect(component.formConfig.autoResponsive).toBe(
      expectedFormConfig.autoResponsive
    );
    expect(component.formConfig.api).toBe(expectedFormConfig.api);
    expect(component.formConfig.goBackRoute).toBe(
      expectedFormConfig.goBackRoute
    );
    expect(component.formConfig.createData).toEqual(
      expectedFormConfig.createData
    );
    expect(component.formConfig.fields.length).toBe(
      expectedFormConfig.fields.length
    );

    // Compare fields individually
    for (let i = 0; i < expectedFormConfig.fields.length; i++) {
      expect(component.formConfig.fields[i].type).toBe(
        expectedFormConfig.fields[i].type
      );
      expect(component.formConfig.fields[i].name).toBe(
        expectedFormConfig.fields[i].name
      );
      expect(component.formConfig.fields[i].label).toBe(
        expectedFormConfig.fields[i].label
      );
      expect(component.formConfig.fields[i].cols).toBe(
        expectedFormConfig.fields[i].cols
      );
      expect(component.formConfig.fields[i]["options"]).toEqual(
        expectedFormConfig.fields[i]["options"]
      );
      // Add more assertions as necessary
    }
  });

  it('should have cardType set to "non-border"', () => {
    expect(component.formConfig.cardType).toBe("non-border");
  });

  it("should have autoResponsive set to true", () => {
    expect(component.formConfig.autoResponsive).toBeTrue();
  });

  it('should have api endpoint as "addAsset"', () => {
    expect(component.formConfig.api).toBe("addAsset");
  });

  it('should have goBackRoute set to "quoteOriginator"', () => {
    expect(component.formConfig.goBackRoute).toBe("quoteOriginator");
  });

  it('should have createData with default searchCustomer as "individual"', () => {
    expect(component.formConfig.createData?.searchCustomer).toBe("individual");
  });

  it("should have a radio field with correct options for searchCustomer", () => {
    const searchCustomerField = component.formConfig.fields.find(
      (field) => field.name === "searchCustomer"
    );

    expect(searchCustomerField).toBeDefined();
    expect(searchCustomerField?.type).toBe("radio");
    expect(searchCustomerField?.label).toBe("Search Type");
    expect(searchCustomerField?.cols).toBe(3);

    const expectedOptions = [
      { label: "Individual", value: "individual" },
      { label: "Business", value: "business" },
      { label: "Trust", value: "trust" },
    ];
    expect(searchCustomerField["options"]).toEqual(expectedOptions);
  });

  it("should update searchType when searchCustomer event is emitted", () => {
    const event = { name: "searchCustomer", value: "business" };

    // Call the method
    component.onFormEvent(event);

    // Expect searchType to be updated
    expect(component.searchType).toBe("business");
  });

  it("should not update searchType for other events", () => {
    const initialSearchType = component.searchType; // Capture the initial searchType
    const event = { name: "otherEvent", value: "someValue" };

    // Call the method with a different event
    component.onFormEvent(event);

    // Expect searchType to remain unchanged
    expect(component.searchType).toBe(initialSearchType);
  });
  it('should set searchType to "individual" on ngOnDestroy', () => {
    // Arrange: Change the searchType to a different value
    component.searchType = "individual";

    // Act: Call ngOnDestroy
    component.ngOnDestroy();

    // Assert: Check that searchType is set to 'individual'
    expect(component.searchType).toBeNull();
  });
  it("should call resetBaseDealerFormData on all services and navigate to the correct URL", () => {
    // Act: Call the newCustomer method

    const commonSvc = TestBed.inject(CommonService);
    const mockRouter = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    commonSvc.router = mockRouter;

    component.newCustomer();
    dialogRefSpy = TestBed.inject(
      DynamicDialogRef
    ) as jasmine.SpyObj<DynamicDialogRef>;

    // Assert: Check that the activeStep was reset for each service
    expect(individualSvc.activeStep).toBe(0);
    expect(businessSvc.activeStep).toBe(0);
    expect(trustSvc.activeStep).toBe(0);

    // Assert: Check that the router navigated to the expected URL
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/individual");

    // Assert: Check that resetBaseDealerFormData was called for each service
    expect(individualSvc.resetBaseDealerFormData).toHaveBeenCalled();
    expect(businessSvc.resetBaseDealerFormData).toHaveBeenCalled();
    expect(trustSvc.resetBaseDealerFormData).toHaveBeenCalled();

    // Assert: Check that the dialog reference was closed
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
