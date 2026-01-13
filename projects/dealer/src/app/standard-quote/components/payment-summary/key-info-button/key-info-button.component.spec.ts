import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyInfoButtonComponent } from './key-info-button.component';
import {
  AuthenticationService,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../../services/standard-quote.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { CalculationService } from '../calculation.service';
import { KeyInfoPopupComponent } from '../../key-info-popup/key-info-popup.component';
import { of } from 'rxjs';

fdescribe('KeyInfoButtonComponent', () => {
  let component: KeyInfoButtonComponent;
  let fixture: ComponentFixture<KeyInfoButtonComponent>;
  let mockCommonService: any;
  let mockStandardQuoteService: jasmine.SpyObj<StandardQuoteService>;

  beforeEach(async () => {
    mockCommonService = jasmine.createSpyObj('CommonService', [
      'dialogSvc',
      'data',
    ]);
    mockCommonService.dialogSvc = jasmine.createSpyObj('DialogService', [
      'show',
    ]);
    mockCommonService.data = jasmine.createSpyObj('DataService', ['post']);

    mockStandardQuoteService = jasmine.createSpyObj('StandardQuoteService', [
      '',
    ]);

    await TestBed.configureTestingModule({
      declarations: [KeyInfoButtonComponent],
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
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyInfoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onButtonClick', () => {
    it('should call showDialog', () => {
      spyOn(component, 'showDialog');
      component.onButtonClick(null);
      expect(component.showDialog).toHaveBeenCalled();
    });
  });
  describe('showDialog', () => {
    it('should open the KeyInfoPopupComponent dialog', () => {
      const mockDialogRef = {
        onClose: of({ data: true }),
      };
      mockCommonService.dialogSvc.show.and.returnValue(mockDialogRef);

      component.showDialog();

      expect(mockCommonService.dialogSvc.show).toHaveBeenCalledWith(
        KeyInfoPopupComponent,
        'Originator Declaration',
        {
          templates: { footer: null },
          data: { other: null },
          width: '60vw',
        }
      );
    });
    it('should call post API with correct data when dialog is closed with data', () => {
      const mockDialogRef = {
        onClose: of({ data: true }),
      };
      mockCommonService.dialogSvc.show.and.returnValue(mockDialogRef);
      mockCommonService.data.post.and.returnValue(of({}));

      component.showDialog();

      const expectedDataApi = {
        DealerId: '',
        MessageID: '8',
        QuoteId: '31',
        IsActive: '1',
      };
      expect(mockCommonService.data.post).toHaveBeenCalledWith(
        'Declaration/save_acceptance_message',
        expectedDataApi
      );
    });

    it('should not call post API if dialog is closed without data', () => {
      const mockDialogRef = {
        onClose: of(null),
      };
      mockCommonService.dialogSvc.show.and.returnValue(mockDialogRef);

      component.showDialog();

      expect(mockCommonService.data.post).not.toHaveBeenCalled();
    });
  });
  it('should call onButtonClick when the label is clicked', () => {
    spyOn(component, 'onButtonClick'); // Spy on the onButtonClick method
  
    // Find the label element
    const labelElement: HTMLElement = fixture.debugElement.nativeElement.querySelector(
      'label[name="keyinfobutton"]'
    );
  
    // Simulate the click event
    labelElement.click();
  
    // Verify the onButtonClick method was called
    expect(component.onButtonClick).toHaveBeenCalled();
  });
  
});
