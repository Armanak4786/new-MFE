import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotesParams } from '../../utils/common-interface';
import { CommonSetterGetterService } from '../../services/common-setter-getter/common-setter-getter.service';
import { CommonApiService } from '../../services/common-api.service';
import { formatDateTime, mapAttachments } from '../../utils/common-utils';
import { documentActions } from '../../utils/common-header-definition';

@Component({
  selector: 'app-notes',
  //standalone: true,
  //imports: [],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
  @Output() seletedNoteDocumentEmit = new EventEmitter<any>();
  @Input() notesColumnDefs;
  @Input() notesDataList;
  @Input() originalDataList;
  comments: any = '';
  seletedNote;

  constructor(private commonApiService: CommonApiService) {}

  ngOnChanges() {
    if (this.notesDataList?.length) {
      const lastNoteIndex = this.notesDataList.length - 1;

      // Clone the note to avoid direct mutation (optional but safer)
      const updatedNote = {
        ...this.notesDataList[lastNoteIndex],
        action: this.notesDataList[lastNoteIndex].action.map((action) =>
          action.name === 'view'
            ? { ...action, icon: 'pi pi-check-circle' }
            : action
        ),
      };
      this.notesDataList[lastNoteIndex] = updatedNote;
      // Replace only the updated note
      if (!updatedNote.hasOwnProperty('comments')) {
        this.notesDataList[lastNoteIndex] = updatedNote;
        const noteId = this.originalDataList[lastNoteIndex].id;
        const params = { noteId: noteId };
        this.fetchNotesDocumentsById(params, noteId);
      } else {
        this.comments = updatedNote.comments || '';
      }
    }
  }

  onNotesActionClicked(event) {
    // Update comments from selected row
    this.comments = event.rowData?.comments || '';

    // Loop through all notes and update their icons
    this.notesDataList = this.notesDataList.map((note) => {
      return {
        ...note,
        action: note.action?.map((action) => {
          if (action.name === 'view') {
            return {
              ...action,
              icon:
                note === event.rowData
                  ? 'pi pi-check-circle'
                  : 'pi pi-circle-off',
            };
          }
          return action;
        }),
      };
    });
  }

  async fetchNotesDocumentsById(params: NotesParams, seletedNote?) {
    try {
      const document =
        await this.commonApiService.getWholesaleRequestHistoryNotes(params);
      // downloadBase64File(document);
      this.comments = document?.comments;
      const processedData = mapAttachments(document);
      processedData.forEach((doc) => {
        doc.actions = documentActions;
        if (doc.loaded) {
          //use to transform date to DD/MM/YYYY HH:MM AM/PM
          doc.loaded = formatDateTime(doc.loaded);
        }
      });
      this.seletedNoteDocumentEmit.emit({
        documentList: processedData,
        seletedNote: seletedNote,
      });
      return document;
    } catch (error) {
      console.log('Error while loadding document by Id data', error);
    }
  }
}
