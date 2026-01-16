import { Component, Input } from '@angular/core';
import { bailmentNotesColumnDefs } from '../../utils/bailment-header.utils';
import { CommonApiService } from '../../../services/common-api.service';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-bailment-notes',
  // standalone: true,
  // imports: [],
  templateUrl: './bailment-notes.component.html',
  styleUrls: ['./bailment-notes.component.scss'],
})
export class BailmentNotesComponent {
  @Input() bailmentNotesColumnDefs = bailmentNotesColumnDefs;
  @Input() notesDataList: any[] = [];
  textAreaValue = '';

  constructor(private commonApiService: CommonApiService) {}

  async onNotesActionClicked(event) {
    this.bailmentNotesColumnDefs = bailmentNotesColumnDefs;
    event.cellData[0].icon = 'pi pi-circle-on';
    const params = {
      ContractId: event.rowData.contractId,
      noteId: event.rowData.noteId,
      CSSNote: true,
    };

    await this.fetchComments(params);
  }

  async fetchComments(params) {
    try {
      const comment = await this.commonApiService.getNoteComments(params);
      if (comment != undefined) {
        this.textAreaValue = comment;
      } else {
        this.textAreaValue = '';
      }
    } catch (error) {
      console.log('Error while loading documents data', error);
    }
  }
}
