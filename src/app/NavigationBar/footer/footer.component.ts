import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit,AfterViewInit {
   
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.getElementById('current-year').innerHTML= new Date().getFullYear().toString()
  }

}
