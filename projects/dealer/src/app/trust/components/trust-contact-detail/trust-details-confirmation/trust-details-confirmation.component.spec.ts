import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustDetailsConfirmationComponent } from './trust-details-confirmation.component';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import {
  AuthenticationService,
  CommonService,
  LibSharedModule,
} from 'auro-ui';
import { DealerModule } from '../../../../dealer.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { TrustService } from '../../../services/trust.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('TrustDetailsConfirmationComponent', () => {
  let component: TrustDetailsConfirmationComponent;
  let fixture: ComponentFixture<TrustDetailsConfirmationComponent>;
  let mockTrustService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrustDetailsConfirmationComponent],
      imports: [CoreAppModule, LibSharedModule, DealerModule],
      providers: [
        JwtHelperService,
        AuthenticationService,
        { provide: TrustService, useValue: mockTrustService },

        ConfirmationService,
        MessageService,
        CommonService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrustDetailsConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the base-form component', () => {
    let baseFormDebugElement = fixture.debugElement.query(By.css('base-form'));

    expect(baseFormDebugElement).toBeTruthy();
  });

  it('should bind the correct input values to base-form', () => {
    let baseFormDebugElement = fixture.debugElement.query(By.css('base-form'));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    expect(baseFormInstance.formConfig).toEqual(component.formConfig);
    expect(baseFormInstance.mode).toEqual(component.mode);
    expect(baseFormInstance.id).toEqual('');
    expect(baseFormInstance.data).toEqual(component.data);
  });

  it('should call onValueChanges when base-form emits valueChanges', () => {
    spyOn(component, 'onValueChanges');
    let baseFormDebugElement = fixture.debugElement.query(By.css('base-form'));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    const mockValueChanges = { testKey: 'testValue' };
    baseFormInstance.valueChanges.emit(mockValueChanges);

    expect(component.onValueChanges).toHaveBeenCalledWith(mockValueChanges);
  });

  it('should call onFormEvent when base-form emits formEvent', () => {
    spyOn(component, 'onFormEvent');
    let baseFormDebugElement = fixture.debugElement.query(By.css('base-form'));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    const mockFormEvent = { event: 'submit', data: { key: 'value' } };
    baseFormInstance.formEvent.emit(mockFormEvent);

    expect(component.onFormEvent).toHaveBeenCalledWith(mockFormEvent);
  });

  it('should call onButtonClick when base-form emits formButtonEvent', () => {
    spyOn(component, 'onButtonClick');
    let baseFormDebugElement = fixture.debugElement.query(By.css('base-form'));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    const mockButtonEvent = { button: 'save', data: {} };
    baseFormInstance.formButtonEvent.emit(mockButtonEvent);

    expect(component.onButtonClick).toHaveBeenCalledWith(mockButtonEvent);
  });

  it('should call onFormReady when base-form emits formReady', () => {
    spyOn(component, 'onFormReady');
    let baseFormDebugElement = fixture.debugElement.query(By.css('base-form'));

    const baseFormInstance = baseFormDebugElement.componentInstance;

    baseFormInstance.formReady.emit();

    expect(component.onFormReady).toHaveBeenCalled();
  });

  it('should initialize formConfig with the correct properties', () => {
    expect(component.formConfig.autoResponsive).toBeTrue();
    expect(component.formConfig.cardBgColor).toEqual('--primary-light-color');
    expect(component.formConfig.api).toEqual('');
    expect(component.formConfig.goBackRoute).toEqual('');
    expect(component.formConfig.fields.length).toBe(1);

    const field = component.formConfig.fields[0];
    expect(field.type).toEqual('checkbox');
    expect(field.label).toEqual(
      'I confirm that all customer details are correct.'
    );
    expect(field.name).toEqual('trustDetailsConfirmation');
  });

  it('should render the checkbox with correct label and bind it to the form', () => {
    const checkboxElement: HTMLElement =
      fixture.nativeElement.querySelector('p-checkbox label');
    expect(checkboxElement).toBeTruthy();
    expect(checkboxElement.textContent?.trim()).toEqual(
      'I confirm that all customer details are correct.'
    );

    const formControl = component.mainForm.get('trustDetailsConfirmation');
    fixture.detectChanges();

    expect(formControl).toBeTruthy();
    expect(formControl?.value).toBeNull();

    // Simulate checking the checkbox
    formControl?.setValue(true);
    fixture.detectChanges();
    expect(formControl?.value).toBeTrue();
  });
});
