import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DealerComponent } from './dealer.component';

@NgModule({
    declarations: [DealerComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: DealerComponent, pathMatch: 'full' }])
    ]
})
export class DealerModule { }
