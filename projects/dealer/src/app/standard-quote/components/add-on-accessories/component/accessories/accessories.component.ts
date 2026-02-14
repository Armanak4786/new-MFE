import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { BaseFormClass, CommonService, GenericFormConfig } from "auro-ui";
import { BaseStandardQuoteClass } from "../../../../base-standard-quote.class";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../../../services/standard-quote.service";
import { ToasterService, ValidationService } from "auro-ui";
import { cloneDeep } from "lodash";
import { Subject, takeUntil } from "rxjs";
import configure from "src/assets/configure.json";
import { isWorkflowStatusInViewOrEdit } from "../../../../utils/workflow-status.utils";

@Component({
  selector: "app-accessories",
  templateUrl: "./accessories.component.html",
  styleUrl: "./accessories.component.scss",
})
export class AccessoriesComponent extends BaseStandardQuoteClass {
  accessoriesForm: FormGroup;
  accessories: FormArray;
   remainingAccessories: any[] = [];
    private accessoriesLoaded: boolean = false;
  noAccessories = false;
   override destroy$ = new Subject<void>(); // ADD THIS
  private isResetting: boolean = false; 
  showDescHeader : boolean = false
  @ViewChild("hello") hello: ElementRef;

// accessoriesData: [
// 				{
// 					"id": 78,
// 					"customflowID": 41185,
// 					"name": "High Roof",
// 					"amount": -8,
// 					"changeAction": null
// 				},
// 				{
// 					"id": 55,
// 					"customflowID": 41190,
// 					"name": "Parking Sensors",
// 					"amount": -3,
// 					"changeAction": null
// 				},
// 				{
// 					"id": 48,
// 					"customflowID": 41193,
// 					"name": "Side Steps",
// 					"amount": -4,
// 					"changeAction": null
// 				},
// 				{
// 					"id": 50,
// 					"customflowID": 41195,
// 					"name": "Tonneau Hard",
// 					"amount": -6,
// 					"changeAction": null
// 				},
// 				{
// 					"id": 43,
// 					"customflowID": 41377,
// 					"name": "Canopy",
// 					"amount": -1,
// 					"changeAction": null
// 				}
// 			]
defaultAccessories:any[]=[]
otherAccessories: any[] =[];
finalAccessories :any[]=[]
 other:   {
    code: "other",
    customFlowName: "Other",
    description: "Other",
    isDefault: true,
    type: "None",
    valueId: 0,
    valueText: "Other",
  };
  defaultLength:any=0;
showError :boolean= false;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    private fb: FormBuilder,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);

    // this.accessoriesForm = this.fb.group({
    //   accessories: this.fb.array([
    //     this.fb.group({
    //       customflowID: 0,
    //       name: [""],
    //       amount: [0, [Validators.pattern("^[0-9]{1,7}(\\.[0-9]{1,2})?$")]],
    //       reference: "Accessories",
    //     }),
    //   ]),
    // });
      this.accessoriesForm = this.fb.group({
      accessories: this.fb.array([])
    });
    this.accessories = this.accessoriesForm.get('accessories') as FormArray;
  }

  sum = 0;
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
     await super.ngOnInit();
 

    await this.callApi()
    this.calculationTotal();
     this.baseSvc.onProductProgramChange?.pipe(takeUntil(this.destroy$)).subscribe((resetData) => {
    
    this.forceResetAccessoriesForm(resetData);
  });

  this.baseSvc
    .getBaseDealerFormData()
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
     
      
      if (this.baseSvc.shouldResetAccessories) {
        
        this.forceResetAccessoriesForm();
        this.baseSvc.shouldResetAccessories = false;
        return;
      }
      
      if (!this.isResetting) {
        
        this.baseFormData = res;
      }
    });
    this.accessoriesForm.valueChanges.subscribe((changes) => {
      this.sum = changes.accessories.reduce(
        (accumulator: number, acc: { amount: number }) => {
          return accumulator + acc.amount;
        },
        0
      );
      this.baseSvc.addsOnAccessoriesData({
        ...changes,
        subTotalServicePlanValue: this.sum,
      });
    });

    if (this.baseFormData) {
      // this.disableControl();
      this.mapData();
    }

    this.baseSvc.accessoriesFormData.subscribe((data) => {
      if (data) {
        Object.values(this.accessoriesForm.controls).forEach((control: any) => {
          control.markAsTouched();
        });
        this.baseSvc.formStatusArr.push(this.accessoriesForm.status);
      }
    });
  }

  isDisabled(){
     return isWorkflowStatusInViewOrEdit(this.baseFormData?.AFworkflowStatus);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.mainForm.formViewMode) {
      this.accessoriesForm.disable();
    }
  }

