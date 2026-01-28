import { Component } from "@angular/core";
import { BaseIndividualClass } from "../../../base-individual.class";
import { ActivatedRoute } from "@angular/router";
import { IndividualService } from "../../../services/individual.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "auro-ui";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-personal-citizenship-detail",
  templateUrl: "./personal-citizenship-detail.component.html",
  styleUrl: "./personal-citizenship-detail.component.scss",
})
export class PersonalCitizenshipDetailComponent extends BaseIndividualClass {
  countryList: any = [];
  citizenshipForm: FormGroup;
  isCitizenshipAdded: boolean = false;
private countryOptions: any[] = [];
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: IndividualService,
    public fb: FormBuilder
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
    this.customForm = { form: this.citizenshipForm };
    await super.ngOnInit();
    // this.svc.data
    //   .get("LookUpServices/locations?LocationType=country")
    //   .subscribe((res) => {

    //   });

     if(this.baseSvc.showValidationMessage){
      this.citizenships.markAllAsTouched()
    }

     await this.baseSvc.getFormData(
    `LookUpServices/locations?LocationType=country`,
    (res) => {
      const list = res.data;
      const index = list.findIndex(c => c.name == "New Zealand");
      if (index > -1) list.unshift(list.splice(index, 1)[0]);
      
     
      this.countryList = res.data;
      return this.countryList;
    }
  );
    //console.log("baseFormData of Citizenship", this.baseFormData);
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
      // console.log("baseFormData of Citizenship", this.baseFormData);
      // if (
      //   this.baseFormData?.personalDetails?.countryOfCitizenship2 !== "" ||
      //   this.baseFormData?.countryOfCitizenship2 !== ""
      // ) {
      //   this.addOtherCitizenship();
      //   this.citizenships.at(1).patchValue({
      //     countryOfCitizenship:
      //       this.baseFormData?.countryOfCitizenship2 ||
      //       this.baseFormData?.personalDetails?.countryOfCitizenship2,
      //   });
      // }
      // if (
      //   this.baseFormData?.personalDetails?.countryOfCitizenship3 !== "" ||
      //   this.baseFormData?.countryOfCitizenship3 !== ""
      // ) {
      //   this.addOtherCitizenship();
      //   this.citizenships.at(2).patchValue({
      //     countryOfCitizenship:
      //       this.baseFormData.countryOfCitizenship3 ||
      //       this.baseFormData?.personalDetails?.countryOfCitizenship3,
      //   });
      // }
      const country2 =
        this.baseFormData?.personalDetails?.countryOfCitizenship2 ||
        this.baseFormData?.countryOfCitizenship2;

      if (country2 && country2.trim() !== "") {
        this.addOtherCitizenship();
        this.citizenships.at(1).patchValue({
          countryOfCitizenship: country2,
        });
      }

      const country3 =
        this.baseFormData?.personalDetails?.countryOfCitizenship3 ||
        this.baseFormData?.countryOfCitizenship3;

      if (country3 && country3.trim() !== "") {
        this.addOtherCitizenship();
        this.citizenships.at(2).patchValue({
          countryOfCitizenship: country3,
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
    
    
  }


isDisabled(): boolean {
  const baseFormDataStatus= this.baseFormData?.AFworkflowStatus; 
  const sessionStorageStatus= sessionStorage.getItem('workFlowStatus'); 
  return !(
    baseFormDataStatus=== 'Quote' ||
    sessionStorageStatus=== 'Open Quote'
  );
}




  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      let formStatus;
      if (this.citizenshipForm) {
        // formStatus = this.svc.proceedForm(this.citizenshipForm);
        // this.baseSvc?.formStatusArr?.push(formStatus);
      }
    }

    this.baseSvc.updateComponentStatus("Personal Details", "PersonalCitizenshipDetailComponent", this.citizenships.valid)

     if(this.baseSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.baseSvc.iconfirmCheckbox.next(invalidPages)
    }
    // this.checkStepValidity()
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
    const newControl = this.fb.group({
      countryOfCitizenship: ["", Validators.required],
    });
    
    this.citizenships.push(newControl);
    this.isCitizenshipAdded = this.citizenships.length === 3;

    
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
    // console.log("residence", this.citizenshipForm, residenece);
    this.baseSvc.setBaseDealerFormData({
      isNewZealandResident: residenece,
      countryOfBirth:
        this.citizenshipForm.value?.citizenships?.[0]?.countryOfBirth,
      countryOfCitizenship1:
        this.citizenshipForm.value?.citizenships?.[0]?.countryOfCitizenship ||
        "",
      countryOfCitizenship2:
        this.citizenshipForm.value?.citizenships?.[1]?.countryOfCitizenship ||
        "",
      countryOfCitizenship3:
        this.citizenshipForm.value?.citizenships?.[2]?.countryOfCitizenship ||
        "",
    });
    // console.
    // ( this.citizenships.value);

    this.isCitizenshipAdded = false;
  }
}
