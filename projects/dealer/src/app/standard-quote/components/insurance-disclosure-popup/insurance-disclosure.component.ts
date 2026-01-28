import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { CloseDialogData, CommonService, Mode } from "auro-ui";
import { ActivatedRoute, Router } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { takeUntil } from "rxjs";
import { KeyInfoPopupComponent } from "../key-info-popup/key-info-popup.component";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToasterService, ValidationService } from "auro-ui";
import configure from "../../../../../public/assets/configure.json";


@Component({
  selector: "app-insurance-disclosure",
  templateUrl: "./insurance-disclosure.component.html",
  styleUrl: "./insurance-disclosure.component.scss",
})
export class InsuranceDisclosureComponent extends BaseStandardQuoteClass {
  @ViewChild("mainSection") mainSection: ElementRef;

  customersToDisplay: any
  messageType = "KeyDisclosureCSAPersonal";
  formData: any;
  tableData: any[] = [];
  declarationMap: { [key: string]: any } = {};

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public router: Router,
    override baseSvc: StandardQuoteService,
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService
  ) {
    super(route, svc, baseSvc);
  }
  resData: any;
  override async ngOnInit(): Promise<void> {
    this.resData = this.config?.data?.disclosureData;
   
    this.baseSvc
      .getBaseDealerFormData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.formData = res;
      });

      this.customersToDisplay = this.formData?.customerSummary?.
      filter(customer => customer.customerRole === 1 || customer.customerRole === 2)?.
      map(customer => ({
        name : customer?.customerName,
        employmentStatus: customer?.employmentStatus
      }));

    this.customersToDisplay.forEach(customer => {
     for (let i = 1; i <= 7; i++) {
     this.tableData.push({
      rowNo: 0,
      insuranceDeclarationType: `Insurance Q${i}`,
      insuredBorrowerName: customer.name,
      declarationResponse: ""
     });
    }
  });
  
  const apiResponse = this.config?.data?.cellData;

  const reconstructedApiResponse = apiResponse.items.map(item => {
    const obj: any = { rowNo: item.rowNo };
    item.customFields.forEach(field => {
    obj[this.toCamelCase(field.name)] = field.value;
    });
    return obj;
  });


  reconstructedApiResponse.forEach(apiObj => {
    const match = this.tableData.find(r =>
    r.insuredBorrowerName === apiObj.insuredBorrowerName &&
    r.insuranceDeclarationType === apiObj.insuranceDeclarationType
    );
    if (match) {
    match.declarationResponse = apiObj.declarationResponse;
    }
  });

 this.tableData.forEach(row => {
    this.declarationMap[`${row.insuredBorrowerName} ${row.insuranceDeclarationType}`] = row;
  });
 
  await this.updateValidation("onInit");
} 

  override ngAfterViewInit() {
    super.ngAfterViewInit();
  
    this.mainSection.nativeElement.scrollTo(0, 0);
  }
  showKeyInfoDisclosure() {
   
    this.svc.data
      ?.get(
        `Declaration/get_disclosure_messages?MessageType=${this.messageType}&ProgramId=${this.formData?.programId}&QuoteId=${this.formData.contractId}`
      )
      ?.subscribe((res) => {
        let responseData = res;
      
        if (responseData) {
         this.svc.dialogSvc
        .show(KeyInfoPopupComponent, "Key Info Disclosure", {
         templates: {
          footer: null,
        },
        data: responseData,
        width: "60vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {});
      }
      })
    }

    toCamelCase = (str: string) =>
    str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

  close() {
     this.svc.ui.showOkDialog("Any unsaved changes will be lost. Are you sure you want to cancel?",
        "",
        () => {
        this.svc.dialogSvc.ref.close({});
      },
      )
  }

  reject(){
      this.svc.ui.showOkDialog("Any unsaved changes will be lost. Are you sure you want to cancel?",
        "",
        () => {
        this.svc.dialogSvc.ref.close({});
      },
      )
  }

  submitForm() {
    // this.baseSvc.setBaseDealerFormData({ ...updatedValues });
    let requestBody = {
      contractId: this.formData?.contractId,
      insuranceDeclarationQuestion: this.tableData
    };

    if (this.formData?.contractId) {
      this.svc.data
        .put("Contract/submit_insurance_declaration_form", requestBody)
        .subscribe((res) => {
          this.ref.close();
        });
    } else {
      this.ref.close();
    }
    // this.svc.dialogSvc
    // .show(InsuranceFinalPopupComponent, 'Insurance Disclosure Form', {
    //   templates: {
    //     footer: null,
    //   },
    //   width: '80vw',
    // })
    // .onClose.subscribe((data: CloseDialogData) => {});
  }

  pageCode: string = "";
  modelName: string = "";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }
isDisabled(){
    if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus) || (configure?.workflowStatus?.edit?.includes(this.baseFormData?.AFworkflowStatus))){
    return true;
  }
  return false;
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
        // this.toasterSvc.showToaster({
        //   severity: "error",
        //   detail: "I7",
        // });
      }
    }
  }
}
