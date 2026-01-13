import { Component } from "@angular/core";
import { CommonService } from "auro-ui";
import { ActivatedRoute } from "@angular/router";
import { BaseDealerClass } from "../base/base-dealer.class";
import { AddAssetService } from "./services/addAsset.service";
import { Subscription, takeUntil } from "rxjs";

@Component({
  template: "",
})
export class BaseAssetClass extends BaseDealerClass {
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    public override baseSvc: AddAssetService
  ) {
    super(route, svc, baseSvc);
  }

  assetSubmitSubscription?: Subscription;

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    this.assetSubmitSubscription = this.baseSvc.addAssetFormDataSubject
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((data) => {
        if (data) {
          let formStatus = this.proceed();

          this.baseSvc.formStatusArr.push(formStatus);
          console.log("form validation", this, formStatus);
        }
      });
  }

  // override ngOnDestroy(): void {
  //   // Unsubscribe from the destroy$ subject
  //   super.ngOnDestroy();

  //   if (this.assetSubmitSubscription) {
  //     this.assetSubmitSubscription?.unsubscribe();
  //   }
  // }

  // onAssetSubmit() {
  //   this.mainForm.
  // }
}
