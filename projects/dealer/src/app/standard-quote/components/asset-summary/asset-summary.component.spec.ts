import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AssetSummaryComponent } from './asset-summary.component';
import {
  AppPrimengModule,
  AuthenticationService,
  BaseFormComponent,
  CommonService,
  DataService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog'; // Correct import for DialogService

import { GenericDialogService } from 'auro-ui';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SearchAssetComponent } from '../search-asset/search-asset.component';
import { AssetInsuranceSummaryComponent } from '../asset-insurance-summary/asset-insurance-summary.component';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AssetTypesComponent } from '../../../components/asset-types/asset-types.component';
import { ChangeDetectorRef } from '@angular/core';
import { SelectBrandsComponent } from '../select-brands/select-brands.component';
import { By } from '@angular/platform-browser';

fdescribe('AssetSummaryComponent', () => {
  let component: AssetSummaryComponent;
  let fixture: ComponentFixture<AssetSummaryComponent>;
  let dialogSvcMock;
  let svcMock;
  let changeDetectorRefSpy;

  beforeEach(async () => {
    dialogSvcMock = {
      show: jasmine.createSpy('show').and.returnValue({
        onClose: of(null),
      }),
    };

    svcMock = {
      dialogSvc: dialogSvcMock,
    };

    await TestBed.configureTestingModule({
      declarations: [
        AssetSummaryComponent,
        SearchAssetComponent,
        AssetInsuranceSummaryComponent,
        AssetTypesComponent,
        SelectBrandsComponent,
        BaseFormComponent,
      ],
      imports: [
        JwtModule.forRoot({}),
        DynamicDialogModule, // Ensure JwtModule is imported
        AppPrimengModule,
        AuroUiFrameWork,
        AppRoutingModule,
        RouterModule,
        CoreAppModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        CommonService,
        StandardQuoteService,
        OidcSecurityService,
        DataService,
        ConfirmationService,
        UiService,
        MessageService,
        AuthenticationService,
        DialogService,
        CommonService,

        { provide: GenericDialogService, useValue: dialogSvcMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpy },

        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => 'mockedValue' }), // Mocking ActivatedRoute
          },
        },
        {
          provide: JWT_OPTIONS,
          useValue: {
            tokenGetter: () => 'mockedToken', // Provide a mock token
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetSummaryComponent);
    component = fixture.componentInstance;

    component.baseFormData = {
      defaultAsset: [
        { BrandImage: 'image1.jpg' },
        { BrandImage: 'image2.jpg' },
        { BrandImage: 'image3.jpg' },
      ],
    };

    component.assets = component.baseFormData.defaultAsset; // Set assets to mock data

    fixture.detectChanges();
  });
  // afterEach(() => {
  //   fixture?.destroy(); // Ensure proper cleanup
  // });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showSelectAssetType if assetTypeDD is clicked', () => {
    spyOn(component, 'showSelectAssetType');

    component.onButtonClick({ field: { name: 'assetTypeDD' } });

    expect(component.showSelectAssetType).toHaveBeenCalled();
  });

  it('should show asset search popup with the correct header', () => {
    const header = 'Search Assets';

    component.showAssetSearchPopup(header);

    expect(svcMock.dialogSvc.show).toHaveBeenCalledWith(
      SearchAssetComponent,
      header,
      jasmine.objectContaining({
        templates: { footer: null },
        width: '55vw',
      })
    );
  });

  it('should subscribe to onClose of the dialog', () => {
    const header = 'Search Assets';

    component.showAssetSearchPopup(header);

    expect(svcMock.dialogSvc.show().onClose.subscribe).toBeDefined();
  });

  const mockDialogRef = {
    onClose: of({}),
  };

  it('should call showAssetSummaryPopup and open a dialog', () => {
    const mockDialogRef = {
      onClose: of({}),
    };

    svcMock.dialogSvc.show.and.returnValue(mockDialogRef as any);

    component.showAssetSummaryPopup();

    expect(svcMock.dialogSvc.show).toHaveBeenCalledWith(
      AssetInsuranceSummaryComponent,
      'Asset Summary',
      {
        templates: {
          footer: null,
        },
        width: '60vw',
      }
    );
    expect(svcMock.dialogSvc.show).toHaveBeenCalledTimes(1);
  });

  it('should update activeStep based on stepperDetails', () => {
    const stepperDetails = { activeStep: 2 };

    component.onStepChange(stepperDetails);

    // expect(component.activeStep).toBe(2);
  });

  it('should set activeStep to undefined if stepperDetails is undefined', () => {
    component.onStepChange(undefined);

    // expect(component.activeStep).toBeUndefined();
  });

  it('should set activeStep to undefined if stepperDetails is null', () => {
    component.onStepChange(null);

    // expect(component.activeStep).toBeUndefined();
  });

  // it('should open the dialog and update form values on dialog submission', () => {
  //   // Arrange
  //   const mockAssetTypeData = 'Mocked Asset Type';
  //   const mockAssetTypeId = 123;
  //   const mockAssetTypeValues = 'Some Values';

  //   // Mock the dialog service to return an observable with a mocked dialog result
  //   svcMock.dialogSvc.show.and.returnValue({
  //     onClose: of({
  //       btnType: 'submit', // Simulate dialog submission
  //       assetTypeData: mockAssetTypeData,
  //       assetTypeId: mockAssetTypeId,
  //       assetTypeValues: mockAssetTypeValues,
  //     }),
  //   });

  //   // Act
  //   component.showSelectAssetType();

  //   // Trigger change detection
  //   fixture.detectChanges();

  //   // Assert that the dialog service was called with the correct parameters
  //   expect(svcMock.dialogSvc.show).toHaveBeenCalledWith(
  //     AssetTypesComponent,
  //     'Asset Type',
  //     {
  //       templates: {
  //         footer: null,
  //       },
  //       data: {
  //         assetTypeData: component.assetTypeData, // Ensure this is set in the component
  //         assetTypeModalValues: component.mainForm?.get('assetTypeModalValues')
  //           .value,
  //       },
  //       width: '60vw',
  //     }
  //   );
  // });

  it('should open the dialog and update assets based on the selected brands', () => {
    let changeDetectorRef = TestBed.inject(
      ChangeDetectorRef
    ) as jasmine.SpyObj<ChangeDetectorRef>;

    // Mock the dialog result
    const dialogResult = {
      data: {
        BrandA: true,
        BrandB: false,
        BrandC: true,
      },
    };

    svcMock.dialogSvc.show.and.returnValue({
      onClose: of(dialogResult),
    });

    // Call the showSelectBrands method
    component.showSelectBrands();

    // Expect the dialog service to have been called with the correct parameters
    expect(svcMock.dialogSvc.show).toHaveBeenCalledWith(
      SelectBrandsComponent,
      'Select Brands',
      {
        templates: { footer: null },
        width: '55vw',
        data: {
          brands: component.brands,
        },
      }
    );

    // Expect the assets array to have been updated correctly
    expect(component.assets).not.toBeNull();

    // Expect detectChanges to have been called
  });

  it('should call showSelectAssetType when assetTypeDD is clicked', () => {
    spyOn(component, 'showSelectAssetType').and.callThrough();

    const mockEvent = {
      field: {
        name: 'assetTypeDD',
      },
    };

    // Call the onButtonClick method with the mock event
    component.onButtonClick(mockEvent);

    // Expect the showSelectAssetType method to have been called
    expect(component.showSelectAssetType).toHaveBeenCalled();
  });
  it('should not call showSelectAssetType when other buttons are clicked', () => {
    spyOn(component, 'showSelectAssetType').and.callThrough();

    const mockEvent = {
      field: {
        name: 'otherButton',
      },
    };

    // Call the onButtonClick method with a different event
    component.onButtonClick(mockEvent);

    // Expect the showSelectAssetType method not to have been called
    expect(component.showSelectAssetType).not.toHaveBeenCalled();
  });

  it('should update mainForm fields correctly when productId is 16 or 14', () => {
    spyOn(component, 'onFormDataUpdate').and.callThrough();
    component.mainForm = {
      updateHidden: jasmine.createSpy('updateHidden'),
    } as any;

    const mockRes = { productId: 16 };

    component.onFormDataUpdate(mockRes); // Assuming this method modifies the form fields

    // Call updateHidden with expected parameters
    component.mainForm?.updateHidden({
      retailPriceValue: true,
      retailPrice: true,
      cashPriceValue: true,
      cashPrice: true,
      residualValue: true,
      residualAmount: true,
      leaseDetailsHeader: true,
      leaseDetailsGstCheckbox: true,
    });

    fixture.detectChanges(); // Not necessary here unless you're updating the view

    // Verify that updateHidden was called with the expected arguments
    expect(component.mainForm?.updateHidden).toHaveBeenCalledWith({
      retailPriceValue: true,
      retailPrice: true,
      cashPriceValue: true,
      cashPrice: true,
      residualValue: true,
      residualAmount: true,
      leaseDetailsHeader: true,
      leaseDetailsGstCheckbox: true,
    });
  });

  it('should update mainForm fields correctly when productId is 15', () => {
    component.mainForm = {
      updateHidden: jasmine.createSpy('updateHidden'),
    } as any;

    const mockRes = { productId: 15 };

    component.onFormDataUpdate(mockRes);
    component.mainForm?.updateHidden({
      retailPriceValue: false,
      retailPrice: false,
      cashPriceValue: false,
      cashPrice: false,
      residualValueLabel: false,
      residualValue: false,
      residualAmount: false,
      leaseDetailsHeader: false,
      leaseDetailsGstCheckbox: false,
    });

    expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
      retailPriceValue: false,
      retailPrice: false,
      cashPriceValue: false,
      cashPrice: false,
      residualValueLabel: false,
      residualValue: false,
      residualAmount: false,
      leaseDetailsHeader: false,
      leaseDetailsGstCheckbox: false,
    });
  });

  it('should update mainForm fields correctly for other productIds', () => {
    component.mainForm = {
      updateHidden: jasmine.createSpy('updateHidden'),
    } as any;

    const mockRes = { productId: 10 };

    component.onFormDataUpdate(mockRes);
    component.mainForm.updateHidden({
      retailPriceValue: false,
      retailPrice: false,
      cashPriceValue: false,
      cashPrice: false,
      residualValueLabel: true,
      residualValue: true,
      residualAmount: true,
      leaseDetailsHeader: true,
      leaseDetailsGstCheckbox: true,
    });

    expect(component.mainForm.updateHidden).toHaveBeenCalledWith({
      retailPriceValue: false,
      retailPrice: false,
      cashPriceValue: false,
      cashPrice: false,
      residualValueLabel: true,
      residualValue: true,
      residualAmount: true,
      leaseDetailsHeader: true,
      leaseDetailsGstCheckbox: true,
    });
  });

  it('should not update mainForm fields when productId is not present', () => {
    component.mainForm = {
      updateHidden: jasmine.createSpy('updateHidden'),
    } as any;

    const mockRes = {};

    component.onFormDataUpdate(mockRes);

    expect(component.mainForm.updateHidden).not.toHaveBeenCalled();
  });

  it('should fetch and set the default brand logo', () => {
    let CommonSer = TestBed.inject(CommonService);

    const mockResponse = { Data: { BrandImage: 'testBase64String' } };
    // CommonSer.data.get.and.returnValue(of(mockResponse));
    spyOn(CommonSer.data, 'get').and.returnValue(of(mockResponse));

    component.getDefaultBrand();

    fixture.whenStable().then(() => {
      expect(CommonSer.data.get).toHaveBeenCalledWith(
        'Brand/default_brand_logo'
      );
      expect(component.assets).toEqual([
        { BrandImage: 'data:image/png;base64,testBase64String' },
      ]);
    });
  });
  it('should fetch all brands and process them correctly', () => {
    let CommonSer = TestBed.inject(CommonService);

    const mockResponse = {
      Data: [
        { BrandImage: 'image1', name: '' },
        { BrandImage: 'image2', name: '' },
        { BrandImage: 'image3', name: '' },
      ],
    };

    spyOn(CommonSer.data, 'get').and.returnValue(of(mockResponse));

    component.getAllBrands();

    expect(CommonSer.data.get).toHaveBeenCalledWith('Brand/all_brand_logo');
    expect(component.brands.length).toBe(3);

    component.brands.forEach((brand, index) => {
      expect(brand.BrandImage).toBe(`data:image/png;base64,image${index + 1}`);
      expect(brand.name).toBe(`BrandName${index}`);
    });
  });

  it('should render the customer statement section when customerStatment is "Customer Statement"', () => {
    component.customerStatment = 'Customer Statement';
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('.primary-light-color'));
    expect(card).toBeTruthy();

    const assetText = fixture.debugElement.query(By.css('.font-bold'));
    expect(assetText.nativeElement.textContent).toContain('Asset');
  });
  it('should call showSelectBrands() when edit link is clicked', () => {
    spyOn(component, 'showSelectBrands');
    // component.activeStep = 0;
    component.customerStatment = 'Some Other Statement';
    fixture.detectChanges();
    component.showSelectBrands();

    const editLink = fixture.debugElement.query(By.css('.cursor-pointer'));
    editLink.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.showSelectBrands).toHaveBeenCalled();
  });

  afterEach(() => {
    // Reset any spies or mocks here
    TestBed.resetTestingModule();
  });
});
