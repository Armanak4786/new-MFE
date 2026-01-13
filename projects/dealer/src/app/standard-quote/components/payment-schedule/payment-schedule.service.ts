import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentScheduleService {
  constructor() {}
  paymentScheduleList: any[] = [];
}
