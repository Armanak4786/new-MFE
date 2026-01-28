import { Injectable } from "@angular/core";
import { DataService } from "auro-ui";
import { BehaviorSubject } from "rxjs";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  userName: String;
  introducers: any;

  public quoteRoute = new BehaviorSubject<any>(false);
  public isProductSelected: boolean = false;
  public isDealerCalculated: boolean;

  constructor(
    public data: DataService,
  ) {
  }

  getUserCode(): string | null {
    const token = sessionStorage.getItem("accessToken");
    const decodedToken = this.decodeToken(token);
    return decodedToken?.preferred_username || decodedToken?.sub || null;
  }


  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }


  private currentRowDataSubject = new BehaviorSubject<any>(null);
  public currentRowData$ = this.currentRowDataSubject.asObservable();

  setCurrentRowData(data: any) {
    this.currentRowDataSubject.next(data);
  }

  getCurrentRowData() {
    return this.currentRowDataSubject.value;
  }

}
