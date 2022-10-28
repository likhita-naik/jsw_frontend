import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  Logout(){
    var confir=confirm('Do you want to log logout?')
    console.log(confir)
    if(confir){
    localStorage.removeItem('session')
    console.log('logout')
    this.router.navigate(['/login'])
  }
}
}
