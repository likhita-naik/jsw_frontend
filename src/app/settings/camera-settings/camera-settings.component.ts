import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { ServerService } from 'src/app/Services/server.service';
import { validate } from 'uuid';
import { NgbdSortableHeader } from 'src/app/common/sortable.directive';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-camera-settings',
  templateUrl: './camera-settings.component.html',
  styleUrls: ['./camera-settings.component.css']
})
export class CameraSettingsComponent implements OnInit,OnDestroy, AfterViewInit {
  RACameraList: Observable<any[]> = of([])
  responseMessage: string = ''
  IP: string = ''
  isFail: boolean = false
  isSuccess: boolean = false
  isLoading: boolean = false
  cameraData: any[] = []
  roiPoints: any[] = []
  showCamName: boolean = true
  showCamImage: boolean = true
  showSI: boolean = true
  showPlant: boolean = true
  showArea: boolean = true
  showCamBrand: boolean = true
  showAlarmType:boolean=true
  showAlarmIp=true
  selectedColumn: any
  showAiSolutions: boolean = true
  isFormValid:boolean=false
  selectedDeleteID:number
  CameraList:any[]=[]
  isHooter:boolean=false
  isRelay:boolean=false
  total:Observable<number>=of(0)
  page:number=1
  pageSize:number=10
  tempData:any[]=[]
  alarmEnabledViolations:any[]=[]
  

  @ViewChild('singleSelect') singleSelect: any

  dropdownSettings: IDropdownSettings
  dropdownSettings2: Observable<IDropdownSettings> = of({
    singleSelection: true,
    idField: "id",
    textField: "text",
    disabledField: "isDisabled",
   
    // enableCheckAll: true,
    // selectAllText: "Select All",
    // unSelectAllText: "UnSelect All",
    // allowSearchFilter: false,
    // limitSelection: 1,
    closeDropDownOnSelection: true,

    clearSearchFilter: true,
    // maxHeight: 197,
    // itemsShowLimit: 999999999999,
    searchPlaceholderText: "Search",
    noDataAvailablePlaceholderText: "No data available",
    noFilteredDataAvailablePlaceholderText: "No filtered data available",
    showSelectedItemsAtTop: false,
    defaultOpen: false,
    allowRemoteDataSearch: false,
  })

  cameraBrandList: Observable<any[]> = of([{id:1,text:'cp_plus'}])
  selectedBrand: FormControl = new FormControl()
  cameraImages: any[] = []

  headers: any[] = [{ item_text: 'si no', item_id: 0 },
  { item_text: 'Camera Name', item_id: 1 },
  { item_text: 'Camera Image', item_id: 2 },
  { item_text: 'Plant', item_id: 3 },
  { item_text: 'Area', item_id: 4 },
  { item_text: 'Camera brand', item_id: 5 },
  { item_text: 'Alarm Type', item_id: 6 },
  { item_text: 'Alarm Ip Address', item_id: 7 },

  { item_text: 'AI solutions', item_id: 8 },
  ]
  @ViewChildren(NgbdSortableHeader) sortableHeaders: QueryList<NgbdSortableHeader>


  AddCameraForm: FormGroup = new FormGroup({
    cameraname: new FormControl('', Validators.required),
    camera_brand: new FormControl('', Validators.required),
    cameraip: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    plant: new FormControl('', Validators.required),
    area: new FormControl('', Validators.required),
    port: new FormControl('', Validators.required),
    rtsp_url: new FormControl(''),
    isHooter:new   FormControl(''),
    isRelay:new FormControl(''),
    hooterIp:new FormControl(''),
    hooterConfig:new FormControl(''),
    relayIp:new FormControl('')

  })

