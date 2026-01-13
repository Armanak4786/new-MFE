import { Component } from "@angular/core";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IndividualService } from "../../../../individual/services/individual.service";


@Component({
  selector: "app-sole-trade-citizenship-detail",

  templateUrl: "./sole-trade-citizenship-detail.component.html",
  styleUrl: "./sole-trade-citizenship-detail.component.scss",
})
export class SoleTradeCitizenshipDetailComponent extends BaseSoleTradeClass {
  //   optionsdata: any[] = ["aa"];
  //   privousChecked: any;
  //   borrowedAmount: any;
  //   constructor(
  //     public override route: ActivatedRoute,
  //     public override svc: CommonService,
  //     public soleTradeSvc: SoleTradeService
  //   ) {
  //     super(route, svc, soleTradeSvc);
  //   }
  //   override formConfig: GenericFormConfig = {
  //     headerTitle: "CitizenShip Details",
  //     autoResponsive: true,
  //     api: "",
  //     goBackRoute: "",
  //     fields: [
  //       {
  //         type: "array",
  //         name: "addCitizenshipArr",
  //         cols: 12,
  //         isTemplateFormData: true,
  //         isDelete: false,
  //         isAdd: false,
  //         fields: [
  //           {
  //             type: "toggle",
  //             label: "New Zealand Resident?",
  //             name: "newZealand",
  //             cols: 3,
  //             offLabel: "Yes",
  //             onLabel: "No",
  //             className: "m-4",
  //           },
  //           {
  //             type: "select",
  //             label: "Country Of Birth",
  //             name: "countryOfBirth",
  //             cols: 2,
  //              options: [
  //               { label: "New Zealand", value: "New Zealand" },
  //               { label: "India", value: "India" },
  //               { label: "United State", value: "United State" },
  //             ],
  //             //validators: [Validators.required],
  //           },
  //           {
  //             type: "select",
  //             label: "Country Of Citizenship",
  //             name: "countryOfCitizenship",
  //             cols: 2,
  //              options: [
  //               { label: "New Zealand", value: "New Zealand" },
  //               { label: "India", value: "India" },
  //               { label: "United State", value: "United State" },
  //             ],
  //             //validators: [Validators.required],
  //           },
  //           {
  //             type: "deleteBtn",
  //             btnType: "non-bg-btn",
  //             submitType: "internal",
  //             name: "deleteBtn",
  //             icon: "fa-regular fa-trash-can text-base",
  //             cols: 3,
  //             nextLine: true,
  //           },
  //         ],
  //         templateFormFields: [
  //           {
  //             type: "toggle",
  //             label: "New Zealand Resident?",
  //             name: "newZealand",
  //             cols: 3,
  //             offLabel: "Yes",
  //             onLabel: "No",
  //             className: "m-4",
  //             default:false,
  //           },
  //           {
  //             type: "select",
  //             label: "Country Of Birth",
  //             name: "countryOfBirth",
  //             cols: 2,
  //             className: "col-offset-0",
  //             options: [
  //               { label: "New Zealand", value: "New Zealand" },
  //               { label: "India", value: "India" },
  //               { label: "United State", value: "United State" },
  //             ],
  //             //validators: [Validators.required],
  //           },
  //           {
  //             type: "select",
  //             label: "Country Of Citizenship",
  //             name: "countryOfCitizenship",
  //             cols: 2,
  //             options: [
  //               { label: "New Zealand", value: "New Zealand" },
  //               { label: "India", value: "India" },
  //               { label: "United State", value: "United State" },
  //             ],
  //             //validators: [Validators.required],
  //           },
  //           {
  //             type: "addBtn",
  //             submitType: "internal",
  //             label: "Add CitizenShip",
  //             name: "addBtn",
  //             btnType: "plus-btn",
  //             cols: 2,
  //             nextLine: true,
  //           },
  //         ],
  //       },
  //     ],
  //   };
  //   override async onSuccess(data: any) {}

  //   override onValueChanges(event: any): void {}
  //   override onButtonClick(event: any): void {
  //     if (event?.field?.name == "addCitizenshipArr") {
  //       this.mainForm.addArrayControls(event?.field?.name);
  //       this.customPatchFormArray(event, event?.templateFormData?.value);
  //     }
  //   }

  //   override onFormEvent(event: any): void {
  //      super.onFormEvent(event);
  //   }
  // }

