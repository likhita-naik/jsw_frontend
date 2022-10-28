import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {CommonModules} from '../common/common.module'

const routes:Routes=[{path:'',component:LoginComponent}]


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    CommonModules
    
    
  ]
})
export class LoginModule { }
