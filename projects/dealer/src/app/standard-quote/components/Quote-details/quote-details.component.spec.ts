import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteDetailsComponent } from './quote-details.component';
import { ActivatedRoute } from '@angular/router';
import {
  AppPrimengModule,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { AssetTradeSummaryService } from '../asset-insurance-summary/asset-trade.service';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('QuoteDetailsComponent', () => {
  let component: QuoteDetailsComponent;
  let fixture: ComponentFixture<QuoteDetailsComponent>;
  let mockTradeSvc: jasmine.SpyObj<AssetTradeSummaryService>;
  let mockStandardQuoteSvc: jasmine.SpyObj<StandardQuoteService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockTradeSvc = jasmine.createSpyObj('AssetTradeSummaryService', [
      'assetListSubject',
    ]);
    mockStandardQuoteSvc = jasmine.createSpyObj('StandardQuoteService', [
      'getBaseDealerFormData',
    ]);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['paramMap']);

    await TestBed.configureTestingModule({
      declarations: [QuoteDetailsComponent],
      imports: [AuroUiFrameWork, CoreAppModule, AppPrimengModule],
      providers: [
        JwtHelperService,
        ConfirmationService,
        MessageService,
        UiService,
        CommonService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AssetTradeSummaryService, useValue: mockTradeSvc },
        { provide: StandardQuoteService, useValue: mockStandardQuoteSvc },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize form fields correctly in ngOnInit()', async () => {
    const baseFormData = {
      ppsrCount: 2,
      ppsrPercentage: 20.7,
      udcEstablishmentFee: 1000,
      dealerOriginationFee: 500,
      totalEstablishmentFee: 1500,
    };

    component.baseFormData = baseFormData;
    await component.ngOnInit();
    fixture.detectChanges();

    expect(component.mainForm.get('ppsrCount').value).toBe(2);
    expect(component.mainForm.get('ppsrPercentage').value).toBe(20.7);
    expect(component.mainForm.get('udcEstablishmentFee').value).toBe(1000);
    expect(component.mainForm.get('dealerOriginationFee').value).toBe(500);
    expect(component.mainForm.get('totalEstablishmentFee').value).toBe(1500);
  });

  // it('should navigate to add-on accessories page when adsOnAccessories button is clicked', () => {
  //   const mockRouter = spyOn(component['svc'], 'router').and.stub();
  //   const event = { field: { name: 'adsOnAccessories' } };

  //   component.onButtonClick(event);

  //   expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dealer/standard-quote/add-on-accessories');
  // });

  // Additional test cases can be written similarly for other methods
});
