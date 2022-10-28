import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageCarousalComponent } from './image-carousal/image-carousal.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';



@NgModule({
  declarations: [
    ImageCarousalComponent,
    ImageCarouselComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule
   ],
   exports:[FormsModule,
            ReactiveFormsModule,
            BrowserAnimationsModule,
            FontAwesomeModule,
            
            ]
})
export class CommonModules { }
