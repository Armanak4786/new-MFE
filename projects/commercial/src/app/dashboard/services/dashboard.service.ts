import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn: "root",
})
export class DashboardService {
    userName: String;
    userSelectedOption: any;
    userSelectedPartyNo: any;
    userOptions: any;
    userCodeName: any;
    dealerAnimate: boolean = false;

    public quoteRoute = new BehaviorSubject<any>(false);

    constructor() { }

    decodeToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    }

    setDealerToLocalStorage(value: any) {
        if (value?.num) {
            sessionStorage.setItem("dealerPartyNumber", value.num);
        }
        if (value?.name) {
            sessionStorage.setItem("dealerPartyName", value.name);
        }
        this.userSelectedOption = value;
    }

    callOriginatorApi() {
        // Placeholder for commercial - can be implemented if needed
    }
}
