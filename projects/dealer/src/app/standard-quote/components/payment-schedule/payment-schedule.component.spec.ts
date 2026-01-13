import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentScheduleComponent } from './payment-schedule.component';
import {
  AppPrimengModule,
  AuthenticationService,
  AuroUiFrameWork,
} from 'auro-ui';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GenCardComponent } from 'auro-ui';
import { GenTableComponent } from 'auro-ui';
import { GenButtonComponent } from 'auro-ui';
import { PaymentScheduleService } from './payment-schedule.service';

fdescribe('PaymentScheduleComponent', () => {
  let component: PaymentScheduleComponent;
  let fixture: ComponentFixture<PaymentScheduleComponent>;
  let paymentScheduleSvc: jasmine.SpyObj<PaymentScheduleService>;

  beforeEach(async () => {
    const paymentScheduleSpy = jasmine.createSpyObj(
      'PaymentScheduleService',
      [],
      { paymentScheduleList: [] }
    );

    await TestBed.configureTestingModule({
      declarations: [PaymentScheduleComponent],
      imports: [AuroUiFrameWork, AppPrimengModule],
      providers: [
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        MessageService,
        { provide: PaymentScheduleService, useValue: paymentScheduleSpy },

        { provide: JWT_OPTIONS, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } },
        },
        // Provide JWT_OPTIONS here
      ],
      schemas: [NO_ERRORS_SCHEMA], // To ignore any unknown component errors
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentScheduleComponent);
    component = fixture.componentInstance;
    paymentScheduleSvc = TestBed.inject(
      PaymentScheduleService
    ) as jasmine.SpyObj<PaymentScheduleService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display gen-table and gen-button for "first" value and !isFinanceLease', () => {
    component.value = 'first'; // set the value for `value`
    component.isFinanceLease = false; // set the value for `isFinanceLease`
    fixture.detectChanges();

    const genTable = fixture.debugElement.query(
      By.directive(GenTableComponent)
    );
    const genButton = fixture.debugElement.query(
      By.directive(GenButtonComponent)
    );

    expect(genTable).toBeTruthy();
    expect(genButton).toBeTruthy();
  });
  it('should display gen-table and gen-button for isFinanceLease', () => {
    component.isFinanceLease = true; // set to true
    component.value = 'first'; // set the value for `value`
    fixture.detectChanges();

    const genTable = fixture.debugElement.query(
      By.directive(GenTableComponent)
    );
    const genButton = fixture.debugElement.query(
      By.directive(GenButtonComponent)
    );

    expect(genTable).toBeTruthy();
    expect(genButton).toBeNull();
  });

  it('should display gen-table for "second" value', () => {
    component.value = 'second';
    fixture.detectChanges();

    const genTable = fixture.debugElement.query(
      By.directive(GenTableComponent)
    );

    expect(genTable).toBeTruthy();
  });

  it('should trigger showDialogEditPaymentSmall when Edit Payment Schedule button is clicked', () => {
    spyOn(component, 'showDialogEditPaymentSmall');
    component.value = 'first';
    component.isFinanceLease = false;
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('gen-button'));
    editButton.triggerEventHandler('onClick', null); // Trigger click event

    expect(component.showDialogEditPaymentSmall).toHaveBeenCalled();
  });

  //for ts

  describe('updatePaymentScheduleData', () => {
    it('should clear the current payment schedule and add a new row', () => {
      // Set initial values for the component properties
      component.firstPaymentDate = '2023-12-01';
      component.editPaymentScheduleNumberOfPayments = 5;
      component.frequency = 'Monthly';
      component.paymentAmount = 1000;

      // Call the updatePaymentScheduleData method
      component.updatePaymentScheduleData();

      // Assertions
      expect(component.paymentSchedule.length).toBe(1); // Expecting only 1 row
      expect(component.paymentSchedule[0]).toEqual({
        paymentScheduleDate: '2023-12-01',
        paymentScheduleNumber: 5,
        paymentScheduleFrequency: 'Monthly',
        paymentSchedulePayment: 1000,
      });
    });

    it('should update an existing row if it exists', () => {
      // Set initial values
      component.firstPaymentDate = '2023-12-01';
      component.editPaymentScheduleNumberOfPayments = 5;
      component.frequency = 'Monthly';
      component.paymentAmount = 1000;

      // Add an existing row in paymentSchedule to simulate a pre-existing row
      component.paymentSchedule = [
        {
          paymentScheduleDate: '2023-11-01',
          paymentScheduleNumber: 3,
          paymentScheduleFrequency: 'Weekly',
          paymentSchedulePayment: 500,
        },
      ];

      // Call the updatePaymentScheduleData method
      component.updatePaymentScheduleData();

      // Assertions
      expect(component.paymentSchedule.length).toBe(1); // Still only 1 row
      expect(component.paymentSchedule[0]).toEqual({
        paymentScheduleDate: '2023-12-01',
        paymentScheduleNumber: 5,
        paymentScheduleFrequency: 'Monthly',
        paymentSchedulePayment: 1000,
      });
    });

    it('should handle empty values gracefully', () => {
      // Call the updatePaymentScheduleData with empty properties
      component.firstPaymentDate = undefined;
      component.editPaymentScheduleNumberOfPayments = undefined;
      component.frequency = undefined;
      component.paymentAmount = undefined;

      // Call the updatePaymentScheduleData method
      component.updatePaymentScheduleData();

      // Assertions
      expect(component.paymentSchedule.length).toBe(1); // Expecting only 1 row with undefined values
      expect(component.paymentSchedule[0]).toEqual({
        paymentScheduleDate: undefined,
        paymentScheduleNumber: undefined,
        paymentScheduleFrequency: undefined,
        paymentSchedulePayment: undefined,
      });
    });
  });

  describe('updateSecondColumnDefs', () => {
    it('should handle empty filteredInstallments array and result in an empty paymentScheduleList', () => {
      const frequency = 'Weekly';
      const filteredInstallments: any[] = [];

      // Call the function
      component.updateSecondColumnDefs(frequency, filteredInstallments);

      // Expect an empty paymentScheduleList
      expect(paymentScheduleSvc.paymentScheduleList).toEqual([]);
    });
  });
});
