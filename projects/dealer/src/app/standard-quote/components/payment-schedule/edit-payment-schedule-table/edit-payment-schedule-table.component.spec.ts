import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentScheduleTableComponent } from './edit-payment-schedule-table.component';
import { AuroUiFrameWork } from 'auro-ui';
import { AuthenticationService, UiService } from 'auro-ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenTableComponent } from 'auro-ui';
import { By } from '@angular/platform-browser';
import { PaymentScheduleService } from '../payment-schedule.service';

fdescribe('EditPaymentScheduleTableComponent', () => {
  let component: EditPaymentScheduleTableComponent;
  let fixture: ComponentFixture<EditPaymentScheduleTableComponent>;
  let paymentScheduleSvc: jasmine.SpyObj<PaymentScheduleService>;

  beforeEach(async () => {
    const paymentScheduleSpy = jasmine.createSpyObj('PaymentScheduleService', [
      'paymentScheduleList',
    ]);

    await TestBed.configureTestingModule({
      declarations: [EditPaymentScheduleTableComponent],
      imports: [AuroUiFrameWork],
      providers: [
        AuthenticationService,
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } },
        },
        { provide: PaymentScheduleService, useValue: paymentScheduleSpy },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPaymentScheduleTableComponent);
    component = fixture.componentInstance;
    paymentScheduleSvc = TestBed.inject(
      PaymentScheduleService
    ) as jasmine.SpyObj<PaymentScheduleService>;

    // Mock data for paymentScheduleList
    paymentScheduleSvc.paymentScheduleList = [
      { date: '2024-11-01', number: 1, frequency: 'Monthly', payment: 1000 },
      { date: '2024-12-01', number: 2, frequency: 'Monthly', payment: 1000 },
    ];

    component.columnDefs = [
      { header: 'Date', field: 'date' },
      { header: 'Number', field: 'number' },
      { header: 'Frequency', field: 'frequency' },
      { header: 'Payment', field: 'payment' },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should pass the correct inputs to <gen-table>', () => {
    const genTableDebugElement = fixture.debugElement.query(
      By.directive(GenTableComponent)
    );
    const genTableComponent =
      genTableDebugElement.componentInstance as GenTableComponent;

    expect(genTableComponent.columns).toEqual(component.columnDefs);
    expect(genTableComponent.dataList).toEqual(
      paymentScheduleSvc.paymentScheduleList
    );
    expect(genTableComponent.tableStyle).toBe('stripped-rows');
    expect(genTableComponent.headingClass).toBe(
      'text-size-12 text-semi-bold text-color-dark-shade-3  background-color-dark-4'
    );
    expect(genTableComponent.bodyClass).toBe('text-size-12');
  });
  it('should call onCellClick when a cell is clicked', () => {
    spyOn(component, 'onCellClick');

    const genTableDebugElement = fixture.debugElement.query(
      By.directive(GenTableComponent)
    );
    genTableDebugElement.triggerEventHandler('onCellClick', {
      row: { date: '2024-11-01', number: 1 },
    });

    expect(component.onCellClick).toHaveBeenCalledWith({
      row: { date: '2024-11-01', number: 1 },
    });
  });
  it('should initialize column definitions', () => {
    expect(component.columnDefs.length).toBe(4);
    expect(component.columnDefs[0].field).toBe('date');
    expect(component.columnDefs[2].field).toBe('frequency');
  });
  it('should call updateFrequency with correct parameters', () => {
    const params = { index: 1, colName: 'frequency', cellData: 'Weekly' };
    component.updateFrequency(params);
    expect(paymentScheduleSvc.paymentScheduleList[1].frequency).toBe('Weekly');
  });

  it('should update formatIndex when editRow is called', () => {
    const params = { index: 1 };
    component.editRow(params);
    expect(component.columnDefs[2].formatIndex).toBe(1);
    expect(component.columnDefs[3].formatIndex).toBe(1);
  });

  it('should reset dropdown list on ngOnChanges', () => {
    component.dropdownList = ['Weekly', 'Monthly', 'Yearly'];
    component.ngOnChanges();
    expect(component.columnDefs[2].list).toEqual(component.dropdownList);
  });

  it('should call editRow when onCellClick is triggered with action "editRow"', () => {
    spyOn(component, 'editRow');
    const event = { actionName: 'editRow', index: 1 };
    component.onCellClick(event);
    expect(component.editRow).toHaveBeenCalledWith(event);
  });

  it('should return correct function when callFunction is called', () => {
    spyOn(component, 'updateFrequency');
    const event = { actionName: 'updateFrequency', index: 0 };
    component.callFunction(event);
    expect(component.updateFrequency).toHaveBeenCalledWith(event);
  });
});
