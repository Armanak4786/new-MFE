import { Component, input, Input } from '@angular/core';
import { curtailmentPlanColumnDefs } from '../../utils/bailment-header.utils';
import { subventionColumnDefs } from '../../utils/bailment-header.utils';
import { CommonApiService } from '../../../services/common-api.service';
import { ComponentLoaderService } from '../../../assetlink/services/component-loader.service';


@Component({
  selector: 'app-bailment-curtailment-details',
  // standalone: false,
  // imports: [],
  templateUrl: './bailment-curtailment-details.component.html',
  styleUrls: ['./bailment-curtailment-details.component.scss']
})
export class BailmentCurtailmentDetailsComponent {
Id : number;
@Input() curtailmentPlanName: string = '';
@Input() subventionColumnDefs =  subventionColumnDefs;
@Input() curtailmentPlanColumnDefs = curtailmentPlanColumnDefs;
@Input() curtailmentDetailsData: any[] = [];
@Input() subventionData: any[] = [];

  constructor(
    private componentLoaderService: ComponentLoaderService,
    public commonApiService: CommonApiService
  ){}

}





