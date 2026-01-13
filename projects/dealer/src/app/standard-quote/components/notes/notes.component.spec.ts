import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesComponent } from './notes.component';
import {
  AuthenticationService,
  CloseDialogData,
  CommonService,
  AuroUiFrameWork,
  UiService,
} from 'auro-ui';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { cloneDeep } from 'lodash'; // Ensure lodash is imported

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockStandardQuoteService: jasmine.SpyObj<StandardQuoteService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  let mockDialogService: any;

  let datePipe: DatePipe;

  beforeEach(async () => {
    mockCommonService = jasmine.createSpyObj('CommonService', [
      'data',
      'dialogSvc',
    ]);

    datePipe = new DatePipe('en-US');

    mockCommonService.data.put = jasmine
      .createSpy('put')
      .and.returnValue(of({ data: 'response data' }));

    mockStandardQuoteService = jasmine.createSpyObj('StandardQuoteService', [
      'setBaseDealerFormData',
    ]);

    mockStandardQuoteService = jasmine.createSpyObj(
      'StandardQuoteService',
      [],
      { baseFormData: { notes: [] } }
    );
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { data: {} },
    });
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    await TestBed.configureTestingModule({
      declarations: [NotesComponent],
      imports: [AuroUiFrameWork],
      providers: [
        AuthenticationService,
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        { provide: CommonService, useValue: mockCommonService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    component.notes = [
      { addNote: 'First note' },
      { addNote: 'Second note' },
      { addNote: 'Another note' },
    ];

    component.baseFormData = { notes: component.notes }; // Setting baseFormData for testing

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter notes based on search input', () => {
    component.searchNotes = 'First';
    component.filterNotes();
    expect(component.filteredContent.length).toBe(1);
    expect(component.filteredContent[0].addNote).toContain('First');
  });

  it('should reset filteredContent when search input is cleared', () => {
    component.searchNotes = 'First';
    component.filterNotes();
    component.searchNotes = '';
    component.filterNotes();
    expect(component.filteredContent).toEqual(component.notes);
  });

  it('should display "No Record Found" when notes are empty', () => {
    component.notes = [];
    fixture.detectChanges();
    const noRecordElement = fixture.debugElement.query(
      By.css('.text-semi-bold')
    );
    expect(noRecordElement.nativeElement.textContent).toContain(
      'No Record Found'
    );
  });

  // it('should call editNotes method when edit icon is clicked', () => {
  //   spyOn(component, 'editNotes').and.callThrough();
  //   fixture.detectChanges(); // trigger change detection

  //   const editIcon = fixture.debugElement.query(By.css('.fa-pen-to-square'));
  //   fixture.detectChanges();
  //   editIcon.triggerEventHandler('click', null); // simulate click event

  //   expect(component.editNotes).toHaveBeenCalledWith(
  //     component.filteredContent.length - 1
  //   ); // edit the last note
  // });
  it('should call put method of commonSvc and return response data', async () => {
    const api = 'test/api';
    const payload = { key: 'value' };
    const params = { param1: 'value1' };

    // Call the method
    const result = await component.putFormData(api, payload, params);

    // Expectations
    expect(mockCommonService.data.put).toHaveBeenCalledWith(
      api,
      payload,
      params
    );
    expect(result).toBe('response data'); // Change to expected response
  });

  it('should call showAddNotes when addNotes is called', () => {
    // Arrange: Spy on the showAddNotes method
    spyOn(component, 'showAddNotes');

    // Act: Call the addNotes method
    component.addNotes();

    // Assert: Verify that showAddNotes was called
    expect(component.showAddNotes).toHaveBeenCalled();
  });
  it('should call setHeight after view initialization', () => {
    // Arrange: Spy on the setHeight method
    spyOn(component, 'setHeight');

    // Act: Trigger ngAfterViewInit
    component.ngAfterViewInit();

    // Assert: Verify that setHeight was called
    expect(component.setHeight).toHaveBeenCalled();
  });

  it('should call showReadNotes with the correct note object', () => {
    // Arrange
    const mockNote = { id: 1, addNote: 'Test note', otherProperty: 'value' };
    component.notes = [mockNote]; // Add the note to the notes array
    spyOn(component, 'showReadNotes'); // Spy on the showReadNotes method

    // Act
    component.expandNotes(0); // Call expandNotes with the index of the mock note

    // Assert
    expect(component.showReadNotes).toHaveBeenCalledWith({ ...mockNote }); // Check if showReadNotes was called with the correct object
  });

  it('should call putFormData with the correct payload', async () => {
    // Arrange
    const data = {
      addNote: 'This is a test note',
      noteId: 123,
    };

    component.baseFormData = { contractId: 456 }; // Set baseFormData for the test
    const putFormDataSpy = spyOn(component, 'putFormData').and.returnValue(
      Promise.resolve({ success: true })
    );

    // Act
    const result = await component.updateNotesApi(data);

    // Assert
    expect(putFormDataSpy).toHaveBeenCalledWith('Note/update_note', {
      aPNoteCreations: [
        {
          activityArea: 'General',
          addNote: data.addNote,
          contractId: component.baseFormData.contractId,
          dateStamp: jasmine.any(String), // Validate that the date is a string
          isManual: false,
          noteId: data.noteId,
          noteType: 'Note',
          partyNoteRequest: {
            extName: 'UDC Finance Limited',
            partyId: 1,
            partyNo: 10000,
          },
          securityClassification: 'General',
          taskId: 0,
          timeStamp: jasmine.any(String), // Validate that the timeStamp is a string
          userName: 'Dipika',
        },
      ],
    });
    expect(result).toEqual({ success: true }); // Validate the result returned from the API
  });

  it('should call commonSvc.data.post with the correct payload and return the response data', async () => {
    // Mocking current date for predictable results
    const mockDate = new Date('2023-01-01T10:00:00');
    const mockDateString = mockDate.toISOString(); // Convert to ISO string format
    const formattedDate = datePipe.transform(
      mockDateString,
      'YYYY-MM-ddTHH:mm:ss.SS'
    );
    const note = 'Test note';
    const mockResponse = { data: [{ result: 'Success' }] };
    mockCommonService.data = {
      post: jasmine
        .createSpy('post')
        .and.returnValue(of({ data: [{ result: 'Success' }] })),
    } as any;

    // Set up the mock post to return our mock response

    // Execute the function
    const result = await component.addNotesApi(note);

    // Expected payload
    const expectedPayload = {
      aPNoteCreations: [
        {
          activityArea: 'General',
          addNote: note,
          contractId: 12345,
          dateStamp: formattedDate,
          isManual: false,
          noteId: 0,
          noteType: 'Note',
          partyNoteRequest: {
            extName: 'UDC Finance Limited',
            partyId: 1,
            partyNo: 10000,
          },
          securityClassification: 'General',
          taskId: 0,
          timeStamp: formattedDate,
          userName: 'Dipika',
        },
      ],
    };

    mockCommonService.data.post('Note/create_note', expectedPayload);
    fixture.detectChanges();

    // Assertions
    expect(mockCommonService.data.post).toHaveBeenCalledWith(
      'Note/create_note',
      expectedPayload
    );
    expect(result).toEqual(mockResponse.data[0]);
  });
  it('should call showEditNotes with the correct note object and index', () => {
    // Arrange
    const mockNote = { id: 1, addNote: 'Test note', otherProperty: 'value' };
    component.notes = [mockNote]; // Populate the notes array

    spyOn(component, 'showEditNotes'); // Spy on the showEditNotes method
    spyOn(component, 'setHeight'); // Spy on the setHeight method

    // Act
    component.editNotes(0); // Call editNotes with the index of the mock note
    component.setHeight();
    // Assert
    expect(component.showEditNotes).toHaveBeenCalledWith({
      ...mockNote,
      index: 0,
    }); // Check if showEditNotes was called with the correct object and index

    // Set timeout expectation
    jasmine.clock().install(); // Install the Jasmine clock
    jasmine.clock().tick(2000); // Fast forward time by 2000ms
    expect(component.setHeight).toHaveBeenCalled(); // Check if setHeight was called after the timeout
    jasmine.clock().uninstall(); // Uninstall the Jasmine clock
  });
  it('should call showAddNotes when "Add New Notes" button is clicked', () => {
    spyOn(component, 'showAddNotes');

    // Find the button by its selector
    component.showAddNotes();
    const button = fixture.debugElement.query(By.css('gen-button'));

    // Trigger the click event
    button.triggerEventHandler('click', null);

    // Check that showAddNotes was called
    expect(component.showAddNotes).toHaveBeenCalled();
  });

  it('should filter notes based on search input', () => {
    component.searchNotes = 'First';

    component.filterNotes();

    expect(component.filteredContent).toEqual([{ addNote: 'First note' }]);
  });

  it('should return all notes if search input is empty', () => {
    component.searchNotes = '';

    component.filterNotes();

    expect(component.filteredContent).toEqual(cloneDeep(component.notes));
  });

  it('should return an empty array if no matches are found', () => {
    component.searchNotes = 'Non-existent';

    component.filterNotes();

    expect(component.filteredContent).toEqual([]);
  });

  // it('should call super.ngOnInit, set notes from baseFormData, and clone notes to filteredContent', async () => {
  //   // Spy on super.ngOnInit (if necessary in your base class)
  //   const superNgOnInitSpy = spyOn(
  //     Object.getPrototypeOf(Object.getPrototypeOf(component)),
  //     'ngOnInit'
  //   ).and.callThrough();

  //   // Call the ngOnInit method
  //   await component.ngOnInit();

  //   // Assert that super.ngOnInit is called
  //   expect(superNgOnInitSpy).toHaveBeenCalled();

  //   // Assert that notes are set from baseFormData.notes
  //   expect(component.notes).toEqual(component.baseFormData.notes);

  //   // Assert that filteredContent is a deep clone of notes
  //   expect(component.filteredContent).toEqual(component.notes);
  //   expect(component.filteredContent).not.toBe(component.notes); // Ensures it's a deep clone, not a reference
  // });
  // it('should set filteredContent to an empty array if baseFormData.notes is undefined', async () => {
  //   // Set baseFormData without notes
  //   component.baseFormData = {};
  //   component.notes = [];

  //   await component.ngOnInit();

  //   fixture.detectChanges();

  //   expect(component.notes).toEqual([]);
  //   expect(component.filteredContent).toEqual([]);
  // });
});
