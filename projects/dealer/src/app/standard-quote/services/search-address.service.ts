import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService, environment } from 'auro-ui';
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchAddressService {
  private physicalAddressData$ = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, public commonService: CommonService) { }

  searchAddress(query: string): Observable<any[]> {
    const url = `${environment.apiUrl}/CustomerDetails/searchAddress?AddressSearch=${query}`;
    // this.commonService.data.get(url)
    return this.http.get<any>(url).pipe(
      map(res => Array.isArray(res?.items) ? res.items : [])
    );
  }

  getExternalAddressDetails(externalAddressLookupKey: string): Observable<any> {
    const url = `${environment.apiUrl}/CustomerDetails/ExternalAddresses`;
    const requestBody = { externalAddressLookupKey: externalAddressLookupKey };
    return this.http.post<any>(url, requestBody);
  }

  //  getAddressDetailsBySearch(query: string): Observable<any[]> {
  //   return this.searchAddress(query).pipe(
  //     switchMap(addressList => {
  //       const requests = addressList
  //         .filter(address => address.externalAddressLookupKey)
  //         .map(address =>
  //           this.getExternalAddressDetails(address.externalAddressLookupKey)
  //         );

  //       if (requests.length === 0) {
  //         return of([]);
  //       }

  //       return forkJoin(requests).pipe(
  //         map(results => results.map(r => r.data)) 
  //       );
  //     })
  //   );
  // }

  /**
   * Sanitizes street address value by replacing newlines with spaces
   * - Replaces \r\n, \n, \r with spaces
   * - Normalizes multiple spaces to single space
   * - Trims the result
   * This ensures the value matches validation pattern ^[a-zA-Z0-9 ]*$
   */
  sanitizeStreetValue(value: string): string {
    if (!value) return '';
    
    return value
      .replace(/\r\n/g, ' ')  // Replace \r\n with space
      .replace(/\n/g, ' ')      // Replace \n with space
      .replace(/\r/g, ' ')     // Replace \r with space
      .replace(/\s+/g, ' ')     // Normalize multiple spaces to single space
      .trim();                  // Trim leading/trailing spaces
  }

  mapAddressJsonToFormControls(response: any, addressType: string): any {
    const prefix = addressType.toLowerCase(); // or keep as is, depending on your naming convention

    const componentMap: { [key: string]: string } = {
      BuildingName: "BuildingName",
      FloorType: "FloorType",
      FloorNo: "FloorNumber",
      UnitType: "UnitType",
      UnitLot: "UnitNumber",
      StreetNo: "StreetNumber",
      StreetName: "StreetName",
      StreetType: "StreetType",
      StreetDirection: "StreetDirection",
      RuralDelivery: "RuralDelivery"
    };

    const data = response?.data;
    const result: any = {};

    if (data?.addressComponents) {
      data.addressComponents.forEach((component: any) => {
        const formKey = componentMap[component.type];
        if (formKey) {
          result[`${prefix}${formKey}`] = component.value;
        }
      });
    }

    // Add static mappings from other fields
    result[`${prefix}Suburbs`] = data?.suburb || '';
    result[`${prefix}City`] = data?.city?.extName || '';
    result[`${prefix}Postcode`] = data?.zipCode || '';
    result[`${prefix}Country`] = data?.countryRegion?.extName || '';
    // Always sanitize street value to match validation pattern ^[a-zA-Z0-9 ]*$
    result[`${prefix}StreetArea`] = this.sanitizeStreetValue(data?.street || '');

    return result;
  }

  setPhysicalAddressData(data: any) {
    this.physicalAddressData$.next(data);
  }

  getPhysicalAddressData() {
    return this.physicalAddressData$.asObservable();
  }

}
