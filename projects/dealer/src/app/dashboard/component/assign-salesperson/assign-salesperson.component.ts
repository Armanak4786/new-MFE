import { Component } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { BaseFormClass, CloseDialogData, CommonService, GenericFormConfig, Mode } from "auro-ui";
import { Validators } from "@angular/forms";
import { BaseDealerClass } from "../../../base/base-dealer.class";
import { ActivatedRoute } from "@angular/router";
import { BaseDealerService } from "../../../base/base-dealer.service";
import { AssigneeDiscloserComponent } from "../assignee-discloser/assignee-discloser.component";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { StandardQuoteService } from "../../../standard-quote/services/standard-quote.service";

@Component({
  selector: "app-assign-salesperson",
  templateUrl: "./assign-salesperson.component.html",
  styleUrl: "./assign-salesperson.component.scss",
})
export class AssignSalespersonComponent extends BaseFormClass {

  scenarioType: any;
  productProgramList: any;
  productList: any[] = []
    programList?: any[];

  salePersonData: any;
  operatingUnitsList: any[] = [];
  closePopup() {
    this.commonSvc.dialogSvc.ngOnDestroy();
  }

  constructor(
    public override route: ActivatedRoute,
    private service: DashboardService,
    public commonSvc: CommonService,
    public dynamicDialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public stdqSvc: StandardQuoteService
  ) { super(route, commonSvc); 
     this.stdqSvc.formDataCacheableRoute([
      "Product/get_programs_products",
      "Contract/contract_party_dealer_details_internal",
      "CustomerDetails/get_contacts?partyNo=1000000&PageNo=1&PageSize=10",
    ]);
  }

