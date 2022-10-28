import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraRoiComponent } from './camera-roi.component';

describe('CameraRoiComponent', () => {
  let component: CameraRoiComponent;
  let fixture: ComponentFixture<CameraRoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraRoiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraRoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