  constructor(public server: ServerService,
    public modalService: NgbModal,
    public _lightBox: Lightbox,
    private toasterService: ToastrService,

    public _lightBoxConfig: LightboxConfig,
    public router: Router) {
    this.IP = server.IP
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'No data',
      maxHeight: 197
    };
    this.AddCameraForm.valueChanges.subscribe(value=>{
      console.log(value)
      if(this.AddCameraForm.get('cameraname').value &&this.AddCameraForm.get('cameraip').value&& this.AddCameraForm.get('port').value&& this.AddCameraForm.get('camera_brand').value && this.AddCameraForm.get('username').value && this.AddCameraForm.get('password').value&&this.AddCameraForm.get('plant').value&&this.AddCameraForm.get('area').value &&this.AddCameraForm.get('cameraip').value)
      {
        console.log('adding manually')
        this.isFormValid=true
      }

      else if(this.AddCameraForm.get('cameraname').value && this.AddCameraForm.get('camera_brand').value && this.AddCameraForm.get('rtsp_url').value && this.AddCameraForm.get('area').value &&this.AddCameraForm.get('plant').value){
        this.isFormValid=true

      }
      else{
        this.isFormValid=false
      }
    })
    this._lightBoxConfig.showDownloadButton = true
    this._lightBoxConfig.showZoom = true
    this._lightBoxConfig.showImageNumberLabel = true
    this._lightBoxConfig.fitImageInViewPort = true
    this._lightBoxConfig.disableScrolling = false
    this._lightBoxConfig.centerVertically = false
    this.GetCameraList()
    this.GetCameraBrands()
    console.log(this.AddCameraForm.value)
    this.AddCameraForm.valueChanges.subscribe(() => {
      this.isSuccess = false
      this.isFail = false
    })
  }

  ngOnInit(): void {
    this.toasterService.clear()
    //   this.dropdownSettings2=  {
    //     singleSelection: true,
    //     idField: "id",
    //     textField: "text",
    //     disabledField: "isDisabled",
    //     enableCheckAll: true,
    //     selectAllText: "Select All",
    //     unSelectAllText: "UnSelect All",
    //     allowSearchFilter: false,
    //     limitSelection: -1,
    //     clearSearchFilter: true,
    //     maxHeight: 197,
    //     itemsShowLimit: 999999999999,
    //     searchPlaceholderText: "Search",
    //     noDataAvailablePlaceholderText: "No data available",
    //     noFilteredDataAvailablePlaceholderText: "No filtered data available",
    //     closeDropDownOnSelection: true,
    //     showSelectedItemsAtTop: false,
    //     defaultOpen: false,
    //     allowRemoteDataSearch: false,
    // }
  }

  ngAfterViewInit(): void {

    this.AddCameraForm.get('rtsp_url').valueChanges.subscribe((value: any) => {
      if (value) {
        console.log(value)

        this.AddCameraForm.get('username').removeValidators(Validators.required)
        this.AddCameraForm.get('password').removeValidators(Validators.required)
        this.AddCameraForm.get('cameraip').removeValidators(Validators.required)
        this.AddCameraForm.get('port').removeValidators(Validators.required)

      }
      else {
        console.log(value)
        this.AddCameraForm.get('username').addValidators(Validators.required)
        this.AddCameraForm.get('password').addValidators(Validators.required)
        this.AddCameraForm.get('cameraip').addValidators(Validators.required)
        this.AddCameraForm.get('port').addValidators(Validators.required)
      }
    })
  }
  openCameraAddModal(modal: any) {
    this.modalService.open(modal, { size: 'lg' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
       //  this.roiNameControl.setValue(null)
       //  this.OnAddingNewROI()
       // this.download = '',
       //   this.isalert = false
       this.isHooter=false
       this.isRelay=false
       console.log('cancel')
      this.AddCameraForm.reset()
      this.isFail=false
      this.isSuccess=false
      this.isLoading=false
       // this.newROIPoints.splice(0,this.newROIPoints.length)
      // this.OnAddingNewROI()
     }, (reason) => {
       console.log('submit')
    this.isLoading=false
      /// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       // this.download = '',
       //   this.isalert = false
       this.AddCameraForm.reset()
      this.isFail=false
      this.isSuccess=false
      
     ;
     }
     )
    }
  isDelete(modal:any,id:number){
    this.selectedDeleteID=id
    this.modalService.open(modal,{ centered: true,backdrop:'static'})
  }
  DeleteCamera(){
   this.server.DeleteCameraDetails(this.CameraList[this.selectedDeleteID]._id.$oid).subscribe((response:any)=>{
    if(response.success){
      this.server.notification(response.message)
      this.modalService.dismissAll()
      this.GetCameraList()
    }
    else{
      this.server.notification(response.message)
    }
   },
   Err=>{
    this.server.notification('Something went wrong','Retry')
   })

  }

  hooterOrRelayConfig(event:any){
    console.log(event)
    if(event.target.value=='hooter'){
    this.isHooter=true
    this.isRelay=false
    }
    if(event.target.value=='relay'){
      this.isHooter=false
      this.isRelay=true
      }
  

  }
  HooterSettings(event:any){
    console.log(event)
    if(event.target.checked){
    this.alarmEnabledViolations.push(event.target.value)
  }
  else{
    var index = this.alarmEnabledViolations.indexOf(event.target.value)
    this.alarmEnabledViolations.splice(index, 1)
  }
  console.log(this.alarmEnabledViolations)

  }

  OnAddCameraDetails() {
    // this.AddCameraForm.get('rtsp_url').value?this.removeValidators():''
    this.AddCameraForm.updateValueAndValidity()
    if (this.isFormValid) {

      this.isLoading = true
      var formData = new FormData()
      this.isFail = false
      this.isSuccess = false
      console.log(this.AddCameraForm.value)
      for (let k in this.AddCameraForm.value) {
        console.log(k, this.AddCameraForm.value[k])
        if (k === 'camera_brand') {
          formData.append(k, this.AddCameraForm.value[k].text)
        }
        else {
          formData.append(k, this.AddCameraForm.value[k])

        }
      }

      if (this.AddCameraForm.get('rtsp_url').value) {
        console.log('rtsp adding')
        var ai_solution=Array
        console.log(ai_solution)
        if(this.isHooter){
       var data1:any = {
          cameraname: this.AddCameraForm.value['cameraname'],
          camera_brand: this.AddCameraForm.value['camera_brand'][0].text,
          plant: this.AddCameraForm.value['plant'],
          area: this.AddCameraForm.value['area'],
          rtsp_url:this.AddCameraForm.value['rtsp_url'],
          ai_solution:[],
          alarm_type:'hooter',
          alarm_ip_address:this.AddCameraForm.value['hooterIp']
          
        }
        console.log(data1)
      }
      else  if(this.isRelay){
        var data1:any = {
           cameraname: this.AddCameraForm.value['cameraname'],
           camera_brand: this.AddCameraForm.value['camera_brand'][0].text,
           plant: this.AddCameraForm.value['plant'],
           area: this.AddCameraForm.value['area'],
           rtsp_url:this.AddCameraForm.value['rtsp_url'],
           alarm_type:'relay',
           alarm_ip_address:this.AddCameraForm.value['relayIp'],
           ai_solution:[]
           
         }
       }
       else{
        var data1:any = {
          cameraname: this.AddCameraForm.value['cameraname'],
          camera_brand: this.AddCameraForm.value['camera_brand'][0].text,
          plant: this.AddCameraForm.value['plant'],
          area: this.AddCameraForm.value['area'],
          rtsp_url:this.AddCameraForm.value['rtsp_url'],
          ai_solution:[],
          
          
        }
       }
        // this.AddCameraForm.removeControl('username')
        // this.AddCameraForm.removeControl('password')
        // this.AddCameraForm.removeControl('cameraip')
        // this.AddCameraForm.removeControl('port')
        this.server.AddRACamerabyRtsp(data1).subscribe((response: any) => {
          console.log(response)
          // this.AddCameraForm.addControl('username', new FormControl('', Validators.required))
          // this.AddCameraForm.addControl('password', new FormControl('', Validators.required))
          // this.AddCameraForm.addControl('cameraip', new FormControl('', Validators.required))
          // this.AddCameraForm.addControl('port', new FormControl('', Validators.required))

          if (response.success) {
            this.isLoading = false

            this.responseMessage = response.message
            this.isSuccess = true
            this.GetCameraList()
            this.isHooter=false
            this.isRelay=false
            setTimeout(() => {
             this.modalService.dismissAll()

            }, 1000);
          }
          else {
            this.isLoading = false
            this.responseMessage = response.message
            this.isFail = true
            //this.AddCameraForm.reset()
          }
        },
        Err=>{
          this.isFail=true
          this.responseMessage="Error while adding camera,retry"
       this.isLoading = false
      // this.AddCameraForm.reset()
        })


      }

      else {
        var ai_solution=Array
      console.log(this.AddCameraForm.value['camera_brand'].text)
      if(this.isHooter){
        var data :any= {
          cameraname: this.AddCameraForm.value['cameraname'],
          camera_brand: this.AddCameraForm.value['camera_brand'][0].text,
          plant: this.AddCameraForm.value['plant'],
          area: this.AddCameraForm.value['area'],
          username: this.AddCameraForm.value['username'],
          password: this.AddCameraForm.value['password'],
          cameraip: this.AddCameraForm.value['cameraip'],
          port: this.AddCameraForm.value['port'],
          alarm_type:'hooter',
          alarm_ip_address:this.AddCameraForm.value['hooterIp'],

          ai_solution:[]
        }
      }
     else if(this.isRelay){
        var data :any= {
          cameraname: this.AddCameraForm.value['cameraname'],
          camera_brand: this.AddCameraForm.value['camera_brand'][0].text,
          plant: this.AddCameraForm.value['plant'],
          area: this.AddCameraForm.value['area'],
          username: this.AddCameraForm.value['username'],
          password: this.AddCameraForm.value['password'],
          cameraip: this.AddCameraForm.value['cameraip'],
          port: this.AddCameraForm.value['port'],
          alarm_type:'relay',
          alarm_ip_address:this.AddCameraForm.value['relayIp'],
          ai_solution:[]
        }
      }
     else{
        var data :any= {
          cameraname: this.AddCameraForm.value['cameraname'],
          camera_brand: this.AddCameraForm.value['camera_brand'][0].text,
          plant: this.AddCameraForm.value['plant'],
          area: this.AddCameraForm.value['area'],
          username: this.AddCameraForm.value['username'],
          password: this.AddCameraForm.value['password'],
          cameraip: this.AddCameraForm.value['cameraip'],
          port: this.AddCameraForm.value['port'],
          ai_solution:[]
        }
      }
    //    this.AddCameraForm.removeControl('rtsp_url')

        this.server.AddCameraDetails(data).subscribe((response: any) => {
          console.log(response)
        //  this.AddCameraForm.addControl('rtsp_url', new FormControl('', Validators.required))

          if (response.success) {
            this.responseMessage = response.message
            this.isSuccess = true
            this.isLoading = false
            this.isHooter=false
            this.isRelay=false

            setTimeout(() => {
              this.modalService.dismissAll()
            }, 1000);
            this.GetCameraList()
          }
          else {
            
            this.isLoading = false
            this.responseMessage = response.message
            this.isFail = true
          }
        },
          (error: any) => {
            //this.AddCameraForm.addControl('rtsp_url', new FormControl('', Validators.required))
               this.isFail=true
               this.responseMessage="Error while adding camera,retry"
            this.isLoading = false
           // this.AddCameraForm.reset()
          })
      }
      
    }
   
    else {
      this.isFail = true
      this.responseMessage = "Above Fields are required"
    }
  }

  StartApplication(){
    this.server.StartApplication().subscribe((response:any)=>{
      if(response.success){
        this.server.notification(response.message)
      }
      else{
        this.server.notification('Something went wrong','Retry')
      }
    },
    Err=>{
      this.server.notification('Something went wrong','Retry')
    })
  }

  removeValidators() {
    this.AddCameraForm.get('username').removeValidators(Validators.required)
    this.AddCameraForm.get('password').removeValidators(Validators.required)
    this.AddCameraForm.get('cameraip').removeValidators(Validators.required)
    this.AddCameraForm.get('port').removeValidators(Validators.required)
    return true
  }
  GetCameraList() {
    this.AddCameraForm.reset()

    this.server.getCameras().subscribe((response: any) => {
      if (response.success) {
        this.cameraImages = []
        this.CameraList=response.message
        this.total=of(response.message.length)
        this.tempData=response.message
        //this.RACameraList = of(response.message)
        this.slice()
        response.message.forEach((element: any, index: number) => {
          this.cameraImages[index] = {
            src: this.IP + '/get_roi_image/' + element.imagename,

            thumb: this.IP + '/get_roi_image/' + element.imagename,
            caption: element.imagename,

          }

        });
      }
    })
  }
  goToRoiEdit(id: string, image: string) {
    var link = this.router.serializeUrl(this.router.createUrlTree(['app/ROISettings'], { queryParams: { id: id, image: image } }))
    window.open(link, '_blank')
    //this.router.navigate(['app/ROISettings'], { queryParams: { id: id, image: image } })

  }

  onHideColumn(event: any) {
    console.log(event)
    this.selectedColumn.push(event.item_text)
    switch (event.item_id) {
      case 0: {
        this.showSI = false
        break;
      }
      case 1: {
        this.showCamName = false
        break;
      }
      case 2: {
        this.showCamImage = false
        break;
      }
      case 3: {
        this.showPlant = false
        break;
      }
      case 4: {
        this.showArea = false
        break;
      }
      case 5: {
        this.showCamBrand = false
        break;
      }
      case 6: {
        this.showAlarmType = false
        break;
      }
      case 7: {
        this.showAlarmIp = false
        break;
      }
      case 8: {
        this.showAiSolutions = false
        break;
      }
    }



  }
  onShowColumn(event: any) {
    switch (event.item_id) {
      case 0: {
        this.showSI = true
        break;
      }
      case 1: {
        this.showCamName = true
        break;
      }
      case 2: {
        this.showCamImage = true
        break;
      }
      case 3: {
        this.showPlant = true
        break;
      }
      case 4: {
        this.showArea = true
        break;
      }
      case 5: {
        this.showCamBrand = true
        break;
      }
      case 6: {
        this.showAlarmType = true
        break;
      }
      case 7: {
        this.showAlarmIp = true
        break;
      }
      case 8: {
        this.showAiSolutions = true
        break;
      }
    }


  }

  GetCameraBrands() {
    this.server.GetCameraBrandDetails().subscribe((response: any) => {
      console.log(response)
      var temp: any[] = []
      if (response.success) {
        response.message.forEach((element: any, id: number) => {
          temp.push({ text: element, id: id })

        });
      }
      console.log(temp)

      this.cameraBrandList = of(temp)
    })
  }


  open(index: number): void {
    // open lightbox
    var imgindex=index-1
    console.log(imgindex)
    console.log(this.cameraImages)
    this._lightBox.open(this.cameraImages, imgindex);
  }

  OnSelectCameraBrand(event: any) {
    // console.log(this.AddCameraForm.get('camera_brand').patchValue(event.text))
    console.log(this.AddCameraForm.get('camera_brand').value)
  }
  
  slice(){
    this.total = of((this.tempData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize)).length)
    this.total = of(this.tempData.length)
    this.RACameraList = of((this.tempData.map((div: any, SINo: number) => ({ SNo: SINo + 1, ...div })).slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize)))

  }

  ngOnDestroy(): void {
    this.modalService.dismissAll()
  }
}
