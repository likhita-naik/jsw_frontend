import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpeViolationComponent } from './ppe-violation.component';

describe('PpeViolationComponent', () => {
  let component: PpeViolationComponent;
  let fixture: ComponentFixture<PpeViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpeViolationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpeViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
