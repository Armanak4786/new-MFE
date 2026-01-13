import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPaymentScheduleComponent } from './edit-payment-schedule.component';
import {
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { StandardQuoteService } from '../../../services/standard-quote.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

fdescribe('EditPaymentScheduleComponent', () => {
  let component: EditPaymentScheduleComponent;
  let fixture: ComponentFixture<EditPaymentScheduleComponent>;
  let mockStandardQuoteService: StandardQuoteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPaymentScheduleComponent],
      imports: [AuroUiFrameWork],
      providers: [
        AuthenticationService,
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        CommonService,
        {
          provide: StandardQuoteService,
          useValue: {
            getBaseDealerFormData: jasmine
              .createSpy('getBaseDealerFormData')
              .and.returnValue(
                of({
                  financialAssetPriceSegments: [
                    {
                      editPaymentScheduleNumberOfPayments: 10,
                      editPaymentScheduleTotalTerm: 24,
                    },
                  ],
                })
              ),
          },
        },

        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } },
        },
        //  { provide: PaymentScheduleService, useValue: paymentScheduleSpy },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPaymentScheduleComponent);
    component = fixture.componentInstance;
    mockStandardQuoteService = TestBed.inject(StandardQuoteService);
    // mockCommonService.form = TestBed.inject(CommonService).form;
    // component.mainForm = mockCommonService.form.group({
    //   editPaymentSchedule: mockCommonService.form.array([]),
    // }) as any;

    spyOn(component, 'customPatchFormArray');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render payment schedule correctly', () => {
    component.noOfMonths = 12;
    component.noOfDays = 15;
    component.paymentScheduleNoOfPaymentsTotal = 5;

    fixture.detectChanges();

    const paymentLabel = fixture.debugElement.query(
      By.css('.paymentScheduleResult .col-6.text-left .text-s')
    ).nativeElement;
    const termLabel = fixture.debugElement.query(
      By.css('.paymentScheduleResult .col-6.text-right .text-s')
    ).nativeElement;

    const expectedText = `Number of Payments : ${component.paymentScheduleNoOfPaymentsTotal}`;

    expect(paymentLabel.textContent).toContain(expectedText);
    expect(termLabel.textContent).toBe('Total Term :  12 Months and 15 Days ');

    //  expect(termLabel.textContent).toContain(expectedText);
  });

  it('should emit valueChanges event and call onValueChanges', () => {
    spyOn(component, 'onValueChanges');
    component.mainForm.valueChanges.emit({ someKey: 'someValue' });
    expect(component.onValueChanges).toHaveBeenCalledWith({
      someKey: 'someValue',
    });
  });

  it('should emit formEvent event and call onFormEvent', () => {
    spyOn(component, 'onFormEvent');
    component.mainForm.formEvent.emit({ eventKey: 'eventValue' });
    expect(component.onFormEvent).toHaveBeenCalledWith({
      eventKey: 'eventValue',
    });
  });

  it('should emit formButtonEvent event and call onButtonClick', () => {
    spyOn(component, 'onButtonClick');
    component.mainForm.formButtonEvent.emit({ button: 'submit' });
    expect(component.onButtonClick).toHaveBeenCalledWith({ button: 'submit' });
  });

  it('should emit formReady event and call onFormReady', () => {
    spyOn(component, 'onFormReady');
    component.mainForm.formReady.emit();
    expect(component.onFormReady).toHaveBeenCalled();
  });
  it('should initialize formConfig with correct fields', () => {
    // Ensure formConfig is defined
    expect(component.formConfig).toBeDefined();

    // Validate that the fields array is populated
    expect(component.formConfig.fields.length).toBeGreaterThan(0);

    // Check for the 'editPaymentSchedule' field and validate its properties
    const editPaymentScheduleField = component.formConfig.fields.find(
      (field) => field.name === 'editPaymentSchedule'
    );
    expect(editPaymentScheduleField).toBeTruthy();
    expect(editPaymentScheduleField.type).toBe('array');
    expect(editPaymentScheduleField['isAdd']).toBeTrue();

    // Validate the templateFormFields inside 'editPaymentSchedule'
    const templateFields = editPaymentScheduleField?.['templateFormFields'];
    expect(templateFields.length).toBe(4); // There should be 4 fields in the template form
    expect(templateFields[0].name).toBe('numberOfPayments');
    expect(templateFields[1].name).toBe('edittype');
    expect(templateFields[2].name).toBe('editfrequency');
    expect(templateFields[3].name).toBe('editAmount');
  });
  it('should validate buttons within formConfig', () => {
    // Validate reset button
    const resetButton = component.formConfig.fields.find(
      (field) => field.name === 'reset'
    );
    expect(resetButton).toBeTruthy();
    expect(resetButton.type).toBe('button');
    expect(resetButton.label).toBe('Reset');
    expect(resetButton.cols).toBe(6);

    // Validate calculate button
    const calculateButton = component.formConfig.fields.find(
      (field) => field.name === 'calculatebtn'
    );
    expect(calculateButton).toBeTruthy();
    expect(calculateButton.type).toBe('button');
    expect(calculateButton.label).toBe('Calculate');
    expect(calculateButton.cols).toBe(6);
  });
  it('should validate addBtn inside editPaymentSchedule', () => {
    // Check if addBtn exists inside editPaymentSchedule
    const editPaymentScheduleField = component.formConfig.fields.find(
      (field) => field.name === 'editPaymentSchedule'
    );
    expect(editPaymentScheduleField).toBeTruthy();
    const addButton = editPaymentScheduleField?.['addBtn'];
    expect(addButton).toBeTruthy();
    expect(addButton.type).toBe('button');
    expect(addButton.btnType).toBe('plus-btn');
    expect(addButton.label).toBe('Add Segment');
    expect(addButton.cols).toBe(4);
  });

  it('should validate fields inside editPaymentSchedule', () => {
    // Validate the fields within editPaymentSchedule
    const editPaymentScheduleField = component.formConfig.fields.find(
      (field) => field.name === 'editPaymentSchedule'
    );
    expect(editPaymentScheduleField).toBeTruthy();

    const fieldsInsideSchedule = editPaymentScheduleField?.['fields'];
    expect(fieldsInsideSchedule.length).toBe(4); // There should be 4 fields in the editPaymentSchedule array

    // Validate the first field (editnumber)
    expect(fieldsInsideSchedule[0].name).toBe('editnumber');
    expect(fieldsInsideSchedule[0].type).toBe('number');

    // Validate the second field (edittype)
    expect(fieldsInsideSchedule[1].name).toBe('edittype');
    expect(fieldsInsideSchedule[1].type).toBe('select');
    expect(fieldsInsideSchedule[1].options.length).toBe(3);

    // Validate the third field (editfrequency)
    expect(fieldsInsideSchedule[2].name).toBe('editfrequency');
    expect(fieldsInsideSchedule[2].type).toBe('select');
    expect(fieldsInsideSchedule[2].options.length).toBe(5);

    // Validate the fourth field (editAmount)
    expect(fieldsInsideSchedule[3].name).toBe('editAmount');
    expect(fieldsInsideSchedule[3].type).toBe('currency');
  });
  it('should call addArrayControls and customPatchFormArray for valid event', () => {
    // Mock event data
    const event = {
      field: { name: 'editPaymentSchedule' },
      templateFormData: { value: 'mockValue' },
    };

    // Call the onButtonClick method with the event
    component.onButtonClick(event);

    // Get the FormArray from the form
    const formArray = component.mainForm.getArrayControls(
      'editPaymentSchedule'
    );

    // Ensure addArrayControls method was called
    expect(formArray.controls.length).toBe(2); // Assuming addArrayControls adds one control

    // Ensure customPatchFormArray is called with correct arguments
    expect(component.customPatchFormArray).toHaveBeenCalledWith(
      event,
      event.templateFormData.value
    );
  });
  it('should call addArrayControls and customPatchFormArray for valid event', () => {
    // Mock event data
    const event = {
      field: { name: 'editPaymentSchedule' },
      templateFormData: { value: 'mockValue' },
    };

    // Call the onButtonClick method with the event
    component.onButtonClick(event);

    // Get the FormArray from the form
    const formArray = component.mainForm.getArrayControls(
      'editPaymentSchedule'
    );

    // Ensure addArrayControls method was called
    expect(formArray.controls.length).toBe(2); // Assuming addArrayControls adds one control

    // Ensure customPatchFormArray is called with correct arguments
    expect(component.customPatchFormArray).toHaveBeenCalledWith(
      event,
      event.templateFormData.value
    );
  });

  it('should not call addArrayControls or customPatchFormArray for invalid event field name', () => {
    const event = {
      field: { name: 'otherField' },
      templateFormData: { value: 'mockValue' },
    };

    // Call the onButtonClick method with the event
    component.onButtonClick(event);

    // Ensure no controls were added to the form array
    const formArray = component.mainForm.getArrayControls(
      'editPaymentSchedule'
    ) as FormArray;
    expect(formArray.controls.length).toBe(1); // No control should be added

    // Ensure customPatchFormArray was not called
    expect(component.customPatchFormArray).not.toHaveBeenCalled();
  });

  it('should handle undefined or null event gracefully', () => {
    // Call onButtonClick with undefined event
    component.onButtonClick(undefined);

    // Ensure no controls were added to the form array
    const formArray = component.mainForm.getArrayControls(
      'editPaymentSchedule'
    ) as FormArray;
    expect(formArray.controls.length).toBe(1); // No control should be added

    // Ensure customPatchFormArray was not called
    expect(component.customPatchFormArray).not.toHaveBeenCalled();

    // Call onButtonClick with null event
    component.onButtonClick(null);

    // Ensure no controls were added to the form array
    expect(formArray.controls.length).toBe(1); // No control should be added
    expect(component.customPatchFormArray).not.toHaveBeenCalled();
  });
  describe('createIncomeGroup', () => {
    it('should create a FormGroup with correct controls', () => {
      const income = {
        editnumber: 1,
        edittype: 'Type A',
        editfrequency: 'Monthly',
        editAmount: 1000,
      };
      const isInitialized = false;
      const formGroup = component.createIncomeGroup(income, isInitialized);

      expect(formGroup instanceof FormGroup).toBeTrue();
      expect(formGroup.contains('editnumber')).toBeTrue();
      expect(formGroup.contains('edittype')).toBeTrue();
      expect(formGroup.contains('editfrequency')).toBeTrue();
      expect(formGroup.contains('editAmount')).toBeTrue();
      expect(formGroup.contains('incomeDeleteBtn')).toBeTrue();

      expect(formGroup.get('editnumber')?.value).toBe(income.editnumber);
      expect(formGroup.get('edittype')?.value).toBe(income.edittype);
      expect(formGroup.get('editfrequency')?.value).toBe(income.editfrequency);
      expect(formGroup.get('editAmount')?.value).toBe(income.editAmount);
      expect(formGroup.get('incomeDeleteBtn')?.disabled).toBeFalse();
    });

    it('should disable incomeDeleteBtn if isInitialized is true', () => {
      const income = {
        editnumber: 1,
        edittype: 'Type A',
        editfrequency: 'Monthly',
        editAmount: 1000,
      };
      const isInitialized = true;
      const formGroup = component.createIncomeGroup(income, isInitialized);

      expect(formGroup.get('incomeDeleteBtn')?.disabled).toBeTrue();
    });
  });

  describe('initializeeditPaymentSchedule', () => {
    it('should initialize editPaymentSchedule with FormArray containing initial group', () => {
      spyOn(component, 'createIncomeGroup').and.callThrough();

      component.initializeeditPaymentSchedule();

      const editPaymentSchedule = component.mainForm.getArrayControls(
        'editPaymentSchedule'
      ) as FormArray;
      expect(editPaymentSchedule).toBeTruthy();
      expect(editPaymentSchedule instanceof FormArray).toBeTrue();
      expect(editPaymentSchedule.length).toBe(2);

      // Check that createIncomeGroup was called with the initial data
      expect(component.createIncomeGroup).toHaveBeenCalledWith({
        editnumber: null,
        edittype: '',
        editfrequency: '',
        editAmount: null,
      });

      const firstGroup = editPaymentSchedule.at(0) as FormGroup;
      expect(firstGroup.get('editnumber') instanceof FormControl).toBeTrue();
      expect(firstGroup.get('edittype') instanceof FormControl).toBeTrue();
      expect(firstGroup.get('editfrequency') instanceof FormControl).toBeTrue();
      expect(firstGroup.get('editAmount') instanceof FormControl).toBeTrue();

      // Check initial values of the controls
      expect(firstGroup.get('editnumber')?.value).toBeNull();
      expect(firstGroup.get('edittype')?.value).toBe('');
      expect(firstGroup.get('editfrequency')?.value).toBe('');
      expect(firstGroup.get('editAmount')?.value).toBeNull();
    });
  });

  it(
    'should call initializeeditPaymentSchedule, subscribe to getBaseDealerFormData, and set properties correctly in ngOnInit',
    waitForAsync(async () => {
      // Spy on initializeeditPaymentSchedule to verify it is called within ngOnInit
      spyOn(component, 'initializeeditPaymentSchedule').and.callThrough();

      // Call ngOnInit (asynchronous)
      await component.ngOnInit();

      // 1. Verify initializeeditPaymentSchedule is called
      expect(component.initializeeditPaymentSchedule).toHaveBeenCalled();

      // 2. Verify getBaseDealerFormData is called on baseSvc
      expect(mockStandardQuoteService.getBaseDealerFormData).toHaveBeenCalled();

      // 3. Check that the values of properties are set correctly based on the mock response
      expect(component.paymentScheduleNoOfPaymentsTotal).toBe(10);
      expect(component.noOfMonths).toBe(24);
    })
  );

});
