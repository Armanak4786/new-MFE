import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawdownService {
    private formData = new BehaviorSubject<any>(null);
    formData$ = this.formData.asObservable();

    private drawdown = new BehaviorSubject<any>(null);
    drawdown$ = this.drawdown.asObservable();

    constructor() { }

    updateFormData(data: any) {
        this.formData.next(data);
    }

    getFormData() {
        return this.formData.getValue();
    }
}
