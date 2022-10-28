import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  Logout(){
    var confir=confirm('Do you want to log out?')
    if(confir){
    localStorage.removeItem('session')
    console.log('logout')
    this.router.navigate(['/login'])
  }
}
}