  countryList: any = [];
  citizenshipForm: FormGroup;
  isCitizenshipAdded: boolean = false;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: SoleTradeService,
    public fb: FormBuilder,
    private indSvc: IndividualService
  ) {
    super(route, svc, baseSvc);
    this.baseSvc.formDataCacheableRoute([
     "LookUpServices/locations?LocationType=country",
    ]);
    this.citizenshipForm = this.fb.group({
      citizenships: this.fb.array([
        this.fb.group({
          isNewZealandResident: ["", Validators.required],
          countryOfCitizenship: ["New Zealand", Validators.required],
          countryOfBirth: ["New Zealand", Validators.required],
        }),
      ]),
    });
  }


  override async ngOnInit(): Promise<void> {
        await super.ngOnInit();

    this.customForm = { form: this.citizenshipForm };
    await this.baseSvc.getFormData(
    `LookUpServices/locations?LocationType=country`,
    (res) => {
      const list = res.data || [];
      const index = list.findIndex(c => c.name === "New Zealand");
      if (index > -1) {list.unshift(list.splice(index, 1)[0]);}
      this.countryList = list.map(c => ({
        label: c.name,
        value: c.name,
      }));
      return this.countryList;
    }
  );

    // await this.baseSvc.getFormData(
    //   `LookUpServices/locations?LocationType=country`,
    //   (res) => {
    //     this.countryList = res.data;
    //     return this.countryList;
    //   }
    // );
    if (this.baseFormData?.personalDetails || this.baseFormData) {
      this.citizenships.at(0).patchValue({
        isNewZealandResident:
          this.baseFormData.isNewZealandResident ||
          this.baseFormData?.personalDetails?.isNewZealandResident,
        countryOfCitizenship:
          this.baseFormData.countryOfCitizenship1 ||
          this.baseFormData?.personalDetails?.countryOfCitizenship1,
        countryOfBirth:
          this.baseFormData.countryOfBirth ||
          this.baseFormData?.personalDetails?.countryOfBirth,
      });

      if (
        this.baseFormData?.personalDetails?.countryOfCitizenship2 ||
        this.baseFormData?.countryOfCitizenship2
      ) {
        this.addOtherCitizenship();
        this.citizenships.at(1).patchValue({
          countryOfCitizenship:
            this.baseFormData?.countryOfCitizenship2 ||
            this.baseFormData?.personalDetails?.countryOfCitizenship2,
        });
      }
      if (
        this.baseFormData?.personalDetails?.countryOfCitizenship3 ||
        this.baseFormData?.countryOfCitizenship3
      ) {
        this.addOtherCitizenship();
        this.citizenships.at(2).patchValue({
          countryOfCitizenship:
            this.baseFormData.countryOfCitizenship3 ||
            this.baseFormData?.personalDetails?.countryOfCitizenship3,
        });
      }
    }

    this.citizenships.valueChanges.subscribe((res) => {
      this.baseSvc.setBaseDealerFormData({
        isNewZealandResident: res?.[0]?.isNewZealandResident,
        countryOfBirth: res?.[0]?.countryOfBirth,
        countryOfCitizenship1: res?.[0]?.countryOfCitizenship,
        countryOfCitizenship2: res?.[1]?.countryOfCitizenship,
        countryOfCitizenship3: res?.[2]?.countryOfCitizenship,
      });

      // this.getvalue();
      // this.baseSvc.setBaseDealerFormData({
      //   personalDetails : res
      // });
    });
    // this.citizenships.at(0).value.patchValue("New Zealand")

    // if (this.mode == 'edit') {
    //   this.citizenships.clear();

    //   // Loop through each email in baseFormData.business.emails
    //   // this.baseFormData?.personalDetails?.phone.forEach((ele) => {
    //   //   if (ele.value !== '') {
    //   //     const phoneControl = this.createCitizenshiForm();
    //   //     this.citizenships.push(phoneControl);
    //   //     phoneControl.patchValue({
    //   //       value: ele.value,
    //   //       type: ele.type || null,
    //   //     });
    //   //   }
    //   // });
    // } else {
    if (this.baseFormData?.personalDetailsCitizenship != undefined) {
      for (
        let i = this.citizenships?.length;
        i != this.baseFormData?.personalDetailsCitizenship.length;
        i++
      ) {
        this.citizenships.push(this.createCitizenshiForm());
      }
      this.citizenships.patchValue(
        this.baseFormData?.personalDetailsCitizenship
      );
    }
    // }

    if(this.baseSvc.showValidationMessage){
      this.citizenships.markAllAsTouched()
    }
  }
