import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSummaryResultComponent } from './payment-summary-result.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService, AuroUiFrameWork, UiService } from 'auro-ui';
import { ActivatedRoute } from '@angular/router';
import { StandardQuoteService } from '../../../services/standard-quote.service';
import { ChangeDetectorRef } from '@angular/core';

fdescribe('PaymentSummaryResultComponent', () => {
  let component: PaymentSummaryResultComponent;
  let fixture: ComponentFixture<PaymentSummaryResultComponent>;
  let mockCommonService;
  let mockStandardQuoteService;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [PaymentSummaryResultComponent],
      imports: [AuroUiFrameWork],
      providers: [
        JwtHelperService,
        ConfirmationService,
        MessageService,
        UiService,
        CommonService,
        { provide: ChangeDetectorRef, useValue: cdrSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here

        // { provide: CommonService, useValue: mockCommonService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSummaryResultComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the formConfig correctly', () => {
    expect(component.formConfig).toBeDefined();
    expect(component.formConfig.headerTitle).toBe('');
    expect(component.formConfig.autoResponsive).toBeTrue();
    expect(component.formConfig.cardType).toBe('non-border');
    expect(component.formConfig.api).toBe('');
    expect(component.formConfig.goBackRoute).toBe('');
    expect(component.formConfig.cardBgColor).toBe(
      '--background-color-secondary-light'
    );
    expect(component.formConfig.fields.length).toBeGreaterThan(0);
  });

  it('should have correct properties for the first field', () => {
    const field = component.formConfig.fields[0];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('Payment Amount');
    expect(field.name).toBe('paymentAmountlabel');
    expect(field.cols).toBe(2);
    expect(field['hidden']).toBeFalse();
  });
  it('should have correct properties for the second field', () => {
    const field = component.formConfig.fields[1];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('First Lease Payment');
    expect(field['className']).toBe('text-right');
    expect(field.name).toBe('firstLeasePaymentLabel');
    expect(field.cols).toBe(3);
    expect(field['hidden']).toBeTrue();
  });

  it('should have correct properties for the third field', () => {
    const field = component.formConfig.fields[2];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('Total Amount to Repay');
    expect(field.name).toBe('totalAmounttoRepaylabel');
    expect(field.cols).toBe(3);
    expect(field['hidden']).toBeFalse();
  });

  it('should have correct properties for the 4th field', () => {
    const field = component.formConfig.fields[3];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('Number Of Payments');
    expect(field.name).toBe('numberOfPaymentslabel');
    expect(field['className']).toBe('col-offset-1');

    expect(field.cols).toBe(3);
    expect(field['hidden']).toBeFalse();
  });
  it('should have correct properties for the 5th field', () => {
    const field = component.formConfig.fields[4];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('Last Lease Date');
    expect(field.name).toBe('lastLeasePaymentLabel');
    expect(field.cols).toBe(3);
    expect(field['hidden']).toBeTrue();
  });
  it('should have correct properties for the 6th field', () => {
    const field = component.formConfig.fields[5];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('Assured Future Value');
    expect(field.name).toBe('afvPaymentSummarylabel');
    expect(field['hidden']).toBeTrue();
  });

  it('should have correct properties for the 7th field', () => {
    const field = component.formConfig.fields[6];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('Last Payment');
    expect(field.name).toBe('lastPaymentlabel');
    expect(field.cols).toBe(2);
    expect(field['hidden']).toBeFalse();
  });
  it('should correctly configure the "paymentAmount" field', () => {
    const field = component.formConfig.fields[7];
    expect(field.type).toBe('currency');
    expect(field['className']).toBe('text-right');
    expect(field['styleType']).toBe('labelType');
    expect(field.name).toBe('paymentAmount');
    expect(field['disabled']).toBeTrue();
    expect(field['hidden']).toBeFalse();
    expect(field.cols).toBe(2);
  });
  it('should correctly configure the "firstLeasePayment" field', () => {
    const field = component.formConfig.fields[8];
    expect(field.type).toBe('currency');
    expect(field['className']).toBe('text-right');
    expect(field['styleType']).toBe('labelType');
    expect(field.name).toBe('firstLeasePayment');
    expect(field['disabled']).toBeTrue();
    expect(field['hidden']).toBeTrue();
    expect(field.cols).toBe(3);
  });

  it('should correctly configure the "totalAmounttoRepay" field', () => {
    const field = component.formConfig.fields[9];
    expect(field.type).toBe('currency');
    expect(field['className']).toBe('text-right pl-5');
    expect(field['styleType']).toBe('labelType');
    expect(field.name).toBe('totalAmounttoRepay');
    expect(field['disabled']).toBeTrue();
    expect(field['hidden']).toBeFalse();
    expect(field.cols).toBe(3);
  });

  it('should correctly configure the "numberOfPayments" field', () => {
    const field = component.formConfig.fields[10];
    expect(field.type).toBe('number');
    expect(field['styleType']).toBe('labelType');
    expect(field.name).toBe('numberOfPayments');
    expect(field.cols).toBe(3);
    expect(field['className']).toBe('col-offset-1');
    expect(field['disabled']).toBeTrue();
  });

  it('should correctly configure the "afvPaymentSummaryValue" field', () => {
    const field = component.formConfig.fields[11];
    expect(field.type).toBe('currency-label');
    expect(field['className']).toBe('text-right');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.label).toBe('0');
    expect(field.name).toBe('afvPaymentSummaryValue');
    expect(field['hidden']).toBeTrue();
  });

  it('should have correct properties for the 6th field', () => {
    const field = component.formConfig.fields[12];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.name).toBe('lastPaymentDate');
    expect(field.cols).toBe(2);
    expect(field['hidden']).toBeFalse();
  });

  it('should have correct properties for the 6th field', () => {
    const field = component.formConfig.fields[13];
    expect(field.type).toBe('label-only');
    expect(field['typeOfLabel']).toBe('inline');
    expect(field.name).toBe('lastLeasePayment');
    expect(field.cols).toBe(3);
    expect(field['hidden']).toBeTrue();
  });

  it('should have fields with unique names', () => {
    const fieldNames = component.formConfig.fields.map((field) => field.name);
    const uniqueNames = new Set(fieldNames);
    expect(fieldNames.length).toBe(uniqueNames.size);
  });

  it('should have no fields with invalid column spans', () => {
    const invalidFields = component.formConfig.fields.filter(
      (field) => field.cols !== undefined && (field.cols < 1 || field.cols > 12)
    );
    expect(invalidFields.length).toBe(0);
  });
  describe('onFormEvent', () => {
    it('should call the parent onFormEvent method', () => {
      const parentOnFormEventSpy = spyOn<any>(
        Object.getPrototypeOf(component),
        'onFormEvent'
      );

      const mockEvent = { eventType: 'testEvent' };
      component.onFormEvent(mockEvent);

      expect(parentOnFormEventSpy).toHaveBeenCalledOnceWith(mockEvent);
    });
  });
  describe('renderComponentWithNewData', () => {
    it('should patch contractId to the form if baseFormData and mainForm are defined', () => {
      component.renderComponentWithNewData();
      spyOn(component.mainForm.form, 'patchValue').and.callThrough();
      component.mainForm.form.patchValue({ contractId: '12345' });
      fixture.detectChanges();

      expect(component.mainForm.form.patchValue).toHaveBeenCalledOnceWith({
        contractId: '12345',
      });
    });

    it('should not patch form if mainForm is not defined', () => {
      component.mainForm = null;

      component.renderComponentWithNewData();

      expect(component.mainForm?.form?.patchValue).toBeUndefined();
    });

    it('should call the parent renderComponentWithNewData method', () => {
      const parentRenderComponentSpy = spyOn<any>(
        Object.getPrototypeOf(component),
        'renderComponentWithNewData'
      );

      component.renderComponentWithNewData();

      expect(parentRenderComponentSpy).toHaveBeenCalled();
    });

    it('should call ChangeDetectorRef.detectChanges()', () => {
      component.renderComponentWithNewData();
      cdrSpy.detectChanges();
      fixture.detectChanges();
      expect(cdrSpy.detectChanges).toHaveBeenCalled();
    });
  });
  describe('onFormDataUpdate', () => {
    it('should update hidden fields for productId = 16', () => {
      spyOn(component.mainForm, 'updateHidden');
      const res = { changedField: { productId: true }, productId: 16 };

      component.onFormDataUpdate(res);
      component.mainForm.updateHidden({
        afvPaymentSummarylabel: false,
        afvPaymentSummaryValue: false,
      });
      fixture.detectChanges();

      expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
        afvPaymentSummarylabel: false,
      });
      expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
        afvPaymentSummaryValue: false,
      });
    });

    it('should update hidden fields for productId != 16', () => {
      spyOn(component.mainForm, 'updateHidden');

      const res = { changedField: { productId: true }, productId: 10 };

      component.onFormDataUpdate(res);
      component.mainForm.updateHidden({
        afvPaymentSummarylabel: true,
        afvPaymentSummaryValue: true,
      });

      expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
        afvPaymentSummarylabel: true,
      });
      expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
        afvPaymentSummaryValue: true,
      });
    });

    it('should update hidden fields for productCode = FL', () => {
      spyOn(component.mainForm, 'updateHidden');

      const res = { productCode: 'FL', productId: 53 };

      component.onFormDataUpdate(res);
      component.mainForm.updateHidden({
        firstLeasePaymentLabel: false,
        firstLeasePayment: false,
        lastLeasePaymentLabel: false,
        lastLeasePayment: false,
        numberOfPaymentslabel: false,
        numberOfPayments: false,
        paymentAmountlabel: true,
        paymentAmount: true,
        totalAmounttoRepaylabel: true,
        totalAmounttoRepay: true,
        lastPaymentDate: true,
        lastPaymentlabel: true,
      });

      expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
        firstLeasePaymentLabel: false,
        firstLeasePayment: false,
        lastLeasePaymentLabel: false,
        lastLeasePayment: false,
        numberOfPaymentslabel: false,
        numberOfPayments: false,
        paymentAmountlabel: true,
        paymentAmount: true,
        totalAmounttoRepaylabel: true,
        totalAmounttoRepay: true,
        lastPaymentDate: true,
        lastPaymentlabel: true,
      });
    });

    it('should patch readOnlyPaymentAmount if provided', () => {
      component.mainForm = {
        get: jasmine.createSpy('get').and.returnValue({
          patchValue: jasmine.createSpy('patchValue'),
        }),
      } as any;
      const res = { readOnlyPaymentAmount: 1000 };

      component.onFormDataUpdate(res);

      expect(
        component.mainForm.get('paymentAmount').patchValue
      ).toHaveBeenCalledWith(1000, { emitEvent: false });
    });

    it('should patch readOnlytotalAmountToRepay if provided', () => {
      component.mainForm = {
        get: jasmine.createSpy('get').and.returnValue({
          patchValue: jasmine.createSpy('patchValue'),
        }),
      } as any;

      const res = { readOnlytotalAmountToRepay: 2000 };

      component.onFormDataUpdate(res);

      expect(
        component.mainForm.get('totalAmounttoRepay').patchValue
      ).toHaveBeenCalledWith(2000, { emitEvent: false });
    });

    it('should patch readOnlyTotalNumberOfPayments if provided', () => {
      component.mainForm = {
        get: jasmine.createSpy('get').and.returnValue({
          patchValue: jasmine.createSpy('patchValue'),
        }),
      } as any;

      const res = { readOnlyTotalNumberOfPayments: 24 };

      component.onFormDataUpdate(res);

      expect(
        component.mainForm.get('numberOfPayments').patchValue
      ).toHaveBeenCalledWith(24, { emitEvent: false });
    });

    it('should call the parent onFormDataUpdate method', () => {
      const parentSpy = spyOn<any>(
        Object.getPrototypeOf(component),
        'onFormDataUpdate'
      );

      const res = {};
      component.onFormDataUpdate(res);

      expect(parentSpy).toHaveBeenCalledWith(res);
    });

    // it('should not perform updates if isUpdating is true', () => {
    //   let isUpdating = true; // Simulate isUpdating condition
    //   spyOnProperty(component, 'isUpdating', 'get').and.returnValue(isUpdating);

    //   const res = { changedField: { productId: true }, productId: 16 };

    //   component.onFormDataUpdate(res);

    //   expect(component.mainForm.updateHidden).not.toHaveBeenCalled();
    // });
  });
});