   override formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    fields: [
      {
        type: 'text',
        label: 'Quote ID',
        name: 'quoteId',
        inputType: 'vertical',
        cols: 4,
        className: "-ml-6 px-6",
        mode: Mode.view
      },
         {
        type: 'text',
        label: 'Customer Name',
        name: 'customerName',
        inputType: 'vertical',
        cols: 4,
        className: "ml-4 px-6",
        mode: Mode.view
      },
         {
        type: 'text',
        label: 'Asset Type',
        name: 'assetType',
        inputType: 'vertical',
        cols: 4,
        className: "ml-3 px-6",
        mode: Mode.view
      },
       {
        type: 'select',
        label: 'Product',
        labelClass: 'mb-4',
        name: 'productId',
        alignmentType: 'vertical',
        cols: 4,
        className: "-ml-6 px-6",
        // hidden: true,
      },
       {
        type: 'select',
        label: 'Program',
        labelClass: 'mb-4',
        name: 'programId',
        alignmentType: 'vertical',
        cols: 4,
        className: "ml-4 pl-6 pr-5",
        options: [],
        // hidden: true,
      },
     
        {
        type: 'select',
        label: 'Originator Name',
        labelClass: 'mb-4',
        name: 'originatorName',
        alignmentType: 'vertical',
        cols: 4,
        className: "ml-2 pl-6 pr-5",
        options: [],
        // hidden: true,
      },
         {
        type: 'number',
        label: 'Originator Number',
        labelClass: 'mb-4 -mt-4',
        name: 'originatorNumber',
        inputType: 'vertical',
        cols: 4,
        className: "-ml-1 pr-8 pl-2",
        mode: Mode.view,
        // hidden: true,
      },
      
       {
        type: 'select',
        label: 'Salesperson',
        labelClass: 'mb-4',
        name: 'salesperson',
        alignmentType: 'vertical',
        cols: 4,
        className: "ml-3 pr-7 -mt-4",
        options: [],
        // hidden: true,
      },
       {
        type: 'select',
        label: 'Operating Unit',
        labelClass: 'mb-4',
        name: 'operatingUnit',
        alignmentType: 'vertical',
        cols: 4,
        className: "-ml-3 pr-6 pl-5 -mt-4",
        options: [],
        // hidden: true,
      }
    ],
  };

  override async ngOnInit() {
    await super.ngOnInit();
     let accessToken = sessionStorage.getItem("accessToken");
     let decodedToken = this.service?.decodeToken(accessToken);

      await this.svc?.data
      ?.get(`CustomerDetails/get_defaultOperatingUnit?userCode=${decodedToken?.sub}`)
      .subscribe((res: any) => {
       const response = res?.data?.data?.responseMessage?.[0];

       const operatingUnit = response?.operatingUnit;
       const allowedUnits = response?.allowedOperatingUnits.filter(
                            unit => unit.partyId !== operatingUnit?.partyId
                            ) ?? [];

       this.operatingUnitsList = [
       ...(operatingUnit ? [{
        label: operatingUnit.extName,
        value: operatingUnit.extName
       }] : []),

      ...allowedUnits.map((unit: any) => ({
       label: unit.extName,
       value: unit.extName
       }))
      ];
  
  });
    await this.mainForm.updateList("operatingUnit", this.operatingUnitsList);

  }

  override async onFormReady() {
    super.onFormReady();
    if(sessionStorage.getItem("externalUserType")==="Internal"){
    await this.getProductProgramForInternalSales();
    }

    this.scenarioType = this.dynamicDialogConfig?.data?.rowData?.originator ? "DealerToDirect" : "DirectToDealer";
    if(this.scenarioType === "DealerToDirect"){
      const directProducts = this.productProgramList.products?.filter(item => item.businessModel === "Direct");
      const productList = Array.isArray(directProducts)
        ? directProducts
            .map((item) => ({
              label: item.name,
              value: item.productId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [];
      
      await this.mainForm.updateList("productId", productList);

      this.mainForm?.updateHidden({originatorName: true, originatorNumber: true})
      this.mainForm?.updateProps("programId", {className: " -ml-6 px-6 "});
      this.mainForm?.updateProps("salesperson", {className: " -ml-1 pl-0", cols: 3});
      this.mainForm?.updateProps("operatingUnit", {className: "ml-1 px-0", cols: 2});
      this.mainForm?.updateProps("customerName", {className: " -ml-6 px-6"});
      this.mainForm?.updateProps("assetType", {className: " -ml-6 px-6"});

        let res = await this.stdqSvc?.getFormData(
        `CustomerDetails/get_contacts?partyNo=1000000&PageNo=1&PageSize=10`
      );
      if (res?.data) {
        let internalSalesPersonList = res.data.map((d: any) => ({
          label: d.lastName,
          value: d.customerId,
        }));
        this.mainForm?.updateList(
          "salesperson",
          internalSalesPersonList
        );
      }
    }else{
      const assignedProducts = this.productProgramList.products?.filter(item => item.businessModel === "Introduced");
      const productList = Array.isArray(assignedProducts)
        ? assignedProducts
            .map((item) => ({
              label: item.name,
              value: item.productId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [];
      
      await this.mainForm.updateList("productId", productList);
    }
  

    if(this.dynamicDialogConfig?.data?.rowData){
      const productId = this.productList?.find(item => item.label === this.dynamicDialogConfig?.data?.rowData?.product)?.value;
      this.mainForm?.get("quoteId")?.setValue(this.dynamicDialogConfig?.data?.rowData?.contractId);
      this.mainForm?.get("customerName")?.setValue(this.dynamicDialogConfig?.data?.rowData?.customerName);
      this.mainForm?.get("assetType")?.setValue(this.dynamicDialogConfig?.data?.rowData?.assetType);
    }
  }

    async getProductProgramForInternalSales() {
    let res = await this.stdqSvc.getFormData(
      `Product/get_programs_products?introducerId=${0}`
    );
    if (res?.data) {
      this.productProgramList = res?.data;
      let productdata = res?.data?.products;
      let programData = res?.data?.programs;
      this.productList = Array.isArray(productdata)
        ? productdata
            .map((item) => ({
              label: item.name,
              value: item.productId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [];
      this.programList = Array.isArray(programData)
        ? programData
            .map((item) => ({
              label: item.name,
              value: item.programId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [];
    }

    // if (this.productCode || this.sessionProductCode) {
    //   let productList = this.productProgramList?.products.filter(
    //     (product) =>
    //       product.code?.includes(this.productCode) ||
    //       product.code?.includes(this.sessionProductCode)
    //   );
    //   let productJson = Array.isArray(productList)
    //     ? productList
    //         .map((item) => ({
    //           label: item.name,
    //           value: item.productId,
    //         }))
    //         .sort((a, b) => a.label.localeCompare(b.label))
    //     : [];
    //   await this.mainForm.updateList("productId", productJson);
    // } else {
    //   await this.mainForm.updateList("productId", this.productList);
    // }
      await this.mainForm.updateList("productId", this.productList);

    if (this.mainForm.form.get("productId")?.value) {
      this.setProgram(this.mainForm.form.get("productId")?.value);
    }
  }
  
   async setProgram(productId) {
    let programOptions = this.productProgramList?.programs?.filter(
      (program) => program.productId === productId
    );
    let programJson = Array.isArray(programOptions)
      ? programOptions
          ?.map((item) => ({
            label: item.name,
            value: item.programId,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
    if (programJson?.length == 1) {
      //this.mainForm.get("programId").patchValue(programJson[0]?.value);
      // this.mainForm.get("programId").disable();
      // this.standardService.programChange.next(programJson[0]?.value);
    }

    let selectedProduct = this.productProgramList?.products?.find(
      (product) => product.productId === productId
    );
    // this.stdqSvc.setBaseDealerFormData({
    //   businessModel: selectedProduct?.businessModel,
    // });
    await this.mainForm.updateList("programId", programJson);
  }

 override async onFormEvent(res: any) {
      if(sessionStorage.getItem("externalUserType")==="Internal"){
      if(res?.name == "productId" && res?.value){
        this.setProgram(res?.value);
      }

      if(res?.name == "programId" && res?.value){
        const dealerList = await this.stdqSvc.getDealerForInternalSales(res?.value);
        await this.mainForm.updateList("originatorName", dealerList || []);
      }

      if(res?.name == "originatorName" && res?.value){
        const originatorNumber = await this.stdqSvc.getOriginatorNumberByName(res?.value)
        await this.mainForm.get("originatorNumber")?.setValue(originatorNumber);
      }

       if(res?.name == "originatorNumber" && res?.value){
        const originatorNumber = await this.getsalesPerson(res?.value)
      }
    }
  }

   async getsalesPerson(salesPersonId: any) {
    if (salesPersonId) {
      this.salePersonData = await this.stdqSvc.getFormData(
        `CustomerDetails/get_contacts?partyNo=${salesPersonId}&PageNo=1&PageSize=10`
      );
      let data = this.salePersonData?.data;
      let arr = Array.isArray(data)
        ? data.map((item) => ({
            label: item.lastName,
            value: item.customerId,
          }))
        : [];
      this.mainForm.updateList("salesperson", arr);
      this.mainForm.form.get("salesperson").patchValue(arr[0]?.value);
    }
  }

  changeAssignee() {
    // this.commonSvc.dialogSvc.ngOnDestroy();
    this.ref.close();
    this.commonSvc.dialogSvc
      .show(AssigneeDiscloserComponent, " ", {
        templates: {
          footer: null,
        },
        width: "40vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {});
  }

  selectedSalesPerson: any;

  selectedOriginatorNumber: any;
  selectedOriginatorName: any;

  listData: any = [
    { name: "Quote", code: "Quote" },
    { name: "AFV Loan", code: "AFVLoan" },
    { name: "Application", code: "Application" },
    { name: "Activated Contract List", code: "ActivatedContracts" },
  ];

}
