import { DatePipe } from '@angular/common';
import { sanitizeIdentifier } from '@angular/compiler';
import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';
import { Moment } from 'moment';
import { ServerService } from 'src/app/Services/server.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,AfterViewInit,OnDestroy{
  selectedMoments:{ startDate: Moment|any, endDate: Moment|any } ={startDate:dayjs(),endDate:dayjs()}
  ECDetails:any={roi_cam_count:0,ppe_data_count:0,tc_data_count:0,cr_data_count:0}
  cameraStatus:any={total_cam_count:0,enable_data_count:0,disable_data_count:0,not_working_cam_count:0,working_cam_count:0}
  crCamDetails:any[]
  tcCamDetails:any[]
  ppeCamDetails:any[]
  raCamDetails:any[]
  disabledCamDetails:any[]
  violationsCount:any={total_count:0,ppe_count:0,ra_count:0}
  NWCamDetails:any[]
  fromDate:any
  toDate:any

   IP:any
  ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  constructor(private server:ServerService,private modalService:NgbModal) { 
  this.IP=this.server.IP
    setInterval(()=>{ this.server.GetCamerasStatus().subscribe((data:any)=>{
    console.log(data)
    this.cameraStatus=data.message[0]
  })
  this.server.GetLiveViolationCount().subscribe((response:any)=>{
    console.log(response)
    if(response.success){
      this.violationsCount=response.message
    }
  })},this.server.cameraDetailsDelay)
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.cb(this.selectedMoments.startDate,this.selectedMoments.endDate)
  }
  cb(start:any, end:any) {
  
       //datepicker.html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    openDatePicker(){
      var datepicker:HTMLElement=document.getElementById('spanDateInput')
      
      console.log(datepicker)
      datepicker.click()
        
    }

    openECDetailsModal(modal:any){
      this.modalService.open(modal,{size:'xl',scrollable:true,centered:true})

      var table=document.getElementById('modal1')
      console.log(table)
    table.classList.add('loading')
      this.server.GetECSolutionCount().subscribe((response:any)=>{
        this.ECDetails=response.message[0]
        console.log(response)
      })

      this.server.GetSolutionCameraDetails().subscribe((response:any)=>{
        
        console.log(response)
        if(response.success){
          this.crCamDetails=response.message[0].cr_cam_details
          this.tcCamDetails=response.message[0].tc_cam_details
          this.raCamDetails=response.message[0].roi_cam_details
          this.ppeCamDetails=response.message[0].ppe_cam_detais

        }
        table.classList.remove('loader')
      },
      err=>{
        table.classList.remove('loader')
 
      })
    }

    openDCDetailsModal(modal:any){
      this.modalService.open(modal,{size:'xl',centered:true})
      this.server.DisableCamDetails().subscribe((response:any)=>{
        if(response.success){
        this.disabledCamDetails=response.message
        }
      })

    }
    openNWCDetailsModal(modal:any){
      this.modalService.open(modal,{size:'xl',centered:true})
      this.server.GetNotWorkingCameraDetails().subscribe((response:any)=>{
        if(response.success){
        this.NWCamDetails=response.message
        }
      })

    }

    DateWiseViolationsCount(){

    }
    ngOnDestroy(): void {
      this.modalService.dismissAll()
    }


}
