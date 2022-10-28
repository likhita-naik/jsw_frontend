import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCarousalComponent } from './image-carousal.component';

describe('ImageCarousalComponent', () => {
  let component: ImageCarousalComponent;
  let fixture: ComponentFixture<ImageCarousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCarousalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCarousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
