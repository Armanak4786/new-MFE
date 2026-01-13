import { Component } from "@angular/core";
import { BaseSoleTradeClass } from "../../../base-sole-trade.class";
import { ActivatedRoute } from "@angular/router";
import { CommonService, GenericFormConfig, Mode } from "auro-ui";
import { SoleTradeService } from "../../../services/sole-trade.service";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-sole-trade-business-customer-role",

  templateUrl: "./sole-trade-business-customer-role.component.html",
  styleUrl: "./sole-trade-business-customer-role.component.scss",
})
export class SoleTradeBusinessCustomerRoleComponent extends BaseSoleTradeClass {
  optionsdata: any[] = ["aa"];
  privousChecked: any;
  borrowedAmount: any;
   override mode: any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public soleTradeSvc: SoleTradeService
  ) {
    super(route, svc, soleTradeSvc);
  }
  customerRoleData: any = [
    { label: "Borrower", value: 1 },
    { label: "Co-Borrower", value: 2 },
    { label: "Guarantor", value: 3 },
  ];
  override formConfig: GenericFormConfig = {
    autoResponsive: true,
    api: "soleTradeBusinessDetail",
    goBackRoute: "soleTradeBusinessDetail",
    cardType: 'non-border',
    fields: [
      {
        type: "select",
        label: "Customer Role",
        name: "role",

        options: this.customerRoleData,
        //validators: [validators.required],
        cols: 4,
        className: "mt-4",
        alignmentType:'horizontal',
        labelClass:'mt-2',
        validators:[Validators.required, Validators.min(1)],
        errorMessage: "Customer Role is required"
      },
      // {
      //   type: "toggle",
      //   label: "Entity Type Is Partnership?",
      //   name: "entityType",
      //   cols: 3,
      //   offLabel: "Yes",
      //   onLabel: "No",
      //   className: "p-4 mt-4",
      // },
    ],
  };

    getvalue(value: any) {
    this.baseSvc.setBaseDealerFormData({
      role: value,
    });
  }

  override onFormEvent(event: any): void {
    super.onFormEvent(event)
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    if(this.soleTradeSvc.showValidationMessage){
      this.mainForm.form.markAllAsTouched()
    }
  
          let params: any = this.route.snapshot.params;
        this.mode = params.mode || Mode.create;
    console.log(this.soleTradeSvc.role,this.baseFormData?.role)
      if (this.baseFormData?.role) {
      this.mainForm.get("role").setValue(this.baseFormData?.role);
    }
        if (this.mode == "create") {
      
      if (this.soleTradeSvc.role === 1) {
        const valueToRemove = this.soleTradeSvc.role;
        this.customerRoleData = this.customerRoleData.filter(
          (role) => role.value !== valueToRemove
        );
        this.mainForm.updateList('role',this.customerRoleData)

        if (this.baseFormData?.customerSummary && Array.isArray(this.baseFormData.customerSummary)) {
          // Count co-borrowers (customerRole = 2)
          const coBorrowers = this.baseFormData.customerSummary.filter(
            customer => customer.customerRole === 2
          );
          
          if (coBorrowers.length >= 2) {
            // If 2 or more co-borrowers exist, set role to guarantor (3)
            this.mainForm.get("role").setValue(this.baseFormData?.role || 3);
            this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 3,
            });
          } else {
              // If less than 2 co-borrowers, set role to co-borrower (2)
            this.mainForm.get("role").setValue(this.baseFormData?.role || 2);
            this.baseSvc.setBaseDealerFormData({
            role: this.baseFormData?.role || 2,
          });
          }
        }

      }
      else{
        if(!this.baseFormData.role){
          this.customerRoleData = this.customerRoleData?.filter(
            (role)=>role.value == 1
          )
          this.mainForm.updateList('role', this.customerRoleData)
          this.mainForm.get("role").setValue(1);
          this.soleTradeSvc.setBaseDealerFormData({
          role : 1
         })
        }     
      }

    }
        if (this.baseFormData?.role) {
          this.mainForm.get("role").setValue(this.baseFormData?.role);
          
        }
        if (this.mode == "edit") {

          if (this.baseSvc.role === 1) {
          
          // this.customerRoleData = this.customerRoleData;
          
          // Check if customerSummary exists and is an array
          if (this.baseFormData?.customerSummary && Array.isArray(this.baseFormData.customerSummary)) {
            // Count co-borrowers (customerRole = 2)
            const coBorrowers = this.baseFormData.customerSummary.filter(
              customer => customer.customerRole === 2
            );
            
            if (coBorrowers.length >= 2) {
              // If 2 or more co-borrowers exist, set role to guarantor (3)
              // this.customerRoleForm.controls["role"].setValue(3);
              this.mainForm.get("role").setValue(this.baseFormData?.role || 3);
              this.baseSvc.setBaseDealerFormData({
                role: this.baseFormData?.role || 3,
              });
            } else {
                // If less than 2 co-borrowers, set role to co-borrower (2)
              // this.customerRoleForm.controls["role"].setValue(2);
              this.mainForm.get("role").setValue(this.baseFormData?.role || 2);
              this.baseSvc.setBaseDealerFormData({
              role: this.baseFormData?.role || 2,
            });
            }
          } 
          // else {
          //   // If customerSummary doesn't exist or is empty, default to co-borrower
          //   this.customerRoleForm.controls["role"].setValue(2);
          // }
        } else {
            if (!this.baseFormData.role) {
              // this.customerRoleForm.controls["role"].setValue(1);
              this.mainForm.get("role").setValue(this.baseFormData?.role || 1);
              this.baseSvc.setBaseDealerFormData({
                role: this.baseFormData?.role || 1,
              });
            }
          }

          // if (this.baseFormData?.role) {
          //   if (this.soleTradeSvc.role === 1) {
          //     const valueToRemove = this.soleTradeSvc.role;
    
          //     this.customerRoleData = this.customerRoleData.filter(
          //       (role) => role.value !== valueToRemove
          //     );
          //     this.mainForm.updateList('role',this.customerRoleData)
          //   }
          // } else {
          //     this.mainForm.get("role").setValue(
          //     this.baseFormData?.role
          //   );
            
          // }

          if(this.baseFormData?.tempCustomerNo === this.baseFormData?.customerNo ){
          if(this.baseFormData?.tempCustomerRole){
            this.mainForm.get("role").setValue(this.baseFormData?.tempCustomerRole);
            this.soleTradeSvc.setBaseDealerFormData({
              role: this.baseFormData?.tempCustomerRole
            });
          }
          }
          else {
              this.mainForm.get("role").setValue(
              this.baseFormData?.role
            );
          }
            

        }
  }

  override onStepChange(stepperDetails: any): void {
    super.onStepChange(stepperDetails)
     if (this.mainForm) {
        if(this.mainForm.form.get("role").value === 0){
          this.mainForm.form.markAllAsTouched();
          // formStatus = "INVALID"
        }
      }

    this.baseSvc.updateComponentStatus("Business Individual", "SoleTradeBusinessCustomerRoleComponent", this.mainForm.form.valid)
     if(this.soleTradeSvc.showValidationMessage){
      let invalidPages = this.checkStepValidity()
      this.soleTradeSvc.iconfirmCheckbox.next(invalidPages)
    }

  }
  

  override onFormReady(): void {
    super.onFormReady()
  }
}
