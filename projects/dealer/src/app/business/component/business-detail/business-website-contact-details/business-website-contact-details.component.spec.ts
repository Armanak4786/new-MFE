import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessWebsiteContactDetailsComponent } from './business-website-contact-details.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  LibSharedModule,
  UiService,
} from 'auro-ui';
import { BusinessService } from '../../../services/business';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { By } from '@angular/platform-browser';

fdescribe('BusinessWebsiteContactDetailsComponent', () => {
  let component: BusinessWebsiteContactDetailsComponent;
  let fixture: ComponentFixture<BusinessWebsiteContactDetailsComponent>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: 123 }),
      snapshot: {
        paramMap: {
          get: () => 'edit', // Simulate 'edit' mode
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [BusinessWebsiteContactDetailsComponent],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        LibSharedModule,
        AppPrimengModule,
        CoreAppModule,
      ],
      providers: [
        CommonService,
        BusinessService,
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        UiService,
        MessageService,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessWebsiteContactDetailsComponent);
    component = fixture.componentInstance;
    component.baseFormData = {
      business: {
        website: 'http://example.com',
      },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valueChanges event from BaseFormComponent', () => {
    // Spy on the event handler
    const valueChangeSpy = spyOn(component, 'onValueChanges');

    // Find the base-form element and trigger the event
    const baseFormElement = fixture.debugElement.query(By.css('base-form'));
    baseFormElement.triggerEventHandler('valueChanges', { field: 'new value' });

    // Verify the event handler was called
    expect(valueChangeSpy).toHaveBeenCalledWith({ field: 'new value' });
  });

  it('should handle formEvent emitted by BaseFormComponent', () => {
    const formEventSpy = spyOn(component, 'onFormEvent');

    // Trigger formEvent
    const baseFormElement = fixture.debugElement.query(By.css('base-form'));
    baseFormElement.triggerEventHandler('formEvent', { event: 'submit' });

    expect(formEventSpy).toHaveBeenCalledWith({ event: 'submit' });
  });

  it('should handle formButtonEvent emitted by BaseFormComponent', () => {
    const formButtonEventSpy = spyOn(component, 'onButtonClick');

    // Trigger formButtonEvent
    const baseFormElement = fixture.debugElement.query(By.css('base-form'));
    baseFormElement.triggerEventHandler('formButtonEvent', { button: 'save' });

    expect(formButtonEventSpy).toHaveBeenCalledWith({ button: 'save' });
  });

  it('should handle formReady emitted by BaseFormComponent', () => {
    const formReadySpy = spyOn(component, 'onFormReady');

    // Trigger formReady event
    const baseFormElement = fixture.debugElement.query(By.css('base-form'));
    baseFormElement.triggerEventHandler('formReady', null);

    expect(formReadySpy).toHaveBeenCalled();
  });

  it('should initialize formConfig with correct values', () => {
    expect(component.formConfig).toBeTruthy();
    expect(component.formConfig.fields.length).toBe(1);
    expect(component.formConfig.fields[0].name).toBe('website');
  });

  it('should not patch website value if not in edit mode', async () => {
    component.mode = 'create'; // Simulate 'create' mode
    await component.ngOnInit();

    const websiteControl = component.mainForm.get('website');
    expect(websiteControl?.value).toBeFalsy(); // Should not patch any value
  });

  it('should patch website value if in edit mode', async () => {
    component.mode = 'edit';
    await component.ngOnInit();

    const websiteControl = component.mainForm.get('website');

    expect(websiteControl?.value).toBe(
      component.baseFormData?.business?.website
    );
  });
});
