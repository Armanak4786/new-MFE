import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseStandardQuoteClass } from "../../base-standard-quote.class";
import { ActivatedRoute } from "@angular/router";
import { StandardQuoteService } from "../../services/standard-quote.service";
import { map } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "auro-ui";

@Component({
  selector: "app-additional-approval",
  templateUrl: "./additional-approval.component.html",
  styleUrl: "./additional-approval.component.scss",
})
export class AdditionalApprovalComponent extends BaseStandardQuoteClass {
  // additionalApprovalForm: FormGroup;

  workFlowId: any;
  workFlowName: any;
  statusOptions = [
    { label: "Pending", value: false },
    { label: "Completed", value: true },
  ];

  additionalApprovalForm: FormGroup;

  columns = [
    { field: "checklist", headerName: "Checklist" },
    {
      field: "status",
      headerName: "Status",
      options: this.statusOptions,
      format: "#dropdown",
    },
    { field: "noteDiscrpition", headerName: "Notes", width: "17rem" },
    { field: "assignee", headerName: "Assignee" },
  ];

  dataList = [];

  constructor(
    public override route: ActivatedRoute,
    public override svc: CommonService,
    override baseSvc: StandardQuoteService,
    // private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    public fb: FormBuilder // public authSvc: AuthenticationService
  ) {
    super(route, svc, baseSvc);
    this.additionalApprovalForm = new FormGroup({
      additionalApprovalFormArray: new FormArray([]),
    });
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();

    if (this.baseFormData?.contractId) {
      this.getAdditionalApprovalList();

      await this.getState();
    }
  }

  async getState() {
    let state = await this.svc.data
      .get(
        `WorkFlows/get_workflownamestate?ContractId=${this.baseFormData?.contractId}&WorkflowName=Application`
      )
      .pipe(
        map((res) => {
          return res?.data;
        })
      )
      .toPromise();

    this.workFlowId = state?.currentState?.id;
    this.workFlowName = state?.currentState?.name;
  }

  // async getToDosApi() {
  //   let data = await this.svc.data
  //     .get(`WorkFlows/get_workflowstate?contractId=${this.baseFormData.contractId}&workflowName=Application`)
  //     .pipe(
  //       map((res) => {
  //         return res?.items;
  //       })
  //     )
  //     .toPromise();

  //   this.cd.detectChanges();

  // }

  async getAdditionalApprovalList() {
    // const contractId = this.contractId ? this.contractId: 4678;
    const contractId = this.baseFormData?.contractId;
    let additionalData = await this.svc.data
      .get(
        `WorkFlows/get_workflowstate?ContractId=${contractId}&workflowName=Application`
      )
      .pipe(
        map((res) => {
          return res?.items;
        })
      )
      .toPromise();
    this.dataList = additionalData.map(({ assignedToUser, ...rest }) => ({
      assignee: assignedToUser.name,
      ...rest,
    }));

    this.segregateAdditionalApprovalList(additionalData);
  }

  getAdditionalApproval(): FormArray {
    return this.additionalApprovalForm.get(
      "additionalApprovalFormArray"
    ) as FormArray;
  }

  createAdditionalApprovalCondition(): FormGroup {
    const Id = this.getAdditionalApproval().length;
    return this.fb.group({
      documentId: Id,
      workflowTodoId: [0],
      uploaded: [false],
      checklist: ["", [Validators.required]],
      status: [false],
      deferDate: [""],
      stateName: [],
      stateNameId: [],
      noteDiscrpition: [""],
      mandetory: [],
    });
  }

  addAdditionalApproval(): void {
    const additionalApprovalForm = this.createAdditionalApprovalCondition();
    (
      this.additionalApprovalForm.get(
        "additionalApprovalFormArray"
      ) as FormArray
    ).push(additionalApprovalForm);
  }

  disableIfChecklistIsEmpty(index: number): boolean {
    const formArray = this.additionalApprovalForm.controls[
      "additionalApprovalFormArray"
    ] as FormArray;
    const formGroup = formArray.at(index) as FormGroup;
    const checklist = formGroup.get("checklist");
    if (!checklist?.value) {
      return true;
    } else {
      return false;
    }
  }

  uploadedAdditionalListData: any[];

  segregateAdditionalApprovalList(response: any) {
    this.uploadedAdditionalListData = response;
    if (
      this.uploadedAdditionalListData &&
      this.uploadedAdditionalListData.length > 0
    ) {
      this.getUploadedAdditionalListFromApi();
    }
    this.cd.detectChanges();
  }

  isToDoAdded: boolean = true;
  incrementAdditionalList() {
    this.addAdditionalApproval();
    this.isToDoAdded = false;
  }

