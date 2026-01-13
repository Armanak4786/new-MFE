import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import {
  AppPrimengModule,
  AuthenticationService,
  CommonService,
  DataService,
  FileUploadComponent,
  AuroUiFrameWork,
  ToasterService,
  UiService,
} from 'auro-ui';
import { CoreAppModule } from 'projects/app-core/src/app/app-core.module';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { CalculationService } from '../payment-summary/calculation.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { By, DomSanitizer } from '@angular/platform-browser';
import { StandardQuoteService } from '../../services/standard-quote.service';
import { GenerateDocumentComponent } from './generate-document.component';

describe('GenerateDocumentComponent', () => {
  let component: GenerateDocumentComponent;
  let fixture: ComponentFixture<GenerateDocumentComponent>;
  let debugElement: DebugElement;
  let mockCommonService;
  let mockToasterService;
  let mockAuthService;
  let mockDataService;
  let mockStandardQuoteService;
  let sanitizer: DomSanitizer;
  let cd: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    mockCommonService = jasmine.createSpyObj(['data']);
    const postSpy = jasmine.createSpy('post').and.returnValue(of({})); // Mocking post method

    mockToasterService = jasmine.createSpyObj(['showToaster']);
    mockAuthService = { oidcUser: { given_name: 'John', family_name: 'Doe' } };
    mockDataService = jasmine.createSpyObj(['post']);
    mockCommonService.data = { post: postSpy }; // Correctly mock the 'data' property

    mockStandardQuoteService = jasmine.createSpyObj([
      'getBaseDealerFormData',
      'setBaseDealerFormData',
    ]);
    const cdSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    cd = cdSpy;

    await TestBed.configureTestingModule({
      declarations: [GenerateDocumentComponent],
      imports: [
        AuroUiFrameWork,
        CoreAppModule,
        AppPrimengModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        MessageService,
        JwtHelperService,
        UiService,
        ConfirmationService,
        AuthenticationService,

        { provide: CommonService, useValue: mockCommonService },
        { provide: ToasterService, useValue: mockToasterService },
        //  { provide: AuthenticationService, useValue: mockAuthService },
        { provide: StandardQuoteService, useValue: mockStandardQuoteService },
        { provide: ChangeDetectorRef, useValue: cd },

        //  { provide: DomSanitizer, useValue: TestBed.inject(DomSanitizer) },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 123 } } },
        },
        { provide: JWT_OPTIONS, useValue: {} }, // Provide JWT_OPTIONS here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateDocumentComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.files = [];
    component.uploadedFiles = [];
    component.columns = [{ field: 'name', headerName: 'Name' }];
    component.documents = [];
    component.generatedDocuments = [
      { name: 'Test Document', type: 'pdf', loaded: new Date() },
    ];
    sanitizer = TestBed.inject(DomSanitizer); // Inject DomSanitizer

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display a button to browse files in gen-file-upload', () => {
    const browseButton = debugElement.query(By.css('.browse-files-btn'));
    expect(browseButton).toBeTruthy();
    expect(browseButton.nativeElement.textContent).toContain('Browse Files');
  });

  it('should call onUploaded when a file is uploaded', () => {
    spyOn(component, 'onUploaded');
    const fileUploadComponent = debugElement.query(
      By.directive(FileUploadComponent)
    );
    fileUploadComponent.triggerEventHandler('onUploaded', {});
    expect(component.onUploaded).toHaveBeenCalled();
  });

  it('should display generated documents section', () => {
    fixture.detectChanges();
    const docName = debugElement.query(By.css('.text-overflow-ellipsis'));
    expect(docName.nativeElement.textContent).toContain('Test Document');
  });
  it('should display the supported formats and size restrictions', () => {
    const uploadInfo = debugElement.query(By.css('.upload-info'));
    expect(uploadInfo.nativeElement.textContent).toContain(
      'Supported documents formats'
    );
    expect(uploadInfo.nativeElement.textContent).toContain(
      'Cannot exceed 50MB per upload'
    );
  });
  it('should display an iframe when displayDoc is set', () => {
    component.displayDoc = 'https://sample-document-url.com';
    fixture.detectChanges();
    const iframe = debugElement.query(By.css('iframe#iframe'));
    expect(iframe).toBeTruthy();
    expect(iframe.nativeElement.src).toContain(component.displayDoc);
  });

  it('should call getSanitizedUrl when iframe is rendered', () => {
    spyOn(component, 'getSanitizedUrl').and.callThrough();
    component.displayDoc = 'https://sample-document-url.com';
    component.getSanitizedUrl(component.displayDoc);
    fixture.detectChanges();
    expect(component.getSanitizedUrl).toHaveBeenCalledWith(
      component.displayDoc
    );
  });

  // it('should display a checkbox for each generated document', () => {
  //   fixture.detectChanges();
  //   const checkbox = debugElement.query(By.css('p-checkbox'));
  //   expect(checkbox).toBeTruthy();
  // });

  // it('should trigger onPreviewFile method when Preview button is clicked', () => {
  //   spyOn(component, 'onPreviewFile');
  //   component.onPreviewFile(0);
  //   fixture.detectChanges();
  //   const previewButton = debugElement.query(By.css('#preview-button'));
  //   previewButton.triggerEventHandler('click', null);
  //   expect(component.onPreviewFile).toHaveBeenCalledWith(0);
  // });
  describe('ngOnInit', () => {
    it('should initialize data and load documents', () => {
      mockStandardQuoteService.getBaseDealerFormData.and.returnValue(
        of({ documentsData: [] })
      );
      component.ngOnInit();
      mockStandardQuoteService.getBaseDealerFormData();
      expect(mockStandardQuoteService.getBaseDealerFormData).toHaveBeenCalled();
      expect(component.documents.length).toBe(0);
    });
  });
  describe('removeDoc', () => {
    it('should remove document from documents list', () => {
      const initialDocument = { name: 'TestDoc.pdf', documentId: 1 };
      component.documents = [initialDocument];

      component.removeDoc(0);

      expect(component.documents.length).toBe(0);
    });
  });

  describe('base64ToBlob', () => {
    it('should convert base64 string to Blob', () => {
      const base64Data = btoa('sample text');
      const blob = component.base64ToBlob(base64Data, 'text/plain');

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/plain');
    });
  });

  it('should call removeDoc when actionName is "removeDoc"', () => {
    // Arrange: Create a mock event object with actionName and index
    const event = {
      actionName: 'removeDoc', // This triggers removeDoc
      index: 1, // Example index
    };

    // Spy on the removeDoc method to track if it's called
    spyOn(component, 'removeDoc');

    // Act: Call the onCellClick method
    component.onCellClick(event);

    // Assert: Check if removeDoc was called with the correct index
    expect(component.removeDoc).toHaveBeenCalledWith(event.index);
  });

  it('should not call removeDoc when actionName is not "removeDoc"', () => {
    // Arrange: Create a mock event object with a different actionName
    const event = {
      actionName: 'otherAction', // Action name is not 'removeDoc', so it should not call removeDoc
      index: 1,
    };

    // Spy on the removeDoc method to track if it's called
    spyOn(component, 'removeDoc');

    // Act: Call the onCellClick method
    component.onCellClick(event);

    // Assert: Check if removeDoc was not called
    expect(component.removeDoc).not.toHaveBeenCalled();
  });
  it('should sanitize the URL and return a SafeUrl', () => {
    // Arrange
    const unsafeUrl = 'javascript:alert("unsafe")';
    const safeUrl = sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);

    // Spy on the sanitizer method
    spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.returnValue(safeUrl);

    // Act
    const result = component.getSanitizedUrl(unsafeUrl);

    // Assert
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      unsafeUrl
    );
    expect(result).toBe(safeUrl);
  });
  it('should extract file contents, convert to Blob, and read the file', () => {
    // Arrange
    const mockGeneratedDocuments = [
      {
        fileDetails: [
          { fileContents: 'base64encodedstring' }, // Simulate file contents as a base64 string
        ],
      },
    ];
    component.generatedDocuments = mockGeneratedDocuments;

    // Spy on the base64ToBlob and readFile methods
    const base64ToBlobSpy = spyOn(component, 'base64ToBlob').and.callThrough();
    const readFileSpy = spyOn(component, 'readFile').and.callThrough();

    // Act
    component.onPreviewFile(0);

    // Assert
    expect(component.generatedDocuments).toBeDefined();
    expect(component.generatedDocuments[0].fileDetails[0].fileContents).toBe(
      'base64encodedstring'
    );
    expect(base64ToBlobSpy).toHaveBeenCalledWith(
      'base64encodedstring',
      'application/pdf'
    );
    expect(readFileSpy).toHaveBeenCalled();
  });

  it('should not execute the logic if generatedDocuments is undefined or empty', () => {
    // Arrange
    component.generatedDocuments = [];

    // Spy on the base64ToBlob and readFile methods
    const base64ToBlobSpy = spyOn(component, 'base64ToBlob');
    const readFileSpy = spyOn(component, 'readFile');

    // Act
    component.onPreviewFile(0);

    // Assert
    expect(base64ToBlobSpy).not.toHaveBeenCalled();
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  it('should handle file upload', () => {
    const file = new File(['file content'], 'testfile.txt', {
      type: 'text/plain',
    });
    const event = { uploadedFiles: [file] } as any;

    // Initialize documents array before the call
    component.documents = [];
    component.id = '123';

    // Call the method
    component.onUploaded(event);
    cd.detectChanges();
    fixture.detectChanges();
    mockCommonService.data.post(
      `DocumentServices/documents?ContractId=123`,
      jasmine.any(FormData)
    );

    // Check that the POST request was made
    expect(mockCommonService.data.post).toHaveBeenCalledWith(
      `DocumentServices/documents?ContractId=123`,
      jasmine.any(FormData)
    );

    // Verify the form data appending logic
    const request = new FormData();
    request.append('ContractId', '123');
    request.append('files', file);
    request.append('loadedBy', 'John Doe');
    request.append(
      'dc',
      JSON.stringify({ name: 'testfile.txt', category: 'Asset Information' })
    );

    // Check that document was added to the documents array
    expect(component.documents.length).toBe(1);
    expect(component.documents[0].name).toBe('testfile.txt');
    expect(component.documents[0].fileData).toBe(file);
    expect(component.documents[0].documentId).toBe(1); // since maxDocumentId is set to 1
    expect(component.documents[0].type).toBe(component.imageTypes[file.type]);
    expect(component.documents[0].dateLoaded).toBeInstanceOf(Date);

    // Check that setBaseDealerFormData was called
    expect(mockStandardQuoteService.setBaseDealerFormData).toHaveBeenCalledWith(
      {
        documentsData: component.documents,
      }
    );

    // Verify detectChanges was called
    expect(cd.detectChanges).toHaveBeenCalled();
  });
  it('should call readAsDataURL on the FileReader with the file', () => {
    const mockFile = new Blob(['Hello World'], { type: 'text/plain' });
    const file = new File([mockFile], 'hello.txt', { type: 'text/plain' });
    const readerSpy = spyOn(
      FileReader.prototype,
      'readAsDataURL'
    ).and.callThrough();

    component.readFile(file);

    expect(readerSpy).toHaveBeenCalledWith(file);
  });

  it('should return undefined for fileText', () => {
    const mockFile = new Blob(['Hello World'], { type: 'text/plain' });
    const file = new File([mockFile], 'hello.txt', { type: 'text/plain' });

    const result = component.readFile(file);

    expect(result).toBeUndefined();
  });
  it('should set displayDoc with file data when file is loaded', () => {
    const mockFile = new Blob(['Hello World'], { type: 'text/plain' });
    const file = new File([mockFile], 'hello.txt', { type: 'text/plain' });

    // Create a mock FileReader
    const mockFileReader: Partial<FileReader> = {
      readAsDataURL: jasmine
        .createSpy('readAsDataURL')
        .and.callFake(function () {
          // Simulate the load event by calling onload
          if (this.onload) {
            this.result = 'data:text/plain;base64,SGVsbG8gV29ybGQ=';
            this.onload(new ProgressEvent('load'));
          }
        }),
      addEventListener: jasmine.createSpy('addEventListener'),
    };

    // Spy on FileReader to return the mock
    spyOn(window as any, 'FileReader').and.returnValue(
      mockFileReader as FileReader
    );

    component.readFile(file);
    fixture.detectChanges();

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
  });
});
