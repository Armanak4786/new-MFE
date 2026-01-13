import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalScheduleComponent } from './rental-schedule.component';
import {
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { CalculationService } from '../payment-summary/calculation.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditPaymentScheduleComponent } from '../payment-schedule/edit-payment-schedule/edit-payment-schedule.component';
import { By } from '@angular/platform-browser';

fdescribe('RentalScheduleComponent', () => {
  let component: RentalScheduleComponent;
  let fixture: ComponentFixture<RentalScheduleComponent>;
  let mockCommonService: any;
  let mockStandardQuoteService: Partial<StandardQuoteService>;
  let mockCalculationService: Partial<CalculationService>;

  beforeEach(async () => {
    mockCommonService = {
      dialogSvc: {
        show: jasmine.createSpy('show').and.returnValue({
          onClose: of({}),
        }),
      },
    };

    mockStandardQuoteService = {};
    mockCalculationService = {};

    await TestBed.configureTestingModule({
      declarations: [RentalScheduleComponent],
      imports: [AuroUiFrameWork],
      providers: [
        AuthenticationService,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,

        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: CommonService, useValue: mockCommonService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: CalculationService, useValue: mockCalculationService },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize headerText and standarPaymentRowData correctly', () => {
    expect(component.headerText).toBe('Rental Schedule');
    expect(component.standarPaymentRowData.length).toBeGreaterThan(0);
  });
  it('should toggle hidden property in onFormDataUpdate based on productId', () => {
    component.onFormDataUpdate({ productId: 15 });
    expect(component.hidden).toBeFalse();

    component.onFormDataUpdate({ productId: 10 });
    expect(component.hidden).toBeTrue();
  });

  it('should call dialog service and handle onClose in showDialogEditPaymentSmall', () => {
    const dialogSvcSpy = mockCommonService.dialogSvc.show as jasmine.Spy;
    component.showDialogEditPaymentSmall();
    expect(dialogSvcSpy).toHaveBeenCalledWith(
      EditPaymentScheduleComponent,
      'Edit Payment Schedule'
    );
  });
  it('should override onButtonClick and not throw errors', () => {
    expect(() => component.onButtonClick({})).not.toThrow();
  });
  it('should render gen-card with the correct header text', () => {
    const genCard = fixture.debugElement.query(By.css('gen-card'));
    expect(genCard).toBeTruthy();
    expect(genCard.attributes['ng-reflect-header-text']).toBe(
      'Rental Schedule'
    );
  });
  it('should not render anything if hidden is true', () => {
    component.hidden = true;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('div'));
    expect(container).toBeNull();
  });
  it('should render the Edit Payment Schedule button with correct properties', () => {
    const genButton = fixture.debugElement.query(By.css('gen-button'));
    expect(genButton).toBeTruthy();
    expect(genButton.attributes['ng-reflect-btn-label']).toBe(
      'Edit Payment Schedule'
    );
    expect(genButton.attributes['ng-reflect-btn-type']).toBe('non-bg-btn');
    expect(genButton.attributes['ng-reflect-btn-icon']).toBe('fa fa-edit');
    expect(genButton.attributes['ng-reflect-icon-pos']).toBe('left');
  });
  it('should render the gen-table component', () => {
    const genTable = fixture.debugElement.query(By.css('gen-table'));
    expect(genTable).toBeTruthy();
  });
});
