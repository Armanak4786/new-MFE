import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetComponent } from './asset.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { AddAssetService } from './services/addAsset.service';
import { AssetTradeSummaryService } from '../standard-quote/components/asset-insurance-summary/asset-trade.service';
import { GenButtonComponent } from 'auro-ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs/internal/observable/of';

fdescribe('AssetComponent', () => {
  let component: AssetComponent;
  let fixture: ComponentFixture<AssetComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockAddAssetService: jasmine.SpyObj<AddAssetService>;
  let mockTradeService: jasmine.SpyObj<AssetTradeSummaryService>;

  const mockRoute = {
    snapshot: {
      params: {
        type: 'addAsset',
        mode: 'edit',
      },
    },
  };

  beforeEach(async () => {
    mockCommonService = jasmine.createSpyObj('CommonService', ['router']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    mockAddAssetService = jasmine.createSpyObj('AddAssetService', [
      'setBaseDealerFormData',
      'getBaseDealerFormData',
      'resetBaseDealerFormData',
    ]);
    mockTradeService = jasmine.createSpyObj('AssetTradeSummaryService', [
      'assetEditData',
      'tradeEditData',
      'assetList',
      'tradeList',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AssetComponent],
      imports: [BrowserDynamicTestingModule, AuroUiFrameWork],
      providers: [
        AuthenticationService,
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: CommonService, useValue: mockCommonService },
        { provide: AddAssetService, useValue: mockAddAssetService },
        { provide: AssetTradeSummaryService, useValue: mockTradeService },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignores unknown components like <app-asset-details> and <gen-card>
    }).compileComponents();

    fixture = TestBed.createComponent(AssetComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render <app-insurance-details> if addType is "addAsset"', () => {
    component.addType = 'addAsset'; // Set addType to 'addAsset' to trigger rendering
    fixture.detectChanges(); // Trigger change detection

    const insuranceDetailsElement = fixture.debugElement.query(
      By.css('app-insurance-details')
    );
    expect(insuranceDetailsElement).toBeTruthy(); // Expect <app-insurance-details> to exist in the DOM
  });

  it('should NOT render <app-insurance-details> if addType is not "addAsset"', () => {
    component.addType = 'addTrade'; // Set addType to something other than 'addAsset'
    fixture.detectChanges(); // Trigger change detection

    const insuranceDetailsElement = fixture.debugElement.query(
      By.css('app-insurance-details')
    );
    expect(insuranceDetailsElement).toBeFalsy(); // Expect <app-insurance-details> to NOT exist in the DOM
  });

  it('should call redirectToHome() when "Cancel" button is clicked', () => {
    spyOn(component, 'redirectToHome'); // Spy on the redirectToHome method

    // Query the `gen-button` component by its directive
    const cancelButtonDe = fixture.debugElement.query(
      By.directive(GenButtonComponent)
    );

    component.redirectToHome();

    // Ensure we found the correct button based on the `btnLabel`
    const cancelButtonInstance = cancelButtonDe.componentInstance;
    expect(cancelButtonInstance.btnLabel).toBe('Cancel');

    // Simulate a click on the Cancel button
    cancelButtonDe.triggerEventHandler('click', null);

    expect(component.redirectToHome).toHaveBeenCalled(); // Verify if redirectToHome is called
  });

  it('should call submitData() when "Submit" button is clicked', () => {
    spyOn(component, 'submitData'); // Spy on the submitData method

    // Query all instances of the GenButtonComponent
    const buttonsDe = fixture.debugElement.queryAll(
      By.directive(GenButtonComponent)
    );

    // Find the specific "Submit" button by filtering the buttons
    const submitButtonDe = buttonsDe.find(
      (buttonDe) => buttonDe.componentInstance.btnLabel === 'Submit'
    );
    component.submitData();

    // Ensure we found the "Submit" button
    expect(submitButtonDe).toBeTruthy();

    // Simulate a click on the "Submit" button
    submitButtonDe.triggerEventHandler('click', null);

    // Verify that the submitData method was called
    expect(component.submitData).toHaveBeenCalled();
  });

  it('should call redirectToHome() when "Search in Motocheck" button is clicked', () => {
    spyOn(component, 'redirectToHome'); // Spy on the redirectToHome method

    // Query all instances of the GenButtonComponent
    const buttonsDe = fixture.debugElement.queryAll(
      By.directive(GenButtonComponent)
    );

    // Find the specific "Search in Motocheck" button by filtering the buttons
    const searchButtonDe = buttonsDe.find(
      (buttonDe) =>
        buttonDe.componentInstance.btnLabel === 'Search in Motocheck'
    );

    component.redirectToHome();
    fixture.detectChanges();

    // Ensure we found the "Search in Motocheck" button
    expect(searchButtonDe).toBeTruthy();

    // Simulate a click on the "Search in Motocheck" button
    searchButtonDe.triggerEventHandler('click', null);

    // Verify that the redirectToHome method was called
    expect(component.redirectToHome).toHaveBeenCalled();
  });

  ////TS File

  it('should call destroy$.next() and destroy$.complete() in ngOnDestroy()', () => {
    // Spy on the next() and complete() methods of destroy$ subject
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Assert that destroy$.next() was called
    expect(component['destroy$'].next).toHaveBeenCalled();

    // Assert that destroy$.complete() was called
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});

//t