import { Component } from '@angular/core';

@Component({
    selector: 'app-dealer',
    template: `
        <div class="dealer-container">
            <h1>Dealer Module</h1>
            <router-outlet></router-outlet>
        </div>
    `
})
export class DealerComponent { }
