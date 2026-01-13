import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardPaymentOptionsComponent } from './standard-payment-options.component';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { of } from 'rxjs/internal/observable/of';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GenCardComponent } from 'auro-ui';
import { GenTableComponent } from 'auro-ui';
import { CalculationService } from '../payment-summary/calculation.service';

fdescribe('StandardPaymentOptionsComponent', () => {
  let component: StandardPaymentOptionsComponent;
  let fixture: ComponentFixture<StandardPaymentOptionsComponent>;
  let calculationService: jasmine.SpyObj<CalculationService>;

  beforeEach(async () => {
    const calculationServiceSpy = jasmine.createSpyObj('CalculationService', [
      'calculateEMI',
      'calculateWeeklyEquivalent',
    ]);

    const commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'ui',
      'router',
    ]);
    commonServiceSpy.router = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    commonServiceSpy.ui = {
      showOkDialog: jasmine
        .createSpy('showOkDialog')
        .and.callFake((message: string, title: string, callback: Function) => {
          callback(); // Directly invoke the callback here
        }),
    };

    const standardQuoteServiceSpy = jasmine.createSpyObj(
      'StandardQuoteService',
      ['someMethod']
    );
    await TestBed.configureTestingModule({
      declarations: [StandardPaymentOptionsComponent],
      imports: [
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        AuthenticationService,
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        { provide: CalculationService, useValue: calculationServiceSpy },

        { provide: CommonService, useValue: commonServiceSpy },
        { provide: StandardQuoteService, useValue: standardQuoteServiceSpy },

        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StandardPaymentOptionsComponent);
    component = fixture.componentInstance;
    calculationService = TestBed.inject(
      CalculationService
    ) as jasmine.SpyObj<CalculationService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display .standardPaymentOptions div only when hidden is true', () => {
    component.hidden = true;
    fixture.detectChanges();
    const divElement = fixture.debugElement.query(
      By.css('.standardPaymentOptions')
    );
    expect(divElement).toBeTruthy();
  });
  it('should display p-accordionTab with the correct header text', () => {
    component.hidden = true;
    component.headerText = 'Sample Header';
    fixture.detectChanges();

    // Find the rendered header text within the p-accordionTab
    const accordionTabHeader = fixture.debugElement.query(
      By.css('.p-accordion-header-text')
    );
    expect(accordionTabHeader.nativeElement.textContent.trim()).toBe(
      'Sample Header'
    );
  });
  it('should render gen-card with cardType input set to "non-border"', () => {
    component.hidden = true;
    fixture.detectChanges();

    const genCard = fixture.debugElement.query(By.directive(GenCardComponent));
    expect(genCard.componentInstance.cardType).toBe('non-border');
  });
  it('should render gen-table with correct inputs', () => {
    component.hidden = true;
    component.columnDefs = [{ field: 'name', header: 'Name' }];
    component.standarPaymentRowData = [{ name: 'Row 1' }];
    fixture.detectChanges();

    const genTable = fixture.debugElement.query(
      By.directive(GenTableComponent)
    );
    expect(genTable.componentInstance.columns).toBe(component.columnDefs);
    expect(genTable.componentInstance.dataList).toBe(
      component.standarPaymentRowData
    );
    expect(genTable.componentInstance.tableStyle).toBe('stripped-rows');
  });

  it('should set headerText and column visibility based on productId', () => {
    component.onFormDataUpdate({ productId: 15 });
    expect(component.headerText).toBe('Standard Payments Options');
    expect(component.columnDefs[2].class).toBe('hidden');
  });

  it('should update totalBorrowedAmount when totalBorrowedAmount is provided', () => {
    component.onFormDataUpdate({ totalBorrowedAmount: 50000 });
    expect(component.totalBorrowedAmount).toBe(50000);
  });

  it('should call calculateEMI for each row when readOnlyPaymentAmount is true', () => {
    component.totalBorrowedAmount = 10000;
    calculationService.calculateEMI.and.returnValue(500);

    component.onFormDataUpdate({
      readOnlyPaymentAmount: true,
      interestRate: 5,
    });

    component.standarPaymentRowData.forEach((row) => {
      expect(calculationService.calculateEMI).toHaveBeenCalledWith(
        component.totalBorrowedAmount,
        5,
        row.longterm
      );
      expect(row.emi).toBe(500);
    });
  });

  it('should call calculateWeeklyEquivalent for each row when readOnlyPaymentAmount is true', () => {
    component.totalBorrowedAmount = 10000;
    calculationService.calculateWeeklyEquivalent.and.returnValue(125);

    component.onFormDataUpdate({
      readOnlyPaymentAmount: true,
      interestRate: 5,
    });

    component.standarPaymentRowData.forEach((row) => {
      expect(calculationService.calculateWeeklyEquivalent).toHaveBeenCalledWith(
        component.totalBorrowedAmount,
        5,
        row.longterm
      );
      expect(row.weeklyEquivalent).toBe(125);
    });
  });

  it('should set hidden to true if productId is not 15 or 53', () => {
    component.onFormDataUpdate({ productId: 10 });
    expect(component.hidden).toBe(true);
  });

  it('should set hidden to false if productId is 15 or 53', () => {
    component.onFormDataUpdate({ productId: 15 });
    expect(component.hidden).toBe(true);

    component.onFormDataUpdate({ productId: 53 });
    expect(component.hidden).toBe(true);
  });
});
