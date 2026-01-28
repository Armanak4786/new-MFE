import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInsuranceSummaryComponent } from './asset-insurance-summary.component';
import {
  AppPrimengModule,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetTradeSummaryService } from './asset-trade.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('AssetInsuranceSummaryComponent', () => {
  let component: AssetInsuranceSummaryComponent;
  let fixture: ComponentFixture<AssetInsuranceSummaryComponent>;
  let mockCommonService,
    mockRouter,
    mockTradeService,
    mockDialogRef,
    mockDialogConfig;

  beforeEach(async () => {
    const mockRoute = {
      snapshot: {
        params: {
          type: 'addAsset',
          mode: 'edit',
        },
      },
    };

    mockTradeService = jasmine.createSpyObj('AssetTradeSummaryService', [
      'assetList',
      'tradeList',
    ]);
    // Initialize mock services as spy objects

    // Configure the TestBed
    await TestBed.configureTestingModule({
      declarations: [AssetInsuranceSummaryComponent], // Declare the component
      providers: [
        CommonService,
        { provide: ActivatedRoute, useValue: mockRoute },
        Router,
        HttpClient,
        { provide: AssetTradeSummaryService, useValue: mockTradeService },
        DynamicDialogRef,
        JwtHelperService,
        ConfirmationService,
        UiService,
        MessageService,
        DynamicDialogConfig,
        { provide: JWT_OPTIONS, useValue: {} },
      ],
      imports: [
        BrowserDynamicTestingModule,
        HttpClientTestingModule,
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // To handle any custom elements
    }).compileComponents();

    // Create component instance
    fixture = TestBed.createComponent(AssetInsuranceSummaryComponent);
    component = fixture.componentInstance;

    // Initialize necessary data
    mockTradeService.assetList = [
      { assetName: 'Car', vin: '1234', costOfAsset: 10000, insurer: 'ABC' },
    ];
    mockTradeService.tradeList = [
      { tradeName: 'Old Car', tradeVinNo: '5678', tradeAssetValue: 5000 },
    ];

    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should call showAssetSearchPopup() with "Search Asset" when "Search & Add Asset" button is clicked', () => {
  //   spyOn(component, 'showAssetSearchPopup');
  //   const button = fixture.debugElement.nativeElement.querySelector(
  //     'gen-button[btnLabel="Search & Add Asset"]'
  //   );
  //   button.click();

  //   expect(component.showAssetSearchPopup).toHaveBeenCalledWith('Search Asset');
  // });

  // it('should call showAssetSearchPopup() with "Search Trade" when "Search & Add Trade in" button is clicked', () => {
  //   spyOn(component, 'showAssetSearchPopup');
  //   const button = fixture.debugElement.nativeElement.querySelector(
  //     'gen-button[btnLabel="Search & Add Trade in"]'
  //   );
  //   button.click();

  //   expect(component.showAssetSearchPopup).toHaveBeenCalledWith('Search Trade');
  // });

  // it('should render the asset list in the asset table', () => {
  //   const assetRows = fixture.debugElement.nativeElement.querySelectorAll(
  //     'gen-table[dataList="assetList"] tbody tr'
  //   );
  //   expect(assetRows.length).toBe(1); // Assuming only one item in the list
  //   expect(assetRows[0].textContent).toContain('Car');
  // });

  // it('should render the trade list in the trade table', () => {
  //   const tradeRows = fixture.debugElement.nativeElement.querySelectorAll(
  //     'gen-table[dataList="tradeList"] tbody tr'
  //   );
  //   expect(tradeRows.length).toBe(1); // Assuming only one item in the list
  //   expect(tradeRows[0].textContent).toContain('Old Car');
  // });

  // it('should navigate to asset edit page when edit action is triggered on an asset', () => {
  //   const event = { actionName: 'edit', index: 0 };
  //   component.onAssetCellClick(event);

  //   expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
  //     'asset/addAsset/edit'
  //   );
  //   expect(mockDialogRef.close).toHaveBeenCalled();
  // });

  // it('should navigate to trade edit page when edit action is triggered on a trade', () => {
  //   const event = { actionName: 'edit', index: 0 };
  //   component.onTradeCellClick(event);

  //   expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
  //     'trade/addTrade/edit'
  //   );
  //   expect(mockDialogRef.close).toHaveBeenCalled();
  // });

  // it('should delete an asset from the list when delete action is triggered on an asset', () => {
  //   const event = { actionName: 'delete', index: 0 };
  //   component.onAssetCellClick(event);

  //   expect(mockTradeService.assetList.length).toBe(0);
  // });

  // it('should delete a trade from the list when delete action is triggered on a trade', () => {
  //   const event = { actionName: 'delete', index: 0 };
  //   component.onTradeCellClick(event);

  //   expect(mockTradeService.tradeList.length).toBe(0);
  // });

  // it('should clone an asset when copy action is triggered on an asset', () => {
  //   const event = { actionName: 'copy', index: 0 };
  //   component.onAssetCellClick(event);

  //   expect(mockTradeService.assetList.length).toBe(2); // List should now have 2 assets after cloning
  // });

  // it('should clone a trade when copy action is triggered on a trade', () => {
  //   const event = { actionName: 'copy', index: 0 };
  //   component.onTradeCellClick(event);

  //   expect(mockTradeService.tradeList.length).toBe(2); // List should now have 2 trades after cloning
  // });
});
