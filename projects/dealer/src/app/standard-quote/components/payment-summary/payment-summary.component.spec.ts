import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaymentSummaryComponent } from "./payment-summary.component";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, AuroUiFrameWork } from "auro-ui";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { CalculationService } from "./calculation.service";
import { of } from "rxjs";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { CoreAppModule } from "projects/app-core/src/app/app-core.module";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

fdescribe("PaymentSummaryComponent", () => {
  let component: PaymentSummaryComponent;
  let fixture: ComponentFixture<PaymentSummaryComponent>;
  let mockCalculationService: jasmine.SpyObj<CalculationService>;
  let mockStandardQuoteService: jasmine.SpyObj<StandardQuoteService>;
  let mockCommonService: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    mockCalculationService = jasmine.createSpyObj("CalculationService", [
      "getDefaultDate",
      "pastDateValidator",
      "firstPaymentAfterLoanDateValidator",
    ]);
    mockStandardQuoteService = jasmine.createSpyObj("StandardQuoteService", [
      "",
    ]);
    mockCommonService = jasmine.createSpyObj("CommonService", [""]);

    await TestBed.configureTestingModule({
      declarations: [PaymentSummaryComponent],
      imports: [BrowserDynamicTestingModule, CoreAppModule, AuroUiFrameWork],
      providers: [
        JwtHelperService,
        ConfirmationService,
        MessageService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here

        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => "123" } } },
        },
        { provide: CalculationService, useValue: mockCalculationService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: CommonService, useValue: mockCommonService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSummaryComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    mockCalculationService.getDefaultDate.and.returnValue("2024-01-01");
    fixture.detectChanges();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSummaryComponent);

    mockCalculationService.getDefaultDate.and.returnValue("2024-01-01");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize formConfig with loanDate and correct field settings", () => {
    expect(component.formConfig).toEqual(
      jasmine.objectContaining({
        // createData: jasmine.objectContaining({ loanDate: component.loanDate }),
        fields: jasmine.any(Array),
      })
    );
  });

  it("should calculate total number of payments for Weekly frequency", () => {
    component.repaymentFrequency = "Weekly";
    component.term = 24; // 2 years
    component.calculateTotalNoOfPayments();
    expect(component.totalNumberOfPayments).toEqual(104); // 52 * 2
  });

  it("should calculate total number of payments for Monthly frequency", () => {
    component.repaymentFrequency = "Monthly";
    component.term = 12; // 1 year
    component.calculateTotalNoOfPayments();
    expect(component.totalNumberOfPayments).toEqual(12); // 12 months
  });

  it("should have autoResponsive set to true", () => {
    expect(component.formConfig.autoResponsive).toBeTrue();
  });

  it('should have cardType set to "non-border"', () => {
    expect(component.formConfig.cardType).toBe("non-border");
  });

  it("should patch form values based on response in onFormDataUpdate", () => {
    const mockResponse = {
      cashPriceValue: 50000,
      totalBorrowedAmount: 30000,
    };
    component.onFormDataUpdate(mockResponse);
    fixture.detectChanges();
    expect(component.cashPrice).toEqual(50000);
  });
  it("should define fields with expected properties", () => {
    const fields = component.formConfig.fields;
    expect(fields).toBeTruthy();
    expect(fields.length).toBeGreaterThan(0);

    // Check specific fields
    const loanDateField = fields.find((f) => f.name === "loanDate");
    expect(loanDateField).toBeTruthy();
    expect(loanDateField?.type).toBe("date");
    expect(loanDateField?.label).toBe("Loan Date");
    expect(loanDateField["errorMessage"]).toBe("Loan date must not be in past");

    const leaseDateField = fields.find((f) => f.name === "leaseDate");
    expect(leaseDateField).toBeTruthy();
    expect(leaseDateField?.type).toBe("date");
    expect(leaseDateField["hidden"]).toBeTrue();

    const paymentCalculateBtn = fields.find(
      (f) => f.name === "paymentCalculatebtn"
    );
    expect(paymentCalculateBtn).toBeTruthy();
    expect(paymentCalculateBtn?.type).toBe("button");
    expect(paymentCalculateBtn?.label).toBe("Calculate");
  });
  it("should validate firstPaymentDate field correctly", () => {
    const firstPaymentField = component.formConfig.fields.find(
      (f) => f.name === "firstPaymentDate"
    );
    expect(firstPaymentField).toBeTruthy();
    expect(firstPaymentField["validators"]).toBeTruthy();
    expect(firstPaymentField["validators"]?.length).toBe(2);
    expect(firstPaymentField["errorMessage"]).toBe(
      "First Payment Date must be after Loan Date "
    );
  });

  it("should have options for paymentStructure field", () => {
    const paymentStructureField = component.formConfig.fields.find(
      (f) => f.name === "paymentStructure"
    );
    expect(paymentStructureField).toBeTruthy();
    expect(paymentStructureField?.type).toBe("select");
    expect(paymentStructureField["options"]).toEqual([
      { label: "50/50", value: "50/50" },
      { label: "1/3", value: "1/3" },
      { label: "1/4", value: "1/4" },
      { label: "None", value: 1 },
    ]);
  });

  it("should validate balloonPct field correctly", () => {
    const balloonPctField = component.formConfig.fields.find(
      (f) => f.name === "balloonPct"
    );
    expect(balloonPctField).toBeTruthy();

    // Access the validators array
    const validators = balloonPctField["validators"];
    expect(validators).toBeTruthy();

    // Check if Validators.max(99) is present
    const maxValidatorExists = validators?.some((validator) => {
      const testControl = { value: 100 } as any; // Mock control
      return validator(testControl) !== null; // If it validates, it is max(99)
    });
    expect(maxValidatorExists).toBeTrue();

    // Check if Validators.maxLength(2) is present
    const maxLengthValidatorExists = validators?.some((validator) => {
      const testControl = { value: "123" } as any; // Mock control
      return validator(testControl) !== null; // If it validates, it is maxLength(2)
    });
    expect(maxLengthValidatorExists).toBeTrue();
  });
  it('should configure the "First Lease Payment" field correctly', () => {
    const firstLeaseDateField = component.formConfig.fields.find(
      (field) => field.name === "firstLeaseDate"
    );
    expect(firstLeaseDateField).toBeTruthy();
    expect(firstLeaseDateField?.type).toBe("date");
    expect(firstLeaseDateField?.label).toBe("First Lease Payment");
    expect(firstLeaseDateField?.cols).toBe(3);
    expect(firstLeaseDateField["nextLine"]).toBe(false);
    expect(firstLeaseDateField["hidden"]).toBe(true);
  });

  it('should configure the "No. of Rentals in Advance" field correctly', () => {
    const noOfRentalsAdvanceField = component.formConfig.fields.find(
      (field) => field.name === "noOfRentalsAdvance"
    );
    expect(noOfRentalsAdvanceField).toBeTruthy();
    expect(noOfRentalsAdvanceField?.type).toBe("number");
    expect(noOfRentalsAdvanceField?.label).toBe("No. of Rentals in Advance");
    expect(noOfRentalsAdvanceField?.cols).toBe(4);
    expect(noOfRentalsAdvanceField["hidden"]).toBe(true);
  });
  it('should configure the "Balloon Amount" field correctly', () => {
    const balloonAmountField = component.formConfig.fields.find(
      (field) => field.name === "balloonAmount"
    );
    expect(balloonAmountField).toBeTruthy();
    expect(balloonAmountField?.type).toBe("currency");
    expect(balloonAmountField?.label).toBe("Balloon Amount");
    expect(balloonAmountField?.cols).toBe(3);
    expect(balloonAmountField?.["disabled"]).toBe(false);
  });
  it('should configure the "Or Label" field correctly', () => {
    const orLabelField = component.formConfig.fields.find(
      (field) => field.name === "orLabel"
    );
    expect(orLabelField).toBeTruthy();
    expect(orLabelField?.type).toBe("label-only");
    expect(orLabelField?.["typeOfLabel"]).toBe("inline");
    expect(orLabelField?.label).toBe("Or");
    expect(orLabelField?.cols).toBe(1);
    expect(orLabelField?.["className"]).toBe("mt-2 text-center");
  });
  it('should configure the "Fixed" checkbox field correctly', () => {
    const fixedField = component.formConfig.fields.find(
      (field) => field.name === "fixed"
    );
    expect(fixedField).toBeTruthy();
    expect(fixedField?.type).toBe("checkbox");
    expect(fixedField?.label).toBe("Fixed");
    expect(fixedField?.cols).toBe(3);
    expect(fixedField?.["className"]).toBe("mt-2");
  });
  it('should configure the "ReadOnly Payment Amount" field correctly', () => {
    const readOnlyPaymentAmountField = component.formConfig.fields.find(
      (field) => field.name === "readOnlyPaymentAmount"
    );
    expect(readOnlyPaymentAmountField).toBeTruthy();
    expect(readOnlyPaymentAmountField?.type).toBe("currency-label");
    expect(readOnlyPaymentAmountField?.["className"]).toBe("text-right");
    expect(readOnlyPaymentAmountField?.["typeOfLabel"]).toBe("inline");
    expect(readOnlyPaymentAmountField?.label).toBe("0");
    expect(readOnlyPaymentAmountField?.["hidden"]).toBe(true);
  });
  it('should configure the "ReadOnly Calculated Interest" field correctly', () => {
    const readOnlyCalculatedInterestField = component.formConfig.fields.find(
      (field) => field.name === "readOnlyCalculatedInterest"
    );
    expect(readOnlyCalculatedInterestField).toBeTruthy();
    expect(readOnlyCalculatedInterestField?.type).toBe("currency-label");
    expect(readOnlyCalculatedInterestField?.["className"]).toBe("text-right");
    expect(readOnlyCalculatedInterestField?.["typeOfLabel"]).toBe("inline");
    expect(readOnlyCalculatedInterestField?.label).toBe("0");
    expect(readOnlyCalculatedInterestField?.["hidden"]).toBe(true);
  });
  it('should configure the "ReadOnly Total Amount to Repay" field correctly', () => {
    const readOnlyTotalAmountToRepayField = component.formConfig.fields.find(
      (field) => field.name === "readOnlytotalAmountToRepay"
    );
    expect(readOnlyTotalAmountToRepayField).toBeTruthy();
    expect(readOnlyTotalAmountToRepayField?.type).toBe("currency-label");
    expect(readOnlyTotalAmountToRepayField?.["className"]).toBe("text-right");
    expect(readOnlyTotalAmountToRepayField?.["typeOfLabel"]).toBe("inline");
    expect(readOnlyTotalAmountToRepayField?.label).toBe("0");
    expect(readOnlyTotalAmountToRepayField?.["hidden"]).toBe(true);
  });

  it('should configure the "ReadOnly Total Number of Payments" field correctly', () => {
    const readOnlyTotalNumberOfPaymentsField = component.formConfig.fields.find(
      (field) => field.name === "readOnlyTotalNumberOfPayments"
    );
    expect(readOnlyTotalNumberOfPaymentsField).toBeTruthy();
    expect(readOnlyTotalNumberOfPaymentsField?.type).toBe("number");
    expect(readOnlyTotalNumberOfPaymentsField?.["className"]).toBe(
      "text-right"
    );
    expect(readOnlyTotalNumberOfPaymentsField?.label).toBe("0");
    expect(readOnlyTotalNumberOfPaymentsField?.["hidden"]).toBe(true);
  });

  it('should configure the "ReadOnly Last Payment Date" field correctly', () => {
    const readOnlyLastPaymentDateField = component.formConfig.fields.find(
      (field) => field.name === "readOnlylastPaymentDate"
    );
    expect(readOnlyLastPaymentDateField).toBeTruthy();
    expect(readOnlyLastPaymentDateField?.type).toBe("date");
    expect(readOnlyLastPaymentDateField?.label).toBe("0");
    expect(readOnlyLastPaymentDateField?.["hidden"]).toBe(true);
  });
});