private forceResetAccessoriesForm(resetData?: any): void {
  console.log('=== ACCESSORIES RESET STARTED ===');
  console.log('Accessories loaded:', this.accessoriesLoaded);
  console.log('Accessories count:', this.accessories.length);
  
  
  if (!this.accessoriesLoaded || this.accessories.length === 0) {
    console.log('Accessories not loaded yet, waiting...');
    
    
    setTimeout(() => {
      console.log('Retrying reset after 1000ms...');
      console.log('Accessories count after wait:', this.accessories.length);
      this.forceResetAccessoriesForm(resetData);
    }, 1000);
    return;
  }
  
  this.isResetting = true;
  console.log('Resetting', this.accessories.length, 'accessories');
  
  
  this.accessories.controls.forEach((control, index) => {
    console.log(`Resetting accessory ${index}:`, control.get('name')?.value);
    control.get('amount')?.setValue(0);
    control.get('description')?.setValue("");
    control.get('changeAction')?.setValue("");
  });

  this.sum = 0;
  this.showDescHeader = false;

  if (this.baseFormData) {
    this.baseFormData.accessories = null;
  }

  this.cdr.detectChanges();
  
  
  setTimeout(() => {
    this.isResetting = false;
    
   
  }, 500);
  
  
}





  async callApi() {
  if(this.baseFormData.physicalAsset || this.baseFormData?.productCode === 'AFV') {
    const assetTypeId = this.baseFormData?.productCode === 'AFV' 
      ? this.baseFormData?.assetTypeId 
      : this.baseFormData?.physicalAsset[0]?.assetType?.assetTypeId;
    const savedAccessories = this.baseFormData?.accessories ?? [];
    
    let res = await this.baseSvc.getFormData(
      `AssetType/get_defaultAccessories?parameterValue=${assetTypeId}`
    );
    
    if (res?.data?.defaultAccessories) {
      const apiResponse = res?.data?.defaultAccessories;
      
      const other = {
        code: "other",
        customFlowName: "Other",
        description: "Other",
        isDefault: true,
        type: "None",
        valueId: 0,
        valueText: "Other",
      };
      if(savedAccessories.length > 0) {
        this.finalAccessories = apiResponse.map(apiAcc => {
          const saved = savedAccessories.find(s => s.name === apiAcc.valueText);
          return saved 
            ? { ...apiAcc, ...saved, type: apiAcc.type, valueText: apiAcc.valueText, customflowID: apiAcc.customFlowID ?? saved.customflowID }
            : apiAcc;
        });
      } else {
        this.finalAccessories = apiResponse;
      }
      
      if(apiResponse.length == 10) {
        const typeOneAccessories = this.finalAccessories.filter(acc => acc.type.includes("Type1"));
        this.defaultAccessories = typeOneAccessories.slice(0, 9).map(acc => ({
          ...acc,
          isDefault: true
        }));
        this.defaultLength = this.defaultAccessories.length;

        this.otherAccessories = [
          ...typeOneAccessories.slice(9),
          ...apiResponse.filter(acc => !acc.type.endsWith("Type1")),
        ].map(acc => ({
          ...acc,
          isDefault: false
        }));
      } else {
        const getTypeNumber = (type: string) => {
          const match = type?.match(/Type(\d+)/);
          return match ? parseInt(match[1], 10) : Infinity;
        };

        let picked: any[] = [];
        let remaining: any[] = [];

        const grouped = this.finalAccessories.reduce((acc, item) => {
          const num = getTypeNumber(item.type);
          if (!acc[num]) acc[num] = [];
          acc[num].push(item);
          return acc;
        }, {} as { [key: number]: any[] });

        const typeNumbers = Object.keys(grouped).map(Number).sort((a, b) => a - b);

        for (const num of typeNumbers) {
          for (const item of grouped[num]) {
            if (picked.length < 9) {
              picked.push({ ...item, isDefault: true });
            } else {
              remaining.push(item);
            }
          }
        }

        this.defaultAccessories = picked;
        this.defaultLength = this.defaultAccessories.length;
        this.otherAccessories = this.finalAccessories
          .filter(acc => !this.defaultAccessories.some(def => def.valueText === acc.valueText))
          .map(acc => ({
            ...acc,
            isDefault: false
          }));
      }

      this.accessoriesLoaded = true;
      this.populateDefaultAccessories(this.defaultAccessories);

    } else {
      this.showError = true;
    }
  } else {
    this.showError = true;
  }
}


