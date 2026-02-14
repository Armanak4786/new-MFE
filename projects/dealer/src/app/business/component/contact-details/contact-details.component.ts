import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseIndividualClass } from '../../../individual/base-individual.class';
import { AddContactsComponent } from '../../../components/add-contacts/add-contacts.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService, ToasterService, ValidationService, GenericFormConfig } from 'auro-ui';
import { IndividualService } from '../../../individual/services/individual.service';
import { BusinessService } from '../../services/business';
import { BaseBusinessClass } from '../../base-business.class';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent extends BaseBusinessClass{

 formData: any;
 formConfig1:any;
  countryCodeOptions: any = [];
  referenceDetailsTemp: any = [];
  referenceDetails: any[] = []

  constructor(
      public override route: ActivatedRoute,
      public override svc: CommonService,
      override baseSvc: BusinessService,
      public toasterSvc: ToasterService,
      public validationSvc: ValidationService,
      public cdr: ChangeDetectorRef,
      // public config : DynamicDialogConfig
    ) {
      super(route, svc, baseSvc);
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

      this.formConfig1 = this.IndividualformConfig;

  // Set maxDate on Date of Birth here
  // const eighteenYearsAgo = new Date();
  // eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  // const dobField = this.formConfig1.fields.find(f => f.name === 'individualDateOfBirth');
  // if (dobField) {
  //   dobField.maxDate = eighteenYearsAgo;
  // }
      
      
        if(this.baseFormData.referenceDetailsTemp){
          this.referenceDetails = this.baseFormData?.referenceDetailsTemp
        }
      // await this.updateValidation("onInit");
    }

    date = new Date();
    allowedDate = new Date(
      this.date.getMonth() +
        1 +
        "/" +
        this.date.getDate() +
        "/" +
        (this.date.getFullYear() - 18)
    );
    
     BusinessformConfig: GenericFormConfig = {
      cardType: "non-border",
      autoResponsive: true,
      api: "addAsset",
      goBackRoute: "quoteOriginator",
      fields: [
        {
          type: "select",
          label: "Contact Type",
          name: "businessContactType",
          cols: 6,
          className: "-ml-5 -mt-2 pl-0 w-4",
          labelClass:"trust-contact-type",
          options: [],
          alignmentType: "vertical",
          // list$: "LookUpServices/lookups?LookupSetName=ContactType",
          // idKey: "lookupValue",
          // idName: "lookupValue",
          // maxLength: 10,
          // //validators: [validators.pattern('^[0-9]{1,4}$')],
        },
        {
          type: "text",
          label: "Contact Legal Name",
          name: "businessLegalName",
          cols: 6,
          className: "mx-2 col-6 w-5",
          inputType: "vertical",
          //validators: [validators.pattern("^[0-9]{1,4}$")],
          //min: 1990,
          //max: 2024,
        },
        // {
        //   type: "text",
        //   label: "Trading Name",
        //   name: "businessTradingName",
        //   cols: 4,
        //   // maxLength: 10,
        // },
        {
          type: "toggle",
          label: "Signatory",
          name: "businessSignatory",
          cols: 2,
          className: "mt-3 w-4 pl-0 -mx-4",
          // inputClass: "",
          // labelClass:"",
          alignmentType: "vertical",
          offLabel: "Yes",
          onLabel: "No",
          // nextLine: true,
        },
      {
        type: "select",
        label: "Business Number",
        name: "businessMobile",
        alignmentType: "vertical",
        // placeholder: "Code",
        default: "+64",
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
        // alignmentType: "vertical",
        className: "ml-2 pt-4 px-3",
        labelClass: "col-12 -my-4",
        // inputClass: "col-12 -my-4",
        cols: 2,
        filter: true,
      },
      //  {
      //   type: "label-only",
      //   typeOfLabel: "inline",
      //   label: "-",
      //   cols: 1,
      //   name: "year",
      //   className: "mt-3 pt-3 px-0 col-fixed w-4rem",
      // },
      {
        type: 'phone',
        // placeholder: 'Area Code',
        name: 'businessAreaCode',
        labelClass: "hidden",
        cols: 1,
        placeholder: "Area Code",
        // maxLength: 4,
        // validators: [Validators.pattern('^[0-9]{1,5}$')],
        className: '-mx-3 mt-3 pt-5 business-areaCode',
        inputType: 'vertical',
        //regexPattern: "^[0-9]{1,5}$*",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "-",
        cols: 1,
        name: "year",
        className: "mt-3 pt-3 mx-4 px-0 col-fixed w-4rem",
      },
      {
        type: 'phone',
        name: 'businessPhoneNumber',
        labelClass: "hidden",
        //placeholder: 'Number',
        cols: 2,
        // maxLength: 10,
        // validators: [Validators.pattern('^[0-9]{1,10}$')],
        className: '-mx-8 mt-3 pl-0 pt-5',
        inputType: 'vertical',
      },

       {
        type: "email",
        label: "Email",
        name: "businessEmail",
        cols: 4,
        className: "ml-3 mt-3 pl-8 pr-0 pt-3",
        inputClass:"-mt-2",
        inputType: "vertical"
      },
      ],

  
    };
    
    IndividualformConfig: GenericFormConfig = {
      cardType: "non-border",
      autoResponsive: true,
      api: "addAsset",
      goBackRoute: "quoteOriginator",
      fields: [
        {
          type: "select",
          label: "Contact Type",
          name: "individualContactType",
          cols: 3,
          alignmentType: "vertical",
          options: [
          
          ],
          className: "-ml-5 pl-0 -mt-2 ",
          labelClass:"cT -mt-2",
          inputClass:"ic"
          // list$: "LookUpServices/lookups?LookupSetName=ContactType",
          // idKey: "lookupValue",
          // idName: "lookupValue",
          // maxLength: 10, 
          // //validators: [validators.pattern('^[0-9]{1,4}$')],
        },
        {
          type: "text",
          label: "Contact First Name",
          name: "individualFirstName",
          inputType: "vertical",
          cols: 3,
          inputClass: "mr-3",
          //validators: [validators.pattern("^[0-9]{1,4}$")],
          //min: 1990,
          //max: 2024,
        },
        {
          type: "text",
          label: "Contact Last Name",
          name: "individualLastName",
          inputType: "vertical",
          cols: 3,
          // maxLength: 10,
        },
        {
          type: "date",
          label: "Date of Birth",
          name: "individualDateOfBirth",
          className: "dob py-0",
          inputType: "vertical",
          cols: 3,
          labelClass:"ddo",
          inputClass:"ic mt-2",
          defaultDate: this.allowedDate,
          maxDate: this.allowedDate,
          
        },
        {
          type: "toggle",
          label: "Signatory",
          name: "individualSignatory",
          cols: 2,
          className: "-mx-5 mt-4",
          inputClass: "mt-2",
          labelClass:"mb-2",
          alignmentType: "vertical",
          offLabel: "Yes",
          onLabel: "No",
          // nextLine: true,
        },
      {
        type: "select",
        label: "Mobile",
        name: "individualMobile",
        alignmentType: "vertical",
        // placeholder: "Code",
        default: "+64",
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
        // alignmentType: "vertical",
        className: "ml-8 mt-5 pt-0 pb-0 pl-4",
        labelClass: "col-12 py-0 business-individual-mobile",
        inputClass: "col-12 py-0",
        cols: 2,
        filter: true,
      },
      //  {
      //   type: "label-only",
      //   typeOfLabel: "inline",
      //   label: "-",
      //   cols: 1,
      //   name: "year",
      //   className: "mt-3 pt-3 px-0 col-fixed w-4rem",
      // },
      {
        type: 'phone',
        // hideLabel: true,
        labelClass: "hidden",
        // placeholder: 'Area Code',
        name: 'individualAreaCode',
        cols: 1,
        placeholder: "Area Code",
        // maxLength: 4,
        // validators: [Validators.pattern('^[0-9]{1,5}$')],
        className: '-mx-3 mt-7 pl-3 pr-0 py-0',
        inputType: 'vertical',
        //regexPattern: "^[0-9]{1,5}$*",
      },
      {
        type: "label-only",
        typeOfLabel: "inline",
        label: "-",
        cols: 1,
        name: "year",
        className: "ml-3 mr-0 mt-4 pt-6 px-0 w-7rem",
      },
      {
        type: 'phone',
        labelClass: "hidden",
        name: 'individualPhoneNumber',
        //placeholder: 'Number',
        cols: 2,
        // maxLength: 10,
        // validators: [Validators.pattern('^[0-9]{1,10}$')],
        className: '-mx-8 mt-7 pr-5 pl-0 py-0 w-3',
        inputType: 'vertical',
      },

       {
        type: "email",
        label: "Email",
        name: "individualEmail",
        cols: 4,
        inputType: "vertical",
        className: "ml-6 mt-3 pl-7 pr-0 pt-4 w-4",
      },
      ],

  
    };
    
  
    
  
    MaintainTempArray(){
      this.baseSvc.setBaseDealerFormData({
        referenceDetailsTemp : this.referenceDetailsTemp
      })
    }
  
    
    showReferenceDetailPopup() {
      this.svc.dialogSvc
        .show(AddContactsComponent, "", {
          templates: {
            footer: null,
          },
          data : {
            parent : "Contact",
            BusinessformConfig : this.BusinessformConfig ,
            IndividualformConfig : this.IndividualformConfig ,
            contactType : this.baseFormData?.ReferenceDetailContactType,
            customerId : this.baseFormData?.customerId, 
            customerNo : this.baseFormData?.customerNo,
            contactOwnerRole: this.baseFormData?.customerContractRole?.roleName || "",
          },
          width: "60vw",
        })
        .onClose.subscribe((res: any) => {
          if(res?.data){
            this.referenceDetails.push(res?.data)
            this.referenceDetailsTemp = this.referenceDetails
            this.MaintainTempArray()
          }
          
        });
  
  
    }
    
  
  editReference(reference: any, index: number) {
      if(reference.classification == "Individual"){
        this.baseSvc.setBaseDealerFormData({
          classification : reference.classification,
          individualContactType : reference.contactType,
          individualFirstName : reference.firstName,
          individualLastName : reference.lastName,
          individualPhoneNumber : reference.phoneNo,
          individualEmail : reference.email,
          individualSignatory : reference.isSignatory,
          individualDateOfBirth : reference.dateOfBirth,
          individualMobile : reference.phoneExt,
          individualAreaCode : reference.phoneAreaCode,
          businessContactType : null,
          businessLegalName : null,
          businessTradingName : null,
          businessPhoneNumber : null,
          businessEmail : null,
          businessSignatory : null,
          businessMobile : null,
          businessAreaCode : null
        })
      }
      else{
        this.baseSvc.setBaseDealerFormData({
          classification : reference.classification,
          individualContactType : null,
          individualFirstName : null,
          individualLastName : null,
          individualPhoneNumber : null,
          individualEmail : null,
          individualSignatory : null,
          individualDateOfBirth : null,
          individualMobile : null,
          individualAreaCode : null,
          businessContactType : reference.contactType,
          businessLegalName : reference.customerName,
          businessPhoneNumber : reference.phoneNo,
          businessEmail : reference.email,
          businessSignatory : reference.isSignatory,
          businessMobile : reference.phoneExt,
          businessAreaCode : reference.phoneAreaCode
        })
      }

      if (this.baseFormData?.referenceDetailsTemp) {
      this.referenceDetails = this.baseFormData?.referenceDetailsTemp;
      }
      const referenceToEdit = this.referenceDetails[index];
  
      this.svc.dialogSvc
      .show(AddContactsComponent, "", {
        templates: {
          footer: null,
        },
        width: "60vw",
        parent : "Contact",
         data : {
            parent : "Contact",
            BusinessformConfig : this.BusinessformConfig ,
            IndividualformConfig : this.IndividualformConfig ,
            classification : reference.classification,
            contactType : this.baseFormData?.ReferenceDetailContactType,
            editReference : referenceToEdit || reference,
            customerId : this.baseFormData?.customerId, 
            customerNo : this.baseFormData?.customerNo,
            contactOwnerRole: this.baseFormData?.customerContractRole?.roleName || "",
            viewMode : "view"
          },
      })
      .onClose.subscribe((res: any) => {
        // this.referenceDetails[index] = res;
        if (res?.data) {
          // Update the reference in your array
          this.referenceDetails[index] = res?.data;
          this.referenceDetailsTemp = this.referenceDetails
          this.MaintainTempArray();
        }
        this.baseSvc.setBaseDealerFormData({
          classification : null,
          individualContactType : null,
          individualFirstName : null,
          individualLastName : null,
          individualPhoneNumber : null,
          individualEmail : null,
          individualSignatory : null,
          individualDateOfBirth : null,
          individualMobile : null,
          individualAreaCode : null,
          businessContactType : null,
          businessLegalName : null,
          // businessTradingName : null,
          businessPhoneNumber : null,
          businessEmail : null,
          businessSignatory : null,
          // businessDateOfBirth : null,
          businessMobile : null,
          businessAreaCode : null
        })
      });
  }
  


removeReference(reference: any, index: number) {

  if (this.baseFormData?.referenceDetailsTemp) {
    this.referenceDetails = this.baseFormData?.referenceDetailsTemp;
  }

  const referenceToDelete = this.referenceDetails[index];

  if (referenceToDelete?.customerNo && referenceToDelete?.customerContactId) {
    this.svc.data
      .delete(
        `CustomerDetails/delete_contact?CustomerNo=${referenceToDelete?.customerNo}&contactPartyNo=${referenceToDelete?.contactPartyNo}&contactId=${referenceToDelete?.customerContactId}`
      )
      .subscribe((res) => {
      });
  }

  // Remove from array and update temp
  this.referenceDetails.splice(index, 1);
  this.referenceDetailsTemp = [...this.referenceDetails]; 
  this.MaintainTempArray();
}
  
    pageCode: string = "IndividualComponent";
    modelName: string = "ReferenceDetailsComponent";
  
    isDisabled(): boolean {
  const baseFormDataStatus= this.baseFormData?.AFworkflowStatus; 
  const sessionStorageStatus= sessionStorage.getItem('workFlowStatus'); 
  return !(
    baseFormDataStatus=== 'Quote' ||
    sessionStorageStatus=== 'Open Quote'
  );
}
  
    override async onStepChange(quotesDetails: any): Promise<void> {
      super.onStepChange(quotesDetails);
      if (quotesDetails.type !== "tabNav") {
        // var result: any = await this.updateValidation("onSubmit");
        // if (!result?.status) {
        //   this.toasterSvc.showToaster({
        //     severity: "error",
        //     detail: "I7",
        //   });
        // }
      }
    }
  }

  

