import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren,
} from "@angular/core";
import { ReadNotesComponent } from "./read-notes.component";
import { CloseDialogData, CommonService } from "auro-ui";
import { EditNotesComponent } from "./edit-notes.component";
import { cloneDeep } from "lodash";
import { AddNotesComponent } from "./add-notes.component";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { map } from "rxjs";
import { DatePipe } from "@angular/common";
import { ToasterService, ValidationService } from "auro-ui";
import { DashboardService } from "../../../dashboard/services/dashboard.service";
import env from "../../../../../public/assets/api-json/en_US.json";
import configure from "../../../../../public/assets/configure.json";


@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"],
})
export class NotesComponent extends BaseStandardQuoteClass {
  notes = [];
  originatorNumber;
  introducers;
  baseData: any;
  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    public commonSvc: CommonService,
    public renderer: Renderer2,
    // private datePipe: DatePipe,
    private cd: ChangeDetectorRef,
    public toasterSvc: ToasterService,
    public validationSvc: ValidationService,
    public dashsvc: DashboardService
  ) {
    super(route, svc, baseSvc);

    effect(() => {
      let res = this.dashsvc?.onOriginatorChange();
      this.originatorNumber = res?.num;
      this.introducers = this.dashsvc.userOptions;
    })
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setHeight();
  }

  override async ngOnInit() {
    this.baseSvc.getBaseDealerFormData().subscribe((res) => {
      this.baseData = res;
    });
    await super.ngOnInit();
    // this.dashsvc.onOriginatorChange.subscribe(async (res) => {
    //   this.originatorNumber = res?.num;
    //   this.introducers = this.dashsvc.userOptions;
    // });

    await this.baseSvc.getFormData(
      `Note/get_all_notes?ContractId=${this.baseData.contractId}`,
      (res) => {
        if (res) {
          this.notes = res.items.filter(note => 
            note.securityClassification === "General"
          );
        }
      }
    );

    this.baseSvc.setBaseDealerFormData({ notes: this.notes });
    this.filteredContent = cloneDeep(this.notes);
    this.cd.detectChanges();
    await this.updateValidation("onInit");
    this.setHeight();
  }

  isNotesDisabled() {
  if(configure?.workflowStatus?.view?.includes(this.baseFormData?.AFworkflowStatus)){
    return true;
  }
  return false;
}

  filteredContent: any;
  searchNotes?: string;

  @ViewChildren("notesCard") notesCard: QueryList<ElementRef>;

  // setHeight() {
  //   let maxHeight = 0;
  //   this.notesCard.forEach((divElement, index) => {
  //     const divHeight = divElement.nativeElement.offsetHeight;

  //     if (maxHeight < divHeight) {
  //       maxHeight = divHeight;
  //     }
  //   });

  //   this.notesCard.forEach((divElement, index) => {
  //     this.renderer.setStyle(
  //       divElement.nativeElement,
  //       "height",
  //       `${maxHeight}px`
  //     );
  //   });
  // }

  // Add this method
ngAfterViewChecked() {
  this.setHeight();
}