populateDefaultAccessories(accessories: any[]) {
    this.accessories.clear();

    if (!accessories?.length) {
      this.noAccessories = true;
       this.accessoriesLoaded = true;
      return;
    }

    this.noAccessories = false;

    if (accessories.length === 1 && accessories[0].valueText.toLowerCase() === 'other') {
      this.accessories.push(
        this.fb.group({
          id : [0],
          customflowID: [0],
          name: 'Other',
          description: [''],
          amount: ['', Validators.required],
          reference: 'Accessories',
          isDefault: false,
          changeAction:""

          
        })
      );
      return;
    }

    accessories.slice(0, 9).forEach(acc => {
      this.accessories.push(
        this.fb.group({
            id : [0],
          customflowID: [0],
          name: acc.valueText || acc.customFlowName,
          amount: [0, Validators.pattern('^[0-9]{1,7}(\\.[0-9]{1,2})?$')],
          reference: 'Accessories',
          isDefault: true,
           description: [''],
          changeAction:""
        })
      );
    });

    this.remainingAccessories = accessories.slice(9);
  }

addAccessory() {
  const activeCount = this.accessories.controls.filter(
    acc => acc.get('changeAction')?.value !== 'delete'
  ).length;
    if (activeCount >= 20) {
    return;
  }


  // const nextAcc = this.otherAccessories?.shift();
  // console.log(nextAcc)
  // if (nextAcc) {
    this.accessories.push(
      this.fb.group({
        id: [0],
        customflowID: 0,
        name: "other",
        amount: [0, Validators.pattern("^[0-9]{1,7}(\\.[0-9]{1,2})?$")],
        reference: "Accessories",
        isDefault: false,
         description: [],
         changeAction:""
      })
    );
  // }
}



  calculationTotal() {
    // throw new Error('Method not implemented.');
    let feeData = this.accessoriesForm.value;

    this.sum = feeData.accessories.reduce(
      (accumulator: number, acc: { amount: number }) => {
        return accumulator + acc.amount;
      },
      0
    );
    this.baseSvc.addsOnAccessoriesData({
      ...feeData,
      subTotalServicePlanValue: this.sum,
    });
  }

  disableControl() {}

  // mapData() {
  //   // this.accessories?.clear();
  //   let data = cloneDeep(this.baseFormData?.accessories);
  //   console.log("data",data)
  //   // let data = this.baseFormData?.accessories;
  //   let stereoObj = data?.findIndex((ele) => {
  //     return ele.name == "Stereo";
  //   });
  //   if (stereoObj >= 0) {
  //     this.accessories.controls[0].patchValue({
  //       id : data[stereoObj]?.id,
  //       customflowID: data[stereoObj]?.customflowID,
  //       name: data[stereoObj].name,
  //       amount: data[stereoObj].amount,
  //       reference: "Accessories",
  //     });
  //     data.splice(stereoObj, 1);
  //     data.unshift(stereoObj);
  //   } else {
  //    // data.unshift({ name: "Stereo" });
  //   }
  //   console.log("accessories",this.accessories)

  //   data?.forEach((ele, index) => {
  //     if (index != 0) {
  //       // if (!this.accessories.controls[index + 1]) {
  //       //   this.accessories.push(this.createAccessoriesForm());
  //       // }
  //           console.log("accessories",this.accessories.controls)
  //          console.log("accessories",this.accessories.controls[index])
  //       this.accessories.controls[index + 1].patchValue({
  //         id : ele?.id || 0,
  //         customflowID: ele?.customflowID || 0,
  //         name: ele.name,
  //         amount: ele.amount,
  //         reference: "Accessories",
  //       });
  //     }

  //   });
  //   console.log("accessoriesForm",this.accessoriesForm)
  // }



//   mapData() {
//   const data = cloneDeep(this.baseFormData?.accessories);
//   if (!data?.length) return;
//     console.log(this.defaultAccessories)
//     console.log("data",data)
// // // if (data.length < 9) {
// //     const savedNames = data.map(acc => acc.name?.toLowerCase());

// //     const missingDefaults = this.defaultAccessories.filter(
// //       acc => !savedNames.includes(acc.valueText?.toLowerCase())
// //     );

// //     const toAddCount = 9 - data.length;
// //      console.log(missingDefaults)
// //     const defaultsToAdd = missingDefaults.slice(0, toAddCount).map(acc => ({
// //       id: 0,
// //       customflowID: acc.customflowID,
// //       name: acc.valueText || acc.customFlowName || '',
// //       amount: 0,
// //       reference: 'Accessories',
// //       isDefault: true,
// //       description: '',
// //       changeAction:''
// //     }));

// //     // Missing defaults add karo saved data mein
// //     data.push(...defaultsToAdd);
// // //  }

//   console.log(data)

//   this.accessories.clear(); // Start fresh

