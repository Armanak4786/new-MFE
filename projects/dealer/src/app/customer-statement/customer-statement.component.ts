import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, MapFunc } from "auro-ui";
import { StandardQuoteService } from "../standard-quote/services/standard-quote.service";
import { BaseDealerClass } from "../base/base-dealer.class";
import { map, Subscription } from "rxjs";
import { ToasterService, ValidationService } from "auro-ui";
import { DashboardService } from "../dashboard/services/dashboard.service";

@Component({
  selector: "app-customer-statement",
  templateUrl: "./customer-statement.component.html",
  styleUrls: ["./customer-statement.component.scss"],
})
export class CustomerStatementComponent
  extends BaseDealerClass
  implements OnInit, OnDestroy
{
  override id: any;
  override mode: any;
  override data: any = {};
  isReady: boolean = false;
  contractId: string = '';
  private routeSubscription: Subscription;

  customerStatments: string = "Customer Statement";
  value: string = "Payment Summary";
  
  // Dynamic properties for labels
  productCode: string = '';
  summaryLabel: string = 'Payment Summary';
  scheduleLabel: string = 'Payment Schedule';
  justifyOptions: any[] = [];

  formdata: any;

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    private commonSvc: CommonService,
    private cd: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef,
    private dashboardSvc: DashboardService
  ) {
    super(route, svc, baseSvc);
  }

  override async ngOnInit() {
    // Subscribe to route params to get contractId
    this.routeSubscription = this.route.params.subscribe(async (params) => {
      this.contractId = params['contractId'];
    //    this.route.queryParams.subscribe(async (qp) => {
    //   this.productCode = qp['productCode'] || '';
    //   const fromBorrower = qp['fromBorrowerSearch'] === 'true' || qp['fromBorrowerSearch'] === true;
    //  if (fromBorrower && this.contractId) {
    //   console.log('Loading customer statement from borrower search flow');
    //       await this.loadDataFromSession();
    //     } 
    
       if (this.contractId) {
         await this.loadDataFromSession();
      } 
      
      // Set up labels after data is loaded
      this.setupLabelsBasedOnProductCode();
    
    });
  }

  override ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    sessionStorage.removeItem('customerStatementData');
  }

  private setupLabelsBasedOnProductCode(): void {
    // Get productCode from sessionStorage
    this.productCode = sessionStorage.getItem('productCode') || '';
    
    // Set labels based on productCode
    this.setDynamicLabels();
    
    // Update justifyOptions with new labels
    this.updateJustifyOptions();
  }

  private setDynamicLabels(): void {
    switch (this.productCode) {
      case 'FL':
        this.summaryLabel = 'Lease Summary';
        this.scheduleLabel = 'Lease Schedule';
        break;
      case 'OL':
        this.summaryLabel = 'Rental Summary';
        this.scheduleLabel = 'Rental Schedule';
        break;
      default:
        this.summaryLabel = 'Payment Summary';
        this.scheduleLabel = 'Payment Schedule';
        break;
    }
  }

  private updateJustifyOptions(): void {
    this.justifyOptions = [
      { name: this.summaryLabel, value: this.summaryLabel },
      { name: this.scheduleLabel, value: this.scheduleLabel }
    ];
    
    // Set default value to the summary label
    this.value = this.summaryLabel;
  }


  private async loadCustomerStatementData(contractId: string) {
    try {
      // First check sessionStorage for persisted data
      const sessionData = sessionStorage.getItem('customerStatementData');
      
      if (sessionData) {
        const parsedSessionData = JSON.parse(sessionData);
        
        // Verify the contractId matches
        if (parsedSessionData.contractId === contractId) {
          // Set the data in service from sessionStorage
          this.baseSvc.setBaseDealerFormData({
            customerStatementData: parsedSessionData.customerStatementData,
          });
          this.formdata = {
            customerStatementData: parsedSessionData.customerStatementData
          };
          
          // Setup labels after loading data
          this.setupLabelsBasedOnProductCode();
          return;
        }
      }

      // If no session data or contractId doesn't match, fetch fresh data
      await this.fetchFreshCustomerStatementData(contractId);
      
    } catch (error) {
      // console.error('Error loading customer statement data:', error);
      this.toasterSvc.showToaster({
        severity: 'error',
        detail: 'Failed to load customer statement data'
      });
    }
  }

  private async fetchFreshCustomerStatementData(contractId: string) {
    try {
      // Get productCode from sessionStorage or use default
      const productCode = sessionStorage.getItem('productCode') || '';
      
      if (!productCode) {
        this.toasterSvc.showToaster({
          severity: 'warn',
          detail: 'Product code not found. Some data may not load properly.'
        });
      }

      // If we have both contractId and productCode, fetch fresh data
      if (contractId && productCode) {
        const customerStatementData = await this.dashboardSvc.getCustomerStatement(contractId, productCode);
        
        if (customerStatementData) {
          // Update sessionStorage with fresh data
          const customerStatementSessionData = {
            customerStatementData: customerStatementData,
            productCode: productCode,
            contractId: contractId
          };
          sessionStorage.setItem('customerStatementData', JSON.stringify(customerStatementSessionData));

          // Set in service for child components
          this.baseSvc.setBaseDealerFormData({
            customerStatementData: customerStatementData,
          });
          
          this.formdata = {
            customerStatementData: customerStatementData
          };
          
          // Setup labels after fetching fresh data
          this.setupLabelsBasedOnProductCode();
        }
      }
    } catch (error) {
      // console.error('Error fetching fresh customer statement data:', error);
      this.toasterSvc.showToaster({
        severity: 'error',
        detail: 'Failed to fetch customer statement data'
      });
    }
  }

  private async loadDataFromSession() {
    // Original logic for loading from session when no URL params
    const sessionData = sessionStorage.getItem('customerStatementData');
    if (sessionData) {
      try {
        const parsedSessionData = JSON.parse(sessionData);
        // Set the data in service from sessionStorage
        this.baseSvc.setBaseDealerFormData({
          customerStatementData: parsedSessionData.customerStatementData,
        });
        this.formdata = {
          customerStatementData: parsedSessionData.customerStatementData
        };
      } catch (error) {
        //console.error('Error parsing session data:', error);
      }
    }
    
    // If no session data, try to get from service
    if (!this.formdata?.customerStatementData) {
      this.baseSvc
        .getBaseDealerFormData()
        .pipe()
        .subscribe((res) => {
          this.formdata = res;
        });
    }
    
    // Setup labels after loading from session
    this.setupLabelsBasedOnProductCode();
  }

  async init(contractData: any) {
    let params: any = this.route.snapshot.params;
    this.id = params.id;
    this.mode = params.mode;
  }

  override onFormDataUpdate(res: any): void {}

  pageCode: string = "";
  modelName: string = "";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
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
