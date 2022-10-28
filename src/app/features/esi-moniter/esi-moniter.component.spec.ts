import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESIMoniterComponent } from './esi-moniter.component';

describe('ESIMoniterComponent', () => {
  let component: ESIMoniterComponent;
  let fixture: ComponentFixture<ESIMoniterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESIMoniterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESIMoniterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
