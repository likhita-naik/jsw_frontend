import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RAViolationComponent } from './raviolation.component';

describe('RAViolationComponent', () => {
  let component: RAViolationComponent;
  let fixture: ComponentFixture<RAViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RAViolationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RAViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
