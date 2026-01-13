import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig } from "auro-ui";
import { BasePartnershipClass } from "../../base-partnership.class";
import { PartnershipService } from "../../services/partnership.service";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-partnership-details",
  templateUrl: "./partnership-details.component.html",
  styleUrl: "./partnership-details.component.scss",
})
export class PartnershipDetailsComponent extends BasePartnershipClass {
  privousChecked: boolean;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override partnershipSvc: PartnershipService
  ) {
    super(route, svc, partnershipSvc);
  }

  customerRoleData: any = [
    { label: "Borrower", value: "Borrower" },
    { label: "Co-Borrower", value: "co-borrower" },
    { label: "Guaranter", value: "guranter" },
  ];

  optionsdata = [{ name: "icashpro", code: "icp" }];

  override formConfig: GenericFormConfig = {
    headerTitle: "",
    autoResponsive: true,
    api: "trustAddress",
    goBackRoute: "trustAddress",
    fields: [
      {
        type: "text",
        label: "Trading Name ",
        name: "tradingName",
        cols: 2,
        //validators: [Validators.required],
        nextLine: false,
      },

      {
        type: "text",
        label: "GST Number ",
        name: "gstNum",
        cols: 2,
        //validators: [Validators.required],
        nextLine: false,
      },
      {
        type: "text",
        label: "Email ",
        name: "email",
        cols: 2,
        //validators: [Validators.required],
        nextLine: true,
      },

      {
        type: "textArea",
        label: "BusinessDescription",
        name: "businessDes",
        //validators: [Validators.required],
        cols: 4,
        placeholder: "Enter a brief description of the purpose of the trust",
        className: "mt-2",
        textAreaRows: 3,
      },

      {
        type: "select",
        label: "Source Of Wealth",
        name: "sourceOfWealth",
        className: "pt-6",

        options: [
          { label: "Dealer A", value: "dealerA" },
          { label: "Dealer B", value: "dealerB" },
          { label: "Dealer C", value: "dealerC" },
        ],
        cols: 2,
      },
      {
        type: "select",
        label: "Primary Nature Of Business",
        name: "primaryNatureBusiness",
        options: [
          { label: "Credit Sales Agreement", value: "creditSalesAgreement" },
          {
            label: "CSA Business - Direct - Fixed",
            value: "CSABusinessDirectFixed",
          },
        ],
        //validators: [Validators.required],
        cols: 2,

        className: "pt-6 flex-column",
        nextLine: true,
      },
      {
        type: "text",
        label: "Search",
        name: "physicalSearchValue",
        className: " ",
        //validators: [Validators.required, Validators.maxLength(40)],
        cols: 3,
        nextLine: true,
        rightIcon: true,
      },

      {
        type: "text",
        label: "Attention",
        name: "attention",
        className: " ",
        cols: 2,
        nextLine: true,
      },

      {
        type: "year-month",
        label: "Time at Address ",
        name: "timeataddress",
        className: "mt-3",
        inputClass: "col-2",
        yearLabelClass: "col-2",
        monthLabelClass: "col-3",
        cols: 3,
        //validators: [Validators.required],
        nextLine: true,
      },
      {
        type: "text",
        label: "Building Name ",
        name: "buildingName",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Unit/Floor Type",
        name: "unitType",
        maxLength: 20,
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Unit/Lot Number",
        name: "unitLotNumber",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Street Number",
        name: "streetNumber",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Street Type",
        name: "streetType",
        options: [
          { label: "Avenue (Ave)", value: "Avenue" },
          { label: "Street (St)", value: "Street" },
          { label: "Road (Rd)", value: "Road" },
          { label: "Boulevard (Blvd)", value: "Boulevard" },
          { label: "Lane (Ln)", value: "Lane" },
          { label: "Drive (Dr)", value: "Drive" },
          { label: "Court (Ct)", value: "Court" },
          { label: "Place (Pl)", value: "Place" },
          { label: "Terrace (Ter)", value: "Terrace" },
          { label: "Crescent (Cres)", value: "Crescent" },
          { label: "Way (Wy)", value: "Way" },
          { label: "Circle (Cir)", value: "Circle" },
          { label: "Alley (Aly)", value: "Alley" },
          { label: "Square (Sq)", value: "Square" },
          { label: "Walk", value: "Walk" },
          { label: "Driveway", value: "Driveway" },
          { label: "Highway (Hwy)", value: "Highway" },
          { label: "Bypass", value: "Bypass" },
          { label: "Pike", value: "Pike" },
          { label: "Path", value: "Path" },
          { label: "Esplanade", value: "Esplanade" },
        ],
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Street Direction",
        name: "streetDirection",
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Rural Delivery",
        name: "ruralDelivery",
        cols: 2,
        nextLine: true,
      },
      {
        type: "text",
        label: "Suburb",
        name: "suburb",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "City",
        name: "city",
        options: [
          { label: "Dealer A", value: "dealerA" },
          { label: "Dealer B", value: "dealerB" },
          { label: "Dealer C", value: "dealerC" },
        ],
        cols: 2,
        nextLine: false,
      },
      {
        type: "text",
        label: "Post Code",
        name: "postCode",
        cols: 2,
        nextLine: false,
      },
      {
        type: "select",
        label: "Country",
        name: "country",
        list$: "LookUpServices/locations?LocationType=country",
        idKey: "name",
        idName: "name",
        default: "New Zealand",
        cols: 2,
        nextLine: false,
      },
    ],
  };
}