// Update setHeight to use setTimeout
setHeight() {
  setTimeout(() => {
    if (this.notesCard && this.notesCard.length > 0) {
      let maxHeight = 0;
      this.notesCard.forEach((divElement) => {
        const divHeight = divElement.nativeElement.offsetHeight;
        if (maxHeight < divHeight) {
          maxHeight = divHeight;
        }
      });

      this.notesCard.forEach((divElement) => {
        this.renderer.setStyle(
          divElement.nativeElement,
          "height",
          `${maxHeight}px`
        );
      });
    }
  });
}

  expandNotes(index) {
    this.showReadNotes({ ...this.filteredContent[index] });
  }

  editNotes(index) {
    if (this.baseSvc?.accessMode != "view") {
      this.showEditNotes({ ...this.notes[index], index: index });
    }

    setTimeout(() => {
      this.setHeight();
    }, 2000);
  }

  addNotes() {
    if (this.baseSvc?.accessMode != "view") {
      this.showAddNotes();
    }
  }

  showReadNotes(note) {
    this.commonSvc.dialogSvc
      .show(ReadNotesComponent, note?.user?.name || "User Name", {
        templates: {
          footer: null,
        },
        data: note,
        width: "40vw",
      })
      .onClose.subscribe((data: CloseDialogData) => {});
  }

  showEditNotes(note) {
    this.commonSvc.dialogSvc
      .show(EditNotesComponent, "Edit Note", {
        templates: {
          footer: null,
        },
        data: note,
        width: "40vw",
      })
      .onClose.subscribe(async (res: any) => {
        if (res?.btnType == "submit") {
          let response = await this.updateNotesApi(res.data);
          this.notes[res.data.index] = response[0];
          this.baseSvc.setBaseDealerFormData({ notes: this.notes });
          this.filteredContent = cloneDeep(this.notes);
          this.cd.detectChanges();
          this.setHeight();
        }
      });
  }

  async putFormData(api: string, payload: any, params?: any) {
    return await this.commonSvc.data
      .put(api, payload, params)
      .pipe(
        map((res) => {
          return res.data;
        })
      )
      .toPromise();
  }

  getOriginatorIdByNo(originatorNo: number): number | null {
    const found = this.introducers.find(
      (item) => item.originatorNo === originatorNo
    );
    return found ? found.originatorId : 0;
  }
  async updateNotesApi(data) {
    let payload = {
      aPNoteCreations: [
        {
          activityArea: env.labelData.securityClassification,
          addNote: data.note,
          contractId: this.baseFormData?.contractId,
          dateStamp: new DatePipe("en-US").transform(
            this.convertDateToString(new Date()),
            "YYYY-MM-ddTHH:mm:ss.SS"
          ),
          isManual: false,
          noteId: data.noteId,
          noteType: env.labelData.portalNote,
          subject:env.labelData.subjectForNotes,
          // partyNoteRequest: {
          //   partyId: this.getOriginatorIdByNo(this.originatorNumber),
          //   partyNo: this.originatorNumber,
          // },
          securityClassification: env.labelData.securityClassification,
          taskId: 0,
          timeStamp: new DatePipe("en-US").transform(
            this.convertDateToString(new Date()),
            "YYYY-MM-ddTHH:mm:ss.SS"
          ),
        },
      ],
    };

    let res = await this.putFormData("Note/update_note", payload);

    return res;
  }

  showAddNotes() {
    this.commonSvc.dialogSvc
      .show(AddNotesComponent, "Add Note", {
        templates: {
          footer: null,
        },
        width: "40vw",
      })
      .onClose.subscribe(async (res: CloseDialogData) => {
        if (res.btnType == "submit") {
          let data = await this.addNotesApi(res.data);

          this.notes.push(data);
          this.baseSvc.setBaseDealerFormData({ notes: this.notes });
          this.filteredContent = cloneDeep(this.notes);
          this.cd.detectChanges();
          this.setHeight();
        }
      });
  }

  async addNotesApi(note) {
    let payload = {
      aPNoteCreations: [
        {
          activityArea: env.labelData.securityClassification,
          addNote: note,
          contractId: this.baseFormData?.contractId,
          dateStamp: new DatePipe("en-US").transform(
            this.convertDateToString(new Date()),
            "YYYY-MM-ddTHH:mm:ss.SS"
          ),
          isManual: false,
          noteId: 0,
          noteType: env.labelData.portalNote,
          subject:env.labelData.subjectForNotes,
          // partyNoteRequest: {
          //   partyId: this.getOriginatorIdByNo(this.originatorNumber),
          //   partyNo: this.originatorNumber,
          // },
          securityClassification: env.labelData.securityClassification,
          taskId: 0,
          timeStamp: new DatePipe("en-US").transform(
            this.convertDateToString(new Date()),
            "YYYY-MM-ddTHH:mm:ss.SS"
          ),
        },
      ],
    };

    let response = await this.commonSvc.data
      ?.post("Note/create_note", payload)
      ?.pipe(
        map((res) => {
          return res.data?.[0];
        })
      )
      .toPromise();

    return response;
  }

  formatDate(dateString) {
    const date = new Date(dateString);

    // Get day, month, year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    // Get hours, minutes and format AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const strTime = hours + ":" + minutes + " " + ampm;

    return `${day}/${month}/${year} | ${strTime}`;
  }

  filterNotes() {
    if (this.searchNotes) {
      this.filteredContent = this.notes.filter((data) =>
        data.addNote.toLowerCase().includes(this.searchNotes.toLowerCase()) || data?.user?.name.toLowerCase().includes(this.searchNotes.toLowerCase())
      );
    } else {
      this.filteredContent = cloneDeep(this.notes);
    }

    this.setHeight();
  }

  // deleteNotes(index) {
  //   if (this.baseSvc?.accessMode != "view") {
  //     this.notes.splice(index, 1);
  //     this.baseSvc.setBaseDealerFormData({ notes: this.notes });
  //     this.filteredContent = cloneDeep(this.notes);
  //   }
  // }

  deleteNotes(index) {
    if (this.baseSvc?.accessMode !== "view") {
      const noteToDelete = this.notes[index];

      const payload = {
        contractId: noteToDelete.contractId,
        noteId: noteToDelete.noteId,
      };

      this.commonSvc.data.delete("Note/delete_note", payload).subscribe();

      this.notes.splice(index, 1);
      this.baseSvc.setBaseDealerFormData({ notes: this.notes });
      this.filteredContent = cloneDeep(this.notes);
      this.cd.detectChanges();
    }
  }

  pageCode: string = "StandardQuoteComponent";
  modelName: string = "NotesComponent";

  override async onFormReady(): Promise<void> {
    await this.updateValidation("onInit");
    super.onFormReady();
  }

  override async onBlurEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  override async onValueEvent(event): Promise<void> {
    await this.updateValidation(event);
  }

  async updateValidation(event) {
    const req = {
      form: this.mainForm?.form,
      formConfig: this.formConfig,
      event: event,
      modelName: this.modelName,
      pageCode: this.pageCode,
    };

    var responses: any = await this.validationSvc.updateValidation(req);
    if (responses.formConfig && !responses.status) {
      this.formConfig = { ...responses.formConfig };

      this.cd.detectChanges();
    }
  }

  override async onStepChange(quotesDetails: any): Promise<void> {
    if (quotesDetails.type !== "tabNav") {
      var result: any = await this.updateValidation("onSubmit");
      if (!result?.status) {
        // this.toasterSvc.showToaster({
        //   severity: 'error',
        //   detail: 'I7',
        // });
      }
    }
  }
}
