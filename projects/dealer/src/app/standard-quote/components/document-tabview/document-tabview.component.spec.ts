import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { DocumentTabViewComponent } from './document-tabview.component';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  DataService,
  AuroUiFrameWork,
  ToasterService,
  UiService,
} from 'auro-ui';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { CalculationService } from '../payment-summary/calculation.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { By, DomSanitizer } from '@angular/platform-browser';
import { StandardQuoteService } from '../../services/standard-quote.service';

describe('UploadDocumentComponent', () => {
  let component: DocumentTabViewComponent;
  let fixture: ComponentFixture<DocumentTabViewComponent>;
  let debugElement: DebugElement;
  let mockCommonService;
  let mockToasterService;
  let mockAuthService;
  let mockDataService;
  let mockStandardQuoteService;
  let sanitizer: DomSanitizer;
  let cd: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    mockCommonService = jasmine.createSpyObj(['data']);
    const postSpy = jasmine.createSpy('post').and.returnValue(of({})); // Mocking post method

    mockToasterService = jasmine.createSpyObj(['showToaster']);
    mockAuthService = { oidcUser: { given_name: 'John', family_name: 'Doe' } };
    mockDataService = jasmine.createSpyObj(['post']);
    mockCommonService.data = { post: postSpy }; // Correctly mock the 'data' property

    mockStandardQuoteService = jasmine.createSpyObj([
      'getBaseDealerFormData',
      'setBaseDealerFormData',
    ]);
    const cdSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    cd = cdSpy;

    await TestBed.configureTestingModule({
      declarations: [DocumentTabViewComponent],
      imports: [
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        AuthenticationService,

        { provide: CommonService, useValue: mockCommonService },
        { provide: ToasterService, useValue: mockToasterService },
        //  { provide: AuthenticationService, useValue: mockAuthService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: ChangeDetectorRef, useValue: cd },

        //  { provide: DomSanitizer, useValue: TestBed.inject(DomSanitizer) },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 123 } } },
        },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentTabViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
   
    sanitizer = TestBed.inject(DomSanitizer); // Inject DomSanitizer

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 ;

})