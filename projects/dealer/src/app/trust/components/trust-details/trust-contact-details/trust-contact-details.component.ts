import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { BaseTrustClass } from "../../../base-trust.class";
import { CommonService, GenericFormConfig } from "auro-ui";
import { TrustService } from "../../../services/trust.service";
import { ActivatedRoute } from "@angular/router";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Dropdown } from "primeng/dropdown";

@Component({
  selector: "app-trust-contact-details",

  templateUrl: "./trust-contact-details.component.html",
  styleUrl: "./trust-contact-details.component.scss",
})
export class TrustContactDetailsComponent extends BaseTrustClass {
  @ViewChildren('valueInput') valueInputs: QueryList<ElementRef>;
  countryCodeOptionsList = [];
  phoneForm: FormGroup;

  // phoneType = ["PhoneMobile", "PhoneBusiness"];
  phoneType = ["PhoneBusiness", "PhoneHome", "PhoneMobile"];
  businessLabel = ["Business Number", "Mobile Number", "Other"];

  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "",
    goBackRoute: "",
    cardType: "border",
    //cardBgColor: "--background-color-secondary",
    fields: [
      {
        type: "array",
        name: "trustDetailsPhone",
        cols: 12,
        isTemplateFormData: false,
        isDelete: false,
        isAdd: false,
        fields: [
          {
            type: "select",
            name: "code",
            label: "Business",
            cols: 4,
            options: [
              { label: "+1", value: "+1" },
              { label: "+7", value: "+7" },
              { label: "+20", value: "+20" },
              { label: "+27", value: "+27" },
              { label: "+30", value: "+30" },
              { label: "+31", value: "+31" },
              { label: "+32", value: "+32" },
              { label: "+33", value: "+33" },
              { label: "+34", value: "+34" },
              { label: "+36", value: "+36" },
              { label: "+39", value: "+39" },
              { label: "+40", value: "+40" },
              { label: "+41", value: "+41" },
              { label: "+43", value: "+43" },
              { label: "+44", value: "+44" },
              { label: "+45", value: "+45" },
              { label: "+46", value: "+46" },
              { label: "+47", value: "+47" },
              { label: "+48", value: "+48" },
              { label: "+49", value: "+49" },
              { label: "+51", value: "+51" },
              { label: "+52", value: "+52" },
              { label: "+53", value: "+53" },
              { label: "+54", value: "+54" },
              { label: "+55", value: "+55" },
              { label: "+56", value: "+56" },
              { label: "+57", value: "+57" },
              { label: "+58", value: "+58" },
              { label: "+60", value: "+60" },
              { label: "+61", value: "+61" },
              { label: "+62", value: "+62" },
              { label: "+63", value: "+63" },
              { label: "+64", value: "+64" },
              { label: "+65", value: "+65" },
              { label: "+66", value: "+66" },
              { label: "+81", value: "+81" },
              { label: "+82", value: "+82" },
              { label: "+84", value: "+84" },
              { label: "+86", value: "+86" },
              { label: "+90", value: "+90" },
              { label: "+91", value: "+91" },
              { label: "+92", value: "+92" },
              { label: "+93", value: "+93" },
              { label: "+94", value: "+94" },
              { label: "+95", value: "+95" },
              { label: "+98", value: "+98" },
              { label: "+211", value: "+211" },
              { label: "+212", value: "+212" },
              { label: "+213", value: "+213" },
              { label: "+216", value: "+216" },
              { label: "+218", value: "+218" },
              { label: "+220", value: "+220" },
              { label: "+221", value: "+221" },
              { label: "+222", value: "+222" },
              { label: "+223", value: "+223" },
              { label: "+224", value: "+224" },
              { label: "+225", value: "+225" },
              { label: "+226", value: "+226" },
              { label: "+227", value: "+227" },
              { label: "+228", value: "+228" },
              { label: "+229", value: "+229" },
              { label: "+230", value: "+230" },
              { label: "+231", value: "+231" },
              { label: "+232", value: "+232" },
              { label: "+233", value: "+233" },
              { label: "+234", value: "+234" },
              { label: "+235", value: "+235" },
              { label: "+236", value: "+236" },
              { label: "+237", value: "+237" },
              { label: "+238", value: "+238" },
              { label: "+239", value: "+239" },
              { label: "+240", value: "+240" },
              { label: "+241", value: "+241" },
              { label: "+242", value: "+242" },
              { label: "+243", value: "+243" },
              { label: "+244", value: "+244" },
              { label: "+245", value: "+245" },
              { label: "+246", value: "+246" },
              { label: "+247", value: "+247" },
              { label: "+248", value: "+248" },
              { label: "+249", value: "+249" },
              { label: "+250", value: "+250" },
              { label: "+251", value: "+251" },
              { label: "+252", value: "+252" },
              { label: "+253", value: "+253" },
              { label: "+254", value: "+254" },
              { label: "+255", value: "+255" },
              { label: "+256", value: "+256" },
              { label: "+257", value: "+257" },
              { label: "+258", value: "+258" },
              { label: "+260", value: "+260" },
              { label: "+261", value: "+261" },
              { label: "+262", value: "+262" },
              { label: "+263", value: "+263" },
              { label: "+264", value: "+264" },
              { label: "+265", value: "+265" },
              { label: "+266", value: "+266" },
              { label: "+267", value: "+267" },
              { label: "+268", value: "+268" },
              { label: "+269", value: "+269" },
              { label: "+290", value: "+290" },
              { label: "+291", value: "+291" },
              { label: "+297", value: "+297" },
              { label: "+298", value: "+298" },
              { label: "+299", value: "+299" },
              { label: "+350", value: "+350" },
              { label: "+351", value: "+351" },
              { label: "+352", value: "+352" },
              { label: "+353", value: "+353" },
              { label: "+354", value: "+354" },
              { label: "+355", value: "+355" },
              { label: "+356", value: "+356" },
              { label: "+357", value: "+357" },
              { label: "+358", value: "+358" },
              { label: "+359", value: "+359" },
              { label: "+370", value: "+370" },
              { label: "+371", value: "+371" },
              { label: "+372", value: "+372" },
              { label: "+373", value: "+373" },
              { label: "+374", value: "+374" },
              { label: "+375", value: "+375" },
              { label: "+376", value: "+376" },
              { label: "+377", value: "+377" },
              { label: "+378", value: "+378" },
              { label: "+379", value: "+379" },
              { label: "+380", value: "+380" },
              { label: "+381", value: "+381" },
              { label: "+382", value: "+382" },
              { label: "+383", value: "+383" },
              { label: "+385", value: "+385" },
              { label: "+386", value: "+386" },
              { label: "+387", value: "+387" },
              { label: "+389", value: "+389" },
              { label: "+420", value: "+420" },
              { label: "+421", value: "+421" },
              { label: "+423", value: "+423" },
              { label: "+500", value: "+500" },
              { label: "+501", value: "+501" },
              { label: "+502", value: "+502" },
              { label: "+503", value: "+503" },
              { label: "+504", value: "+504" },
              { label: "+505", value: "+505" },
              { label: "+506", value: "+506" },
              { label: "+507", value: "+507" },
              { label: "+508", value: "+508" },
              { label: "+509", value: "+509" },
              { label: "+590", value: "+590" },
              { label: "+591", value: "+591" },
              { label: "+592", value: "+592" },
              { label: "+593", value: "+593" },
              { label: "+594", value: "+594" },
              { label: "+595", value: "+595" },
              { label: "+596", value: "+596" },
              { label: "+597", value: "+597" },
              { label: "+598", value: "+598" },
              { label: "+599", value: "+599" },
              { label: "+670", value: "+670" },
              { label: "+672", value: "+672" },
              { label: "+673", value: "+673" },
              { label: "+674", value: "+674" },
              { label: "+675", value: "+675" },
              { label: "+676", value: "+676" },
              { label: "+677", value: "+677" },
              { label: "+678", value: "+678" },
              { label: "+679", value: "+679" },
              { label: "+680", value: "+680" },
              { label: "+681", value: "+681" },
              { label: "+682", value: "+682" },
              { label: "+683", value: "+683" },
              { label: "+684", value: "+684" },
              { label: "+685", value: "+685" },
              { label: "+686", value: "+686" },
              { label: "+687", value: "+687" },
              { label: "+688", value: "+688" },
              { label: "+689", value: "+689" },
              { label: "+690", value: "+690" },
              { label: "+691", value: "+691" },
              { label: "+692", value: "+692" },
              { label: "+850", value: "+850" },
              { label: "+852", value: "+852" },
              { label: "+853", value: "+853" },
              { label: "+855", value: "+855" },
              { label: "+856", value: "+856" },
              { label: "+870", value: "+870" },
              { label: "+880", value: "+880" },
              { label: "+886", value: "+886" },
              { label: "+960", value: "+960" },
              { label: "+961", value: "+961" },
              { label: "+962", value: "+962" },
              { label: "+963", value: "+963" },
              { label: "+964", value: "+964" },
              { label: "+965", value: "+965" },
              { label: "+966", value: "+966" },
              { label: "+967", value: "+967" },
              { label: "+968", value: "+968" },
              { label: "+970", value: "+970" },
              { label: "+971", value: "+971" },
              { label: "+972", value: "+972" },
              { label: "+973", value: "+973" },
              { label: "+974", value: "+974" },
              { label: "+975", value: "+975" },
              { label: "+976", value: "+976" },
              { label: "+977", value: "+977" },
              { label: "+992", value: "+992" },
              { label: "+993", value: "+993" },
              { label: "+994", value: "+994" },
              { label: "+995", value: "+995" },
              { label: "+996", value: "+996" },
              { label: "+998", value: "+998" },
            ],
          },
          {
            type: "phone",
            name: "areaNum",
            cols: 2,
            disabled: true,
            nextLine: false,
          },
          {
            type: "phone",
            name: "mobileNoText",
            cols: 4,
          },
          {
            type: "deleteBtn",
            btnType: "non-bg-btn",
            submitType: "internal",
            name: "deleteBtn",
            icon: "fa-regular fa-trash-can text-base",
            cols: 1,
            nextLine: true,
          },
        ],
        templateFormFields: [
          {
            type: "select",
            label: "Business",
            name: "code",
            cols: 4,
            options: [
              { label: "+1", value: "+1" },
              { label: "+7", value: "+7" },
              { label: "+20", value: "+20" },
              { label: "+27", value: "+27" },
              { label: "+30", value: "+30" },
              { label: "+31", value: "+31" },
              { label: "+32", value: "+32" },
              { label: "+33", value: "+33" },
              { label: "+34", value: "+34" },
              { label: "+36", value: "+36" },
              { label: "+39", value: "+39" },
              { label: "+40", value: "+40" },
              { label: "+41", value: "+41" },
              { label: "+43", value: "+43" },
              { label: "+44", value: "+44" },
              { label: "+45", value: "+45" },
              { label: "+46", value: "+46" },
              { label: "+47", value: "+47" },
              { label: "+48", value: "+48" },
              { label: "+49", value: "+49" },
              { label: "+51", value: "+51" },
              { label: "+52", value: "+52" },
              { label: "+53", value: "+53" },
              { label: "+54", value: "+54" },
              { label: "+55", value: "+55" },
              { label: "+56", value: "+56" },
              { label: "+57", value: "+57" },
              { label: "+58", value: "+58" },
              { label: "+60", value: "+60" },
              { label: "+61", value: "+61" },
              { label: "+62", value: "+62" },
              { label: "+63", value: "+63" },
              { label: "+64", value: "+64" },
              { label: "+65", value: "+65" },
              { label: "+66", value: "+66" },
              { label: "+81", value: "+81" },
              { label: "+82", value: "+82" },
              { label: "+84", value: "+84" },
              { label: "+86", value: "+86" },
              { label: "+90", value: "+90" },
              { label: "+91", value: "+91" },
              { label: "+92", value: "+92" },
              { label: "+93", value: "+93" },
              { label: "+94", value: "+94" },
              { label: "+95", value: "+95" },
              { label: "+98", value: "+98" },
              { label: "+211", value: "+211" },
              { label: "+212", value: "+212" },
              { label: "+213", value: "+213" },
              { label: "+216", value: "+216" },
              { label: "+218", value: "+218" },
              { label: "+220", value: "+220" },
              { label: "+221", value: "+221" },
              { label: "+222", value: "+222" },
              { label: "+223", value: "+223" },
              { label: "+224", value: "+224" },
              { label: "+225", value: "+225" },
              { label: "+226", value: "+226" },
              { label: "+227", value: "+227" },
              { label: "+228", value: "+228" },
              { label: "+229", value: "+229" },
              { label: "+230", value: "+230" },
              { label: "+231", value: "+231" },
              { label: "+232", value: "+232" },
              { label: "+233", value: "+233" },
              { label: "+234", value: "+234" },
              { label: "+235", value: "+235" },
              { label: "+236", value: "+236" },
              { label: "+237", value: "+237" },
              { label: "+238", value: "+238" },
              { label: "+239", value: "+239" },
              { label: "+240", value: "+240" },
              { label: "+241", value: "+241" },
              { label: "+242", value: "+242" },
              { label: "+243", value: "+243" },
              { label: "+244", value: "+244" },
              { label: "+245", value: "+245" },
              { label: "+246", value: "+246" },
              { label: "+247", value: "+247" },
              { label: "+248", value: "+248" },
              { label: "+249", value: "+249" },
              { label: "+250", value: "+250" },
              { label: "+251", value: "+251" },
              { label: "+252", value: "+252" },
              { label: "+253", value: "+253" },
              { label: "+254", value: "+254" },
              { label: "+255", value: "+255" },
              { label: "+256", value: "+256" },
              { label: "+257", value: "+257" },
              { label: "+258", value: "+258" },
              { label: "+260", value: "+260" },
              { label: "+261", value: "+261" },
              { label: "+262", value: "+262" },
              { label: "+263", value: "+263" },
              { label: "+264", value: "+264" },
              { label: "+265", value: "+265" },
              { label: "+266", value: "+266" },
              { label: "+267", value: "+267" },
              { label: "+268", value: "+268" },
              { label: "+269", value: "+269" },
              { label: "+290", value: "+290" },
              { label: "+291", value: "+291" },
              { label: "+297", value: "+297" },
              { label: "+298", value: "+298" },
              { label: "+299", value: "+299" },
              { label: "+350", value: "+350" },
              { label: "+351", value: "+351" },
              { label: "+352", value: "+352" },
              { label: "+353", value: "+353" },
              { label: "+354", value: "+354" },
              { label: "+355", value: "+355" },
              { label: "+356", value: "+356" },
              { label: "+357", value: "+357" },
              { label: "+358", value: "+358" },
              { label: "+359", value: "+359" },
              { label: "+370", value: "+370" },
              { label: "+371", value: "+371" },
              { label: "+372", value: "+372" },
              { label: "+373", value: "+373" },
              { label: "+374", value: "+374" },
              { label: "+375", value: "+375" },
              { label: "+376", value: "+376" },
              { label: "+377", value: "+377" },
              { label: "+378", value: "+378" },
              { label: "+379", value: "+379" },
              { label: "+380", value: "+380" },
              { label: "+381", value: "+381" },
              { label: "+382", value: "+382" },
              { label: "+383", value: "+383" },
              { label: "+385", value: "+385" },
              { label: "+386", value: "+386" },
              { label: "+387", value: "+387" },
              { label: "+389", value: "+389" },
              { label: "+420", value: "+420" },
              { label: "+421", value: "+421" },
              { label: "+423", value: "+423" },
              { label: "+500", value: "+500" },
              { label: "+501", value: "+501" },
              { label: "+502", value: "+502" },
              { label: "+503", value: "+503" },
              { label: "+504", value: "+504" },
              { label: "+505", value: "+505" },
              { label: "+506", value: "+506" },
              { label: "+507", value: "+507" },
              { label: "+508", value: "+508" },
              { label: "+509", value: "+509" },
              { label: "+590", value: "+590" },
              { label: "+591", value: "+591" },
              { label: "+592", value: "+592" },
              { label: "+593", value: "+593" },
              { label: "+594", value: "+594" },
              { label: "+595", value: "+595" },
              { label: "+596", value: "+596" },
              { label: "+597", value: "+597" },
              { label: "+598", value: "+598" },
              { label: "+599", value: "+599" },
              { label: "+670", value: "+670" },
              { label: "+672", value: "+672" },
              { label: "+673", value: "+673" },
              { label: "+674", value: "+674" },
              { label: "+675", value: "+675" },
              { label: "+676", value: "+676" },
              { label: "+677", value: "+677" },
              { label: "+678", value: "+678" },
              { label: "+679", value: "+679" },
              { label: "+680", value: "+680" },
              { label: "+681", value: "+681" },
              { label: "+682", value: "+682" },
              { label: "+683", value: "+683" },
              { label: "+684", value: "+684" },
              { label: "+685", value: "+685" },
              { label: "+686", value: "+686" },
              { label: "+687", value: "+687" },
              { label: "+688", value: "+688" },
              { label: "+689", value: "+689" },
              { label: "+690", value: "+690" },
              { label: "+691", value: "+691" },
              { label: "+692", value: "+692" },
              { label: "+850", value: "+850" },
              { label: "+852", value: "+852" },
              { label: "+853", value: "+853" },
              { label: "+855", value: "+855" },
              { label: "+856", value: "+856" },
              { label: "+870", value: "+870" },
              { label: "+880", value: "+880" },
              { label: "+886", value: "+886" },
              { label: "+960", value: "+960" },
              { label: "+961", value: "+961" },
              { label: "+962", value: "+962" },
              { label: "+963", value: "+963" },
              { label: "+964", value: "+964" },
              { label: "+965", value: "+965" },
              { label: "+966", value: "+966" },
              { label: "+967", value: "+967" },
              { label: "+968", value: "+968" },
              { label: "+970", value: "+970" },
              { label: "+971", value: "+971" },
              { label: "+972", value: "+972" },
              { label: "+973", value: "+973" },
              { label: "+974", value: "+974" },
              { label: "+975", value: "+975" },
              { label: "+976", value: "+976" },
              { label: "+977", value: "+977" },
              { label: "+992", value: "+992" },
              { label: "+993", value: "+993" },
              { label: "+994", value: "+994" },
              { label: "+995", value: "+995" },
              { label: "+996", value: "+996" },
              { label: "+998", value: "+998" },
            ],
          },
          {
            type: "phone",
            name: "areaNum",
            cols: 2,
          },
          {
            type: "phone",
            name: "mobileNoText",
            cols: 4,
          },
          {
            type: "addBtn",
            submitType: "internal",
            label: "Add Other Number",
            name: "addBtn",
            btnType: "plus-btn",
            cols: 6,
            className: "",
            nextLine: true,
          },
        ],
      },
    ],
    
  };

 
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override trustSvc: TrustService,
    public fb: FormBuilder
  ) {
    super(route, svc, trustSvc);
    
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
  await super.ngOnInit();
  let portalWorkflowStatus = sessionStorage.getItem("workFlowStatus");
      if (
      (portalWorkflowStatus != 'Open Quote') || (
      this.baseFormData?.AFworkflowStatus &&
      this.baseFormData.AFworkflowStatus !== 'Quote'
      ) )
      {
        this.mainForm?.form?.disable();
      }
      else{ this.mainForm?.form?.enable();}

  this.svc.countryCodeOptions.subscribe((data) => {
    this.countryCodeOptionsList = data;
  });

  if (this.mode == "edit") {
    this.phone.clear();
    let phoneData = this.baseFormData?.trustDetailPhone || this.baseFormData?.trust?.phone;

    if (phoneData) {
      phoneData.forEach((phone) => {
        if (phone.value) {
          const phoneControl = this.createPhoneForm("+64");
          this.phone.push(phoneControl);

          const splitParts = this.splitPhoneNumber(phone.value);
          phoneControl.patchValue({
            value: splitParts.mobileNoText,
            type: phone.type,
            areacode: splitParts.areaNum,
            code: splitParts.code
          });

          this.onCountryCodeChange({ value: splitParts.code }, this.phone.length - 1);
        }
      });
    } else {
      this.phone.push(this.createPhoneForm("+64"));
    }
  } else {
    if (this.baseFormData?.trustDetailPhone != undefined) {
      this.phone.clear();

      this.baseFormData.trustDetailPhone.forEach((phone) => {
        const phoneControl = this.createPhoneForm("+64");
        this.phone.push(phoneControl);

        const splitParts = this.splitPhoneNumber(phone.value);
        phoneControl.patchValue({
          value: splitParts.mobileNoText,
          type: phone.type,
          areacode: splitParts.areaNum,
          code: splitParts.code
        });

        this.onCountryCodeChange({ value: splitParts.code }, this.phone.length - 1);
      });
    }
  }

  // Move this to the END, after all form setup is complete
  if (this.trustSvc.showValidationMessage) {
    this.phone.markAllAsTouched();
  }

  // Disable form if workflow status requires it
  if (this.isDisabled()) {
    this.phoneForm.disable();
  }
}

  isDisabled(): boolean {
    const baseFormDataStatus = this.baseFormData?.AFworkflowStatus;
    const sessionStorageStatus = sessionStorage.getItem('workFlowStatus');
    return !(
      baseFormDataStatus === 'Quote' ||
      sessionStorageStatus === 'Open Quote'
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

  override onFormReady(): void {
    super.onFormReady();
  }

  splitPhoneNumber(phoneNumber: string) {
    if (!phoneNumber) {
      return {
        code: "",
        areaNum: "",
        mobileNoText: "",
      };
    }

    const phonePattern = /^([^\(]+)\(([^\)]+)\)([\s\S]*)$/;
    const match = phoneNumber.match(phonePattern);

    if (match) {
      return {
        code: `${match[1]}`,
        areaNum: match[2],
        mobileNoText: match[3],
      };
    }

    // Fallback for improperly formatted numbers
    return {
      code: "+64",
      areaNum: "",
      mobileNoText: phoneNumber,
    };
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

    this.trustSvc.setBaseDealerFormData({
      trustDetailPhone: formattedPhones,
    });
  }

  createPhoneForm(code: string = "+64"): FormGroup {
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

  createNewPhoneForm(code: string = "+64"): FormGroup {
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

    this.trustSvc.setBaseDealerFormData({
      trustDetailPhone: formattedPhones,
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

    this.trustSvc.updateComponentStatus(
      "Trust Details",
      "TrustContactDetailsComponent",
      this.phone.valid
    );

    if (this.trustSvc.showValidationMessage) {
      let invalidPages = this.checkStepValidity();
      this.trustSvc.iconfirmCheckbox.next(invalidPages);
    }
  }
}
