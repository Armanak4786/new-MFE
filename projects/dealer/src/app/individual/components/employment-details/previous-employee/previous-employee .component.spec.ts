import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviousEmploymentComponent } from './previous-employee .component';
import { ActivatedRoute } from '@angular/router';
import { CommonService, GenericFormConfig } from 'auro-ui';
import { IndividualService } from '../../../services/individual.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

fdescribe('PreviousEmploymentComponent', () => {
  let component: PreviousEmploymentComponent;
  let fixture: ComponentFixture<PreviousEmploymentComponent>;
  let mockCommonService;
  let mockIndividualService;
  let mockActivatedRoute;

  beforeEach(async () => {
    // Mock services as spy objects
    // Mock services as spy objects
    mockCommonService = jasmine.createSpyObj('CommonService', ['']);
    mockIndividualService = jasmine.createSpyObj('IndividualService', [
      'getBaseDealerFormData',
    ]);

    // Provide return value for getBaseDealerFormData
    mockIndividualService.getBaseDealerFormData.and.returnValue(
      of({
        employementDetails: [
          null, // Assuming the first entry is not used, set it to null
          {
            employerName: 'Test Employer',
            occupationType: 'Developer',
            employmentStatus: 'Full-Time',
            effectDtFrom: '2020-01-01T00:00:00',
            effectDtTO: '2023-01-01T00:00:00',
          },
        ],
      })
    );
    // Mock ActivatedRoute snapshot params
    mockActivatedRoute = { snapshot: { params: { mode: 'edit' } } };

    await TestBed.configureTestingModule({
      declarations: [PreviousEmploymentComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CommonService, useValue: mockCommonService },
        { provide: IndividualService, useValue: mockIndividualService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviousEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should calculate year difference correctly', () => {
    const fromDate = '2020-01-01T00:00:00';
    const toDate = '2023-01-01T00:00:00';
    const yearDifference = component.calculateYearDifference(fromDate, toDate);

    expect(yearDifference).toBe(3); // Should return 3 years
  });
  it('should calculate month difference correctly', () => {
    const fromDate = '2020-01-01T00:00:00';
    const toDate = '2023-04-01T00:00:00';
    const monthDifference = component.calculateMonthDifference(
      fromDate,
      toDate
    );

    expect(monthDifference).toBe(3); // Should return 3 months
  });
  it('should calculate a new date by subtracting years', () => {
    const result = component.calculateNewDate(5);
    const expectedYear = new Date().getFullYear() - 5;
    expect(result.startsWith(`${expectedYear}-`)).toBeTrue();
  });
  it('should calculate a new date by subtracting months', () => {
    const result = component.calculateNewDateByMonth('2023-05-01T00:00:00', 2);
    expect(result.startsWith('2023-03')).toBeTrue();
  });
});
