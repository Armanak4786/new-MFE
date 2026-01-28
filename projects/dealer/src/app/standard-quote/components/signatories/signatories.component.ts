import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import {
  CloseDialogData,
  CommonService,
  GenericFormConfig,
  Mode,
} from "auro-ui";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { Subject, takeUntil } from "rxjs";
import { AddContactsComponent } from "../../../components/add-contacts/add-contacts.component";
import { OverlayPanel } from "primeng/overlaypanel";
import configure from "../../../../../public/assets/configure.json";


@Component({
  selector: "app-signatories",
  templateUrl: "./signatories.component.html",
  styleUrl: "./signatories.component.scss",
})
export class SignatoriesComponent extends BaseStandardQuoteClass {
  @ViewChild("op") overlayPanel!: OverlayPanel;

  response: any;
  contactList: any;
  baseData: any;
  preferredDeliveryMethod: any;

  signatoriesData: any;

  // Store selected row data for the overlay panel
  selectedRowData: any;
  selectedParentRowData: any;
  selectedContactIndex: number | null = null;
  contactPartyRoleMatrixResponse: any;
  private verificationRules: any[] = [];

  private destroySub$ = new Subject<void>();
  private lastClickedElement: HTMLElement | null = null;

  IndividualformConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        label: "Customer Name",
        name: "individualCustomerName",
        cols: 2,
        options: [],
        className: "-ml-5 col-2 pl-3 pr-0",
        alignmentType: "vertical",
        labelClass: "pl-1",
      },
      {
        type: "select",
        label: "Role",
        name: "individualRole",
        cols: 2,
        options: [],
        alignmentType: "vertical",
        className: "ml-2 pl-3 pr-0 ",
      },

      {
        type: "text",
        label: "First Name",
        name: "individualFirstName",
        cols: 2,
        inputType: "vertical",
        className: "mt-2 pr-2 pl-5",
        labelClass: "mb-3",
      },
      {
        type: "text",
        label: "Last Name",
        name: "individualLastName",
        cols: 2,
        inputType: "vertical",
        className: "mt-2 pl-7 mr-1 -ml-1",
        labelClass: "mb-3",
      },
      {
        type: "date",
        label: "Date of Birth",
        name: "individualDateOfBirth",
        cols: 2,
        className: "pr-2 mt-0 ",
        inputType: "vertical",
        inputClass: "mt-3",
        maxDate: new Date(
          new Date().setFullYear(new Date().getFullYear() - 18)
        ),
      },
      {
        type: "select",
        label: "Contact Type",
        name: "individualContactType",
        cols: 2,
        options: [],
        className: " ml-2 pr-0 py-1 pl-5  ",
        alignmentType: "vertical",
        labelClass:"pt-1 ctsig",
        
      },

      {
        type: "toggle",
        label: "Signatory",
        name: "individualSignatory",
        cols: 2,
        className: "mt-0 -ml-4 py-2 pl-3",
        labelClass: " togsig",
        offLabel: "Yes",
        onLabel: "No",
        alignmentType: "vertical",

        // mode: Mode.view,
      },
      {
        type: "select",
        label: "Mobile",
        name: "individualMobile",
        alignmentType: "vertical",
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

        className: "-ml-3 mb-2  pl-5 pr-4 py-0 mt-2",
        // labelClass: "col-12 -my-4",
        // inputClass: "col-12 -my-5",
        cols: 2,
        filter: true,
        default: "+64",
      },

      {
        type: "phone",
        name: "individualAreaCode",
        cols: 2,
        maxLength: 4,
        className: "-ml-4 col-1 col-2 mb-5 pr-8 mt-5 ",
        // inputType: "vertical",
        labelClass: "hidden",
      },
      {
        type: "phone",
        name: "individualPhoneNumber",
        cols: 2,
        maxLength: 10,
        className: "-ml-8 col-2 mb-5 pr-4 mt-5",
        // inputType: "vertical",
        labelClass: "hidden",
      },

      {
        type: "email",
        label: "Email",
        name: "individualEmail",
        cols: 2,
        className: "-mr-3 ml-3 mt-3 pr-0 pl-1 ",
        labelClass: "-mt-3 mb-3",
        inputType: "vertical",
        inputClass: " eml",
      },
      {
        type: "number",
        label: "Signing Order",
        name: "individualSigningOrder",
        cols: 2,
        className: "ml-6 pl-5 pr-2 mt-2",
        inputClass: " soi",
        labelClass:"mb-2",
        mode: Mode.view,
        showButtons: true,
        inputType: "vertical",
        default: null,
      },
    ],
  };

  BusinessformConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        label: "Customer Name",
        name: "businessCustomerName",
        cols: 3,
        options: [],
        className: "-ml-4 pl-2 pr-0 ",
        alignmentType: "vertical",
      },
      {
        type: "select",
        label: "Role",
        name: "businessRole",
        cols: 4,
        options: [],
        alignmentType: "vertical",
        className: "ml-3",
      },

      {
        type: "text",
        label: "Legal Name",
        name: "businessLegalName",
        cols: 3,
        className: " ml-5 pr-7 mt-2 ",
        inputType: "vertical",
        labelClass: "mb-3",
      },
      {
        type: "select",
        label: "Contact Type",
        name: "businessContactType",
        cols: 2,
        className: "-ml-4 pr-1 ",
        options: [],
        alignmentType: "vertical",
      },
      {
        type: "toggle",
        label: "Signatory",
        name: "businessSignatory",
        cols: 2,
        className: "mt-0 -ml-3 py-2",
        offLabel: "Yes",
        onLabel: "No",
        alignmentType: "vertical",
        // mode: Mode.view,
      },
      {
        type: "select",
        label: "Mobile",
        name: "businessMobile",
        alignmentType: "vertical",
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
        className: "ml-7 my-2 py-0 pl-4 pr-5 ",
        // labelClass: "col-12 -my-4",
        // inputClass: "col-12 -my-4",
        cols: 2,
        filter: true,
        default: "+64",
      },
      {
        type: "phone",
        // placeholder: 'Area Code',
        name: "businessAreaCode",
        // cols: 2,
        maxLength: 4,
        // validators: [Validators.pattern('^[0-9]{1,5}$')],
        className: "-ml-4 col col-1 mb-5 mt-5",
        // inputType: "vertical",
        //regexPattern: "^[0-9]{1,5}$*",
        labelClass: "hidden",
      },

      {
        type: "phone",
        name: "businessPhoneNumber",
        // cols: 2,
        maxLength: 10,
        // validators: [Validators.pattern('^[0-9]{1,10}$')],
        className: " col-2 -ml-1 mb-5 pr-5 mt-5",
        // inputType: "vertical",
        labelClass: "hidden",
      },

      {
        type: "email",
        label: "Email",
        name: "businessEmail",
        // cols: 3,
        className: "-mr-3 col-3 ml-1 mr-1 mt-3 pr-7",
        inputType: "vertical",
        labelClass: "-mt-3 mb-3",
      },
      {
        type: "number",
        label: "Signing Order",
        name: "businessSigningOrder",
        cols: 2,
        className: "  -ml-2 pl-3 mt-2",
        mode: Mode.view,
        showButtons: true,
        inputType: "vertical",
        default: null,
      },
    ],
  };

  IndividualCustomerformConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        label: "Customer Name",
        name: "individualPartyName",
        cols: 2,
        options: [],
        className: "-ml-5 col-2 pl-3 pr-0",
        disabled: true,
        alignmentType: "vertical",
        labelClass: "pl-1",
      },
      {
        type: "select",
        label: "Role",
        name: "individualPartyRole",
        cols: 2,
        options: [],
        disabled: true,
        alignmentType: "vertical",
        className: "ml-2 pl-3 pr-0 ",
      },

      {
        type: "text",
        label: "First Name",
        name: "individualPartyFirstName",
        cols: 2,
        mode: Mode.view,
        inputType: "vertical",
        className: "mt-2 pr-2 pl-5",
        labelClass: "mb-3",
      },
      {
        type: "text",
        label: "Last Name",
        name: "individualPartyLastName",
        cols: 2,
        mode: Mode.view,
        inputType: "vertical",
        className: "mt-2 pl-7 mr-1 -ml-1",
        labelClass: "mb-3",
      },
      {
        type: "date",
        label: "Date of Birth",
        name: "individualPartyDateOfBirth",
        cols: 2,
        disabled: true,
        className: "pr-2 mt-0",
        inputType: "vertical",
        inputClass: "mt-3",
      },
      {
        type: "select",
        label: "Contact Type",
        name: "individualPartyContactType",
        cols: 2,
        options: [],
        disabled: true,
        className: " ml-2 pr-0 py-1 pl-5 ",
        alignmentType: "vertical",
      },

      {
        type: "toggle",
        label: "Signatory",
        name: "individualPartySignatory",
        cols: 2,
        className: "mt-0 -ml-4 py-2 pl-3",
        offLabel: "Yes",
        onLabel: "No",
        // mode: Mode.view,
        alignmentType: "vertical",
      },
      {
        type: "select",
        label: "Mobile",
        name: "individualPartyMobile",
        alignmentType: "vertical",
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

        className: "-ml-3 my-2 pl-5 pr-4 py-0  mobile-order-field",
        // labelClass: "col-12 -my-4",
        // inputClass: "col-12 -my-4",
        cols: 2,
        filter: true,
        disabled: true,
      },

      {
        type: "phone",
        name: "individualPartyAreaCode",
        cols: 2,
        maxLength: 4,
        className: "-ml-4 col-1 mt-5 col-2 mb-5 pr-8 mobile-field",
        // inputType: "vertical",
        labelClass: "hidden",
        mode: Mode.view,
      },
      {
        type: "phone",
        name: "individualPartyPhoneNumber",
        cols: 2,
        maxLength: 10,
        className: "-ml-8 col-2 mt-5 mb-5 pr-4 mobile-field",
        // inputType: "vertical",
        labelClass: "hidden",
        mode: Mode.view,
      },

      {
        type: "email",
        label: "Email",
        name: "individualPartyEmail",
        cols: 4,
        mode: Mode.view,
        inputType: "vertical",
        className: "-mr-3 ml-2 mt-3 pr-7 pl-1",
        labelClass: "-mt-3 mb-3",
      },
      {
        type: "number",
        label: "Signing Order",
        name: "individualPartySigningOrder",
        cols: 2,
        className: "-ml-3 mt-2 pl-4 pr-3 signing-order-field",
        mode: Mode.view,
        showButtons: true,
        inputType: "vertical",
        default: null,
      },
    ],
  };

  BusinessCustomerformConfig: GenericFormConfig = {
    cardType: "non-border",
    autoResponsive: true,
    api: "addAsset",
    goBackRoute: "quoteOriginator",
    fields: [
      {
        type: "select",
        label: "Customer Name",
        name: "businessPartyName",
        cols: 3,
        options: [],
        className: "-ml-5 pl-3 pr-0 ",
        labelClass: "pl-1",
        alignmentType: "vertical",
        disabled: true,
      },
      {
        type: "select",
        label: "Role",
        name: "businessPartyRole",
        cols: 4,
        options: [],
        disabled: true,
        alignmentType: "vertical",
        className: "ml-3",
      },

      {
        type: "text",
        label: "Legal Name",
        name: "businessPartyLegalName",
        cols: 3,
        mode: Mode.view,
        className: " ml-5 pr-7 mt-2 pl-3 ",
        inputType: "vertical",
        labelClass: "mb-3",
      },
      {
        type: "select",
        label: "Contact Type",
        name: "businessPartyContactType",
        cols: 2,
        className: "-ml-4 pr-1 pl-3 ",
        options: [],
        disabled: true,
        alignmentType: "vertical",
      },
      {
        type: "toggle",
        label: "Signatory",
        name: "businessPartySignatory",
        cols: 2,
        className: "mt-0 -ml-3 py-2",
        offLabel: "Yes",
        onLabel: "No",
        // mode: Mode.view,
        alignmentType: "vertical",
      },
      {
        type: "select",
        label: "Mobile",
        name: "businessPartyMobile",
        alignmentType: "vertical",
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
        className: "ml-7 my-2  py-0 pl-3 pr-5  mobile-order-field",
        // labelClass: "col-12 -my-4",
        // inputClass: "col-12 -my-4",
        cols: 2,
        filter: true,
        disabled: true,
      },
      {
        type: "phone",
        // placeholder: 'Area Code',
        name: "businessPartyAreaCode",
        // cols: 2,
        maxLength: 4,
        // validators: [Validators.pattern('^[0-9]{1,5}$')],
        className: "-ml-4 mt-5 col col-1 mb-5 mobile-field",
        // inputType: "vertical",
        //regexPattern: "^[0-9]{1,5}$*",
        labelClass: "hidden",
        disabled: true,
      },

      {
        type: "phone",
        name: "businessPartyPhoneNumber",
        // cols: 2,
        maxLength: 10,
        // validators: [Validators.pattern('^[0-9]{1,10}$')],
        className: " col-2 -ml-1 mt-5 mb-5 pr-5 mobile-field",
        // inputType: "vertical",
        labelClass: "hidden",
        disabled: true,
      },

      {
        type: "email",
        label: "Email",
        name: "businessPartyEmail",
        // cols: 3,
        className: "-mr-3 col-3 ml-1 mr-1 mt-3 pr-7 pl-1",
        inputType: "vertical",
        mode: Mode.view,
      },
      {
        type: "number",
        label: "Signing Order",
        name: "businessPartySigningOrder",
        cols: 2,
        className: " -ml-2 pl-3 pr-3 mt-2 signing-order-field",
        mode: Mode.view,
        showButtons: true,
        inputType: "vertical",
        default: null,
      },
    ],
  };
  // data = []
  loading = false;
  preferredDeliveryMethodOptions = [
    { label: "ESign", value: "ESign" },
    { label: "Print", value: "Print" },
    { label: "Screen", value: "Screen" },
  ];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: StandardQuoteService,
    public cdr: ChangeDetectorRef
  ) {
    super(route, svc, baseSvc);
    this.baseSvc.formDataCacheableRoute([
      "LookUpServices/lookups?LookupSetName=ContactType",
    ]);

    this.baseSvc.formDataCacheableRoute([
      "WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Role Matrix",
    ]);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.baseSvc.getBaseDealerFormData().subscribe((res) => {
      this.baseData = res;
    });

    // await this.init();

    this.baseSvc.updateSignatories
      .pipe(takeUntil(this.destroySub$))
      .subscribe(() => {
        this.init();
      });

    await this.baseSvc.getFormData(
      `LookUpServices/lookups?LookupSetName=ContactType`,
      (res) => {
        let list = res.data;

        this.contactList = list.map((item) => ({
          label: item.lookupValue,
          value: item.lookupValue,
        }));

        return this.contactList;
      }
    );

    this.preferredDeliveryMethod =
      this.baseFormData?.preferredDeliveryMethod || "ESign";
  }

  isDisabled(){
    if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)){
    return true;
  }
  return false;
  }

  workflowViewonlyField(rowData:any){
    if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus) || this.baseSvc?.partyStatusListforIconDisable?.includes(rowData?.currentWorkflowStatus.toLowerCase())){
      return true;
    }
    return false;
  }

  async init() {
    this.loading = true;
    await this.baseSvc.getFormData(
      `CustomerDetails/get_AllDocusign?contractId=${this.baseData.contractId}`,
      (res) => {
        if (res.data) {
          this.signatoriesData = res.data?.filter(r=>r.customerRole != 7);
          this.baseSvc.setBaseDealerFormData({
            signatories: this.signatoriesData,
          });
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
    );

    this.contactPartyRoleMatrixResponse = await this.baseSvc.getFormData(
      `WorkFlows/get_config_matrix_datset?MatrixName=DO Portal Party Ver Role Matrix`
    );

    this.processVerificationMatrix();

    // console.log(this.contactPartyRoleMatrixResponse, "Subhashish");
  }
  OnDropdownChange(event: any) {
    this.baseSvc.setBaseDealerFormData({
      preferredDeliveryMethod: event.value,
    });
  }

  getSignatoryContacts(rowData: any): any[] {
    return rowData?.contact?.filter((c) => c.isSignatory) || [];
  }

  showAddSignatoryPopUp() {
    this.svc.dialogSvc
      .show(AddContactsComponent, "", {
        templates: {
          footer: null,
        },
        data: {
          parent: "Signatories",
          IndividualformConfig: this.IndividualformConfig,
          BusinessformConfig: this.BusinessformConfig,
          contactType: this.contactList,
          // classification: "Individual",
          signatoriesData: this.signatoriesData,
        },
        width: "62vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {
        if (data?.data?.data?.data) {
          this.signatoriesData = data?.data?.data?.data;
        }
        this.cdr.detectChanges();
      });
  }

  onCustomerView(rowData: any) {
    this.svc.dialogSvc
      .show(AddContactsComponent, "", {
        templates: {
          footer: null,
        },
        data: {
          rowData: rowData,
          parent: "Signatories",
          modalType: "customerView",
          IndividualformConfig: this.IndividualCustomerformConfig,
          BusinessformConfig: this.BusinessCustomerformConfig,
          classification: rowData?.classification,
          customerName: rowData?.customerName,
          customerRole: rowData?.roleName,
          signatoriesData: this.signatoriesData,
        },
        width: "62vw",
      })
      .onClose.subscribe((data?: CloseDialogData) => {
        if (data?.data?.data) {
          this.signatoriesData = data?.data?.data;
        }
        this.cdr.detectChanges();
      });
  }

  onContactView(contact: any, customer) {
    this.svc.dialogSvc
      .show(AddContactsComponent, "", {
        templates: {
          footer: null,
        },
        data: {
          rowData: contact,
          parent: "Signatories",
          modalType: "view",
          IndividualformConfig: this.IndividualformConfig,
          BusinessformConfig: this.BusinessformConfig,
          contactType: this.contactList,
          classification: contact?.classification,
          customerName: customer?.customerName,
          customerRole: customer?.roleName,
          contractId: this.baseData.contractId,
          signatoriesData: this.signatoriesData,
        },
        width: "62vw",
      })
      .onClose.subscribe((data?: CloseDialogData) => {
        console.log("on close pr updated table data", data?.data);
        if (data?.data?.data?.data) {
          this.signatoriesData = data?.data?.data?.data;
        }
        this.cdr.detectChanges();
      });
  }

  onContactDelete(
    rowData: any,
    contact: any,
    rowIndex: number,
    contactIndex: number
  ) {
    if((configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus))){
      return;
    }
    this.svc.data
      .delete(
        `CustomerDetails/delete_eSignatory?contractId=${this.baseData?.contractId}&eSignatoryId=${contact.esignatoryDetails?.eSignatoryId}`
      )
      .subscribe((res) => {
        //   if(res){
        //         const customerIndex = this.signatoriesData.findIndex(
        //     (customer: any) => customer.customerId === rowData.customerId
        //   );

        //     if (customerIndex !== -1) {

        //     this.signatoriesData[customerIndex].contact = this.signatoriesData[customerIndex].contact.filter(
        //       (c: any) => c.customerContactId !== contact.customerContactId
        //     );
        //   }

        //   this.cdr.detectChanges()
        //   console.log("hi", this.signatoriesData);
        // }

        if (res?.data) {
          this.signatoriesData = res?.data;
          this.cdr.detectChanges();
        }
      });
  }

  onIdentityCellClick(
    rowData: any,
    rowIndex: number,
    columnName: string,
    event: Event,
    targetElement: any,
    parentRowData?: any,
    contactIndex?: number
  ) {
    // console.log("ID Verification clicked:", {
    //   rowData,
    //   rowIndex,
    //   columnName,
    //   parentRowData,
    //   contactIndex
    // });

    // Store the selected data for the overlay panel
    this.selectedRowData = rowData;
    this.selectedParentRowData = parentRowData;
    this.selectedContactIndex = contactIndex || null;
    this.lastClickedElement = targetElement;

    if(this.baseSvc?.partyStatusListforIconDisable?.includes(rowData?.currentWorkflowStatus?.toLowerCase())){
      return;
    }

    // Show the overlay panel
    this.overlayPanel.toggle(event, targetElement);
  }
  onOverlayShow() {
  if (this.lastClickedElement) {
    const buttonWidth = this.lastClickedElement.offsetWidth;
    const overlayPanel = document.querySelector('.custom-overlay-panel.p-overlaypanel') as HTMLElement;
    if (overlayPanel) {
      overlayPanel.style.width = `${buttonWidth}px`;
    }
  }
} 

  // Handle verification completion from the child component
  onVerificationComplete(result: any) {
    console.log("Verification completed:", result);

    // Close the overlay panel
    this.overlayPanel.hide();

    // Update your data if needed
    if (result.success) {
      // Refresh your data or update specific row
      this.init();
    }
  }

  processVerificationMatrix() {
    if (this.contactPartyRoleMatrixResponse?.data?.dataRowList) {
      this.verificationRules =
        this.contactPartyRoleMatrixResponse.data.dataRowList.map(
          (row: any) => ({
            contactType:
              row.customFields["Ver Matrix Contact Type"]?.toLowerCase() || "",
            partyType:
              row.customFields["Matrix Party Type"]?.toLowerCase() || "",
            roles: (
              row.customFields["Matrix Contact Role"]?.split(", ") || []
            ).map((role: string) => role.toLowerCase()),
          })
        );
    }
  }

  shouldShowIdVerification(contact: any): boolean {
    if (!contact) {
      return false;
    }

    const classification = contact.classification?.toLowerCase() || "";
    const contactType = contact.contactType?.toLowerCase() || "";

    // Find matching rule
    const matchingRule = this.verificationRules.find(
      (rule) =>
        rule.contactType === classification && rule.roles.includes(contactType)
    );

    return !!matchingRule;
  }

  override ngOnDestroy(): void {
    this.destroySub$.next();
    this.destroySub$.complete();
  }
}
