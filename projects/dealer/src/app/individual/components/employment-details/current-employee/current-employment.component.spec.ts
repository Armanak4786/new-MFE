import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentEmploymentComponent } from './current-employment.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { IndividualService } from '../../../services/individual.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('CurrentEmploymentComponent', () => {
  let component: CurrentEmploymentComponent;
  let fixture: ComponentFixture<CurrentEmploymentComponent>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockIndividualService: jasmine.SpyObj<IndividualService>;

  beforeEach(async () => {
    // Initialize mock services
    mockCommonService = jasmine.createSpyObj('CommonService', [
      'method1',
      'method2',
    ]); // Add actual method names as necessary
    mockIndividualService = jasmine.createSpyObj('IndividualService', [
      'method1',
      'method2',
    ]); // Add actual method names as necessary

    // Configure the TestBed
    await TestBed.configureTestingModule({
      declarations: [CurrentEmploymentComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: CommonService, useValue: mockCommonService },
        { provide: IndividualService, useValue: mockIndividualService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignore unknown elements
    }).compileComponents();

    // Create component instance
    fixture = TestBed.createComponent(CurrentEmploymentComponent);
    component = fixture.componentInstance;

    // Trigger initial data binding
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate year difference correctly', () => {
    const result = component.calculateYearDifference(
      '2020-01-01',
      '2023-01-01'
    );
    expect(result).toBe(3);
  });

  it('should calculate month difference correctly', () => {
    const result = component.calculateMonthDifference(
      '2020-01-01',
      '2023-01-01'
    );
    expect(result).toBe(36); // 3 years
  });

  it('should not reset form if conditions are not met', () => {
    component.baseFormData = {
      checkPreviousEmployees: true,
      employementDetails: [{}],
    };
    component.mainForm['reset'] = jasmine.createSpy('reset');

    component.onFormDataUpdate({
      checkPreviousEmployees: false,
      previousEmployer: false,
    });

    expect(component.mainForm['reset']).not.toHaveBeenCalled();
  });
});
