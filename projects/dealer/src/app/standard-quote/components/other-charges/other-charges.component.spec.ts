import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtherChargesComponent } from './other-charges.component';
import { ActivatedRoute } from '@angular/router';
import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  GenericFormConfig,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LessDepositComponent } from '../less-deposit/less-deposit.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('OtherChargesComponent', () => {
  let component: OtherChargesComponent;
  let fixture: ComponentFixture<OtherChargesComponent>;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockActivatedRoute = {} as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserDynamicTestingModule,
        CoreAppModule,
        AppPrimengModule,
      ],
      declarations: [OtherChargesComponent, LessDepositComponent],
      providers: [
        AuthenticationService,
        JwtHelperService,
        { provide: ActivatedRoute, useValue: { params: of({}) } },

        ConfirmationService,
        AuroUiFrameWork,
        UiService,
        MessageService,
        { provide: JWT_OPTIONS, useValue: {} },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        CommonService,
        StandardQuoteService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OtherChargesComponent);
    component = fixture.componentInstance;
    component.baseFormData = {
      data: {
        financialAssetLease: {
          totalAmountBorrowed: 10000,
          interestCharge: 500,
        },
        financialAssets: [{ taxesAmt: 700 }],
        loanMaintenanceFee: 200,
      },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should initialize form values in ngOnInit', async () => {
  //   await component.ngOnInit();
  //   fixture.detectChanges();

  //   expect(component.mainForm.get('totalAmountBorrowed').patchValue).toHaveBeenCalledWith(10000);
  //   expect(component.mainForm.get('includeGst').patchValue).toHaveBeenCalledWith(700);
  //   expect(component.mainForm.get('interestCharges').patchValue).toHaveBeenCalledWith(500);
  //   expect(component.mainForm.get('loanMaintenceFee').patchValue).toHaveBeenCalledWith(200);
  // });

  it('should handle form event for fixedCheckbox', () => {
    const event = { name: 'fixedCheckbox', value: true };

    component.onFormEvent(event);

    // Assuming the logic is implemented, you can check the behavior.
    // Expect something to happen when fixedCheckbox is checked.
    // Example: expect(component.updateDisableValue).toHaveBeenCalled();
  });

  // it('should update hidden fields based on productId in onFormDataUpdate', () => {
  //   component.baseFormData = { productId: 52 }; // Previous productId
  //   const res = { productId: 53 }; // New productId

  //   component.onFormDataUpdate(res);

  //   expect(component.mainForm?.updateHidden).toHaveBeenCalledWith({ loanMaintenceFee: true });
  //   expect(component.mainForm?.updateHidden).toHaveBeenCalledWith({ fixedCheckbox: true });
  // });

  // it('should not patch values when baseFormData is undefined', async () => {
  //   component.baseFormData = undefined;
  //   spyOn(component.mainForm.get('totalAmountBorrowed'), 'patchValue');
  //   spyOn(component.mainForm.get('includeGst'), 'patchValue');
  //   spyOn(component.mainForm.get('interestCharges'), 'patchValue');
  //   spyOn(component.mainForm.get('loanMaintenceFee'), 'patchValue');

  //   await component.ngOnInit();

  //   expect(component.mainForm.get('totalAmountBorrowed').patchValue).not.toHaveBeenCalled();
  //   expect(component.mainForm.get('includeGst').patchValue).not.toHaveBeenCalled();
  //   expect(component.mainForm.get('interestCharges').patchValue).not.toHaveBeenCalled();
  //   expect(component.mainForm.get('loanMaintenceFee').patchValue).not.toHaveBeenCalled();
  // });
  // it('should call handleUpdateAmount when updateAmount event is emitted from LessDepositComponent', () => {
  //   spyOn(component, 'handleUpdateAmount');

  //   const lessDepositComponent = fixture.debugElement.query(
  //     (el) => el.name === 'app-less-deposit'
  //   ).componentInstance;

  //   const mockEventValue = 1000;
  //   lessDepositComponent.updateAmount.emit(mockEventValue); // Emit the event

  //   expect(component.handleUpdateAmount).toHaveBeenCalledWith(mockEventValue);
  // });
});
