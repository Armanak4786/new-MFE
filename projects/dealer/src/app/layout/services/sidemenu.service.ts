import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidemenuService {
    private sidemenuExpandedSubject = new BehaviorSubject<boolean>(false);
    sidemenuExpanded$ = this.sidemenuExpandedSubject.asObservable();

    toggleSidemenu(expanded: boolean) {
        this.sidemenuExpandedSubject.next(expanded);
    }

    getSidemenuState() {
        return this.sidemenuExpandedSubject.getValue();
    }
}
