import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssetComponent } from './search-asset.component';
import { AuthenticationService, AuroUiFrameWork, UiService } from 'auro-ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FinalConfirmationComponent } from '../final-confirmation/final-confirmation.component';

fdescribe('SearchAssetComponent', () => {
  let component: SearchAssetComponent;
  let fixture: ComponentFixture<SearchAssetComponent>;
  let dialogRefSpy: jasmine.SpyObj<DynamicDialogRef>;
  let dialogConfig: DynamicDialogConfig;
  let router: Router;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    dialogConfig = new DynamicDialogConfig();
    dialogConfig.data = { modalType: 'Search Asset' }; // default setup

    await TestBed.configureTestingModule({
      declarations: [SearchAssetComponent],
      imports: [AuroUiFrameWork],
      providers: [
        AuthenticationService,
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        { provide: DynamicDialogRef, useValue: dialogRefSpy },
        { provide: DynamicDialogConfig, useValue: dialogConfig },

        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchAssetComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set modalType and buttonName to "Add Asset" if modalType is "Search Asset"', () => {
      dialogConfig.data = { modalType: 'Search Asset' };
      component.ngOnInit();
      expect(component.modalType).toBe('Search Asset');
      expect(component.buttonName).toBe('Add Asset');
    });

    it('should set buttonName to "Add Trade" if modalType is not "Search Asset"', () => {
      dialogConfig.data = { modalType: 'Search Trade' };
      component.ngOnInit();
      expect(component.modalType).toBe('Search Trade');
      expect(component.buttonName).toBe('Add Trade');
    });
  });
  describe('redirectToAsset', () => {
    it('should navigate to "standard-quote/addAsset" and close dialog if modalType is "Search Asset"', () => {
      const navigateSpy = spyOn(router, 'navigateByUrl');
      component.modalType = 'Search Asset';
      component.redirectToAsset();

      expect(navigateSpy).toHaveBeenCalledWith('asset/addAsset');
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'closeAssetInsuranceSummaryTable',
      });
    });

    it('should navigate to "standard-quote/addTrade" and close dialog if modalType is "Search Trade"', () => {
      const navigateSpy = spyOn(router, 'navigateByUrl');
      component.modalType = 'Search Trade';
      component.redirectToAsset();

      expect(navigateSpy).toHaveBeenCalledWith('asset/addTrade');
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'closeAssetInsuranceSummaryTable',
      });
    });
  });

  it('should render "Motocheck" and "Dealer Inventory" radio buttons if modalType is "Search Asset"', () => {
    // Set modalType to "Search Asset" and detect changes
    dialogConfig.data.modalType = 'Search Asset';
    component.ngOnInit();
    fixture.detectChanges();

    const radioButtons = fixture.debugElement.queryAll(By.css('p-radioButton'));
    expect(radioButtons.length).toBe(2);

    const motocheckRadio = radioButtons[0].componentInstance;
    const dealerInventoryRadio = radioButtons[1].componentInstance;

    expect(motocheckRadio.label).toBe('Motocheck');
    expect(dealerInventoryRadio.label).toBe('Dealer Inventory');
  });

  it('should only render "Motocheck" radio button if modalType is not "Search Asset"', () => {
    // Set modalType to something other than "Search Asset"
    dialogConfig.data.modalType = 'Search Trade';
    component.ngOnInit();
    fixture.detectChanges();

    const radioButtons = fixture.debugElement.queryAll(By.css('p-radioButton'));
    expect(radioButtons.length).toBe(1);
    expect(radioButtons[0].componentInstance.label).toBe('Motocheck');
  });

  it('should render <app-motocheck-tab> if searchType is "motocheck"', () => {
    component.searchType = 'motocheck';
    fixture.detectChanges();

    const motocheckTab = fixture.debugElement.query(
      By.css('app-motocheck-tab')
    );
    expect(motocheckTab).toBeTruthy();

    const dealerInventoryTab = fixture.debugElement.query(
      By.css('app-dealer-inventory-tab')
    );
    expect(dealerInventoryTab).toBeNull();
  });

  it('should render <app-dealer-inventory-tab> if searchType is "dealerInventory"', () => {
    component.searchType = 'dealerInventory';
    fixture.detectChanges();

    const dealerInventoryTab = fixture.debugElement.query(
      By.css('app-dealer-inventory-tab')
    );
    expect(dealerInventoryTab).toBeTruthy();

    const motocheckTab = fixture.debugElement.query(
      By.css('app-motocheck-tab')
    );
    expect(motocheckTab).toBeNull();
  });

  it('should call redirectToAsset when the button is clicked', () => {
    spyOn(component, 'redirectToAsset');
    component.redirectToAsset();
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('gen-button'));
    button.triggerEventHandler('click', null);

    expect(component.redirectToAsset).toHaveBeenCalled();
  });
});
