import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BaseDealerClass } from './base-dealer.class';
import { BaseDealerService } from './base-dealer.service';
import { SecurityContext } from '@angular/core';
import { CommonService } from 'auro-ui';

fdescribe('BaseDealerClass', () => {
  let component: BaseDealerClass;
  let fixture: ComponentFixture<BaseDealerClass>;
  let mockBaseSvc: jasmine.SpyObj<BaseDealerService>;
  let mockCommonSvc: any; // Adjusted to any due to custom object creation
  let mockRoute: Partial<ActivatedRoute>;
  let destroy$: Subject<void>;

  beforeEach(() => {
    mockBaseSvc = jasmine.createSpyObj('BaseDealerService', [
      'getBaseDealerFormData',
      'setBaseDealerFormData',
    ]);
    mockCommonSvc = jasmine.createSpyObj('CommonService', [], {
      sanitizer: jasmine.createSpyObj('DomSanitizer', {
        sanitize: jasmine.createSpy('sanitize'),
      }),
    });
    mockRoute = {
      snapshot: {
        params: {},
        url: [],
        queryParams: {},
        fragment: '',
        data: {},
        outlet: '',
        component: undefined,
        routeConfig: undefined,
        title: '',
        root: new ActivatedRouteSnapshot(),
        parent: new ActivatedRouteSnapshot(),
        firstChild: new ActivatedRouteSnapshot(),
        children: [],
        pathFromRoot: [],
        paramMap: undefined,
        queryParamMap: undefined,
      },
    };

    destroy$ = new Subject<void>();

    TestBed.configureTestingModule({
      declarations: [BaseDealerClass],
      providers: [
        { provide: BaseDealerService, useValue: mockBaseSvc },
        { provide: CommonService, useValue: mockCommonSvc },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseDealerClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize input strings correctly', () => {
    const input = '<script>alert("XSS")</script>';
    mockCommonSvc.sanitizer.sanitize.and.returnValue('safe-string');

    const result = component.sanitizeInput(input);

    expect(mockCommonSvc.sanitizer.sanitize).toHaveBeenCalledWith(
      SecurityContext.HTML,
      input
    );
    expect(result).toBe('safe-string');
  });

  it('should sanitize object properties in setFormData', () => {
    const data = { key1: '<script>alert("XSS")</script>', key2: 'safe' };
    mockCommonSvc.sanitizer.sanitize.and.callFake((_, value) =>
      value.includes('XSS') ? 'safe-string' : value
    );

    component.setFormData(data);

    expect(mockBaseSvc.setBaseDealerFormData).toHaveBeenCalledWith({
      key1: 'safe-string',
      key2: 'safe',
    });
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(component.destroy$, 'next');
    spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
