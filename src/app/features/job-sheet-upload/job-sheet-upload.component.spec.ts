import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSheetUploadComponent } from './job-sheet-upload.component';

describe('JobSheetUploadComponent', () => {
  let component: JobSheetUploadComponent;
  let fixture: ComponentFixture<JobSheetUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSheetUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSheetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
