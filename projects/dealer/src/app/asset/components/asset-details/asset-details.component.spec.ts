import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetailsComponent } from './asset-details.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';
import {
  AppPrimengModule,
  BaseFormComponent,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { AddAssetService } from '../../services/addAsset.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfigurationService } from 'angular-auth-oidc-client';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { By } from '@angular/platform-browser';
import { BaseDealerClass } from '../../../base/base-dealer.class';
import { BaseDealerService } from '../../../base/base-dealer.service';

fdescribe('AssetDetailsComponent', () => {
  let component: AssetDetailsComponent;
  let fixture: ComponentFixture<AssetDetailsComponent>;
  let baseClassSpy: jasmine.SpyObj<BaseDealerClass>;
  let baseSvcSpy: jasmine.SpyObj<BaseDealerService>;

  const mockRoute = {
    snapshot: {
      params: {
        type: 'addAsset',
        mode: 'edit',
      },
    },
  };

  beforeEach(async () => {
    baseClassSpy = jasmine.createSpyObj('BaseClass', ['onFormEvent']);
    baseSvcSpy = jasmine.createSpyObj('BaseDealerService', ['getFormData']);

    await TestBed.configureTestingModule({
      declarations: [AssetDetailsComponent],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
      ],
      providers: [
        { provide: BaseDealerClass, useValue: baseClassSpy }, // Use the spy instead of the actual base class
        { provide: BaseDealerService, useValue: baseSvcSpy }, // Provide the spy
        { provide: ActivatedRoute, useValue: mockRoute },
        CommonService,
        AddAssetService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDetailsComponent);
    component = fixture.componentInstance;
    // component.assetCategoryOptionsList = [
    //   { label: 'Vehicle', value: 'vehicle' },
    //   { label: 'Property', value: 'property' },
    // ];

    spyOn(component, 'showSelectAssetType').and.callThrough();

    component.baseFormData = { assetValue: 100000 }; // Set initial base form data

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valueChanges event from <base-form>', () => {
    spyOn(component, 'onValueChanges');

    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    baseForm.valueChanges.emit({ newValue: 'test' });
    fixture.detectChanges();

    expect(component.onValueChanges).toHaveBeenCalledWith({ newValue: 'test' });
  });

  it('should handle formEvent event from <base-form>', () => {
    spyOn(component, 'onFormEvent');

    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    baseForm.formEvent.emit({ eventType: 'submit' });
    fixture.detectChanges();

    expect(component.onFormEvent).toHaveBeenCalledWith({ eventType: 'submit' });
  });

  it('should handle formButtonEvent event from <base-form>', () => {
    spyOn(component, 'onButtonClick');

    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    baseForm.formButtonEvent.emit({ buttonType: 'save' });
    fixture.detectChanges();

    expect(component.onButtonClick).toHaveBeenCalledWith({
      buttonType: 'save',
    });
  });

  it('should call onFormReady when the form is ready', () => {
    spyOn(component, 'onFormReady');

    const baseForm: BaseFormComponent = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    ).componentInstance;

    baseForm.formReady.emit();
    fixture.detectChanges();

    expect(component.onFormReady).toHaveBeenCalled();
  });

  describe('Form Validation', () => {
    it('should validate Asset Value', () => {
      const assetValueControl = component.mainForm.get('costOfAsset');
      expect(assetValueControl).toBeTruthy(); // Check if the control exists

      // Set invalid value (empty)
      assetValueControl?.setValue('');
      expect(assetValueControl?.valid).toBeFalse(); // Should be invalid due to required validator
      expect(assetValueControl?.hasError('required')).toBeTrue(); // Check for required error

      // Set invalid value (negative)
      assetValueControl?.setValue(-10000);

      // expect(assetValueControl?.valid).toBeFalse(); // Should be invalid due to minimum value
      // expect(assetValueControl?.hasError('min')).toBeTrue(); // Check for min error

      // Set valid value
      assetValueControl?.setValue(50000);
      expect(assetValueControl?.valid).toBeTrue(); // Should be valid
      expect(assetValueControl?.hasError('min')).toBeFalse(); // Should not have min error
    });

    it('should validate Make', () => {
      const makeControl = component.mainForm.get('make');
      expect(makeControl).toBeTruthy(); // Check if the control exists

      makeControl?.setValue('');
      expect(makeControl?.hasError('required')).toBeTrue(); // Required validation check

      // Set valid value
      makeControl?.setValue('vehicle');
      expect(makeControl?.valid).toBeTrue(); // Should be valid
    });

    it('should validate Model', () => {
      const makeControl = component.mainForm.get('model');
      expect(makeControl).toBeTruthy(); // Check if the control exists

      makeControl?.setValue('');
      expect(makeControl?.hasError('required')).toBeTrue(); // Required validation check

      // Set valid value
      makeControl?.setValue('vehicle');
      expect(makeControl?.valid).toBeTrue(); // Should be valid
    });

    it('should validate Variant', () => {
      const makeControl = component.mainForm.get('variant');
      expect(makeControl).toBeTruthy(); // Check if the control exists

      makeControl?.setValue('');
      expect(makeControl?.hasError('required')).toBeTrue(); // Required validation check

      // Set valid value
      makeControl?.setValue('vehicle');
      expect(makeControl?.valid).toBeTrue(); // Should be valid
    });

    it('should validate Registration Number', () => {
      const makeControl = component.mainForm.get('regoNumber');
      expect(makeControl).toBeTruthy(); // Check if the control exists

      makeControl?.setValue('');
      expect(makeControl?.hasError('required')).toBeTrue(); // Required validation check

      // Set valid value
      makeControl?.setValue('RD123');
      expect(makeControl?.valid).toBeTrue(); // Should be valid
    });
  });

  describe('ngOnInit', () => {
    it('should call super.ngOnInit()', async () => {
      spyOn(component, 'ngOnInit').and.callThrough(); // Spy on ngOnInit
      await component.ngOnInit(); // Call the method
      expect(component.ngOnInit).toHaveBeenCalled(); // Check if it was called
    });

    it('should set addType from route params', async () => {
      await component.ngOnInit();
      expect(component.addType).toBe('addAsset'); // Verify addType is set
    });
  });

  it('should initialize formConfig with correct values', () => {
    expect(component.formConfig).toBeTruthy();
    expect(component.formConfig.fields.length).toBe(21);
    expect(component.formConfig.fields[0].name).toBe('assetName');
    expect(component.formConfig.fields[1].name).toBe('costOfAsset');
    expect(component.formConfig.fields[2].name).toBe('conditionOfGood');
    expect(component.formConfig.fields[3].name).toBe('year');
    expect(component.formConfig.fields[4].name).toBe('make');
    expect(component.formConfig.fields[5].name).toBe('model');
    expect(component.formConfig.fields[6].name).toBe('variant');
    expect(component.formConfig.fields[7].name).toBe('regoNumber');
    expect(component.formConfig.fields[8].name).toBe('vin');
    expect(component.formConfig.fields[9].name).toBe('odometer');
    expect(component.formConfig.fields[10].name).toBe('colour');
    expect(component.formConfig.fields[11].name).toBe('serialChassisNumber');
    expect(component.formConfig.fields[12].name).toBe('engineNumber');
    expect(component.formConfig.fields[13].name).toBe('ccRating');
    expect(component.formConfig.fields[14].name).toBe('assetPath');
    expect(component.formConfig.fields[15].name).toBe('assetTypeId');
    expect(component.formConfig.fields[16].name).toBe('motivePower');
    expect(component.formConfig.fields[17].name).toBe('countryFirstRegistered');
    expect(component.formConfig.fields[18].name).toBe('assetLocationOfUse');
    expect(component.formConfig.fields[19].name).toBe('supplierName');
    expect(component.formConfig.fields[20].name).toBe('assetLeased');
  });

  describe('onButtonClick', () => {
    it('should call showSelectAssetType when assetName is clicked', () => {
      const event = {
        field: {
          name: 'assetName',
        },
      };

      // Call the onButtonClick method
      component.onButtonClick(event);

      // Check that showSelectAssetType was called
      expect(component.showSelectAssetType).toHaveBeenCalled();
    });

    it('should not call showSelectAssetType when a different field is clicked', () => {
      const event = {
        field: {
          name: 'otherField',
        },
      };

      // Call the onButtonClick method
      component.onButtonClick(event);

      // Check that showSelectAssetType was not called
      expect(component.showSelectAssetType).not.toHaveBeenCalled();
    });
  });

  describe('onFormEvent', () => {
    it('should call super.onFormEvent with the correct event', () => {
      const event = {
        /* mock event data */
      };

      // Call the onFormEvent method
      component.onFormEvent(event);
      baseClassSpy.onFormEvent(event);
      fixture.detectChanges();

      // Check that the base class method was called with the correct event
      expect(baseClassSpy.onFormEvent).toHaveBeenCalledWith(event);
    });
  });
});
