import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceRequirementComponent } from './insurance-requirement.component';
import {
  AppPrimengModule,
  BaseFormComponent,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('InsuranceRequirementComponent', () => {
  let component: InsuranceRequirementComponent;
  let fixture: ComponentFixture<InsuranceRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceRequirementComponent],
      imports: [AuroUiFrameWork, CoreAppModule, BrowserDynamicTestingModule],
      providers: [
        JwtHelperService,
        ConfirmationService,
        MessageService,
        UiService,
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should pass input values to base-form component', () => {
  //   // Set up mock inputs for the parent component
  //   component.mode = 'edit'; // Or 'create' depending on your case
  //   component.id = 123;
  //   component.data = {
  //     /* mock data object */
  //   };

  //   fixture.detectChanges(); // Trigger change detection to apply the input bindings

  //   // Query the base-form component and check if the input values are passed correctly
  //   const baseFormElement = fixture.debugElement.query(
  //     By.directive(BaseFormComponent)
  //   ).componentInstance;

  //   expect(baseFormElement.formConfig).toBe(component.formConfig);
  //   expect(baseFormElement.mode).toBe(component.mode);
  //   // expect(baseFormElement.id).toBe(component.id);
  //   expect(baseFormElement.data).toBe(component.data);
  // });

  // it('should emit valueChanges event and handle it in parent component', () => {
  //   spyOn(component, 'onValueChanges'); // Spy on the parent method

  //   // Get the base-form component instance
  //   const baseFormElement = fixture.debugElement.query(
  //     By.directive(BaseFormComponent)
  //   ).componentInstance;

  //   // Trigger valueChanges event
  //   const mockEvent = {
  //     /* mock event data */
  //   };
  //   baseFormElement.valueChanges.emit(mockEvent);

  //   expect(component.onValueChanges).toHaveBeenCalledWith(mockEvent);
  // });

  // it('should emit formEvent event and handle it in parent component', () => {
  //   spyOn(component, 'onFormEvent'); // Spy on the parent method

  //   // Get the base-form component instance
  //   const baseFormElement = fixture.debugElement.query(
  //     By.directive(BaseFormComponent)
  //   ).componentInstance;

  //   // Trigger formEvent
  //   const mockEvent = {
  //     /* mock event data */
  //   };
  //   baseFormElement.formEvent.emit(mockEvent);

  //   expect(component.onFormEvent).toHaveBeenCalledWith(mockEvent);
  // });

  // it('should emit formButtonEvent event and handle it in parent component', () => {
  //   spyOn(component, 'onButtonClick'); // Spy on the parent method

  //   // Get the base-form component instance
  //   const baseFormElement = fixture.debugElement.query(
  //     By.directive(BaseFormComponent)
  //   ).componentInstance;

  //   // Trigger formButtonEvent
  //   const mockEvent = {
  //     /* mock event data */
  //   };
  //   baseFormElement.formButtonEvent.emit(mockEvent);

  //   expect(component.onButtonClick).toHaveBeenCalledWith(mockEvent);
  // });

  // it('should emit formReady event and handle it in parent component', () => {
  //   spyOn(component, 'onFormReady'); // Spy on the parent method

  //   // Get the base-form component instance
  //   const baseFormElement = fixture.debugElement.query(
  //     By.directive(BaseFormComponent)
  //   ).componentInstance;

  //   // Trigger formReady event
  //   baseFormElement.formReady.emit();

  //   expect(component.onFormReady).toHaveBeenCalled();
  // });

  // it('should initialize formConfig correctly', () => {
  //   expect(component.formConfig).toBeDefined();
  //   expect(component.formConfig.headerTitle).toBe('My Insurance Requirements');
  //   expect(component.formConfig.fields.length).toBeGreaterThan(0);
  //   expect(component.formConfig.api).toBe('addOnAccessories');
  //   expect(component.formConfig.goBackRoute).toBe('addOnAccessories');
  // });
  // it('should handle form submit correctly', () => {
  //   spyOn(component, 'onButtonClick');

  //   // Find the submit button and simulate click
  //   const submitButton = fixture.debugElement.query(
  //     By.css('button[type="submit"]')
  //   );
  //   submitButton.nativeElement.click();

  //   fixture.detectChanges(); // Run change detection

  //   expect(component.onButtonClick).toHaveBeenCalled();
  // });
});
