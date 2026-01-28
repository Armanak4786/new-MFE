import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { BaseBusinessClass } from "../../../base-business.class";
import { ActivatedRoute } from "@angular/router";
import { BusinessService } from "../../../services/business";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonService, Mode } from "auro-ui";
import { Dropdown } from "primeng/dropdown";

@Component({
  selector: "app-business-contact-deatil",
  templateUrl: "./business-contact-deatil.component.html",
  styleUrl: "./business-contact-deatil.component.scss",
})
export class BusinessContactDeatilComponent extends BaseBusinessClass {
  @ViewChildren('valueInput') valueInputs: QueryList<ElementRef>;
  @ViewChild('dropdown') dropdown: Dropdown;
  
  countryCodeOptionsList = [];
  phoneForm: FormGroup;
  phoneType = ["PhoneBusiness", "PhoneMobile", "PhoneHome"];
  businessLabel = ["Business Number", "Mobile Number", "Other"];
  activeStep: any; 

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: BusinessService,
    private fb: FormBuilder
  ) {
    super(route, svc, baseSvc);
    
    this.phoneForm = this.fb.group({
      phone: this.fb.array([
        this.fb.group({
          value: ["", [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(1), Validators.maxLength(22)]],
          type: this.phoneType[0],
          areacode: ["", [Validators.pattern('^[0-9]{0,3}$'), Validators.maxLength(3)]],
          code: ["+64", [Validators.required, Validators.pattern(/^\+\d+$/)]],
        }),
      ]),
    });
  }

  override async ngOnInit(): Promise<void> {
    this.customForm = { form: this.phoneForm };
    await super.ngOnInit();
    this.activeStep = this.baseSvc.activeStep;
    let params: any = this.route.snapshot.params;
    this.mode = params.mode || Mode.create;

    this.svc.countryCodeOptions.subscribe((data) => {
      this.countryCodeOptionsList = data;
    });

    if (this.mode == "edit") {
      const phonesFromApi =
        this.baseFormData?.businessDetailPhone ||
        this.baseFormData?.business?.phone;
      
      this.phone.clear();
      
      if (Array.isArray(phonesFromApi) && phonesFromApi.length) {
        phonesFromApi.forEach((ele) => {
          if (ele?.value?.trim()) {
            this.phone.push(this.createPhoneForm("+64"));
          }
        });
        this.patchPhoneValue();
      } else {
        this.phone.push(this.createPhoneForm("+64"));
      }
    } else {
      if (this.baseFormData?.businessDetailPhone != undefined) {
        for (
          let i = this.phone?.length;
          i != this.baseFormData?.businessDetailPhone?.length;
          i++
        ) {
          this.phone.push(this.createPhoneForm("+64"));
        }
        this.patchPhoneValue();
      }
    }

    if (this.baseSvc.showValidationMessage) {
      this.phone.markAllAsTouched();
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

  onCountryCodeChange(event: any, index: number) {
    const phoneArray = this.phone as FormArray;
    const phoneControl = phoneArray.at(index);
    const countryCode = event.value;

    // // Enable/disable area code based on country code
    // if (countryCode === '+91') {
    //   phoneControl.get('areacode')?.disable();
    //   phoneControl.get('areacode')?.setValue('');
    // } else {
    //   phoneControl.get('areacode')?.enable();
    // }

    const requiredValidators = index === 0 ? [Validators.required] : [];

    // Unified validators for all countries
    phoneControl.get('areacode')?.setValidators([
      Validators.pattern('^[0-9]{0,3}$'),
      Validators.maxLength(3)
    ]);
    
    phoneControl.get('value')?.setValidators([
      ...requiredValidators,
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(1),
      Validators.maxLength(22)
    ]);

    // Update validators
    phoneControl.get('areacode')?.updateValueAndValidity();
    phoneControl.get('value')?.updateValueAndValidity();
    this.getvalue();
  }

  override clearSearchFilter(dropdown: Dropdown) {
    dropdown.filterValue = '';
    dropdown.overlayVisible = true;
  }

  patchPhoneValue() {
    let phoneData: any;
    
    phoneData = this.baseFormData?.businessDetailPhone || this.baseFormData?.business?.phone;

    if (phoneData && Array.isArray(phoneData)) {
      const phoneArray = this.phone as FormArray;

      // Clear existing controls
      while (phoneArray.length > 0) {
        phoneArray.removeAt(0);
      }

      // Sort phone data by type order
      const phoneTypeOrder = {
        'PhoneBusiness': 0,
        'PhoneMobile': 1,
        'PhoneHome': 2
      };

      const sortedPhoneData = [...phoneData].sort((a, b) => {
        const aIndex = phoneTypeOrder[a.type] ?? 3;
        const bIndex = phoneTypeOrder[b.type] ?? 3;
        return aIndex - bIndex;
      });

      sortedPhoneData.forEach((phone, index) => {
        if (phone?.value) {
          const phoneValue = phone.value;
          let code = '+64';

          const codeMatch = phoneValue.match(/^([^\(]+)/);
          if (codeMatch) {
            code = `${codeMatch[1]}`;
          }

          const numberPart = phoneValue.replace(/^\+?\d+/, '');
          let areacode = '';
          let value = numberPart;

          const areacodeMatch = numberPart.match(/\((\d+)\)/);
          if (areacodeMatch) {
            areacode = areacodeMatch[1];
            value = numberPart.replace(/\((\d+)\)/, '');
          }

          value = value.replace(/\D/g, '');

          const newPhoneControl = this.createPhoneForm(code);
          phoneArray.push(newPhoneControl);
          newPhoneControl.patchValue({
            value: value,
            type: phone.type || this.phoneType[index] || this.phoneType[0],
            areacode: areacode,
            code: code
          });

          this.onCountryCodeChange({ value: code }, index);
        }
      });

      if (phoneArray.length === 0) {
        phoneArray.push(this.createPhoneForm('+64'));
      }
    } else {
      this.phone.push(this.createPhoneForm('+64'));
    }
  }

  getvalue() {
    const formattedPhones = this.phoneForm.value.phone.map((phone) => {
      return {
        value: `${phone.code}(${phone.areacode || ''})${phone.value}`,
        type: phone.type,
        areacode: phone.areacode || '',
        code: phone.code,
      };
    });
    
    this.baseSvc.setBaseDealerFormData({
      businessDetailPhone: formattedPhones,
    });
  }

  createPhoneForm(code: string = "+64") {
    const isFirstPhone = this.phone.length === 0;
    
    return this.fb.group({
      value: [
        "", 
        isFirstPhone 
          ? [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(1), Validators.maxLength(22)]
          : [Validators.pattern('^[0-9]+$'), Validators.maxLength(22)]
      ],
      type: this.phoneType[this.phone.length] || this.phoneType[0],
      areacode: ["", [Validators.pattern('^[0-9]{0,3}$'), Validators.maxLength(3)]],
      code: [
        code,
        isFirstPhone 
          ? [Validators.required, Validators.pattern(/^\+\d+$/)]
          : [Validators.pattern(/^\+\d+$/)]
      ],
    });
  }

  getPhoneErrorMessage(index: number, field: string): string {
    const phoneControl = (this.phoneForm.get('phone') as FormArray).at(index);
    const control = phoneControl.get(field);

    if (control?.hasError('required')) {
      if (field === 'areacode') return 'Area code is required';
      if (field === 'value') return 'Mobile Number is required';
      if (field === 'code') return 'Country code is required';
    }

    if (control?.hasError('minlength') || control?.hasError('maxlength')) {
      if (field === 'value') return 'Phone number must be between 1 and 22 digits';
      if (field === 'areacode') return 'Area code must be 0-3 digits';
      return 'Invalid length';
    }

    if (control?.hasError('pattern')) {
      if (field === 'code') return 'Please enter a valid country code (e.g., +64)';
      if (field === 'areacode') return 'Only numbers are allowed (0-3 digits)';
      if (field === 'value') return 'Only numbers are allowed';
    }

    return '';
  }

  get phone(): FormArray {
    return this.phoneForm.get("phone") as FormArray;
  }

  createNewPhoneForm(code: string = "+64") {
    const phoneType = this.phoneType[this.phone.length] || this.phoneType[0];

    return this.fb.group({
      value: ["", [Validators.pattern('^[0-9]+$'), Validators.maxLength(22)]],
      type: [phoneType],
      areacode: ["", [Validators.pattern('^[0-9]{0,3}$'), Validators.maxLength(3)]],
      code: [code, [Validators.pattern(/^\+\d+$/)]],
    });
  }

  addOtherPhone() {
    if (this.phone.length < 3) {
      const newPhone = this.createNewPhoneForm("+64");
      newPhone.get('type').setValue(this.phoneType[this.phone.length]);
      this.phone.push(newPhone);
    }
  }

  onAreaCodeInputChange(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 3) {
      const phoneControl = (this.phoneForm.get('phone') as FormArray).at(index);
      
      const areaCode = value.substring(0, 3);
      const extraChars = value.substring(3);
      
      phoneControl.get('areacode')?.setValue(areaCode, { emitEvent: false });
      
      const currentLocalValue = phoneControl.get('value')?.value || '';
      
      phoneControl.get('value')?.setValue(currentLocalValue + extraChars, { emitEvent: false });
      
      phoneControl.get('value')?.updateValueAndValidity();
      
      
        const valueInputArray = this.valueInputs?.toArray() || [];
        
        if (valueInputArray[index]) {
          input.blur();
          
         
            valueInputArray[index].nativeElement.focus();
            const cursorPos = (currentLocalValue + extraChars).length;
            valueInputArray[index].nativeElement.setSelectionRange(cursorPos, cursorPos);
          
        }
      
      
    } else {
      const phoneControl = (this.phoneForm.get('phone') as FormArray).at(index);
      phoneControl.get('areacode')?.setValue(value, { emitEvent: false });
    }
    
    this.getvalue();
  }

  removePhone(index: number) {
    this.phone.removeAt(index);

    // Reassign types to maintain correct order
    this.phone.controls.forEach((control, i) => {
      control.get('type').setValue(this.phoneType[i]);
    });

    const formattedPhones = this.phoneForm?.value?.phone?.map((phone, i) => {
      return {
        value: `${phone.code}(${phone.areacode || ''})${phone.value}`,
        type: this.phoneType[i],
        areacode: phone.areacode || '',
        code: phone.code,
      };
    });

    this.baseSvc.setBaseDealerFormData({
      businessDetailPhone: formattedPhones,
    });
  }

  getPhoneLabel(type: string): string {
    const typeMap = {
      'PhoneBusiness': 'Business',
      'PhoneMobile': 'Mobile Number',
      'PhoneHome': 'Home'
    };
    return typeMap[type] || 'Phone';
  }

  override onStepChange(stepperDetails: any): void {
    if (stepperDetails?.validate) {
      // Validation logic if needed
    }
    super.onStepChange(stepperDetails);
    
    this.baseSvc.updateComponentStatus(
      "Business Details",
      "BusinessContactDeatilComponent",
      this.phone.valid
    );
    
    if (this.baseSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.baseSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
}