  getUploadedAdditionalListFromApi() {
    let additionalApprovalFormArray = this.additionalApprovalForm.get(
      "additionalApprovalFormArray"
    ) as FormArray;

    this.uploadedAdditionalListData.forEach((ele) => {
      let uploadedDocsGroup = this.fb.group({
        documentId: [ele?.documentId],
        workflowTodoId: [ele?.workflowTodoId],
        stateName: [ele?.stateName],
        stateNameId: [ele?.stateNameId],
        checklist: [ele?.checklist, [Validators.required]],
        status: [ele?.status],
        uploaded: [ele?.status],
        deferDate: [ele?.deferDate ? new Date(ele?.deferDate) : null],
        noteDiscrpition: [ele?.noteDiscrpition],
        assignTo: [ele?.assignedToUser?.name],
        mandetory: [ele?.mandetory],
      });
      additionalApprovalFormArray.push(uploadedDocsGroup);
    });
  }

  // hello(hh) {
  //   console.log("kjhkj", hh);

  // }

  isStatusCompletedForAllRows(): boolean {
    const formArray = this.getAdditionalApproval();

    for (let i = 0; i < formArray.length; i++) {
      const formGroup = formArray.at(i) as FormGroup;
      const status = formGroup.get("status")?.value;
      if (!status) {
        return false;
      }
    }
    return true;
  }

  async onOkBoxClicked(index: number, event: any) {
    // console.log("kjhgjgkugkgkgk");(todo.value.workflowTodoId>0)

    const formArray = this.additionalApprovalForm.get(
      "additionalApprovalFormArray"
    ) as FormArray;
    const formGroup = formArray.at(index) as FormGroup;
    if (formGroup.value.workflowTodoId > 0) {
      await this.updateToDo(formGroup);
      // console.log("hellooooo");

      formGroup.get("uploaded").patchValue(formGroup.value.status);
      this.cd.detectChanges();
    } else {
      let workflowData = await this.postToDo(formGroup);
      // console.log("workflowTodoId", workflowTodoId);

      formGroup.get("workflowTodoId").patchValue(workflowData?.workflowTodoId);
      formGroup.get("stateName").patchValue(workflowData?.stateName);
      formGroup.get("stateNameId").patchValue(workflowData?.stateNameId);

      formGroup.get("uploaded").patchValue(formGroup.value.status);
      this.cd.detectChanges();
      // this.isToDoAdded = false;
    }
  }
  async postToDo(formGroup: any) {
    // const contractId = this.contractId ? this.contractId: 4678;
    const contractId = this.baseFormData?.contractId;
    let data = formGroup.value;
    let postData = null;

    const request = {
      flowRequests: [
        {
          checklist: data?.checklist,
          status: data?.status,
          deferDate: null,
          noteDiscrpition: data?.noteDiscrpition,
          stateName: this.workFlowName,
          stateNameId: this.workFlowId,
        },
      ],
    };
    let resData = await this.svc.data
      .post(
        `WorkFlows/add_workflowTodo?ContractId=${contractId}&workflowName=Application`,
        request
      )
      .pipe(
        map((res) => {
          if (res?.data[0]?.workflowTodoId) {
            // this.ngOnInit();
            // workflowTodoId = res?.data[0]?.workflowTodoId;
            this.isToDoAdded = true;
            //  console.log("disable checkbox");
          }
          return res?.data;
        })
      )
      .toPromise();

    if (resData) {
      postData = resData[0];
    }
    this.cd.detectChanges();
    return postData;
  }

  async updateToDo(formGroup) {
    // const contractId = this.contractId ? this.contractId: 4678;
    const contractId = this.baseFormData?.contractId;
    let data = formGroup.value;
    const request = {
      flowRequests: [
        {
          workflowTodoId: data?.workflowTodoId,
          checklist: data?.checklist,
          status: data?.status,
          deferDate: null,
          stateName: data?.stateName,
          stateNameId: data?.stateNameId,
          mandetory: data?.mandetory || false,
          noteDiscrpition: data?.noteDiscrpition,
          assignedToUser: {
            name: data?.assignTo,
          },
        },
      ],
    };
    await this.svc.data
      .put(
        `WorkFlows/update_workflowTodo?ContractId=${contractId}&workflowName=Application`,
        request
      )
      .pipe(
        map((res) => {
          // console.log("byeeee");

          if (this.isStatusCompletedForAllRows()) {
            /////State managment
            //  this.hideNext = true
          }
        })
      )
      .toPromise();
    this.cd.detectChanges();
  }
}
