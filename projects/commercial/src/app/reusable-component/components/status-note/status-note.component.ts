import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonApiService } from '../../../services/common-api.service';

@Component({
  selector: 'app-status-note',
  templateUrl: './status-note.component.html',
  styleUrls: ['./status-note.component.scss'],
})
export class StatusNoteComponent {
  notesDataList: any = [];
  comments: any = '';
  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    private commonApiService: CommonApiService
  ) {}
  ngOnInit() {
    if (this.dynamicDialogConfig?.data) {
      const taskId = this.dynamicDialogConfig?.data.taskId;
      const params = {
        taskId: taskId,
      };
      this.fetchNotesByTaskId(params);
    }
  }
  async fetchNotesByTaskId(params) {
    try {
      this.notesDataList = await this.commonApiService.getNotesByTaskId(params);

      if (this.notesDataList && this.notesDataList.length > 0) {
        const lastNote = this.notesDataList[this.notesDataList.length - 1];
        this.comments = lastNote?.noteAttachmentId || '';
      }
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }
}
