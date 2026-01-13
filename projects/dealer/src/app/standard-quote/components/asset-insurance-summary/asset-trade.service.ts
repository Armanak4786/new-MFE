import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
 
@Injectable({
  providedIn: "root",
})
export class AssetTradeSummaryService {
  actions = [
    {
      action: "edit",
      name: "edit",
      icon: "fa-regular fa-pen-to-square",
      color: "--primary-color",
    },
    {
      action: "copy",
      name: "copy",
      icon: "fa-regular fa-clone",
      color: "--primary-color",
    },
    {
      action: "delete",
      name: "delete",
      icon: "fa-regular fa-trash-can",
      color: "--red-600",
    },
  ];
 
  assetList = [];
  tradeList = [];
  insuranceList = [];
  deleteAssetList = [];
 
  assetListSubject = new BehaviorSubject<any>(this.assetList);
  insuranceListSubject = new BehaviorSubject<any>(this.insuranceList);
  tradeListSubject = new BehaviorSubject<any>(this.tradeList);
  assetSearchSubject = new BehaviorSubject<any>(null);
  existingTradeListSubject = [];
 
 
 
  assetSearchResult = [];
  searchAssetData: any = [];
  assetEditData: any = {};
  tradeEditData: any = {};
  assetEditIndex: any;
  tradeEditIndex: any;
 private tradeAmountForAddTradeSubject = new BehaviorSubject<number>(0);
  public tradeAmountForAddTrade$ = this.tradeAmountForAddTradeSubject.asObservable();
  
  
  updateTradeAmountForAddTrade(amount: number) {
    this.tradeAmountForAddTradeSubject.next(amount);
    
  }
  
  
  getCurrentTradeAmountForAddTrade(): number {
    return this.tradeAmountForAddTradeSubject.value;
  }
  resetData() {
    this.assetList = [];
    this.tradeList = [];
    this.insuranceList = [];
 
    this.assetSearchResult = [];
    this.assetEditData = {};
    this.tradeEditData = {};
    this.assetEditIndex = null;
    this.tradeEditIndex = null;
    this.assetListSubject.next(this.assetList);
    this.insuranceListSubject.next(this.insuranceList);
    this.tradeListSubject.next(this.tradeList);
 
    // this.assetSearchSubject.next(this.assetEditData);
  }
}
 