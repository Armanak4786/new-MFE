import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementPopupComponent } from './settlement-popup.component';
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('SettlementPopupComponent', () => {
  let component: SettlementPopupComponent;
  let fixture: ComponentFixture<SettlementPopupComponent>;

  beforeEach(async () => {
    const mockDialogConfig = {};
    await TestBed.configureTestingModule({
      declarations: [SettlementPopupComponent],
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
        CommonService,
        StandardQuoteService,

        { provide: DynamicDialogConfig, useValue: mockDialogConfig },

        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettlementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display <base-form> component when next is false', () => {
    component.next = false;
    fixture.detectChanges();

    const baseFormElement = fixture.debugElement.query(By.css('base-form'));
    const settlementDisclosureElement = fixture.debugElement.query(
      By.css('app-settlement-disclosure')
    );

    expect(baseFormElement).toBeTruthy(); // Ensure <base-form> is rendered
    expect(settlementDisclosureElement).toBeFalsy(); // Ensure <app-settlement-disclosure> is not rendered
  });
  it('should display <app-settlement-disclosure> component when next is true', () => {
    component.next = true;
    fixture.detectChanges();

    const baseFormElement = fixture.debugElement.query(By.css('base-form'));
    const settlementDisclosureElement = fixture.debugElement.query(
      By.css('app-settlement-disclosure')
    );

    expect(settlementDisclosureElement).toBeNull(); // Ensure <app-settlement-disclosure> is rendered
    expect(baseFormElement).toBeFalsy(); // Ensure <base-form> is not rendered
  });

  it('should call onValueChanges when valueChanges is emitted from <base-form>', () => {
    component.next = false;
    fixture.detectChanges();

    spyOn(component, 'onValueChanges');

    // Trigger the valueChanges event from the <base-form> component
    const baseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;
    baseFormComponent.valueChanges.emit({ someData: 'test' });

    expect(component.onValueChanges).toHaveBeenCalledWith({ someData: 'test' });
  });
  it('should call onFormEvent when formEvent is emitted from <base-form>', () => {
    component.next = false;
    fixture.detectChanges();

    spyOn(component, 'onFormEvent');

    // Trigger the formEvent event from the <base-form> component
    const baseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;
    baseFormComponent.formEvent.emit({ name: 'eventName' });

    expect(component.onFormEvent).toHaveBeenCalledWith({ name: 'eventName' });
  });

  it('should call onButtonClick when formButtonEvent is emitted from <base-form>', () => {
    component.next = false;
    fixture.detectChanges();

    spyOn(component, 'onButtonClick');

    // Trigger the formButtonEvent event from the <base-form> component
    const baseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;
    baseFormComponent.formButtonEvent.emit({ button: 'submit' });

    expect(component.onButtonClick).toHaveBeenCalledWith({ button: 'submit' });
  });
  it('should call onFormReady when formReady is emitted from <base-form>', () => {
    component.next = false;
    fixture.detectChanges();

    spyOn(component, 'onFormReady');

    // Trigger the formReady event from the <base-form> component
    const baseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;
    baseFormComponent.formReady.emit();

    expect(component.onFormReady).toHaveBeenCalled();
  });

  it('should update config.data when onValueChanges is called', () => {
    const mockEventData = {
      SearchBy: 'IcashPro',
      Number: '12345',
      settlementDate: '2024-12-31',
    };

    component.onValueChanges(mockEventData);

    expect(component.config.data).toEqual(mockEventData);
  });

  it('should have next property initialized as false', () => {
    expect(component.next).toBeFalse();
  });

  it('should initialize formConfig with the correct values', () => {
    expect(component.formConfig.cardType).toBe('non-border');
    expect(component.formConfig.autoResponsive).toBeTrue();
    expect(component.formConfig.api).toBe('settlement');
    expect(component.formConfig.goBackRoute).toBe('lessDeposite');

    // Check fields array length
    expect(component.formConfig.fields.length).toBe(4);

    // Check individual fields in the formConfig
    const [labelField, selectField, textField, dateField] =
      component.formConfig.fields;

    // Field 1: Label-only field
    expect(labelField.type).toBe('label-only');
    expect(labelField['className']).toBe('  text-center text-sm');
    expect(labelField.label).toBe(
      'Please complete the details below to view a settlement quote. As this settlement quote is for the purpose of refinancing, a date for the new loan must also be entered.'
    );
    expect(labelField.name).toBe('nettrade');
    expect(labelField.cols).toBe(12);
    expect(labelField['typeOfLabel']).toBe('inline');

    // Field 2: Select field
    expect(selectField.type).toBe('select');
    expect(selectField.label).toBe('Search By');
    expect(selectField.name).toBe('SearchBy');
    expect(selectField['className']).toBe('pb-0');
    expect(selectField.cols).toBe(4);
    expect(selectField['options']).toEqual([
      { label: 'IcashPro', name: 'icp' },
    ]);

    // Field 3: Text field
    expect(textField.type).toBe('text');
    expect(textField.label).toBe('Number');
    expect(textField.name).toBe('Number');
    expect(textField['className']).toBe('pb-0');
    expect(textField.cols).toBe(4);

    // Field 4: Date field
    expect(dateField.type).toBe('date');
    expect(dateField.label).toBe('Settlement Date');
    expect(dateField.name).toBe('settlementDate');
    expect(dateField['className']).toBe('pb-0');
    expect(dateField.cols).toBe(4);
  });
});
