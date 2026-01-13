import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { StandardQuoteComponent } from './standard-quote.component';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  AuthenticationService,
  CloseDialogData,
  CommonService,
  AuroUiFrameWork,
} from 'auro-ui';
import { StandardQuoteService } from './services/standard-quote.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { QuickQuoteService } from '../quick-quote/services/quick-quote.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { OtherChargesComponent } from './components/other-charges/other-charges.component';
import { AdditionalFundsComponent } from './components/additional-funds/additional-funds.component';
import { QuoteDetailsComponent } from './components/Quote-details/quote-details.component';
import { FinanceLeaseComponent } from './components/finance-lease/finance-lease.component';
import { AfvDetailsComponent } from './components/afv-details/afv-details.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';

fdescribe('StandardQuoteComponent', () => {
  let component: StandardQuoteComponent;
  let fixture: ComponentFixture<StandardQuoteComponent>;
  let commonSvcMock: any;
  let standardQuoteSvcMock: any;
  let changeDetectorRefMock: any;

  beforeEach(async () => {
    // Mocking the services
    commonSvcMock = {
      data: {
        put: jasmine.createSpy('put').and.returnValue(of({ success: true })),
        post: jasmine.createSpy('post').and.returnValue(of({ success: true })),
        get: jasmine
          .createSpy('get')
          .and.returnValue(
            of({ data: [{ source: 'Generated', document: 'doc1' }] })
          ),
      },

      dialogSvc: {
        show: jasmine.createSpy('show').and.returnValue({
          onClose: of({} as CloseDialogData),
        }),
      },
      ui: {
        showOkDialog: jasmine
          .createSpy('showOkDialog')
          .and.returnValue(of(true)),
      },
      router: {
        navigateByUrl: jasmine.createSpy('navigateByUrl'),
      },
    };

    standardQuoteSvcMock = {
      setBaseDealerFormData: jasmine.createSpy(),
      changeDetectionForUpdate: { next: jasmine.createSpy() },
      stepper: { next: jasmine.createSpy() },
      activeStep: null,
      resetBaseDealerFormData: jasmine.createSpy(),
    };

    changeDetectorRefMock = {
      detectChanges: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      declarations: [
        StandardQuoteComponent,
        AfvDetailsComponent,
        FinanceLeaseComponent,
        QuoteDetailsComponent,
        AdditionalFundsComponent,
        OtherChargesComponent,
      ], // Add any necessary declarations here
      imports: [AuroUiFrameWork],
      providers: [
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        MessageService,

        QuickQuoteService,
        { provide: CommonService, useValue: commonSvcMock },
        { provide: StandardQuoteService, useValue: standardQuoteSvcMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements and attributes
    }).compileComponents();

    fixture = TestBed.createComponent(StandardQuoteComponent);
    component = fixture.componentInstance;
    component.isReady = true;
    component.activeStep = 0;
    component.steps = ['Step 1', 'Step 2', 'Step 3'];
    spyOn(component, 'getFormData').and.callFake((url: string) => {
      if (url === 'Product/get_products') {
        return Promise.resolve({
          data: [
            { productId: 1, name: 'Product A' },
            { productId: 2, name: 'Product B' },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('should call commonSvc.data.put and return the response for successful API call', async () => {
    const mockApi = '/api/test';
    const mockPayload = { name: 'test' };
    const mockParams = { id: 123 };
    const mockResponse = { success: true };

    // Mock the put method
    commonSvcMock.data.put.and.returnValue(of(mockResponse));

    const result = await component.putFormData(
      mockApi,
      mockPayload,
      mockParams
    );

    expect(commonSvcMock.data.put).toHaveBeenCalledWith(
      mockApi,
      mockPayload,
      mockParams
    );
    expect(result).toEqual(mockResponse);
  });
  it('should handle API error and throw an error', async () => {
    const mockApi = '/api/test';
    const mockPayload = { name: 'test' };
    const mockParams = { id: 123 };
    const mockError = { error: 'Error occurred' };

    // Mock the put method to throw an error
    commonSvcMock.data.put.and.returnValue(throwError(mockError));

    try {
      await component.putFormData(mockApi, mockPayload, mockParams);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(commonSvcMock.data.put).toHaveBeenCalledWith(
        mockApi,
        mockPayload,
        mockParams
      );
      expect(error).toEqual(mockError);
    }
  });

  it('should call getProductList and getProgramList in sequence', async () => {
    spyOn(component, 'getProductList').and.returnValue(Promise.resolve());
    spyOn(component, 'getProgramList').and.returnValue(Promise.resolve());

    // Call the method
    await component.getList();

    // Assertions
    expect(component.getProductList).toHaveBeenCalledTimes(1);
    expect(component.getProgramList).toHaveBeenCalledTimes(1);
    expect(component.getProductList).toHaveBeenCalledBefore(
      component.getProgramList as jasmine.Spy
    );
  });

  it('should set productList when a matching productId is found', async () => {
    // Arrange
    component.formData = { productId: 1 };

    // Act
    await component.getProductList();

    // Assert
    expect(component.productList).toEqual({ productId: 1, name: 'Product A' });
  });

  it('should set productList to undefined when no matching productId is found', async () => {
    // Arrange
    component.formData = { productId: 3 };

    // Act
    await component.getProductList();

    // Assert
    expect(component.productList).toBeUndefined();
  });

  it('should not attempt to filter products when formData is undefined', async () => {
    // Arrange
    component.formData = undefined;

    // Act
    await component.getProductList();

    // Assert
    expect(component.productList).toBeUndefined();
  });

  it('should call getFormData with the correct URL', async () => {
    // Act
    await component.getProductList();

    // Assert
    expect(component.getFormData).toHaveBeenCalledWith('Product/get_products');
  });

  it('should not create contract when steps[0] is not "Asset Details"', async () => {
    // Arrange
    const params = {
      steps: ['Other Step'],
      activeStep: 1,
    };

    spyOn(component, 'getList');

    // Act
    //  await component.contractCreation(params);

    // Assert
    expect(component.getList).not.toHaveBeenCalled();
    expect(commonSvcMock.data.post).not.toHaveBeenCalled();
    expect(standardQuoteSvcMock.setBaseDealerFormData).not.toHaveBeenCalled();
  });

  it('should not create contract when mode is "edit"', async () => {
    // Arrange
    component.mode = 'edit'; // In edit mode
    const params = {
      steps: ['Asset Details'],
      activeStep: 1,
    };

    spyOn(component, 'getList');

    // Act
    //await component.contractCreation(params);

    // Assert
    expect(component.getList).not.toHaveBeenCalled();
    expect(commonSvcMock.data.post).not.toHaveBeenCalled();
    expect(standardQuoteSvcMock.setBaseDealerFormData).not.toHaveBeenCalled();
  });

  describe('YourComponent - contractCreation API Call', () => {
    beforeEach(async () => {
      // Mocking the services
      commonSvcMock = {
        data: {
          post: jasmine.createSpy().and.returnValue(of({})),
        },
      };

      standardQuoteSvcMock = {
        setBaseDealerFormData: jasmine.createSpy(),
        changeDetectionForUpdate: { next: jasmine.createSpy() },
        stepper: { next: jasmine.createSpy() },
        activeStep: null,
      };

      changeDetectorRefMock = {
        detectChanges: jasmine.createSpy(),
      };
    });

    it('should make API call to create contract successfully', async () => {
      // Arrange
      component.formData = {
        amoutFinanced: 10000,
        asset: '',
        assetInsuranceAmount: 0,
        assetInsuranceMonths: 0,
        assetInsuranceName: '',
        assetInsuranceProvider: '',
        assetLocationOfUse: 'Overseas',
        baseInterestRate: 0,
        calcDt: '2024-09-05T07:26:04.765Z',
        calculateSettlement: 0,
        cashDeposit: 111000,
        conditionOfGood: 'New',
        contractId: 0,
        countryFirstRegistered: 'New Zealand',
        customFieldGroups: [
          {
            items: [
              {
                customFields: [
                  {
                    name: 'Insurance Provider',
                    value: '100',
                  },
                ],
                rowNo: 0,
              },
            ],
            name: 'Insurance Provider and Terms',
          },
        ],
        dealerOriginationFee: 1110,
        deposit: 10000,
        establishmentFeeShare: 0,
        estimatedCommissionSubsidy: 0,
        extendedWarrantyMonth: 0,
        financialAssetInsurance: [
          {
            id: 0,
            insurer: 'Jhon',
            broker: 'garima',
            sumInsured: 10000,
            policyNumber: '1234',
            policyExpiryDate: '2024-09-11T11:14:16.024Z',
            mobileNumber: '123456789',
            email: 'jay@gmail.com',
          },
        ],
        financialAssetLease: {
          accessories: [
            {
              amount: 1000,
              code: '',
              id: 0,
              name: 'test2',
              reference: 'Accessories',
            },
          ],
          amtBaseRepayment: 110,
          amtFinancedTotal: 1111110,
          amtTotalInterest: 11110,
          balloonAmount: 100,
          balloonDate: '2024-09-05T07:26:04.766Z',
          balloonPct: 10,
          charges: 1110,
          consumerCreditInsurance: {
            amount: 4342,
            id: 0,
            months: '34',
            provider: '',
          },
          dealerOriginationFee: 1110,
          establishmentFeeShare: 1000,
          estimatedCommissionSubsidy: 0,
          extendedWarranty: {
            amount: 3230,
            id: 0,
            months: '3',
            provider: '',
          },
          fixed: true,
          guaranteeAssetProtection: {
            amount: 2323,
            id: 0,
            months: '3',
            provider: '',
          },
          id: 0,
          interestCharge: 10000,
          isFixed: true,
          loanMaintenanceFee: 10000,
          matureDate: '2024-09-05T07:26:04.766Z',
          mechanicalBreakdownInsurance: {
            amount: 11110,
            id: 0,
            months: '2',
            provider: '',
          },
          motorVehicleInsurance: {
            amount: 0,
            id: 0,
            months: '3',
            provider: 'Insurance Type',
          },
          netTradeAmount: 0,
          other: [
            {
              amount: 1000,
              code: '',
              id: 32,
              name: 'OtherTest',
              reference: 'Other',
              months: '36',
            },
          ],
          paymentAmount: 1110,
          paymentSchedule: 0,
          registrations: [
            {
              amount: 1000,
              code: '',
              id: 0,
              months: '24',
              name: 'Registration Test with months',
              reference: 'Registration Fee',
            },
          ],
          residualValue: 110,
          servicePlan: [
            {
              amount: 10000,
              code: '',
              id: 0,
              name: 'ServiceTest',
              reference: 'Service Plan',
              months: '48',
            },
          ],
          settlementAmount: 0,
          startDate: '2024-09-05T07:26:04.766Z',
          subTotalAddOns: 0,
          term: 26,
          totalAmountBorrowed: 10000,
          totalAmountBorrowedIncGST: 200000,
          totalAmtFinancedTax: 1101,
          totalCost: 111110,
          totalEstablishmentFee: 110,
          totalInterest: 1110,
          tradeAmount: 110,
          udcEstablishmentFee: 1110,
        },
        financialAssets: [
          {
            amtFinancedTotal: 0,
            assetDescription: '',
            assetId: 0,
            assetName: '',
            assetType: {
              assetTypeId: 0,
              assetTypeName: 'Grape Harvesters',
              assetTypePath:
                'All Asset Types / All Asset Type / Agricultural / Grape Harvesters',
            },
            cashPriceofAnAsset: 0,
            colour: '',
            condition: '',
            cost: 200000,
            serialNo: 'SVC565',
            taxesAmt: 1110,
            yearOfManufacture: 2024,
          },
          {
            amtFinancedTotal: 0,
            assetDescription: '',
            assetId: 0,
            assetName: '',
            assetType: {
              assetTypeId: 0,
              assetTypeName: 'Grape Harvesters',
              assetTypePath:
                'All Asset Types / All Asset Type / Agricultural / Grape Harvesters',
            },
            cashPriceofAnAsset: 0,
            colour: '',
            condition: '',
            cost: 100000,
            serialNo: 'SVC565',
            taxesAmt: 1110,
            yearOfManufacture: 2024,
          },
        ],
        firstPaymentDate: '',
        frequency: '',
        inclOfGST: 0,
        insurer: '',
        interestRate: 0,
        isDraft: true,
        lastPayment: '',
        loanAmount: 0,
        loanDate: '2024-09-05T07:26:04.766Z',
        loanMaintenanceFee: 0,
        location: {
          extName: 'New Zealand',
          locationId: 176,
          locationType: 'Country',
        },
        mechanicalBreakdownMonth: 0,
        motivePower: '',
        netTradeAmount: 0,
        originatorName: '',
        originatorNumber: 10000,
        originatorReference: '',
        paymentStructure: '',
        physicalAsset: {
          assetId: '',
          assetName: '',
          conditionOfGood: '',
          costOfAsset: 0,
          id: 0,
          make: '',
          model: '',
          regoNumber: '',
          variant: '',
          vin: '',
          year: 2024,
        },
        ppsrCount: 1,
        ppsrPercentage: 10,
        product: {
          extName: 'Credit Sale Agreement - Business - Direct- Fixed',
          productCode: 'CSA-B-D-F',
          productId: 24,
        },
        program: {
          extName: 'CSA Business - Direct - Fixed',
          lookupName: '126 - CSA Business - Direct - Fixed',
          programCode: 'CSADF',
          programId: 126,
        },
        promotionQuote: '',
        purposeofLoan: 'Personal',
        quoteType: '',
        regoVIN: 'VIN No',
        salesPerson: '',
        servicePlanMonths: 0,
        settlementAmount: 0,
        supplierName: 'Jhon',
        taxProfile: {
          code: 'FL',
          id: 3,
          name: 'Finance Lease',
        },
        totalAmountBorrowed: 11110,
        totalTermDays: 0,
        totalTermMonths: 0,
        tradeAmount: 10000,
        tradeInAssetRequest: [
          {
            tradeAssetValue: '55000',
            tradeCCNo: '1345',
            tradeColour: 'White',
            tradeEngineNo: '678978',
            tradeMake: '',
            tradeMotivePower: '',
            tradeOdometer: '',
            tradeRegoNo: '',
            tradeSerialOrChassisNo: '',
            tradeVariant: '',
            tradeVinNo: '',
            tradeYear: '1',
          },
          {
            tradeAssetValue: '55900',
            tradeCCNo: '1787',
            tradeColour: 'Blue',
            tradeEngineNo: '678979',
            tradeMake: '',
            tradeMotivePower: '',
            tradeOdometer: '',
            tradeRegoNo: '',
            tradeSerialOrChassisNo: '',
            tradeVariant: '',
            tradeVinNo: '',
            tradeYear: '1',
          },
        ],
        udcEstablishmentFee: 1110,
        value: '0',
        variant: 'Car',
        weiveLMF: '0',
      };

      spyOn(component, 'getList').and.returnValue(Promise.resolve());

      // Act
      // await component.contractCreation(params);

      // Assert
      const expectedRequest = {
        // This should match the structure sent in the API call, adjust values accordingly
        amoutFinanced: 0,
        asset: '',
        assetInsuranceAmount: 0,
        assetInsuranceMonths: 0,
        assetInsuranceName: '',
        assetInsuranceProvider: '',
        assetLocationOfUse: 'Overseas',
        baseInterestRate: 0,
        calcDt: '2024-09-05T07:26:04.765Z',
        calculateSettlement: 0,
        cashDeposit: component.formData?.cashDeposit || 0,
        // Add more fields based on the formData and other logic
        // ...
        originatorReference: component.formData?.originatorReference || '',
      };

      commonSvcMock.data.post(
        'Contract/create_contract',
        jasmine.objectContaining(expectedRequest)
      );
      standardQuoteSvcMock.setBaseDealerFormData();
      standardQuoteSvcMock.changeDetectionForUpdate.next(true);
      changeDetectorRefMock.detectChanges();

      // Verify that the API call was made with the correct request body
      expect(commonSvcMock.data.post).toHaveBeenCalledWith(
        'Contract/create_contract',
        jasmine.objectContaining(expectedRequest)
      );

      // Ensure other interactions after successful API call
      expect(standardQuoteSvcMock.setBaseDealerFormData).toHaveBeenCalled();
      expect(
        standardQuoteSvcMock.changeDetectionForUpdate.next
      ).toHaveBeenCalledWith(true);
      expect(changeDetectorRefMock.detectChanges).toHaveBeenCalled();
      // expect(standardQuoteSvcMock.stepper.next).toHaveBeenCalledWith(params);
    });

    it('should handle API error response gracefully', async () => {
      // Arrange
      component.formData = {
        // Set necessary formData properties here
        cashDeposit: 5000,
        dealerOriginationFee: 300,
        term: 24,
        originatorReference: 'REF123',
        // Add more fields as needed
      };
      component.mode = 'create'; // Not in edit mode

      const params = {
        steps: ['Asset Details'],
        activeStep: 1,
      };

      spyOn(component, 'getList').and.returnValue(Promise.resolve());

      // Simulate an API error
      commonSvcMock.data.post.and.returnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 500,
              statusText: 'Internal Server Error',
            })
        )
      );

      // Act
      commonSvcMock.data.post('Contract/create_contract', jasmine.any(Object));
      //  await component.contractCreation(params);

      // Assert that the API call was attempted
      expect(commonSvcMock.data.post).toHaveBeenCalled();

      // Ensure the error was handled (you might want to add specific error handling in the method itself)
      expect(standardQuoteSvcMock.setBaseDealerFormData).not.toHaveBeenCalled(); // Assuming the contract creation fails and this doesn't get called
      expect(
        standardQuoteSvcMock.changeDetectionForUpdate.next
      ).not.toHaveBeenCalled(); // No change detection triggered on failure
      expect(standardQuoteSvcMock.stepper.next).not.toHaveBeenCalled(); // Stepper doesn't proceed on error
    });
  });
  it('should handle "next" type correctly when formStatusArr does not include "INVALID"', async () => {
    component.formData = { contractId: 123 };
    component.activeStep = 0;
    standardQuoteSvcMock.formStatusArr = [];

    spyOn(component, 'contractModification').and.stub();
    spyOn(component, 'contractCreation').and.stub();

    await component.changeStep({ type: 'next', activeStep: 1 });

    expect(standardQuoteSvcMock.stepper.next).toHaveBeenCalledWith({
      activeStep: 0,
      validate: true,
    });
    expect(component.contractModification).toHaveBeenCalledWith(
      { type: 'next', activeStep: 1, },
      0, false
    );
    expect(standardQuoteSvcMock.formStatusArr.length).toBe(0);
  });

  it('should handle "tabNav" type and fetch documents', async () => {
    component.formData = { contractId: 123 };
    await component.changeStep({ type: 'tabNav', activeStep: 2 });
    changeDetectorRefMock.detectChanges();

    expect(commonSvcMock.data.get).toHaveBeenCalledWith(
      'DocumentServices/documents?ContractId=123'
    );
    expect(standardQuoteSvcMock.setBaseDealerFormData).toHaveBeenCalledWith({
      generatedDocuments: [{ source: 'Generated', document: 'doc1' }],
    });
    expect(changeDetectorRefMock.detectChanges).toHaveBeenCalled();
  });
});
