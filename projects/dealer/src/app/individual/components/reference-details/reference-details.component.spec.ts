import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDetailsComponent } from './reference-details.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { IndividualService } from '../../services/individual.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IndividualReferenceConfirmationComponent } from './individual-reference-confirmation/individual-reference-confirmation.component';
import { By } from '@angular/platform-browser';

fdescribe('ReferenceDetailsComponent', () => {
  let component: ReferenceDetailsComponent;
  let fixture: ComponentFixture<ReferenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ReferenceDetailsComponent,
        IndividualReferenceConfirmationComponent,
      ],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        AuroUiFrameWork,
        AppPrimengModule,
      ],
      providers: [
        CommonService,
        IndividualService,
        JwtHelperService,
        AuthenticationService,
        MessageService,
        UiService,
        ConfirmationService,
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferenceDetailsComponent);
    component = fixture.componentInstance;
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
    expect(component.formConfig.fields.length).toBe(19);
    expect(component.formConfig.fields[0].name).toBe('referenceFirstName');
    expect(component.formConfig.fields[1].name).toBe('referenceLastName');
    expect(component.formConfig.fields[2].name).toBe('relationshipToCustomer');
    expect(component.formConfig.fields[3].name).toBe('referencePhoneExt');
    expect(component.formConfig.fields[4].name).toBe('referenceAreaCode');
    expect(component.formConfig.fields[5].name).toBe('referencePhoneNo');
    expect(component.formConfig.fields[6].name).toBe('referenceSearch');
    expect(component.formConfig.fields[7].name).toBe('referenceBuildingName');
    expect(component.formConfig.fields[8].name).toBe('referenceUnitFloorType');
    expect(component.formConfig.fields[9].name).toBe('referenceUnitLotNumber');
    expect(component.formConfig.fields[10].name).toBe('referenceStreetNumber');
    expect(component.formConfig.fields[11].name).toBe('referenceStreetName');
    expect(component.formConfig.fields[12].name).toBe('referenceStreetType');
    expect(component.formConfig.fields[13].name).toBe(
      'referenceStreetDirection'
    );
    expect(component.formConfig.fields[14].name).toBe('referenceRuralDelivery');
    expect(component.formConfig.fields[15].name).toBe('referenceSuburb');
    expect(component.formConfig.fields[16].name).toBe('referenceCity');
    expect(component.formConfig.fields[17].name).toBe('referencePostCode');
    expect(component.formConfig.fields[18].name).toBe('referenceCountry');
  });

  // it('should render IndividualReferenceConfirmationComponent', () => {
  //   // Check if the component is rendered in the template
  //   const confirmationElement = fixture.debugElement.query(
  //     By.directive(IndividualReferenceConfirmationComponent)
  //   );

  //   expect(confirmationElement).toBeTruthy(); // Ensure that the component is found in the DOM
  // });
});
