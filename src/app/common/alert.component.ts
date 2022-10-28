import {
    animate,
    keyframes,
    state,
    style,
    transition,
    trigger
  } from '@angular/animations';
  import { Component } from '@angular/core';
  
  import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
  


  @Component({
    selector: '[alertComponent]',
    styles: [`
      :host {
        background-color:hsl(0, 44%, 91%);
        position: relative;
        overflow: hidden;
        border:none;
        margin-bottom:15px;
        padding: 10px 10px 10px 10px;
        width: 400px !important;
        border-radius: 10px 10px 10px 10px;
        color: black;
        pointer-events: all;
        cursor: pointer;
        width:auto;
        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);

      }
      .btn-pink {
        -webkit-backface-visibility: hidden;
        -webkit-transform: translateZ(0);
      }
  
      .violImage{
        width: 360px;
        height: 250px;
        object-fit:fill;
        border-radius:5px 5px 5px 5px;
      }
    `],
    template: `
    <div class="row" [style.display]="state.value === 'inactive' ? 'none' : ''" >
      <div class="col-12">
        <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
          {{ title }}
        </div>
        <div *ngIf="message && options.enableHtml" role="alert" aria-live="polite"
          [class]="options.messageClass" [innerHTML]="message">
        </div>
        <div *ngIf="message && !options.enableHtml" role="alert" aria-live="polite"
          [class]="options.messageClass" [attr.aria-label]="message">
          {{ message }}
        </div>
      </div>
      <div class="col-3 text-right">
       
        <a *ngIf="options.closeButton" (click)="remove()" class="btn btn-pink btn-sm">
          close
        </a>
      </div>
    </div>
    <div *ngIf="options.progressBar">
      <div class="toast-progress" [style.width]="width + '%'"></div>
    </div>
    `,
    animations: [
      trigger('flyInOut', [
        state('inactive', style({
          opacity: 0,
        })),
        transition('inactive => active', animate('400ms ease-out', keyframes([
          style({
            transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
            opacity: 0,
          }),
          style({
            transform: 'skewX(20deg)',
            opacity: 1,
          }),
          style({
            transform: 'skewX(-5deg)',
            opacity: 1,
          }),
          style({
            transform: 'none',
            opacity: 1,
          }),
        ]))),
        transition('active => removed', animate('400ms ease-out', keyframes([
          style({
            opacity: 1,
          }),
          style({
            transform: 'translate3d(100%, 0, 0) skewX(30deg)',
            opacity: 0,
          }),
        ]))),
      ]),
    ],
    preserveWhitespaces: false,
  })
  export class alertComponent extends Toast {
    // used for demo purposes
    undoString = 'undo';
  
    // constructor is only necessary when not using AoT
    constructor(
      protected override toastrService: ToastrService,
      public override toastPackage: ToastPackage,
    ) {
      super(toastrService, toastPackage);
    }
  
    action(event: Event) {
      event.stopPropagation();
      this.undoString = 'undid';
      this.toastPackage.triggerAction();
      return false;
    }
  }