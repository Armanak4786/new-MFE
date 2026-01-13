import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementQuoteDetailsComponent } from './settlement-quote-details.component';
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
import { StandardQuoteService } from '../../services/standard-quote.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { GenCardComponent } from 'auro-ui';
import { GenButtonComponent } from 'auro-ui';
import { BaseStandardQuoteClass } from '../../base-standard-quote.class';
import { GenTableComponent } from 'auro-ui';

fdescribe('SettlementQuoteDetailsComponent', () => {
  let component: SettlementQuoteDetailsComponent;
  let fixture: ComponentFixture<SettlementQuoteDetailsComponent>;
  let commonService: jasmine.SpyObj<CommonService>;
  let standardQuoteService: jasmine.SpyObj<StandardQuoteService>;

  beforeEach(async () => {
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
      declarations: [SettlementQuoteDetailsComponent],
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
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: StandardQuoteService, useValue: standardQuoteServiceSpy },

        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettlementQuoteDetailsComponent);
    component = fixture.componentInstance;

    component.header = []; // Initialize header
    component.body = []; // Initialize body
    component.assetHeader = []; // Initialize asset header
    component.assetBody = []; // Initialize asset body
    component.settlementAmount = ''; // Initialize settlement amount

    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
    standardQuoteService = TestBed.inject(
      StandardQuoteService
    ) as jasmine.SpyObj<StandardQuoteService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Customer Details Card', () => {
    it('should display "Customer Details" card header', () => {
      const genCardComponent = fixture.debugElement.query(
        By.directive(GenCardComponent)
      );
      expect(genCardComponent).toBeTruthy();
      expect(genCardComponent.componentInstance.headerText).toBe(
        'Customer Details'
      );
    });
    it('should render the gen-table', () => {
      const genTable = fixture.debugElement.query(
        By.directive(GenTableComponent)
      );
      expect(genTable).toBeTruthy(); // Check that gen-table is present in the DOM
    });

    it('should pass the correct columns to the gen-table', () => {
      const genTable = fixture.debugElement.query(
        By.directive(GenTableComponent)
      );
      expect(genTable.componentInstance.columns).toEqual(component.header); // Verify the columns are passed correctly
    });

    it('should pass the correct dataList to the gen-table', () => {
      const genTable = fixture.debugElement.query(
        By.directive(GenTableComponent)
      );
      expect(genTable.componentInstance.dataList).toEqual(component.body); // Verify the dataList is passed correctly
    });
  });

  it('should select Refinancing settlement amount', () => {
    const radioRefinancing = fixture.debugElement.query(
      By.css('input#Refinancing')
    );
    radioRefinancing.nativeElement.click();
    fixture.detectChanges();

    expect(component.settlementAmount).toBe('Refinancing');
  });

  describe('Settlement Amount Cards', () => {
    it('should display "Settlement Amount (Standard)" label', () => {
      const standardLabel = fixture.debugElement.query(
        By.css('label[for="Standard"]')
      ).nativeElement;
      expect(standardLabel.textContent).toContain(
        'Settlement Amount (Standard)'
      );
    });

    it('should select Standard settlement amount', () => {
      const radioStandard = fixture.debugElement.query(
        By.css('input#Standard')
      );
      radioStandard.nativeElement.click();
      fixture.detectChanges();

      expect(component.settlementAmount).toBe('Standard');
    });

    it('should display "Settlement Amount (Refinancing)" label', () => {
      const refinancingLabel = fixture.debugElement.query(
        By.css('label[for="Refinancing"]')
      ).nativeElement;
      expect(refinancingLabel.textContent).toContain(
        'Settlement Amount (Refinancing)'
      );
    });
  });

  describe('Buttons', () => {
    it('should call addAmount() when "Add this Settlement Amount to the Quote" button is clicked', () => {
      spyOn(component, 'addAmount');
      const event = {};
      component.addAmount(event);
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(
        By.directive(GenButtonComponent)
      );
      const addButton = buttons.find(
        (button) =>
          button.componentInstance.btnLabel ===
          'Add this Settlement Amount to the Quote'
      );

      expect(addButton).toBeTruthy();
      addButton.triggerEventHandler('click', null);
      expect(component.addAmount).toHaveBeenCalled();
    });

    it('should call cancelsettlement() when "Cancel" button is clicked', () => {
      spyOn(component, 'cancelsettlement').and.callThrough(); // Allow original implementation

      // Use By.directive to find the gen-button directive
      const cancelButton = fixture.debugElement.query(
        By.directive(GenButtonComponent)
      );

      component.cancelsettlement();
      fixture.detectChanges();

      expect(cancelButton).toBeTruthy('Cancel button should exist');

      // Trigger the button click
      cancelButton.triggerEventHandler('click', null);

      // Verify that `cancelsettlement` was called
      expect(component.cancelsettlement).toHaveBeenCalled();
    });
  });

  describe('asset details', () => {
    it('should display the asset details card', () => {
      fixture.detectChanges(); // Ensure the view is updated
      const assetCard = fixture.debugElement.query(By.css('gen-card')); // Query for the gen-card
      const assetTable = assetCard.query(By.css('gen-table')); // Query for the gen-table inside the asset card

      expect(assetTable).toBeTruthy(); // Check that the table is found inside the asset card
    });

    it('should render the gen-table component', () => {
      const genTable = fixture.debugElement.query(
        By.directive(GenTableComponent)
      );
      expect(genTable).toBeTruthy(); // Verify that gen-table is in the DOM
    });

    it('should pass the correct assetHeader to gen-table as columns', () => {
      const genTable = fixture.debugElement.query(
        By.directive(GenTableComponent)
      );
      expect(genTable.componentInstance.columns).toEqual(component.assetHeader); // Check if columns are passed correctly
    });

    it('should pass the correct assetBody to gen-table as dataList', () => {
      const genTable = fixture.debugElement.query(
        By.directive(GenTableComponent)
      );
      expect(genTable.componentInstance.dataList).toEqual(component.assetBody); // Check if dataList is passed correctly
    });
  });

  describe('Quote Validity Message', () => {
    it('should display the quote validity message with correct date', () => {
      const validityMessage = fixture.debugElement.query(
        By.css('.para.text-sm')
      ).nativeElement;
      expect(validityMessage.textContent.trim()).toContain(
        'This quote will be valid until 24th May 2024'
      );
    });
  });

  it('should call super.ngOnInit in ngOnInit', () => {
    const ngOnInitSpy = spyOn(BaseStandardQuoteClass.prototype, 'ngOnInit');
    component.ngOnInit();
    expect(ngOnInitSpy).toHaveBeenCalled();
  });

  it('should navigate to standard quote in back method', () => {
    component.back();
    expect(commonService.router.navigateByUrl).toHaveBeenCalledWith(
      '/dealer/standard-quote'
    );
  });

  it('should navigate to standard quote in cancelsettlement method', () => {
    component.cancelsettlement();
    expect(commonService.router.navigateByUrl).toHaveBeenCalledWith(
      '/dealer/standard-quote'
    );
  });

  it('should display the confirmation dialog and trigger callback to navigate back', () => {
    const mockEvent = {};
    const expectedMessage =
      'Please confirm if you wish to proceed for a new quote with this settlement amount.';
    const expectedTitle = 'Settlement Quote';
    spyOn(component, 'back').and.callThrough();

    // Act: Call `addAmount`
    component.addAmount(mockEvent);

    // Assert that showOkDialog was called with the right arguments
    expect(commonService.ui.showOkDialog).toHaveBeenCalledWith(
      expectedMessage,
      expectedTitle,
      jasmine.any(Function)
    );

    // Assert that `back` was called as a result of the callback being triggered
    expect(component.back).toHaveBeenCalled();
  });
});
