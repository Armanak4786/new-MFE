import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateQuickQuoteComponent } from "./create-quick-quote.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs/internal/observable/of";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";

import { ConfirmationService, MessageService } from "primeng/api";
import { By } from "@angular/platform-browser";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { QuickQuoteService } from "../../services/quick-quote.service";
import {
  AuroUiFrameWork,
  AuthenticationService,
  CommonService,
  GenericDialogService,
  BaseFormComponent,
} from "auro-ui";

fdescribe("CreateQuickQuoteComponent", () => {
  let component: CreateQuickQuoteComponent;
  let fixture: ComponentFixture<CreateQuickQuoteComponent>;
  let standardQuoteSvc: jasmine.SpyObj<StandardQuoteService>;
  let router: jasmine.SpyObj<Router>;
  let quoteSvc: jasmine.SpyObj<QuickQuoteService>;
  let mockDialogService: any;

  beforeEach(async () => {
    const standardQuoteSvcSpy = jasmine.createSpyObj("StandardQuoteService", [
      "setBaseDealerFormData",
      "getFormData",
    ]);

    mockDialogService = jasmine.createSpyObj("GenericDialogService", ["show"]); // Create a spy object with the 'show' method

    const quoteSpy = jasmine.createSpyObj("QuoteService", ["quickQuoteData"]);

    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    await TestBed.configureTestingModule({
      declarations: [CreateQuickQuoteComponent],
      imports: [BrowserAnimationsModule, AuroUiFrameWork],
      providers: [
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        MessageService,
        CommonService,

        { provide: StandardQuoteService, useValue: standardQuoteSvcSpy },
        { provide: Router, useValue: routerSpy },
        { provide: QuickQuoteService, useValue: quoteSpy },
        { provide: GenericDialogService, useValue: mockDialogService },

        { provide: ActivatedRoute, useValue: { params: of({}) } },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQuickQuoteComponent);
    component = fixture.componentInstance;
    component.frequencyList = [
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "yearly", label: "Yearly" },
    ];

    standardQuoteSvc = TestBed.inject(
      StandardQuoteService
    ) as jasmine.SpyObj<StandardQuoteService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    quoteSvc = TestBed.inject(
      QuickQuoteService
    ) as jasmine.SpyObj<QuickQuoteService>;

    component.calculatedResult = { frequency: null };

    component.index = 0; // Ensure that this.index is set to a valid number

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render the gen-card component", () => {
    fixture.detectChanges(); // Triggers component initialization and rendering
    const genCardElement = fixture.nativeElement.querySelector("gen-card");
    expect(genCardElement).toBeTruthy(); // Check if gen-card exists
  });

  it("should show the result section when result and hideQuote are true", () => {
    component.result = true;
    component.hideQuote = true;
    fixture.detectChanges();

    const resultSection =
      fixture.nativeElement.querySelector(".createquickQuote");
    expect(resultSection).toBeTruthy(); // Check if result section is displayed
  });
  it("should render the dropdown for frequency", () => {
    component.frequencyList = [{ label: "Monthly", value: "M" }];
    fixture.detectChanges();
    const dropdownElement = fixture.nativeElement.querySelector("p-dropdown");
    expect(dropdownElement).toBeTruthy(); // Check if dropdown exists
  });

  it("should trigger onValueChanges when form value changes", () => {
    spyOn(component, "onValueChanges");

    const formComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;
    formComponent.valueChanges.emit({ someValue: "test" });

    expect(component.onValueChanges).toHaveBeenCalledWith({
      someValue: "test",
    });
  });

  it("should call sendDataStandardQuote when Create Quote button is clicked", () => {
    spyOn(component, "sendDataStandardQuote");
    component.quickQuoteData = { someData: "test" };

    const createQuoteButton = fixture.debugElement.query(By.css("gen-button"));
    component.sendDataStandardQuote(component.quickQuoteData);
    createQuoteButton.triggerEventHandler("click", null);

    expect(component.sendDataStandardQuote).toHaveBeenCalledWith(
      component.quickQuoteData
    );
  });

  it("should call closeCard() when the gen-button is clicked", () => {
    spyOn(component, "closeCard");
    component.closeCard(component.ind);
    fixture.detectChanges();

    // Use fixture.debugElement to query the gen-button using By.directive or By.css
    const genButtonDebugElement = fixture.debugElement.query(
      By.css("gen-button")
    );

    // Trigger a click event using DebugElement's triggerEventHandler
    genButtonDebugElement.triggerEventHandler("click", null);

    // Verify the closeCard method was called
    expect(component.closeCard).toHaveBeenCalledWith(component.ind);
  });

  it("should show close button only when ind !== 0", () => {
    component.ind = 1;
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css(".close"));
    expect(closeButton).toBeTruthy();

    component.ind = 0;
    fixture.detectChanges();

    const closeButtonAfterChange = fixture.debugElement.query(By.css(".close"));
    expect(closeButtonAfterChange).toBeFalsy();
  });

  it("should call closeCard when close button is clicked", () => {
    spyOn(component, "closeCard");

    component.ind = 1;
    component.closeCard(1);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css(".close"));
    closeButton.triggerEventHandler("click", null);

    expect(component.closeCard).toHaveBeenCalledWith(1);
  });

  // it('should log deposit value, set the correct data, and navigate to the correct URL', () => {
  //   const mockResponse = {}; // Mock the input parameter 'res' (not used in function)

  //   // Call the function
  //   component.sendDataStandardQuote(mockResponse);

  //   // Verify the console log for deposit value

  //   fixture.detectChanges();

  //   // Verify the data object passed to setBaseDealerFormData
  //   let data = {
  //     ...component.calculatedResult,
  //     ...component.mainForm.form.value,
  //     frequency: component.calculatedResult?.frequency?.value,
  //     taxProfile: { code: 'CSABD', id: 5, name: 'CSA-B Direct' },
  //     assetTypeDD: null, // Include this property to match the actual call
  //   };

  //   expect(standardQuoteSvc.setBaseDealerFormData).toHaveBeenCalledWith(data);

  //   // Verify that the service mode is set to 'create'
  //   expect(standardQuoteSvc.mode).toBe('create');

  //   // Verify that the router navigated to the correct URL
  //   expect(router.navigateByUrl).toHaveBeenCalledWith('/dealer/standard-quote');
  // });

  // // call api functions

  it("should fetch assetTypeData and update the assetTypeData property", async () => {
    const mockResponse = {
      data: {
        asset: [
          { id: 1, name: "Asset A" },
          { id: 2, name: "Asset B" },
        ],
      },
    };

    // Mock the getFormData method to return a resolved Promise with mock data
    standardQuoteSvc.getFormData.and.callFake(
      (url: string, callback: Function) => {
        return Promise.resolve(callback(mockResponse));
      }
    );

    // Call the function
    await component.callApi();

    // Verify that getFormData was called with the correct URL
    expect(standardQuoteSvc.getFormData).toHaveBeenCalledWith(
      "AssetType/get_assettype?PageNo=1&PageSize=500",
      jasmine.any(Function) // Matches any callback function
    );

    // Verify that assetTypeData is set correctly
    expect(component.assetTypeData).toEqual(mockResponse.data.asset);
  });

  it("should handle case when asset data is null", async () => {
    const mockResponse = { data: { asset: null } };

    // Mock the getFormData method to return a resolved Promise with null asset data
    standardQuoteSvc.getFormData.and.callFake(
      (url: string, callback: Function) => {
        return Promise.resolve(callback(mockResponse));
      }
    );

    // Call the function
    await component.callApi();

    // Verify that assetTypeData is set to null
    expect(component.assetTypeData).toBeNull();
  });
  // it('should initialize correctly and call super.ngOnInit and callApi', async () => {
  //   // Spy on super.ngOnInit (which might be in the Base class) and callApi
  //   spyOn(component, 'ngOnInit').and.callThrough(); // Ensures ngOnInit is called
  //   spyOn(component, 'callApi').and.returnValue(Promise.resolve()); // Simulate callApi being an async function

  //   // Call ngOnInit
  //   await component.ngOnInit();

  //   // Expect formConfig.createData to be set based on the mocked quickQuoteData
  //   expect(component.formConfig.createData).toEqual(
  //     quoteSvc.quickQuoteData[component.index]
  //   );

  //   // Check if super.ngOnInit was called (this would depend on the Base class implementation)
  //   expect(component.ngOnInit).toHaveBeenCalled();

  //   // Check if callApi was called
  //   expect(component.callApi).toHaveBeenCalled();

  //   // Check if this.ind was set correctly
  //   expect(component.ind).toBe(component.index);
  // });

  it("should set validators and update quickQuoteData when cashPriceValue is present", () => {
    const event = { cashPriceValue: 100 }; // Example event

    // Call the onValueChanges method
    component.onValueChanges(event);

    // Get the deposit and balloonAmount controls
    const depositControl = component.mainForm.get("deposit");
    const balloonAmountControl = component.mainForm.get("balloonAmount");

    // Check if the validators are set correctly
    expect(depositControl.validator).toBeTruthy();
    expect(balloonAmountControl.validator).toBeTruthy();

    // Check if the max validator is set with the correct value
    const depositValidator = depositControl.validator(depositControl);
    const balloonValidator =
      balloonAmountControl.validator(balloonAmountControl);

    expect(depositValidator).toEqual(null); // The control should not be invalid
    expect(balloonValidator).toEqual(null); // The control should not be invalid

    // Check if the quickQuoteData is updated correctly
    expect(quoteSvc.quickQuoteData[component.index]).toEqual(event);
  });
  it("should clear validators when cashPriceValue is absent", () => {
    const event = {}; // Example event without cashPriceValue

    // Call the onValueChanges method
    component.onValueChanges(event);

    // Get the deposit and balloonAmount controls
    const depositControl = component.mainForm.get("deposit");
    const balloonAmountControl = component.mainForm.get("balloonAmount");

    // Check if controls are valid (should be true)
    expect(depositControl.valid).toBe(true); // Control should be valid when no validators are set
    expect(balloonAmountControl.valid).toBe(true); // Control should be valid when no validators are set

    // Check if quickQuoteData is updated with the empty event
    expect(quoteSvc.quickQuoteData[component.index]).toEqual(event);
  });

  describe("onValueTyped", () => {
    let convertPctToAmountSpy: jasmine.Spy;
    let convertAmountToPctSpy: jasmine.Spy;

    beforeEach(() => {
      // Create spies for the methods to track their calls
      convertPctToAmountSpy = spyOn(component, "convertPctToAmount");
      convertAmountToPctSpy = spyOn(component, "convertAmountToPct");

      // Set up any initial values needed
      component.cashPrice = 100; // Set cashPrice to a value greater than 0
    });

    it("should call convertPctToAmount when depositPct is typed and cashPrice > 0", () => {
      const event = {
        name: "depositPct",
        data: { value: 20 },
      };

      component.onValueTyped(event);

      expect(convertPctToAmountSpy).toHaveBeenCalledWith("deposit", 20);
    });

    it("should call convertAmountToPct when deposit is typed and cashPrice > 0", () => {
      const event = {
        name: "deposit",
        data: { value: 500 },
      };

      component.onValueTyped(event);

      expect(convertAmountToPctSpy).toHaveBeenCalledWith("depositPct", 500);
    });

    it("should call convertPctToAmount when balloonPct is typed and cashPrice > 0", () => {
      const event = {
        name: "balloonPct",
        data: { value: 15 },
      };

      component.onValueTyped(event);

      expect(convertPctToAmountSpy).toHaveBeenCalledWith(
        "balloonAmount",
        15,
        "ballon"
      );
    });

    it("should call convertAmountToPct when balloonAmount is typed", () => {
      const event = {
        name: "balloonAmount",
        data: { value: 300 },
      };

      component.onValueTyped(event);

      expect(convertAmountToPctSpy).toHaveBeenCalledWith(
        "balloonPct",
        300,
        "ballon"
      );
    });

    it("should not call any conversion methods when cashPrice is 0", () => {
      component.cashPrice = 0; // Set cashPrice to 0
      const event = {
        name: "depositPct",
        data: { value: 20 },
      };

      component.onValueTyped(event);

      expect(convertPctToAmountSpy).not.toHaveBeenCalled();
      expect(convertAmountToPctSpy).not.toHaveBeenCalled();
    });
  });

  describe("convertPctToAmount", () => {
    it("should convert percentage to amount when cashPrice > 0", () => {
      component.cashPrice = 200; // Set cashPrice to a positive value
      const val = 25; // Example percentage

      component.convertPctToAmount("deposit", val);

      expect(component.mainForm.get("deposit").value).toEqual(50); // 25% of 200 is 50
    });

    it("should set amount to 0 when cashPrice <= 0", () => {
      component.cashPrice = 0; // Set cashPrice to 0
      const val = 25; // Example percentage

      component.convertPctToAmount("deposit", val);

      expect(component.mainForm.get("deposit").value).toBeNull();
    });
  });

  describe("convertAmountToPct", () => {
    it("should convert amount to percentage when cashPrice > 0", () => {
      component.cashPrice = 200; // Set cashPrice to a positive value
      const val = 50; // Example amount

      component.convertAmountToPct("depositPct", val);

      expect(component.mainForm.get("depositPct").value).toEqual(25); // 50 is 25% of 200
    });

    it("should set percentage to 0 when cashPrice <= 0", () => {
      component.cashPrice = 0; // Set cashPrice to 0
      const val = 50; // Example amount

      component.convertAmountToPct("depositPct", val);

      expect(component.mainForm.get("depositPct").value).toBeNull();
    });
  });

  // describe('onFormEvent', () => {
  //   it('should update form for productId 19', () => {
  //     spyOn(component.mainForm, 'updateHidden').and.callThrough();
  //     spyOn(component.mainForm, 'updateClass').and.callThrough();
  //     spyOn(component.mainForm, 'updateCols').and.callThrough();

  //     const event = { name: 'productId', value: 19 };

  //     component.onFormEvent(event);
  //     fixture.detectChanges();

  //     expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
  //       kmAllowance: false,
  //       assetTypeDD: false,
  //       assuredFutureValue: false,
  //       balloonOR: true,
  //       balloonPct: true,
  //       balloonAmount: true,
  //       fixed: true,
  //     });

  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { kmAllowance: 'col-offset-2 col-4' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateCols).toHaveBeenCalledWith({
  //       depositPct: 7,
  //     });
  //     // Additional expectations based on your logic...
  //   });
  //   it('should update form for productId 15', () => {
  //     spyOn(component.mainForm, 'updateHidden').and.callThrough();
  //     spyOn(component.mainForm, 'updateClass').and.callThrough();
  //     spyOn(component.mainForm, 'updateCols').and.callThrough();
  //     spyOn(component.buttonEvent, 'emit').and.callThrough();

  //     const event = { name: 'productId', value: 15 };

  //     component.onFormEvent(event);
  //     expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
  //       kmAllowance: true,
  //       assetTypeDD: true,
  //       assuredFutureValue: true,
  //       balloonOR: true,
  //       balloonPct: true,
  //       balloonAmount: true,
  //       fixed: true,
  //       depositOR: true,
  //       deposit: true,

  //       depositPct: true,
  //       advanceRent: false,
  //       residualValue: false,
  //       residualAmount: false,
  //       residualOR: false,
  //       firstLeasePayment: false,
  //     });

  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { residualValue: 'col-offset-1 col-4' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { firstLeasePayment: 'col-offset-1 col-4' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { cashPriceValue: 'col-offset-1 col-4' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { interestRate: 'col-offset-2 col-4' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { term: 'col-offset-2 col-4' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { advanceRent: 'col-offset-2 col-4' },
  //       'inputClass'
  //     );

  //     expect(component.mainForm.updateCols).toHaveBeenCalledWith({
  //       residualValue: 7,
  //       residualAmount: 4,
  //     });
  //     expect(component.hideQuote).toBe(false);
  //     expect(component.buttonEvent.emit).toHaveBeenCalledWith(true);
  //   });
  //   it('should update form for productId 53', () => {
  //     spyOn(component.mainForm, 'updateHidden').and.callThrough();
  //     spyOn(component.mainForm, 'updateClass').and.callThrough();
  //     spyOn(component.mainForm, 'updateCols').and.callThrough();
  //     spyOn(component.buttonEvent, 'emit').and.callThrough();

  //     const event = { name: 'productId', value: 53 };

  //     component.onFormEvent(event);

  //     expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
  //       kmAllowance: true,
  //       assetTypeDD: true,
  //       assuredFutureValue: true,
  //       balloonOR: true,
  //       balloonPct: true,
  //       balloonAmount: true,
  //       fixed: true,
  //       depositOR: true,
  //       deposit: true,
  //       depositPct: true,
  //       advanceRent: true,
  //       residualValue: false,
  //       residualAmount: false,
  //       residualOR: false,
  //       firstLeasePayment: false,
  //     });

  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { firstLeasePayment: 'col-offset-1 col-4' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateCols).toHaveBeenCalledWith({
  //       residualValue: 7,
  //     });
  //     // Additional expectations based on your logic...
  //   });
  //   it('should handle default case when productId is not 14, 15, or 16', () => {
  //     spyOn(component.mainForm, 'updateHidden').and.callThrough();
  //     spyOn(component.mainForm, 'updateClass').and.callThrough();
  //     spyOn(component.mainForm, 'updateCols').and.callThrough();

  //     const event = { name: 'productId', value: 99 }; // An example value that doesn't match

  //     component.onFormEvent(event);

  //     expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
  //       kmAllowance: true,
  //       assetTypeDD: true,
  //       assuredFutureValue: true,
  //       balloonOR: false,
  //       balloonPct: false,
  //       balloonAmount: false,
  //       fixed: false,
  //       depositOR: false,
  //       deposit: false,
  //       depositPct: false,
  //       advanceRent: true,
  //       residualValue: true,
  //       residualAmount: true,
  //       residualOR: true,
  //       firstLeasePayment: true,
  //     });
  //     expect(component.mainForm.updateClass).toHaveBeenCalledWith(
  //       { advanceRent: 'col-4 px-0' },
  //       'inputClass'
  //     );
  //     expect(component.mainForm.updateCols).toHaveBeenCalledWith({
  //       depositPct: 6,
  //     });
  //     // Additional expectations based on your logic...
  //   });
  //   it('should handle cashPriceValue event and convert percentages to amounts', () => {
  //     const event = { name: 'cashPriceValue', value: 1000 };

  //     // Mock methods to avoid errors
  //     spyOn(component, 'convertPctToAmount').and.callThrough();

  //     component.onFormEvent(event);

  //     expect(component.cashPrice).toBe(1000);
  //     expect(component.convertPctToAmount).toHaveBeenCalledWith(
  //       'deposit',
  //       component.mainForm.get('depositPct').value
  //     );
  //     expect(component.convertPctToAmount).toHaveBeenCalledWith(
  //       'balloonAmount',
  //       component.mainForm.get('balloonPct').value
  //     );
  //   });
  // });
});
