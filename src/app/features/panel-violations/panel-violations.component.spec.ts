import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelViolationsComponent } from './panel-violations.component';

describe('PanelViolationsComponent', () => {
  let component: PanelViolationsComponent;
  let fixture: ComponentFixture<PanelViolationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelViolationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
