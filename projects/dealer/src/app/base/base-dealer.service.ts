import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService, MapFunc, Mode } from "auro-ui";
import { BehaviorSubject, map } from "rxjs";

@Component({
  template: "",
})
export abstract class BaseDealerService implements OnInit {
  mode: Mode | string = Mode.create;
  accessMode: Mode | string = Mode.create;
  public changeDetectionForUpdate = new BehaviorSubject<any>(null);
  formStatusArr = [];
  user_role: any;
  accessGranted: any = {};
  constructor(public data: DataService, public route: ActivatedRoute) {}
  ngOnInit(): void {}
  public stepper = new BehaviorSubject<any>(null);
  public appStatus = new BehaviorSubject<any>(null);
  activeStep = 0;
  private baseDealerFormData = {};
  private baseDealerFormDataSubject = new BehaviorSubject<any>(
    this.baseDealerFormData
  );
  // setBaseDealerFormData(data: any) {
  //   this.baseDealerFormData = {
  //     ...this.baseDealerFormData,
  //     ...data,
  //     changedField: data,
  //   };
  //   // console.log(data);

  //   this.baseDealerFormDataSubject.next(this.baseDealerFormData);
  // }

  setBaseDealerFormData(data: any) {
    let changedData = { ...data };

    // different fiels names in quick quote and standard quote
    if (
      data?.residualValue !== undefined &&
      data?.residualAmount !== undefined
    ) {
      changedData = {
        ...data,
        // pctResidualValue: data.residualValue,   // residual percent
        // residualValue: data.residualAmount,     // residual amount
        // initialLeasePayment: data.firstLeasePayment, //Initial Lease Amount
      };
    }

    this.baseDealerFormData = {
      ...this.baseDealerFormData,
      ...changedData,
      changedField: changedData,
    };

    this.baseDealerFormDataSubject.next(this.baseDealerFormData);
  }

  removeBaseDealerFormData(key: string) {
    this.baseDealerFormData = delete this.baseDealerFormData[key];
    this.baseDealerFormDataSubject.next(this.baseDealerFormData);
  }

  resetBaseDealerFormData() {
    this.baseDealerFormData = {};
    this.baseDealerFormDataSubject.next(null);
  }

  getBaseDealerFormData() {
    return this.baseDealerFormDataSubject;
  }

  convertDateToString(date: Date | string): string {
    if (date) {
      if (typeof date === "string") {
        date = this.convertStringToDate(date);
      }
      if (date instanceof Date && !isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      }
    }
    return "";
  }

  convertStringToDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    } else {
      return null;
    }
  }

  // getRBACData() {
  //   let params: any = this.route.snapshot.params;
  //   this.mode = params.mode || 'create';
  //   this.user_role = JSON.parse(sessionStorage.getItem('user_role'));
  //   if (this.user_role.functions) {
  //     Object.keys(this.user_role.functions).forEach((key) => {
  //       this.accessGranted[key] = this.validateAction(key);
  //     });

  //   }
  // }

  validateAction(functionName: string): any {
    let accessTypes = ["View", "Add", "Update"];
    const parameter: any = this.route.snapshot.params;
    const userRole = JSON.parse(sessionStorage.getItem("user_role"));
    if (
      this.accessMode == "edit" &&
      userRole?.functions?.[functionName]?.includes("Update") &&
      accessTypes.includes("Update")
    ) {
      return true;
    } else if (
      (this.accessMode === "create" || this.accessMode === "") &&
      userRole?.functions?.[functionName]?.includes("Add") &&
      accessTypes.includes("Add")
    ) {
      return true;
    } else if (
      this.accessMode === "view" &&
      userRole?.functions?.[functionName]?.includes("View") &&
      accessTypes.includes("View")
    ) {
      return true;
    } else {
      return false;
    }
  }

  private formDataCacheableRoutes: Set<string> = new Set();

  formDataCacheableRoute(routes: string[]) {
    routes.forEach((route) => {
      this.formDataCacheableRoutes.add(route.split("?")[0]);
    });
  }

  private inflightRequests = new Map<string, Promise<any>>();

  async getFormData(api: string, mapFunc?: MapFunc) {
    const cacheKey = api;
    const cacheKeyNoParams = api.split("?")[0];
    const isCacheable = this.formDataCacheableRoutes.has(cacheKeyNoParams);

    // ✅ First: check sessionStorage
    if (isCacheable) {
      const sessionData = sessionStorage.getItem(cacheKey);
      if (sessionData) {
        let result = JSON.parse(sessionData);
        return mapFunc ? mapFunc(result) : result;
      }
    }

    // ✅ Second: check if request is already in flight
    if (this.inflightRequests.has(cacheKey)) {
      return this.inflightRequests.get(cacheKey);
    }

    // ✅ Third: make the actual request and store the Promise
    const requestPromise = this.data
      .get(api)
      .toPromise()
      .then((res) => {
        // Only cache if there's no API error in the response
        const hasApiError = res?.apiError?.errors?.length > 0 || res?.Error?.Message ? true : false;
        if (isCacheable && !hasApiError) {
          sessionStorage.setItem(cacheKey, JSON.stringify(res));
        }
        return mapFunc ? mapFunc(res) : res;
      })
      .finally(() => {
        // Remove from inflight after completion
        this.inflightRequests.delete(cacheKey);
      });

    this.inflightRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }
}
