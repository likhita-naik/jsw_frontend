import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validate } from 'uuid';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName:string=''
  passwordInfo:any
  fail:boolean=false
  email:FormControl=new FormControl('',Validators.required)
  password:FormControl=new FormControl('',Validators.required)
  constructor(
    private Router:Router


  ) { }

  ngOnInit(): void {
  }

  OnSubmit(){
    this.userName=this.email.value
    this.passwordInfo=this.password.value
    console.log(this.userName,this.password)
    if(this.userName=='admin' && this.passwordInfo=='admin')
    {
    this.fail=false
    localStorage.setItem('session','loggedin')  
    this.Router.navigate(['app/violations'])
    }
    else{
      this.fail=true
    }
   
  }

}
