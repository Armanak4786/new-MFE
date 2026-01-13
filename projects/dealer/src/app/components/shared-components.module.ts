import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuroUiFrameWork } from 'auro-ui';
import { AfvAssetTypesComponent } from './afv-asset-types/afv-asset-types.component';
import { AssetTypesComponent } from './asset-types/asset-types.component';
import { CustomerTypeComponent } from './customer-type/customer-type.component';
import { AddContactsComponent } from './add-contacts/add-contacts.component';

@NgModule({
    declarations: [
        AfvAssetTypesComponent,
        AssetTypesComponent,
        CustomerTypeComponent,
        AddContactsComponent
    ],
    imports: [
        CommonModule,
        AuroUiFrameWork
    ],
    exports: [
        AfvAssetTypesComponent,
        AssetTypesComponent,
        CustomerTypeComponent,
        AddContactsComponent
    ]
})
export class SharedComponentsModule { }
