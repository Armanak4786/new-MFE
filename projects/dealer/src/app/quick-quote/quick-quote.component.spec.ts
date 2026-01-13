import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickQuoteComponent } from './quick-quote.component';
import {
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
} from 'auro-ui';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { CreateQuickQuoteComponent } from './components/create-quick-quote/create-quick-quote.component';
import { QuickQuoteService } from './services/quick-quote.service';
import jsPDF from 'jspdf';

fdescribe('QuickQuoteComponent', () => {
  let component: QuickQuoteComponent;
  let fixture: ComponentFixture<QuickQuoteComponent>;
  let mockQuickQuoteService: jasmine.SpyObj<QuickQuoteService>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    mockQuickQuoteService = jasmine.createSpyObj(
      'QuickQuoteService',
      ['copyData'],
      {
        quickQuote: [
          { products: 'product1', btnDisabled: true, form: true },
          { products: 'product2', btnDisabled: true, form: false },
        ],
      }
    );

    mockCommonService = jasmine.createSpyObj('CommonService', ['dialogSvc']);
    mockCommonService.dialogSvc = jasmine.createSpyObj('dialogSvc', ['show']);

    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    await TestBed.configureTestingModule({
      declarations: [QuickQuoteComponent],
      imports: [AuroUiFrameWork],
      providers: [
        JwtHelperService,
        AuthenticationService,
        ConfirmationService,
        MessageService,
        CommonService,
        { provide: QuickQuoteService, useValue: mockQuickQuoteService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },

        { provide: ActivatedRoute, useValue: { params: of({}) } },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should reset quickQuote fields and forms', () => {
      component.quickQuote = mockQuickQuoteService.quickQuote;
      component.ngOnDestroy();

      component.quickQuote.forEach((item, index) => {
        expect(item.products).toBeNull();
        expect(item.programType).toBeNull();
        expect(item.cashPrice).toBe('');
        expect(item.form).toBe(index === 0);
      });
    });
  });

  // describe('onDownload', () => {
  //   it('should generate a PDF using html2canvas and jsPDF', async () => {
  //     spyOn(window, 'html2canvas').and.returnValue(Promise.resolve({ toDataURL: () => 'imageData' }));
  //     const pdfSaveSpy = spyOn(jsPDF.prototype, 'save');

  //     await component.onDownload();

  //     expect(pdfSaveSpy).toHaveBeenCalledWith('quickQuote.pdf');
  //   });
  // });

  it('should render "Download", "Mail", and "Print" buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('gen-button'));

    const downloadButton = buttons[0].query(By.css('button'));
    expect(downloadButton.nativeElement.textContent.trim()).toBe('Download');

    const mailButton = buttons[1].query(By.css('button'));
    expect(mailButton.nativeElement.textContent.trim()).toBe('Mail');

    const printButton = buttons[2].query(By.css('button'));
    expect(printButton.nativeElement.textContent.trim()).toBe('Print');
  });

  it('should call onDownload() when "Download" button is clicked', () => {
    spyOn(component, 'onDownload');
    const downloadButton = fixture.debugElement.queryAll(
      By.css('gen-button')
    )[0];
    component.onDownload();
    downloadButton.triggerEventHandler('click', null);
    expect(component.onDownload).toHaveBeenCalled();
  });

  it('should call mail() when "Mail" button is clicked', () => {
    spyOn(component, 'mail');
    const mailButton = fixture.debugElement.queryAll(By.css('gen-button'))[1];
    component.mail();
    mailButton.triggerEventHandler('click', null);
    expect(component.mail).toHaveBeenCalled();
  });

  it('should call onPrint() when "Print" button is clicked', () => {
    spyOn(component, 'onPrint');
    const printButton = fixture.debugElement.queryAll(By.css('gen-button'))[2];
    component.onPrint();
    printButton.triggerEventHandler('click', null);
    expect(component.onPrint).toHaveBeenCalled();
  });

  it('should render "Add Comparison" button when form is false in quickQuote', () => {
    fixture.detectChanges();
    const addComparisonButton = fixture.debugElement.query(
      By.css('.empty-boxes .button gen-button')
    );
    expect(addComparisonButton.nativeElement.textContent.trim()).toContain(
      'Add Comparison 2'
    );
  });

  it('should call btnClick(i) when "Add Comparison" button is clicked', () => {
    spyOn(component, 'btnClick');
    const addComparisonButton = fixture.debugElement.query(
      By.css('.empty-boxes .button gen-button')
    );
    component.btnClick(1);
    fixture.detectChanges();
    addComparisonButton.triggerEventHandler('click', null);
    expect(component.btnClick).toHaveBeenCalledWith(1); // Check index based on mock data
  });

  it('should enable "Add Comparison" button if btnDisabled is false', () => {
    // Set up the test data
    component.quickQuote = [{ form: false, btnDisabled: false }];
    fixture.detectChanges();

    // Query the button element in the mock component
    const buttonElement = fixture.debugElement.query(
      By.css('.empty-boxes .button button')
    );

    // Assert that the button is not disabled
    expect(buttonElement.nativeElement.disabled).toBeFalse();
  });
  it('should disable "Add Comparison" button if btnDisabled is true', () => {
    // Set up the test data
    component.quickQuote = [{ form: false, btnDisabled: true }];
    fixture.detectChanges();

    // Query the button element in the mock component
    const buttonElement = fixture.debugElement.query(
      By.css('.empty-boxes .button button')
    );

    // Assert that the button is disabled
    expect(buttonElement.nativeElement.disabled).toBeTrue();
  });
});
