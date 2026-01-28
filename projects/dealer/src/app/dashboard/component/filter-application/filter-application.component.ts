import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseFormClass, CommonService } from 'auro-ui';
import { DashboardService } from '../../services/dashboard.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuickQuoteService } from '../../../quick-quote/services/quick-quote.service';



@Component({
  selector: 'app-filter-application',
  templateUrl: './filter-application.component.html',
  styleUrl: './filter-application.component.scss'
})
export class FilterApplicationComponent extends BaseFormClass {
  fields : any;


 constructor(
    public override route: ActivatedRoute,
    private service: DashboardService,
    public commonSvc: CommonService,
    public quickQuoteService: QuickQuoteService,
    private cdr: ChangeDetectorRef
  ) { super(route, commonSvc);
     let accessToken = sessionStorage.getItem("accessToken");
    let decodedToken = this.service?.decodeToken(accessToken);
    this.svc.data.getCacheableRoutes([`CustomerDetails/get_defaultOperatingUnit?userCode=${decodedToken?.sub}`])
   }


//    ngOnInit() {
 
//   this.updateVisibleFields()
//  }
  override async ngOnInit() {
    await super.ngOnInit();

     let accessToken = sessionStorage.getItem("accessToken");
    let decodedToken = this.service?.decodeToken(accessToken);

    const previouslySelected = this.quickQuoteService.getOperatingUnit();

    await this.svc?.data
  ?.get(`CustomerDetails/get_defaultOperatingUnit?userCode=${decodedToken?.sub}`)
  .subscribe((res: any) => {

    const response = res?.data?.data?.responseMessage?.[0];

    const operatingUnit = response?.operatingUnit;
    const allowedUnits = response?.allowedOperatingUnits.filter(
                         unit => unit.partyId !== operatingUnit?.partyId
                        ) ?? [];

   
    const operatingUnitEntry = operatingUnit
      ? [{ ...operatingUnit, checked: true }]
      : [];

    if(operatingUnitEntry?.length){
    this.quickQuoteService.setOperatingUnit(operatingUnitEntry);
    }
    const allowedUnitEntries = allowedUnits.map((u: any) => ({
      ...u,
      checked: false
    }));


    let apiField = [...operatingUnitEntry, ...allowedUnitEntries];

      this.fields = apiField
   
      this.updateVisibleFields();
    });

   
  }

 showAll = false;
 visibleFields: any[] = [];

 selectAll = false;
 allSelected = false;

updateVisibleFields() {
  

    if (this.showAll) {
    this.visibleFields = [...this.fields];
  } else {
    this.visibleFields = this.fields.slice(0, 3); 
  }
}

toggleShowAll() {
  this.showAll = !this.showAll;
  this.updateVisibleFields();
}

 getSelected(field:any){
  const previouslySelected = this.quickQuoteService.getOperatingUnit();
  const selectedFields = this.fields.filter(field => field.checked);
  if(field?.checked){
  let fieldsToAdd = selectedFields.filter(field => 
    !previouslySelected?.some((p: any) => p.partyId === field.partyId)
  );
  this.quickQuoteService.setOperatingUnit(previouslySelected ? [...previouslySelected, ...fieldsToAdd] : fieldsToAdd);
  }
  else{
    let updatedSelection = previouslySelected?.filter((p: any) => p.partyId !== field.partyId);
    this.quickQuoteService.setOperatingUnit(updatedSelection);
  }
  
 }


 getAllSelected(){
  if(this.selectAll){
  this.fields.forEach(field => field.checked = true);
  }
  else{
    this.fields.forEach(field => field.checked = false);
  }
  const selectedFields = this.fields.filter(field => field.checked);
  this.quickQuoteService.setOperatingUnit(selectedFields);
 }

 search(){

 }

clearFilters() {
  this.selectAll = false;
    this.fields.forEach(f => (f.checked = false));
    // this.allSelected = false;
    this.showAll = false;
    this.updateVisibleFields();
    this.quickQuoteService?.setOperatingUnit(null)
    }
}
