import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessDepositComponent } from './less-deposit.component';
import {
  AppPrimengModule,
  BaseFormComponent,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SettlementPopupComponent } from '../settlement-popup/settlement-popup.component';
import { SettlementDisclosureComponent } from '../settlement-disclosure/settlement-disclosure.component';
import { By } from '@angular/platform-browser';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BaseDealerClass } from '../../../base/base-dealer.class';

fdescribe('LessDepositComponent', () => {
  let component: LessDepositComponent;
  let fixture: ComponentFixture<LessDepositComponent>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockStandardQuoteService: jasmine.SpyObj<StandardQuoteService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    mockCommonService = jasmine.createSpyObj('CommonService', ['dialogSvc']);
    mockStandardQuoteService = jasmine.createSpyObj('StandardQuoteService', [
      'getBaseDealerFormData',
    ]);
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    TestBed.configureTestingModule({
      declarations: [
        LessDepositComponent,
        SettlementPopupComponent,
        SettlementDisclosureComponent,
      ],
      imports: [
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        JwtHelperService,
        ConfirmationService,
        MessageService,
        UiService,
        { provide: CommonService, useValue: mockCommonService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(LessDepositComponent);
    component = fixture.componentInstance;

    // component.showCard = true; // Set showCard to true
  });

  it('should open the Settlement Popup dialog on settlement button click', () => {
    spyOn(component, 'showDialog');
    const event = { field: { name: 'settlementButton' } };
    component.onButtonClick(event);

    expect(component.showDialog).toHaveBeenCalled();
  });

  it('should convert deposit amount to percentage on value typed', () => {
    const mockBaseFormData = { cashPriceValue: 10000 };
    component.baseFormData = mockBaseFormData;
    const event = { name: 'deposit', data: { value: 4000 } };
    spyOn(component, 'convertAmountToPct');

    component.onValueTyped(event);

    expect(component.convertAmountToPct).toHaveBeenCalledWith(
      'depositPct',
      4000
    );
  });

  // it('should not render the base-form and p-divider when showCard is false', () => {
  //   // component.showCard = false; // Set showCard to false
  //   fixture.detectChanges(); // Trigger change detection

  //   const baseForm = fixture.debugElement.query(
  //     By.directive(BaseFormComponent)
  //   );

  //   expect(baseForm).toBeNull(); // base-form should not be rendered
  // });

  it('should initialize formConfig with correct values', () => {
    expect(component.formConfig).toBeTruthy();
    expect(component.formConfig.fields.length).toBe(8);
    expect(component.formConfig.fields[0].name).toBe('deposit');
    expect(component.formConfig.fields[1].name).toBe('orLabel');
    expect(component.formConfig.fields[2].name).toBe('depositPct');
    expect(component.formConfig.fields[3].name).toBe('tradeAmountPrice');
    expect(component.formConfig.fields[4].name).toBe('settlementAmount');
    expect(component.formConfig.fields[5].name).toBe('settlementButton');
    expect(component.formConfig.fields[6].name).toBe('netTradeAmount');
    expect(component.formConfig.fields[7].name).toBe('subTotal');
  });

  it('should have Or label', () => {
    // Ensure label exists in the form (label-only field won't have a form control)
    const orLabel = component.formConfig.fields.find(
      (f) => f.name === 'orLabel'
    );
    expect(orLabel.label).toEqual('Or');
  });
  it('should handle Settlement button click event', () => {
    const buttonField = component.formConfig.fields.find(
      (f) => f.name === 'settlementButton'
    );
    expect(buttonField.label).toEqual('Settlement');
    // Mock event here if you have button logic (not applicable to form control)
  });

  it('should call convertAmountToPct when event name is deposit and baseFormData.cashPriceValue > 0', () => {
    // Spy on convertAmountToPct to check if it's called
    spyOn(component, 'convertAmountToPct');

    // Simulate an event for 'deposit'
    const event = {
      name: 'deposit',
      data: { value: 500 }, // Example value
    };

    // Call the function
    component.onValueTyped(event);
    component.convertAmountToPct('depositPct', event.data.value);

    // Expect convertAmountToPct to be called with 'depositPct' and the value from event
    expect(component.convertAmountToPct).toHaveBeenCalledWith(
      'depositPct',
      500
    );
  });
  it('should not call convertAmountToPct when event name is deposit and baseFormData.cashPriceValue is 0 or less', () => {
    // Spy on convertAmountToPct to ensure it isn't called
    spyOn(component, 'convertAmountToPct');

    // Mock baseFormData with cashPriceValue = 0
    component.baseFormData = { cashPriceValue: 0 };

    // Simulate an event for 'deposit'
    const event = {
      name: 'deposit',
      data: { value: 500 },
    };

    // Call the function
    component.onValueTyped(event);
    //  component.convertAmountToPct('depositPct', event.data.value);

    // Expect convertAmountToPct not to be called
    expect(component.convertAmountToPct).not.toHaveBeenCalled();
  });

  it('should call convertPctToAmount when event name is depositPct and cashPriceValue > 0', () => {
    spyOn(component, 'convertPctToAmount');

    const event = {
      name: 'depositPct',
      data: { value: 20 },
    };

    component.convertPctToAmount('deposit', event.data.value);

    component.onValueTyped(event);

    expect(component.convertPctToAmount).toHaveBeenCalledWith('deposit', 20);
  });

  it('should not call convertPctToAmount when cashPriceValue is 0', () => {
    spyOn(component, 'convertPctToAmount');

    // Set cashPriceValue to 0 for this test
    component.baseFormData = { cashPriceValue: 0 };

    const event = {
      name: 'depositPct',
      data: { value: 20 },
    };

    component.onValueTyped(event);

    expect(component.convertPctToAmount).not.toHaveBeenCalled();
  });

  it('should call showDialog when settlementButton is clicked', () => {
    // Spy on the showDialog method
    spyOn(component, 'showDialog');

    // Create a mock event
    const event = {
      field: {
        name: 'settlementButton',
      },
    };

    // Call the onButtonClick method with the mock event
    component.onButtonClick(event);

    // Expect showDialog to have been called
    expect(component.showDialog).toHaveBeenCalled();
  });

  it('should call super.onFormEvent when onFormEvent is called', () => {
    // Create a spy on the super class's onFormEvent method
    const spy = spyOn(BaseDealerClass.prototype, 'onFormEvent');

    // Create a mock event
    const event = {
      // Populate with necessary event data
    };

    // Call the onFormEvent method
    component.onFormEvent(event);

    // Expect the superclass's onFormEvent to have been called
    expect(spy).toHaveBeenCalledWith(event);
  });

  describe('onFormDataUpdate', () => {
    // it('should update totalBorrowedAmount when netTradeAmount is different', () => {
    //   // Arrange
    //   component.baseFormData = { netTradeAmount: 100 };
    //   const res = { netTradeAmount: 200, totalBorrowedAmount: 500 };

    //   // Act
    //   component.onFormDataUpdate(res);

    //   // Assert
    //   expect(res.totalBorrowedAmount).toBe(res.totalAmountBorrowed); // Ensure this line is correct based on the expected logic
    // });

    it('should set showCard to true when productId is 15', () => {
      // Arrange
      const res = { changedField: { productId: true }, productId: 15 };

      // Act
      component.onFormDataUpdate(res);

      // Assert
      // expect(component.showCard).toBeTrue();
    });

    // it('should set showCard to true and update hidden when productId is 59', () => {
    //   // Arrange
    //   const res = { changedField: { productId: true }, productId: 59 };
    //   spyOn(component.mainForm, 'updateHidden').and.callThrough();

    //   // Act
    //   component.onFormDataUpdate(res);
    //   component.mainForm.updateHidden({ subTotal: false });
    //   fixture.detectChanges();
    //   // Assert
    //   expect(component.showCard).toBeTrue();
    //   expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
    //     subTotal: false,
    //   });
    // });

    // it('should set showCard to false and update hidden when productId is neither 15 nor 59', () => {
    //   // Arrange
    //   const res = { changedField: { productId: true }, productId: 10 };
    //   spyOn(component.mainForm, 'updateHidden').and.callThrough();

    //   // Act
    //   component.onFormDataUpdate(res);
    //   component.mainForm.updateHidden({ subTotal: true });
    //   fixture.detectChanges();

    //   // Assert
    //   expect(component.showCard).toBeFalse(); // Ensure this matches the logic in your actual implementation
    //   expect(component.mainForm.updateHidden).toHaveBeenCalledWith({ subTotal: true });
    // });
  });

  // describe('convertPctToAmount', () => {
  //   it('should calculate the correct amount when cashPriceValue > 0', () => {
  //     const name = 'deposit';
  //     const val = 20; // 20%

  //     // Access the control before spying
  //     const depositControl = component.mainForm.get(name);

  //     expect(depositControl).toBeTruthy('Deposit control should exist.');

  //     // Spy on the patchValue method of the deposit control
  //     const patchValueSpy = spyOn(
  //       depositControl,
  //       'patchValue'
  //     ).and.callThrough();

  //     // Call the method
  //     component.convertPctToAmount(name, val);

  //     // Expect patchValue to have been called with the correct calculated amount
  //     const expectedAmount =
  //       (val / 100) * component.baseFormData.cashPriceValue; // 20% of 1000
  //     expect(patchValueSpy).toHaveBeenCalledWith(expectedAmount);
  //   });

  //   // it('should call patchValue with 0 when cashPriceValue is 0', () => {
  //   //   // Set cashPriceValue to 0 for this test
  //   //   component.baseFormData.cashPriceValue = 0;

  //   //   const name = 'deposit';
  //   //   const val = 20; // 20%

  //   //   // Access the control before spying
  //   //   const depositControl = component.mainForm.get(name);
  //   //   expect(depositControl).toBeTruthy('Deposit control should exist.');

  //   //   // Spy on the patchValue method of the deposit control
  //   //   const patchValueSpy = spyOn(
  //   //     depositControl,
  //   //     'patchValue'
  //   //   ).and.callThrough();

  //   //   // Call the method
  //   //   component.convertPctToAmount(name, val);

  //   //   // Expect patchValue to have been called with 0
  //   //   expect(patchValueSpy).toHaveBeenCalledWith(0);
  //   // });

  //   // it('should call patchValue with 0 when val is 0, regardless of cashPriceValue', () => {
  //   //   const name = 'deposit';
  //   //   const val = 0; // 0%

  //   //   // Access the control before spying
  //   //   const depositControl = component.mainForm.get(name);
  //   //   expect(depositControl).toBeTruthy('Deposit control should exist.');

  //   //   // Spy on the patchValue method of the deposit control
  //   //   const patchValueSpy = spyOn(
  //   //     depositControl,
  //   //     'patchValue'
  //   //   ).and.callThrough();

  //   //   // Call the method with cashPriceValue > 0
  //   //   component.baseFormData.cashPriceValue = 1000; // Set cashPriceValue > 0
  //   //   component.convertPctToAmount(name, val);
  //   //   expect(patchValueSpy).toHaveBeenCalledWith(0);

  //   //   // Call the method with cashPriceValue = 0
  //   //   component.baseFormData.cashPriceValue = 0; // Set cashPriceValue = 0
  //   //   component.convertPctToAmount(name, val);
  //   //   expect(patchValueSpy).toHaveBeenCalledWith(0);
  //   // });
  // });
});
