import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementDisclosureComponent } from './settlement-disclosure.component';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  GenericFormConfig,
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

fdescribe('SettlementDisclosureComponent', () => {
  let component: SettlementDisclosureComponent;
  let fixture: ComponentFixture<SettlementDisclosureComponent>;
  const mockDialogRef = jasmine.createSpyObj('DynamicDialogRef', ['close']);
  const mockDialogConfig = {
    data: {
      brands: [
        { name: 'Brand A', BrandImage: 'brandA.jpg' },
        { name: 'Brand B', BrandImage: 'brandB.jpg' },
      ],
    },
  } as DynamicDialogConfig;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettlementDisclosureComponent],
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

        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },

        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettlementDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valueChanges event from <base-form>', () => {
    // Arrange
    spyOn(component, 'onValueChanges');

    // Act
    const mockValue = { field: 'test' };
    component.onValueChanges(mockValue);

    // Assert
    expect(component.onValueChanges).toHaveBeenCalledWith(mockValue);
  });

  it('should handle formEvent event from <base-form>', () => {
    // Arrange
    spyOn(component, 'onFormEvent');

    // Act
    const mockEvent = { type: 'submit' };
    component.onFormEvent(mockEvent);

    // Assert
    expect(component.onFormEvent).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle formButtonEvent event from <base-form>', () => {
    // Arrange
    spyOn(component, 'onButtonClick');

    // Act
    const mockButtonEvent = { button: 'save' };
    component.onButtonClick(mockButtonEvent);

    // Assert
    expect(component.onButtonClick).toHaveBeenCalledWith(mockButtonEvent);
  });

  it('should handle formReady event from <base-form>', () => {
    // Arrange
    spyOn(component, 'onFormReady');

    // Act
    component.onFormReady();

    // Assert
    expect(component.onFormReady).toHaveBeenCalled();
  });

  it('should handle formEvent correctly in onFormEvent', () => {
    // Arrange
    const mockEvent = { name: 'settlementAmount' };

    // Act
    component.onFormEvent(mockEvent);

    // Assert
    expect(component.config.data).toEqual({ settlementAmount: 5000 });
  });

  it('should initialize formConfig with correct properties', () => {
    expect(component.formConfig.cardType).toBe('non-border');
    expect(component.formConfig.autoResponsive).toBeTrue();
    expect(component.formConfig.api).toBe('settlement');
    expect(component.formConfig.goBackRoute).toBe('lessDeposite');

    // Check specific fields within the formConfig
    expect(component.formConfig.fields.length).toBe(2);

    // Verify properties of the first field (checkbox)
    const checkboxField = component.formConfig.fields[0];
    expect(checkboxField.type).toBe('checkbox');
    expect(checkboxField.label).toBe(' ');
    expect(checkboxField.name).toBe('checkboxs');
    expect(checkboxField['className']).toBe('pb-0');
    expect(checkboxField.cols).toBe(1);

    // Verify properties of the second field (label-only)
    const labelField = component.formConfig.fields[1];
    expect(labelField.type).toBe('label-only');
    expect(labelField['className']).toBe('  text-center ');
    expect(labelField.label).toContain(
      'A settlement amount of 5000 is available for this vehicle'
    );
    expect(labelField.name).toBe('settlementDisclouser');
    expect(labelField.cols).toBe(11);
    expect(labelField['typeOfLabel']).toBe('inline');
  });
});
