import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBrandsComponent } from './select-brands.component';
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
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { StandardQuoteService } from '../../services/standard-quote.service';

fdescribe('SelectBrandsComponent', () => {
  let component: SelectBrandsComponent;
  let fixture: ComponentFixture<SelectBrandsComponent>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;

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
    dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [SelectBrandsComponent],
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

    fixture = TestBed.createComponent(SelectBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass correct input properties to <base-form> component', () => {
    const baseFormEl = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    );

    expect(baseFormEl).toBeTruthy();
    expect(baseFormEl.componentInstance.formConfig).toBe(component.formConfig);
    expect(baseFormEl.componentInstance.mode).toBe(component.mode);
    expect(baseFormEl.componentInstance.data).toBe(component.data);
  });

  it('should bind valueChanges event to onValueChanges method', () => {
    const baseFormEl = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    );
    spyOn(component, 'onValueChanges');

    // Trigger the event
    baseFormEl.triggerEventHandler('valueChanges', { someData: 'test' });
    fixture.detectChanges();

    expect(component.onValueChanges).toHaveBeenCalledWith({ someData: 'test' });
  });

  it('should bind formEvent event to onFormEvent method', () => {
    const baseFormEl = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    );
    spyOn(component, 'onFormEvent');

    // Trigger the event
    baseFormEl.triggerEventHandler('formEvent', { name: 'testEvent' });
    fixture.detectChanges();

    expect(component.onFormEvent).toHaveBeenCalledWith({ name: 'testEvent' });
  });

  it('should bind formButtonEvent event to onButtonClick method', () => {
    const baseFormEl = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    );
    spyOn(component, 'onButtonClick');

    // Trigger the event
    baseFormEl.triggerEventHandler('formButtonEvent', { action: 'submit' });
    fixture.detectChanges();

    expect(component.onButtonClick).toHaveBeenCalledWith({ action: 'submit' });
  });

  it('should bind formReady event to onFormReady method', () => {
    const baseFormEl = fixture.debugElement.query(
      By.directive(BaseFormComponent)
    );
    spyOn(component, 'onFormReady');

    // Trigger the event
    baseFormEl.triggerEventHandler('formReady', null);
    fixture.detectChanges();

    expect(component.onFormReady).toHaveBeenCalled();
  });

  it('should call passDataToParent method when Add button is clicked', () => {
    spyOn(component, 'passDataToParent');
    component.passDataToParent();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('gen-button'));
    buttonEl.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.passDataToParent).toHaveBeenCalled();
  });
  it('should initialize brands from dialog config data', () => {
    expect(component.brands).toEqual(mockDialogConfig.data.brands);
  });
  it('should call generateFields in ngOnInit', () => {
    spyOn(component, 'generateFields');
    component.ngOnInit();
    expect(component.generateFields).toHaveBeenCalled();
  });
  it('should generate fields based on brands in generateFields method', () => {
    component.generateFields();
    expect(component.fields.length).toBe(4);
    expect(component.fields[0]).toEqual(
      jasmine.objectContaining({
        type: 'checkbox',
        name: 'Brand A',
        imgPath: 'brandA.jpg',
        imgClassName:
          'border border-1 border-round flex justify-content-center align-items-center p-2 mx-2 w-full h-7rem',
        cols: 4,
      })
    );
  });
  it('should update selectedBrands when onValueChanges is called', () => {
    const mockEvent = [{ name: 'Brand A' }, { name: 'Brand B' }];
    component.onValueChanges(mockEvent);
    expect(component.selectedBrands).toEqual(mockEvent);
  });
  it('should set formConfig with default values', () => {
    expect(component.formConfig).toEqual(
      jasmine.objectContaining({
        cardType: 'non-border',
        autoResponsive: true,
        api: 'addAsset',
        goBackRoute: 'quoteOriginator',
        fields: component.fields,
      })
    );
  });
  it('should call ref.close() with selectedBrands data', () => {
    // Arrange
    component.selectedBrands = ['Brand1', 'Brand2']; // Set the test data

    // Act
    component.passDataToParent();
    dialogRefSpy.close({ data: component.selectedBrands });
    fixture.detectChanges();

    // Assert
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      data: component.selectedBrands,
    });
  });
});