//   data.forEach((acc: any) => {
//     const accGroup = this.fb.group({
//       id: [acc.id || 0],
//       customflowID: [acc.customflowID || 0],
//       name: [acc.name || ''],
//       amount: [ Math.abs(acc.amount) || 0, Validators.pattern('^[0-9]{1,7}(\\.[0-9]{1,2})?$')],
//       reference: 'Accessories',
//       isDefault: [acc?.isDefault ?? true],
//       description: [acc.description || ''],
//       changeAction:acc?.changeAction
//     });

//     this.accessories.push(accGroup);
//   });

//   // Optional: update total after mapping
//   this.calculationTotal();
// }
mapData() {
  if (this.isResetting) {
    
    return;
  }
  const data = cloneDeep(this.baseFormData?.accessories);
  if (!data?.length) return;
  this.accessories.clear(); 
  const defaultNames = this.defaultAccessories.map(acc => acc.valueText?.toLowerCase());

  const defaults = data.filter(acc =>
    defaultNames.includes(acc.name?.toLowerCase())
  );
  const others = data.filter(
    acc => !defaultNames.includes(acc.name?.toLowerCase())
  );

  const orderedDefaults = this.defaultAccessories.map(def => {
    const match = defaults.find(d => d.name?.toLowerCase() === def.valueText?.toLowerCase());
    return match || {
      id: 0,
      customflowID: def.customflowID,
      name: def.valueText || def.customFlowName || "",
      amount: 0,
      reference: "Accessories",
      isDefault: true,
      description: "",
      changeAction: ""
    };
  });

  const finalData = [...orderedDefaults, ...others];

  finalData.forEach(acc => {
    const accGroup = this.fb.group({
      id: [acc.id || 0],
      customflowID: [acc.customflowID || 0],
      name: [acc.name || ""],
      amount: [
        Math.abs(acc.amount) || 0,
        Validators.pattern("^[0-9]{1,7}(\\.[0-9]{1,2})?$")
      ],
      reference: "Accessories",
      isDefault: [acc?.isDefault ?? true],
      description: [acc.description || ""],
      changeAction: acc?.changeAction
    });

    this.accessories.push(accGroup);
  });


  this.calculationTotal();
}
override ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
  super.ngOnDestroy();
}

  createAccessoriesForm(): FormGroup {
        // this.defaultLength += this.defaultLength

    return this.fb.group({
      id:[0],
      customflowID: [0],
      name: [""],
      amount: [0, Validators.pattern("^[0-9]{1,7}(\\.[0-9]{1,2})?$")],
      reference: "Accessories",
       description: [''],
       changeAction:""
    });
  }

  removeAccessories(index) {
   const acc = this.accessories.at(index);

  if (acc.get('isDefault')?.value) {
    acc.patchValue({ changeAction: 'delete' });
  } else {
    this.accessories.removeAt(index);
  }
}

  // get accessories(): FormArray {
  //   return this.accessoriesForm.get("accessories") as FormArray;
  // }

  addOtherAccessories() {
    // this.accessories.push(this.createAccessoriesForm());
      this.addAccessory();

  }
  get visibleAccessories() {
  return this.accessories.controls.filter(
    (acc) => acc.get('changeAction')?.value !== 'delete'
  );
}

  pageCode: string = "AddOnAccessoriesComponent";
  modelName: string = "AccessoriesComponent";

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

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.cdr.detectChanges();
    }
  }

  // override async onStepChange(quotesDetails: any): Promise<void> {
  //   if (quotesDetails.type !== "tabNav") {
  //     var result: any = await this.updateValidation("onSubmit");
  //     if (!result?.status) {
  //       // this.toasterSvc.showToaster({
  //       //   severity: "error",
  //       //   detail: "I7",
  //       // });
  //     }
  //   }
  // }

  onAccessoryChange(event: any, index: number) {
    const selectedValue = event.value; // dropdown ka value
    // if(selectedValue === 'Other'){
    //   this.showDescHeader = true
    // }else{
    //   this.showDescHeader = false

    // }
        const accGroup = this.accessories.at(index) as FormGroup;
          const descControl = accGroup.get('description');

          if (selectedValue === 'Other') {
            descControl?.setValidators([Validators.required]);
          } else {
            descControl?.clearValidators();
            descControl?.setValue('');
          }

          descControl?.updateValueAndValidity();  
        }

    getSelectedTooltip(index: number): string {
      const control = this.accessories?.at(index)?.get('name');
      const value = control?.value;

      const selected = this.otherAccessories.find(opt => opt.valueText === value);

      return selected?.description || selected?.valueText || 'Select Accessory';
    }

}
