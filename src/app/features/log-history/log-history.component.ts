import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, Query, ViewChild, ViewChildren } from '@angular/core';
import { ServerService } from 'src/app/Services/server.service';
import { Lightbox, LightboxConfig } from 'ngx-lightbox'
import { Router } from '@angular/router';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr'
import { ModalDismissReasons, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Moment } from 'moment';
import { DaterangepickerDirective, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs from 'dayjs';
export interface violation {
  si_no?: string
}

export interface hooter {
  cameraName: string,
  startTime: any,
  hooterIp: string
}
export interface relay {
  cameraName: string,
  startTime: any,
  hooterIp: string
}


var data: any[] = []
@Component({
  selector: 'app-log-history',
  templateUrl: './log-history.component.html',
  styleUrls: ['./log-history.component.css']
})
export class LogHistoryComponent implements OnDestroy {

  data: any[] = []
  zoom = 100
  selectedPlant: any
  selectedArea: any
  selectedPanel: any
  panelData: Observable<any[]> = of([{ item_text: 1, item_id: 0 }, { item_text: 2, item_id: 1 }, { item_text: 3, item_id: 2 }])
  plantData: Observable<any[]> = of([{ item_text: 'hsm', item_id: 0 }, { item_text: 'crm', item_id: 1 }, { item_text: 'scm', item_id: 2 }])
  areaData: Observable<any[]> = of([])

  isAlert: boolean = false
  download: string = ''
  isalert: boolean = false
  imageUrl: string
  imgWidth: number = 400
  imgheight: number = 300
  closeResult: string;
  tempdata: any[] = [];
  page: number = 1
  pageSize: number = 30
  collectionSize: number
  cameraDetails: any[] = []
  audioOff: boolean = false
  verdate!: NgbDate
  alertmessage: string = ''
  total: Observable<number> = of(0)
  violData: Observable<any[]> = of([])
  loading: boolean = false
  filterOut: FormControl = new FormControl()
  closeModal: any
  dataForExcel: any[] = []
  images: any[] = []
  ExcelData: any
  pdfLoader: boolean = false
  excelLoader: boolean = false
  violLength: number = 0
  updatedLen: number = 0
  violdata: any[] = [];
  currentViol!: any
  dataForPdf!: any[]
  show1: number = 30
  show2: number = 40
  show3: number = 50
  fromDate: any = new Date()
  toDate: any = new Date()
  updateTO!: number;
  isdatewise: boolean = false
  API: any
  interval: any
  loader2: boolean = false
  interval2: any
  excelBlob: any
  Excel: boolean = false
  date !: NgbDate
  Edata: any[] = []
  isExcel: boolean = false
  excelLoad: boolean = false
  alert: boolean = true
  imageData: any[] = []
  imageBase64: any[] = []
  ExcelRange: number
  time: any
  objectKeys = Object.keys
  isdate: boolean = false
  form = new FormGroup({
    control: new FormControl()
  });
  _value: any
  label: any
  selectedViolType: string | null = null
  Subsciption!: Subscription
  imageObject: Array<object> | undefined = [{}]
  subscription2!: Subscription
  selectedCameraId: string | null = null
  dropdownList: Observable<any[]> = of([])
  fromDateControl: FormControl = new FormControl(new Date().getTime(), Validators.required)
  toDateControl: FormControl = new FormControl(new Date(), Validators.required)
  excelFromDate: FormControl = new FormControl(new Date(), Validators.required)
  excelToDate: FormControl = new FormControl(new Date(), Validators.required)
  Images: any[] = []
  loc2: FormControl = new FormControl('', Validators.required)
  @ViewChild('dangerAlert') Violation: ElementRef<any>;
  dropdownSettings!: IDropdownSettings
  selectedItems!: any[]
  violationTypeList: Observable<any[]> = of([])
  dropdownSettings2: any
  selectedViolation!: any[]
  livedataInteval!: any
  loaderLatest: boolean = false
  isLatest: boolean = false
  latest: boolean = false
  selectedMoments: { startDate: Moment, endDate: Moment }
  scrollStrategy: ScrollStrategy;
  hooterDelay: number
  relayFlag: boolean = false
  relayDelay: number
  relayInterval: any
  activeHooterCameras: any[] = []
  activeRelayCameras: any[] = []
  ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  @ViewChildren(DaterangepickerDirective) pickerDirective: any;

  //@ViewChild('data',{static:true}) table!:ElementRef<any>




  constructor(
    private http: HttpClient,
    // public excelSheet: ExcelsheetService,
    // public pdfService: PdfService,
    private webServer: ServerService,
    private datepipe: DatePipe,
    private toasterService: ToastrService,
    private _lightbox: Lightbox,
    private _lightBoxConfig: LightboxConfig,
    private router: Router,
    private snackbar: MatSnackBar,
    public modalService: NgbModal,
    private readonly sso: ScrollStrategyOptions,) {

    localStorage.getItem('audioOff') == 'true' ? this.audioOff = true : this.audioOff = false
    localStorage.getItem('alert') == 'true' ? this.alert = true : this.alert = false
    console.log(localStorage.getItem('audioOff'), localStorage.getItem('alert'))
    var temp = JSON.parse(localStorage.getItem('hooterCameras'))
    console.log(temp)
    this.scrollStrategy = this.sso.reposition();

    this.relayDelay = webServer.relayDelay
    console.log(this.relayDelay)
    this.hooterDelay = webServer.delay
    this.getCameraList()
    this.getViolationTypes()
    this.ExcelRange = 0
    //.............lightbox configaration...........
    this._lightBoxConfig.showDownloadButton = false
    this._lightBoxConfig.showZoom = true
    this._lightBoxConfig.showImageNumberLabel = true
    this._lightBoxConfig.fitImageInViewPort = true
    this._lightBoxConfig.disableScrolling = false
    this._lightBoxConfig.centerVertically = false
    //..............................................

    this.API = webServer.IP
    console.log(this.API)

    //..................for search..................
    this.filterOut.valueChanges.pipe((startWith(''),
      switchMap((text) => this.matches(text.strip())
      )
    )).subscribe(result => {
      this.tempdata = result
      //  console.log(result)
      this.violData = of(result)
      this.sliceVD()
    }
    )
    this.excelFromDate.valueChanges.subscribe(data => {
      this.isalert = false
    })
    this.excelToDate.valueChanges.subscribe(data => {
      this.isalert = false
    })

    //..............................................

  }

  openDatePicker(event: any) {
    console.log(this.pickerDirective.last.picker)
    console.log(this.pickerDirective)
    var dateInput = document.getElementById('dateInput')
    dateInput.click()
    //   this.pickerDirective.open(event)
    //  // this.pickerDirective[0].open()
    //   this.pickerDirective.forEach((element:any) => {
    //     if(element===event){
    //       element.open()
    //       console.log(element)
    //     }
    //   });
    //console.log(this.pickerDirective[0].open())
    // if(this.pickerDirective[i]===event).showDropdowns=true

  }


  ngOnInit(): void {
    console.log(new Date().getTime())
    var fromDate = this.webServer.dateTransform(new Date()) + ' ' + '00:00:00'
    var toDate = this.webServer.dateTransform(new Date()) + ' ' + '23:59:59'
    this.fromDateControl.setValue(fromDate)
    this.toDateControl.setValue(toDate)

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      // closeDropDownOnSelection: true,
      // noDataAvailablePlaceholderText: 'No cameras detected',
      // maxHeight: 197
    };

    this.dropdownSettings2 = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',

      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'No violation types detected',
      maxHeight: 197
    };

    console.log(NgxDaterangepickerMd)
    // this.selectedItems = [
    //   { item_id: 1, item_text: "All camera" },

    // ];

    //...........Reading previous violation data's length from local storage....
    this.violLength = Number(localStorage.getItem("updatedLen"))



    //------------Reading the camera details--------------
    //uncomment while you work
    this.webServer.GetCameraNames().subscribe((data: any) => {
      console.log(data)
      if (data.success === true) {

        data.message.forEach((el: any, i: number) => { this.cameraDetails[i] = { camera_id: el.camera_id, camera_name: el.camera_name } })
        console.log(this.cameraDetails)

      }
      else {

      }
    })
    var table = document.getElementById('content')
    table?.classList.add('loading')

    // console.log(this.violLength)

    //.............Reading violation data........
    //change foreach to subscribe while you work

    if (!this.latest || this.isLatest) {
      this.webServer.LiveViolationData(this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null).subscribe((Rdata: any) => {
        if (Rdata.success) {

          table?.classList.remove('loading')

          var data = Rdata.message

          this.imageData = Rdata.message
          this.tempdata = Rdata.message
          console.log(this.tempdata)
          Number(localStorage.setItem("updatedLen", Rdata.message.length ? Rdata.message.length : 0))

          this.tempdata = Rdata.message
          // this.imageCarousal()


          this.total = of(this.tempdata.length)
          this.violData = of(Rdata.message)
          // console.log(this.violData)
          this.sliceVD()


        }
        else {
          table?.classList.remove('loading')
          this.notification(Rdata.message)
        }
      },
        err => {
          table?.classList.remove('loading')

          this.notification("Error While fetching the data")
        })


    }



  }


  //pop up for violation 


  ngAfterViewInit() {
    console.log(this.selectedViolation)

    this.dataread()
    this.Reset()


    //this.Relay('http://192.168.1.201/Delay*100@')
    this.Reset()
    //this.Relay('http://192.168.1.201/')




  }

  onPlantSelect(event: any) {

  }
  onAreaSelect(event: any) {

  }

  public dataread() {

    this.interval = setInterval(() => {
      if (!this.isdate) {
        console.log("interval1")
        if (Number(localStorage.getItem("updatedLen"))) {
          this.violLength = Number(localStorage.getItem("updatedLen"))
        }
        this.Subsciption = this.webServer.LiveViolationData(this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null).subscribe((Rdata: any) => {
          // console.log(Rdata)
          if (Rdata.success) {
            var cviol = Rdata.message
            console.log(this.isLatest)
            //console.log(Rdata.message)
            localStorage.setItem("updatedLen", JSON.stringify(cviol.length))
           
            var diff = Math.abs(Rdata.now_live_count - Rdata.previous_live_count);
            console.log(diff)
            if (diff > 0) {
              //this.violdata = Rdata.message
              //this.imageData = Rdata.message
              //this.tempdata = Rdata.message
              //this.sliceVD()



              //console.log(diff)
              // this.toasterService.clear()
              console.log('minutes less than 10')


              for (let i = diff - 1; i >= 0; i--) {

                // if (cviol[i].alarm_type=='hooter') {
                if (true) {
                  console.log('hooter testing')

                  // if (cviol[i].alarm_type == 'hooter') {
                  //   console.log('alarm type hooter')

                  //   if (cviol[i].analyticstype == 'RA' || cviol[i].analyticstype == 'ONB') {
                  //     console.log('RA or ONB')
                  //     this.ActiveHooter(cviol[i])
                  //     //this.Hooter(cviol[i].alarm_ip_address,this.hooterDelay)
                  //   }
                  // }
                  // if (cviol[i].alarm_type == 'relay') {
                  //   this.Reset()
                  //   this.Relay(cviol[i].alarm_ip_address)
                  //   //this.relayFlag=true
                  // }

                  if (this.alert) {
                    console.log()
                    console.log(this.isLatest)
                    this.currentViol = cviol[i]

                    setTimeout(() => {

                      console.log('violation is happening')
                      console.log(this.currentViol)
                      this.showViol()

                    }, 300);
                    !this.audioOff ? this.alertSound() : ''
                  }
                  // console.log(i)


                }
                else {
                  continue;
                }
              }




              // data = this.violdata

              //this.tempdata = this.violdata

              //this.sliceVD()
            }
          }
        }
        )
       // this.HooterOff()

        if (!this.latest) {
          this.webServer.LiveViolationData(this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null).subscribe((Response: any) => {
            if (!this.latest) {
              if (Response.success === true) {
                console.log(Response)
                console.log(this.selectedCameraId)
                console.log(Response.message)

                this.imageData = Response.message
                this.tempdata = Response.message
                console.log(this.tempdata)
                //  this.imageCarousal()
                this.total = of(this.violdata.length)
                this.loader2 = false
                this.isdatewise = false

                this.violData = of(Response.message)

                data = Response.message
                this.sliceVD()
                var data = Response.message
                this.violdata = Response.message
                // this.tempdata = this.violdata

                if (this.tempdata.length > 0) {
                  this.Excel = true
                }
                else {
                  false
                }

                this.sliceVD()

              }
              else {

              }
            }
          }, (err: any) => {
            console.log(err)
          })
        }
      }
    }, 5000)
  }


  //modal to view the image


  //MODAL FOR VIOLATION
  showViol() {
    console.log(this.currentViol)
    this.toasterService.error(<any>this.Violation.nativeElement.innerHTML, " ", {
      enableHtml: true,
      positionClass: 'toast-top-right'
    })
    // console.log(currentViol)

  }

  notification(message: string, action?: string) {
    console.log('snackbar')
    this.snackbar.open(message, action ? action : '', ({
      duration: 4000, panelClass: ['error'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    })
    )
  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.zoom = 100
      this.imgWidth = 400
      this.imgheight = 300

      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.zoom = 100
      this.imgWidth = 400
      this.imgheight = 300
      return 'by clicking on a backdrop';
    } else {
      this.imgWidth = 400
      this.imgheight = 300
      this.zoom = 100
      return `with: ${reason}`;
    }

  }

  //function for searching

  matches(term: string): Observable<any[]> {
    var resultVD = this.tempdata.filter((viol: any) => {
      return (<String>viol.cameraid).includes(term) || viol.roi_violation_name.includes(term) || viol.deviceid.includes(term) || viol.camera_name.includes(term)
    })

    this.tempdata = resultVD
    const length = resultVD.length;
    this.sliceVD()


    return of(resultVD);


  }
  sliceVD() {
    console.log(this.page, this.pageSize)
    if (!this.isdate) {
      this.total = of((this.tempdata.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize)).length)
      this.total = of(this.tempdata.length)
      this.violData = of((this.tempdata.map((div: any, SINo: number) => ({ SNo: SINo + 1, ...div })).slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize)))
    }
    console.log(this.tempdata)
    if (this.isdate) {
      console.log(this.tempdata)
      var table = document.getElementById('dataTable')
      table?.classList.add('loading')
      this.webServer.DatewiseViolations(this.fromDate, this.toDate, this.page, this.pageSize, this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null).subscribe((Response: any) => {
        console.log(Response)
        if (Response.success) {
          table?.classList.remove('loading')
          console.log(Response.message)
          if (Response.message.length === 0) {
            this.notification("No violations found")
          }

          // for (let i = 0; i < Response.message.length; i++) {
          //   var el = Response.message[i]
          //   for (let j = 0; j < this.cameraDetails.length; j++) {
          //     if (Response.message[i].cameraid === this.cameraDetails[j].camera_id) {
          //       Response.message[i].camera_name = this.cameraDetails[j].camera_name
          //     }
          //   }

          // }

          data = Response.message
          this.tempdata = data
          //this.imageData=
          this.violData = of(this.tempdata)
          //  this.isdatewise = true

          //  this.imageCarousal()
        }
      })

    }

  }


  //----------METHOD TO FETCH DATE WISE DATA-----------------

  Submit() {
    this.isLatest = false
    console.log(this.fromDateControl.value)
    this.Images = []
    this.fromDate = this.webServer.dateTransform(this.selectedMoments.startDate.toDate())
    this.toDate = this.webServer.dateTransform(this.selectedMoments.endDate.toDate())
    this.Subsciption ? this.Subsciption.unsubscribe() : ''
    // this.table.nativeElement.querySelectorAll('table.table.table-striped.table-bordered')
    var table = document.getElementById('content')
    table?.classList.add('loading')

    this.pageSize = 30
    this.page = 1
    this.isdate = true
    this.loading = true
    console.log(clearInterval(this.interval))
    console.log(this.selectedCameraId)

    this.webServer.DatewiseViolations(this.fromDate, this.toDate, null, null, this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null).subscribe((Response: any) => {
      console.log(Response)
      if (Response.success) {
        console.log(Response)
        if (Response.message.length == 0) {
          this.tempdata = []
          this.violData = of([])
          this.loading = false
          this.isdatewise = true
          this.total = of(0)
          table?.classList.remove('loading')
          this.notification("No violations found for entered date and time")
        }
        if (Response.message.length > 0) {
          this.imageData = Response.message
          this.total = of(Response.message.length)
          this.webServer.DatewiseViolations(this.fromDate, this.toDate, this.page, this.pageSize, this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null).subscribe((Response: any) => {
            console.log(Response)

            if (Response.success) {
              this.loading = false
              table?.classList.remove('loading')

              console.log(Response.message.length)

              // console.log(Response.message)
              if (Response.message.length === 0) {
                this.notification("No violations found")
                this.violData = of([])
                this.isdatewise = true
                this.loading = false

              }

              else {
                // for (let i = 0; i < Response.message.length; i++) {
                //   var el = Response.message[i]
                //   for (let j = 0; j < this.cameraDetails.length; j++) {
                //     if (Response.message[i].cameraid === this.cameraDetails[j].camera_id) {
                //       Response.message[i].camera_name = this.cameraDetails[j].camera_name
                //     }
                //   }

                // }

                data = Response.message
                this.tempdata = Response.message
                this.isdatewise = true
                //this.imageCarousal()
                // console.log(this.tempdata)

                this.violData = of(this.tempdata)
                this.sliceVD()

                this.loading = false

              }
            }


            this.loading = false

          },
            err => {
              this.loading = false
              this.notification("Error while fetching the data")
            })
        }
      }
      else {
        this.tempdata = []
        this.violData = of([])
        this.loading = false
        this.isdatewise = true
        this.total = of(0)
        table?.classList.remove('loading')
        table?.classList.remove('loading')
        this.notification("No violations found for entered date and time")
        this.loading = false
      }



    }, err => {
      this.loading = false
    })





    //------------INTERWAL TO FETCH THE VIOLATIONS -------------
    this.interval2 = setInterval(() => {
      if (this.isdate) {
        if (Number(localStorage.getItem("updatedLen"))) {
          this.violLength = Number(localStorage.getItem("updatedLen"))
        }

        console.log("interval 2")

        this.webServer.LiveViolationData(this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null
        ).subscribe((Rdata: any) => {

          console.log(Rdata)
          if (Rdata.success) {
            var cviol = Rdata.message
            console.log(Rdata.message)
            localStorage.setItem("updatedLen", JSON.stringify(cviol.length))
            var updatedLen = Number(localStorage.getItem("updatedLen"))
            var diff = Rdata.now_live_count - Rdata.previous_live_count;

            if (diff > 0) {
              this.violdata = Rdata.message
              //this.imageData = Rdata.message

              //this.imageCarousal()

              // this.toasterService.clear()



              for (let i = diff - 1; i >= 0; i--) {

                //  console.log(diffMinsi)

                // if (this.violdata[i].alarm_type == 'hooter') {
                //   if (this.violdata[i].analyticstype == 'RA' || this.violdata[i].analyticstype == 'ONB') {
                //    this.ActiveHooter(this.violdata[i])
                //     // this.Hooter(this.violdata[i].alarm_ip_address, this.hooterDelay)
                //   }

                // }
                // if (this.violdata[i].alarm_type == 'relay') {
                //   this.Reset()
                //   this.Relay(this.violdata[i].alarm_ip_address)
                //   //this.relayFlag=true
                // }
                if (this.alert) {
                  console.log("date wise violation")

                  this.currentViol = this.violdata[i]

                  setTimeout(() => {

                    this.showViol()
                    !this.audioOff ? this.alertSound() : ''
                  }, 300);

                }

                else {
                  continue;
                }
              }




            }

          }

        })
      }
     // this.HooterOff()

    }, 3000)

    console.log(this.API)

  }

  //-----------------METHOD TO GO BACK TO LIVE-------------------------

  BackToToday() {
    this.page = 1

    this.Images = []
    this.latest = false
    var table = document.getElementById('dataTable')
    table?.classList.add('loading')
    this.loader2 = true
    console.log(this.isLatest)
    this.interval2 ? clearInterval(this.interval2) : ""
    this.isdate = false
    this.tempdata = []
    this.total = of(0)

    this.Images = []
    var table = document.getElementById('dataTable')
    table?.classList.add('loading')
    this.loader2 = true
    console.log(this.isLatest)
    this.interval2 ? clearInterval(this.interval2) : ""
    this.isdate = false
    this.tempdata = []
    this.total = of(0)
    this.webServer.LiveViolationData(this.selectedCameraId ? this.selectedCameraId : null, this.selectedViolType ? this.selectedViolType : null).subscribe((Rdata: any) => {
      //  console.log(Rdata)
      if (Rdata.success) {
        this.isLatest = false
        table?.classList.remove('loading')
        this.imageData = Rdata.message
        console.log(this.imageData)
        // this.imageCarousal()
        this.total = of(Rdata.message.length)
        if (Rdata.message.length == 0) {
          this.notification("no violations found for today")
        }
        var cviol = Rdata.message
        console.log('backto live')
        this.tempdata = Rdata.message
        this.sliceVD()
        this.loader2 = true
        this.isdatewise = false
        localStorage.setItem("updatedLen", JSON.stringify(cviol.length))
        var updatedLen = Number(localStorage.getItem("updatedLen"))
      }

    })

    this.dataread()

  }
  //----------FUNCTION TO TRANSFORM THE DATE----------------

  dateTransform(date: any) {

    const temp = new Date(date.year, date.month - 1, date.day)
    console.log(temp)
    const FD = this.datepipe.transform(temp, 'dd/MM/yyyy')

    return FD
  }


  onCameraIdSelect(event: any) {
    console.log(event)
    console.log(event.item_id)
    !this.isdatewise ? this.page = 1 : ''
    if (!this.selectedItems) {
      this.selectedCameraId = null
    }
    if (event.item_id == -1) {
      this.selectedCameraId = "all_cameras"
    }
    else {
      this.selectedCameraId = event.item_text
      console.log(this.selectedCameraId)
      console.log(this.selectedItems)
      console.log(event)
    }

  }


  onViolationTypeSelect(event: any) {
    console.log(this.selectedViolation)
    console.log(event)
    console.log(event.item_id)
    !this.isdatewise ? this.page = 1 : ''
    if (!this.selectedViolation) {
      this.selectedViolation = null
    }
    if (event.item_id == -1) {
      this.selectedViolType = "all_violations"
    }
    else {
      this.selectedViolType = event.item_text
      console.log(this.selectedViolation)
      console.log(event)
    }

  }


  imageCarousal(viol: any) {

    //  NgImageSliderServi
    this.Images = []
    viol.imagename.forEach((imgname: string, index: number) => {
      console.log(imgname)
      this.Images[index] = {
        src: this.API + '/image/' + imgname,

        thumb: this.API + '/image/' + imgname,
        caption: imgname,

      }
    })

    this.open(0)
    console.log(this.Images)

  }
  open(index: number): void {
    // open lightbox
    console.log('opening lightbox')
    this._lightbox.open(this.Images, index);
  }
  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  submitForm() {
    this.isalert = false
    this.excelLoad = true
    this.isExcel = false
    console.log(this.excelFromDate.value)
    console.log(this.excelToDate.value)
    var body = {
      from_date: this.webServer.dateTransform(this.selectedMoments.startDate.toDate() ? this.selectedMoments.startDate.toDate() : new Date()),
      to_date: this.webServer.dateTransform(this.selectedMoments.endDate.toDate() ? this.selectedMoments.endDate.toDate() : new Date()),
      cameraname: this.selectedCameraId ? this.selectedCameraId : 'none',
      violation_type: this.selectedViolType ? this.selectedViolType : 'none'
    }
    var date1 = new Date(this.excelFromDate.value)
    var date2 = new Date(this.excelToDate.value)
    var Difference_In_Time = date2.getTime() - date1.getTime();
    const diffInDs = (Difference_In_Time) / (1000 * 3600 * 24)
    console.log(diffInDs)

    if (true) {

      this.webServer.CreateExcel(body).subscribe((Response: any) => {
        console.log(Response)
        if (Response.success) {
          this.excelLoad = false
          //console.log(Response)
          this.isExcel = true
          console.log("APi data for excel")

          console.log(Response)
          this.Edata = Response.message
          this.Edata = Response.message
          this.webServer.DownloadExcel().subscribe(
            (response: HttpResponse<any>) => {
              this.excelLoader = false
              this.excelLoad = false
              var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              console.log(response.headers.get('content-Type'))


              console.log(response)
              const blob = new Blob([response.body], { type: '.xlsx' });
              // var fileName =  response.headers.get('Content-Disposition').split(';')[1];
              var fileName = "violation report" + " " + this.datepipe.transform(new Date, 'YYYY-MM-dd h:mm:ss') + '.xlsx'
              const file = new File([blob], fileName, { type: '.xlsx' });
              saveAs(blob, fileName);
            },
            err => {
              this.excelLoader = false
              console.log(err)
            })
        }
        else {
          this.notification(Response.message, 'Retry')
          this.excelLoad = false
          this.isExcel = false
          this.alertmessage = Response.message
          this.isalert = true

        }
      },
        err => {
          this.excelLoad = false

          this.isExcel = false
          this.alertmessage = "Error while creating excel"
          this.notification(this.alertmessage, 'Retry')
          this.isalert = true
        })
    }

    else {
      this.excelLoad = false
      this.isalert = true
      this.excelLoader = false
      this.alertmessage = "Data range should be " + this.ExcelRange + " days"

    }
    var formData: FormData = new FormData()

    formData.append('location', this.loc2.value)
  }

  onCameraIdDeSelect(event: any) {
    console.log(event)
    console.log(event.item_id)
    console.log(this.selectedItems)
    this.selectedItems = []
    !this.isdatewise ? this.page = 1 : ''
    if (this.selectedItems.length === 0) {
      console.log("undefined")
      this.selectedCameraId = null
    }
    // if (event.item_id === -1) {
    //   this.selectedCameraId = "all_cameras"
    // }
    // else {
    //   this.selectedCameraId = event.item_text
    //   console.log(this.selectedItems)
    //   console.log(event)
    // }

  }


  onViolationTypeDeSelect(event: any) {
    console.log(this.selectedViolation)
    console.log(event)
    console.log(event.item_id)
    this.selectedViolation = []
    !this.isdatewise ? this.page = 1 : ''
    if (this.selectedViolation.length === 0) {
      this.selectedViolType = null
    }
    // if (event.item_id == -1) {
    //   this.selectedViolType = "all_violations"
    // }
    // else {
    //   this.selectedViolType = event.item_text
    //   console.log(this.selectedViolation)
    //   console.log(event)
    // }

  }


  //-------METHOD TO DOWNLOAD THE EXCEL--------
  OnDownload() {
    this.excelLoader = true
    this.webServer.SampleExcelDownload().subscribe(
      (response: any) => {
        this.excelLoader = false
        console.log(response)
        console.log(response)
        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        const blob = new Blob([response.body], { type: contentType });
        //var fileName =  response.headers.get('content-disposition').split(';')[0];
        var fileName = "violation report" + " " + this.datepipe.transform(new Date, 'YYYY-MM-dd h:mm:ss')
        const file = new File([blob], fileName, { type: '.xlsx' });
        saveAs(file);
      },
      err => {
        this.excelLoader = false
        console.log(err)
      })
  }

  ExcelD(selectfile: any) {
    this.modalService.open(selectfile).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.download = '',
        this.isalert = false
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.download = '',
        this.isalert = false
    });

  }


  //-----NAVIGATE TO SETTINGS PAGE------
  settings() {
    this.router.navigate(['app/Settings'])
  }

  //-----METHOD FOR ALERT SOUND------------
  alertSound() {
    console.log('alert sound')
    let audio = new Audio()
    audio.src = '../../../assets/audio/alert.wav'
    audio.load()
    audio.play()
  }

  Hooter(IP: string, delay: number) {
    console.log('hooter' + IP)
    //  this.http.get("http://192.168.1.22/Delay*100@").subscribe()
    fetch('http://192.168.1.22/Delay*100@').then((response: any) => { }).catch(() => {

    })
    // this.http.get('http://'+IP+'/Delay*'+delay+'@').subscribe()

    //this.http.get('http://192.168.1.22'+'/Delay*'+delay+'@').subscribe()
  }
  hooterTesting() {
    fetch('http://192.168.1.22/Delay*150@').then((response: any) => { }).catch(() => {

    })
  }

  Relay(relayIp: any) {
    console.log('relay' + relayIp)

    this.http.get("http://192.168.1.22" + '/ON').subscribe()
    this.relayInterval = setTimeout(() => {
      console.log('relay is off')
      //console.log(n)
      //this.Reset()
      this.http.get("http://192.168.1.22" + '/OFF').subscribe()

    }, this.relayDelay);
  }

  Reset() {
    clearTimeout(this.relayInterval)
  }

 
  //----------METHOD TO TOGGLE THE VOLUME-------
  volumeToggle() {
    if (!this.alert) {
      this.audioOff = true
      localStorage.setItem('audioOff', 'true')
    }
    else {
      this.audioOff = !this.audioOff
      localStorage.setItem('audioOff', this.audioOff ? 'true' : 'false')
    }
  }


  //----------METHOD TO TOGGLE THE NOTIFICATION --------
  alertToggle() {
    this.alert = !this.alert
    localStorage.setItem('alert', this.alert ? 'true' : 'false')
    // console.log(localStorage.getItem('alert'))
    if (!this.alert) {
      this.audioOff = true
      localStorage.setItem('alert', 'false')

      localStorage.setItem('audioOff', 'true')
      this.toasterService.clear()
    }
  }


  getLatestData() {
    this.loader2 = false
    this.loaderLatest = true
    this.latest = true
    // this.interval2.subscribe()
    var table = document.getElementById('dataTable')
    table?.classList.add('loading')
    console.log(this.selectedViolType)
    this.webServer.LatestData(this.selectedViolType, this.selectedCameraId).subscribe((Rdata: any) => {
      if (Rdata.success) {
        this.isLatest = true
        table?.classList.remove('loading')
        this.loaderLatest = false
        data = Rdata.message
        Rdata.message.length === 0 ? this.notification("No violations found") : ''
        this.imageData = Rdata.message
        this.tempdata = Rdata.message
        console.log(this.tempdata)
        // Number(localStorage.setItem("updatedLen", Rdata.message.length ? Rdata.message.length : 0))

        this.tempdata = Rdata.message
        //this.imageCarousal()


        this.total = of(Rdata.message.length)
        this.violData = of(Rdata.message)
        // console.log(this.violData)
        this.sliceVD()


      }
      else {
        this.loaderLatest = false
        table?.classList.remove('loading')
        this.notification(Rdata.message)
      }
    },
      err => {
        this.loaderLatest = false
        table?.classList.remove('loading')

        this.notification("Error While fetching the data", 'Retry')
      })


  }

  //----------------METHOD TO DOWNLOAD THE  IMAGE-------------

  downloadImage(img: any) {
    const imgUrl = img;
    const requestOptions = {
      headers: new HttpHeaders({
        responseType: 'blob',
        // observe:'body'
      }),
      withCredentials: true
    };
    console.log(imgUrl)
    const imgName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
    // this.http.get(imgUrl, requestOptions)
    //   .subscribe((res: any) => {
    //     console.log(res)
    //     const file = new Blob([res], { type: res.type });
    //     const blob = window.URL.createObjectURL(file);
    //     const link = document.createElement('a');
    //     link.href = blob;
    //     link.download = imgName;
    //     link.dispatchEvent(new MouseEvent('click', {
    //       bubbles: true,
    //       cancelable: true,
    //       view: window
    //     }));

    //     setTimeout(() => { // firefox
    //       window.URL.revokeObjectURL(blob);
    //       link.remove();
    //     }, 100);
    //   },
    //     err => { this.notification("Erro while downloading the image") })

    this.http.get(imgUrl, { responseType: 'blob' }).subscribe(
      (d: any) => {
        console.log("image url data", d);
        saveAs(d, imgName);

      },
      (err: any) => {
        console.log("error", err)
      }
    )

  }







  ngOnDestroy() {
    this.modalService.dismissAll()
    //clearInterval(this.interval)
    //clearInterval(this.interval2)
    localStorage.setItem('hooterCameras', JSON.stringify(this.activeHooterCameras))
    this.toasterService.clear()
    this.alert = false

  }

  getCameraList() {
    var cameralist: any[] = []
    var cameraIdList: any[] = []

    cameralist[0] = { item_id: -1, item_text: 'All Camera' }
    this.webServer.GetCameraDetails().subscribe((data: any) => {
      console.log(data)
      if (data.success === true) {
        data.message.forEach((el: any, i: number) => {
          cameraIdList.push({ cameraid: i, cameraname: el })
        });
        console.log(cameraIdList)
        cameraIdList = cameraIdList.filter((el, i, a) => i === a.indexOf(el))
        console.log(cameraIdList)
        cameraIdList.forEach((element: any, i: number) => {
          cameralist[i + 1] = { item_id: element.cameraid, item_text: element.cameraname }

        });
        console.log(cameralist)
        this.dropdownList = of(cameralist)
      }
      console.log(this.dropdownList)

    })

  }

  getViolationTypes() {
    var violTypeList: any[] = []
    var temp: any[] = []

    violTypeList[0] = { item_id: -1, item_text: 'All violations' }
    this.webServer.GetViolationList().subscribe((reponse: any) => {
      console.log(reponse)
      if (reponse.success) {
        reponse.message.forEach((element: any) => {
          temp.push(element)
        });

        //temp=temp.filter((el,i,a)=>{i===a.indexOf(el)})
        console.log(temp)
        temp.forEach((element: any, i: number) => {
          violTypeList[i + 1] = { item_id: i, item_text: element }
        })
        console.log(violTypeList)
        this.violationTypeList = of(violTypeList)
      }
    })

  }




}
//----------------DATE TIME VALIDATOR FOR DATE TIME PICKER-----
export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
    isValid: {
      valid: false
    }
  };
};








