import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { currentPosition } from "../../model/customer-statment";
import { CustomerStatementService } from "../../service/customer-statement.service";
import { CommonService, ToasterService, ValidationService } from "auro-ui";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";
import { BaseStandardQuoteClass } from "../../../standard-quote/base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-current-position",
  templateUrl: "./current-position.component.html",
  styleUrl: "./current-position.component.scss",
})
export class CurrentPositionComponent extends BaseStandardQuoteClass implements OnInit {
  currentPosition: currentPosition[];
  override mainForm: any;
  override formConfig: any;
  customerStatementApiData: any;
  today: Date = new Date();
  showOnlyRemainingTerm: boolean = false;
  productCode: string = '';

  constructor(
    public override route: ActivatedRoute,        
    public override svc: CommonService,           
    public override baseSvc: StandardQuoteService,
    private customerSvc: CustomerStatementService,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc); 
  }

 override async ngOnInit(): Promise<void> {
  this.productCode=sessionStorage.getItem('productCode') || '';
  this.renderData();
  await super.ngOnInit();
     if (this.baseFormData?.customerStatementData) {
      this.customerStatementApiData = this.baseFormData.customerStatementData;
      this.extractCurrentPositionData();
    }
  }
  extractCurrentPositionData() {
    if (!this.customerStatementApiData) {
      return;
    }
    const currentPositionData = this.customerStatementApiData?.currentPositionDetails?.currentPosition;
    if (currentPositionData && currentPositionData.length > 0) {

      const apiData = currentPositionData[0];

      this.currentPosition = [{
        grossBalance: apiData?.grossBalanceAsOfToday || 0,
        loanBalance: apiData?.principalBalance || 0,
        currentIntresetRate: this.customerStatementApiData?.loanDetails?.interestRate || 0,
        nextRepriceDate: apiData?.nextInstallment || null,
        remainingTerm: apiData?.remainingTerm || 0
      }];
    } 
  }
  renderData() {
  this.showOnlyRemainingTerm = (this.productCode === 'FL' || this.productCode === 'OL');
  }
  pageCode: string = "";
  modelName: string = "";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

   const responses = await this.validationSvc.updateValidation(req);
    if (!responses.status && responses.updatedFields.length) {
      await this.mainForm.applyValidationUpdates(responses);
    }

    return responses.status;
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        this.toasterSvc.showToaster({
          severity: "error",
          detail: "I7",
        });
      }
    }
  }
}