//  getSortedCountryList(index: number, fieldName: 'countryOfCitizenship' | 'countryOfBirth'): any[] {
//     const selectedValue = this.citizenships.at(index)?.get(fieldName)?.value;
//     if (!this.countryList || !this.countryList.length) return [];
    
//     // Filter and sort the rest
//     const rest = this.countryList
//       .filter(country => country.name !== selectedValue)
//       .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    
//     // Find selected country
//     const selectedCountry = this.countryList.find(country => country.name === selectedValue);
    
//     // Return with selected first
//     return selectedCountry ? [selectedCountry, ...rest] : rest;
//   }

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.citizenshipForm) {
        // formStatus = this.svc.proceedForm(this.citizenshipForm);
        // this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }
    // super.onStepChange(stepperDetails)
    this.baseSvc.updateComponentStatus("Business Individual", "SoleTradeCitizenshipDetailComponent", this.citizenships.valid)

    if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
  }

//   override async onStepChange(stepperDetails: any): Promise<void> {
//   if (stepperDetails?.type !== "tabNav") {

//     let formStatus = this.svc.proceedForm(this.citizenshipForm);
//     this.baseSvc?.formStatusArr?.push(formStatus);

//     if (!this.citizenshipForm.valid) {
//       stepperDetails.preventNavigation = true; 
//     }
//   }
// }



public updateValidation(trigger: string): void {
  // if (super["updateValidation"]) {
  //   (super["updateValidation"] as any).call(this, trigger);
  // }

  // touch all fields to show error
  // this.citizenshipForm.markAllAsTouched();

  // const formStatus = this.svc.proceedForm(this.citizenshipForm);

  // this.baseSvc?.formStatusArr?.push(formStatus);

}



  residentOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  onSwitchChange(event: any) {
    if (!event.checked) {
      this.citizenships.at(0).patchValue({
        isNewZealandResident: "No",
        countryOfBirth: "",
        countryOfCitizenship: "",
      });
    } else {
      this.citizenships.at(0).patchValue({
        isNewZealandResident: "Yes",
        countryOfBirth: "",
        countryOfCitizenship: "",
      });
    }
  }

  createCitizenshiForm(): FormGroup {
    return this.fb.group({
      residentOptions: ["", Validators.required],
      countryOfCitizenship: ["New Zealand", Validators.required],
      countryOfBirth: ["New Zealand", Validators.required],
    });
  }

  get citizenships(): FormArray {
    return this.citizenshipForm.get("citizenships") as FormArray;
  }

  addOtherCitizenship() {
    if (this.citizenships.length < 3) {
      this.citizenships.push(
        this.fb.group({
          countryOfCitizenship: ["", Validators.required],
        })
      );
      this.isCitizenshipAdded = this.citizenships.length === 3; // Set the flag to true to hide the button
    }
  }
  // getvalue() {
  //   const residenece = this.citizenships.at(0).value.isNewZealandResident;
  //   console.log("residence", residenece)
  //   console.log(this.citizenships)
  //   this.baseSvc.setBaseDealerFormData({
  //     isNewZealandResident: residenece,
  //     countryOfBirth:
  //       this.citizenshipForm.value?.citizenships?.[0]?.countryOfBirth,
  //     countryOfCitizenship1:
  //       this.citizenshipForm.value?.citizenships?.[0]?.countryOfCitizenship,
  //     countryOfCitizenship2:
  //       this.citizenshipForm.value?.citizenships?.[1]?.countryOfCitizenship,
  //     countryOfCitizenship3:
  //       this.citizenshipForm.value?.citizenships?.[2]?.countryOfCitizenship,
  //   });
  //   console.log("getValue",this.baseFormData)
  // }
  removePhone(index) {
    this.citizenships.removeAt(index);
    const residenece = this.citizenships.at(0).value.isNewZealandResident;
    this.baseSvc.setBaseDealerFormData({
      isNewZealandResident: residenece,
      countryOfBirth:
        this.citizenshipForm.value?.citizenships?.[0]?.countryOfBirth,
      countryOfCitizenship1:
        this.citizenshipForm.value?.citizenships?.[0]?.countryOfCitizenship,
      countryOfCitizenship2:
        this.citizenshipForm.value?.citizenships?.[1]?.countryOfCitizenship,
      countryOfCitizenship3:
        this.citizenshipForm.value?.citizenships?.[2]?.countryOfCitizenship,
    });
    // console.
    // ( this.citizenships.value);

    this.isCitizenshipAdded = false;
  }
}
