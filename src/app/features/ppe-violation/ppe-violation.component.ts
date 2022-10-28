import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Moment } from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ServerService } from 'src/app/Services/server.service';

@Component({
  selector: 'app-ppe-violation',
  templateUrl: './ppe-violation.component.html',
  styleUrls: ['./ppe-violation.component.css']
})
export class PpeViolationComponent implements OnInit,AfterViewInit {
  panelData:Observable<any[]>=of([{item_text:1,item_id:0}, {item_text:2,item_id:1},{item_text:3,item_id:2}])
  plantData:Observable<any[]>=of([{item_text:'hsm',item_id:0},{item_text:'crm',item_id:1},{item_text:'scm',item_id:2}])
  areaData:Observable<any[]>=of([])
  violationTypes:Observable<any[]>=of([])
  selectedViolation:any
  selectedPlant:any
  selectedArea:any
  dropdownSettings:IDropdownSettings
  selectedPanel:any
  selected: { startDate: Moment, endDate: Moment };  

  @ViewChild('dangerAlert',{static:false}) alert:ElementRef<any>
  constructor(public server:ServerService,
    public  toasterService:ToastrService) {
    this.dropdownSettings={ singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'No data',
      maxHeight: 197}
   }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.toasterService.error(<any>this.alert.nativeElement.innerHTML, " ", {
      enableHtml: true,
      positionClass: 'toast-top-right'
   })
   this.toasterService.error(<any>this.alert.nativeElement.innerHTML, " ", {
    enableHtml: true,
    positionClass: 'toast-top-right'
 }) 
 this.toasterService.error(<any>this.alert.nativeElement.innerHTML, " ", {
  enableHtml: true,
  positionClass: 'toast-top-right'
})
this.toasterService.error(<any>this.alert.nativeElement.innerHTML, " ", {
  enableHtml: true,
  positionClass: 'toast-top-right'
})
this.toasterService.error(<any>this.alert.nativeElement.innerHTML, " ", {
  enableHtml: true,
  positionClass: 'toast-top-right'
})
this.toasterService.error(<any>this.alert.nativeElement.innerHTML, " ", {
  enableHtml: true,
  positionClass: 'toast-top-right'
})
this.toasterService.error(<any>this.alert.nativeElement.innerHTML, " ", {
  enableHtml: true,
  positionClass: 'toast-top-right'
})
    
  }
  onViolationTypeSelect(event:any){

  }
  onPlantSelect(event:any){

  }
  onAreaSelect(event:any){

  }

}
