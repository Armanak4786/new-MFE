import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmploymentDetailsComponent } from './employment-details.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { IndividualService } from '../../services/individual.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { BaseDealerService } from '../../../base/base-dealer.service';

fdescribe('EmploymentDetailsComponent', () => {
  let component: EmploymentDetailsComponent;
  let fixture: ComponentFixture<EmploymentDetailsComponent>;
  let mockCommonService;
  let mockIndividualService;

  beforeEach(async () => {
    // Initialize mock services as spy objects
    mockCommonService = jasmine.createSpyObj('CommonService', [
      'setBaseDealerFormData',
    ]);
    mockIndividualService = jasmine.createSpyObj('IndividualService', [
      'getBaseDealerFormData',
    ]);

    // Mock the return value for getBaseDealerFormData
    // We return an observable emitting { checkPreviousEmployees: false }
    mockIndividualService.getBaseDealerFormData.and.returnValue(
      of({ checkPreviousEmployees: false })
    );

    // Configure the TestBed
    await TestBed.configureTestingModule({
      declarations: [EmploymentDetailsComponent], // Declare the component
      imports: [
        BrowserDynamicTestingModule, // Import required modules
        CoreAppModule,
        AppPrimengModule,
        AuroUiFrameWork,
      ],
      providers: [
        AuthenticationService, // Provide other necessary services
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        BaseDealerService,
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }, // Mock ActivatedRoute
        { provide: CommonService, useValue: mockCommonService }, // Use mockCommonService
        { provide: IndividualService, useValue: mockIndividualService },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add CUSTOM_ELEMENTS_SCHEMA if necessary for custom components
    }).compileComponents();

    // Create component instance
    fixture = TestBed.createComponent(EmploymentDetailsComponent);
    component = fixture.componentInstance;

    // Trigger initial data binding
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display "No" when checkPreviousEmployees is false', () => {
    component.checkPreviousEmployees = false;
    fixture.detectChanges();

    const noLabel = fixture.debugElement.query(By.css('label.ml-2.mt-4'));
    expect(noLabel.nativeElement.textContent.trim()).toBe('No');
  });

  it('should display "Yes" when checkPreviousEmployees is true', () => {
    component.checkPreviousEmployees = true;
    fixture.detectChanges();

    const yesLabel = fixture.debugElement.query(By.css('label.ml-2.mt-4'));
    expect(yesLabel.nativeElement.textContent.trim()).toBe('Yes');
  });

  it('should toggle checkPreviousEmployees value when p-inputSwitch is clicked', () => {
    const inputSwitch = fixture.debugElement.query(By.css('p-inputSwitch'));
    component.checkPreviousEmployees = false;
    inputSwitch.triggerEventHandler('ngModelChange', true);
    fixture.detectChanges();

    expect(component.checkPreviousEmployees).toBe(true);
  });

  it('should render app-previous-employee component when checkPreviousEmployees is true', () => {
    component.checkPreviousEmployees = true;
    fixture.detectChanges();

    const previousEmployeeComponent = fixture.debugElement.query(
      By.css('app-previous-employee')
    );
    expect(previousEmployeeComponent).toBeTruthy();
  });

  it('should not render app-previous-employee component when checkPreviousEmployees is false and isEnable is false', () => {
    component.checkPreviousEmployees = false;
    component.isEnable = false;
    fixture.detectChanges();

    const previousEmployeeComponent = fixture.debugElement.query(
      By.css('app-previous-employee')
    );
    expect(previousEmployeeComponent).toBeFalsy();
  });
});
