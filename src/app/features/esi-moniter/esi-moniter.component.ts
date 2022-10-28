import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { interval, Observable, of } from 'rxjs';
import { ServerService } from 'src/app/Services/server.service';
import { saveAs } from 'file-saver';
import { NgbdSortableHeader, SortColumn, SortDirection, SortEvent } from '../../common/sortable.directive'


@Component({
  selector: 'app-esi-moniter',
  templateUrl: './esi-moniter.component.html',
  styleUrls: ['./esi-moniter.component.css']
})
export class ESIMoniterComponent implements OnInit,AfterViewInit,OnDestroy {
  dropdownSettings: IDropdownSettings
  cameras: Observable<any[]>
  panelNumbers: Observable<any[]>
  violationTypes: Observable<any[]>
  plants: Observable<any[]>
  areas: Observable<any[]>
  panels:Observable<any[]>
  selectedCamera: any
  selectedPanel: any
  selectedPlant: any
  selectedArea: any
  selectedViolation: any
  notInJobList: any[] = []
  enabledCameras: any[] = []
  total: Observable<number> = of(0)
  page: number = 1
  pageSize: number = 5
  tempData: any[] = []
  isLoading:boolean=false
  isAreaDisable: boolean = true
  isPanelDisable: boolean = true
  jobsheetData: Observable<any[]> = of([])
  headers: any[] = [{ columnName: 'Sl.No.', showColumn: true },
  { columnName: 'Plant', showColumn: true },
  { columnName: 'Job Description', showColumn: true },
  { columnName: 'panel', showColumn: true },
  { columnName: 'Isolating locations', showColumn: true },
  { columnName: 'IP Address', showColumn: true }]
  totalJobsheetEntries: number = 0
  showPanel: boolean = true
  showJD: boolean = true
  showPlant: boolean = true
  showNIP: boolean = false
  showIA: boolean = true
  showIP: boolean = true
  showArea: boolean = true
  showSI: boolean = true
  showPS: boolean = true
  selectedColumn: any[] = []
  selectedJobsheet: any
  isDesc: boolean = false
  selectedPlants: any[] = []
  selectedAreas: any[] = []
  selectedPanels: any[] = []
  excelLoad:boolean=false
  Interval:any
  
  dataHeaders: any[] = [{ item_text: 'SI no', item_id: 0 },
  { item_text: 'Plant', item_id: 1 },
  { item_text: 'Area', item_id: 2 },
  { item_text: 'Job Description', item_id: 3 },
  { item_text: 'Panel', item_id: 4 },
  // {item_text:'No of isolating Points',item_id:5},
  { item_text: 'Isolating Area', item_id: 6 },
  { item_text: 'IP Address', item_id: 7 },
  { item_text: 'Panel Status', item_id: 8 },
  ]

  @ViewChildren(NgbdSortableHeader) sortableHeaders: QueryList<NgbdSortableHeader>

  dataJobsheets: Observable<any[]> = of([{ item_text: 'Previous Excel', item_id: 0 },
  { item_text: 'latest Excel', item_id: 1 }])

  constructor(
    public server: ServerService,
    public router: Router
  ) {
    this.GetPlantList()
    this.dropdownSettings = {
      singleSelection: false,
      enableCheckAll:false,
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
    //this.getJobsheetData()
    this.GetJobsheetStatus()

  }

  ngOnInit(): void {
    var table=document.getElementById('dataTable')
    table.classList.add('loader')
    this.server.GetJobSheet().subscribe((response: any) => {
      table.classList.remove('loader')
      console.log(response)
      if (response.success) {
        this.total = of(response.message.length)
        this.jobsheetData = of(response.message)
        this.tempData = response.message
        this.sliceData()
      }
      else {
       this.server.notification('Data not found')
      }

    },
    err=>{
      this.server.notification('Error while fetching the data','Retry')
      table.classList.remove('loading')
    })
  }

  ngAfterViewInit(): void {
  this.Interval=  setInterval(()=>{
      this.ShowData()

    },60000)
  }
   
  
  onCameraSelect(event: any) {

  }
  onPanelSelect(event: any) {

  }
  onViolationSelect(event: any) {

  }

  OnAllPlantSelect(event:any){
    console.log(event)
  }

  JobsheetDownload(){
    this.excelLoad=true
    this.server.CreateJobsheetExcel().subscribe((Response: any) => {
      console.log(Response)
      if (Response.success) {
       // this.excelLoad = false
        //console.log(Response)
        console.log("APi data for excel")

        console.log(Response)
      
        this.server.DownloadJobsheet().subscribe(
          (response: any) => {
            console.log(response)
            this.excelLoad = false
            this.excelLoad = false
            var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            console.log(response.headers.get('content-Type'))


            console.log(response)
            const blob = new Blob([response.body], { type: '.xlsx' });
            // var fileName =  response.headers.get('Content-Disposition').split(';')[1];
            var fileName = "Jobsheet" + " " + this.server.dateTransform(new Date) + '.xlsx'
            const file = new File([blob], fileName, { type: '.xlsx' });
            saveAs(blob, fileName);
          },
          err => {
            this.excelLoad = false
            console.log(err)
            this.server.notification(err.text)
          })
      }
      else {
        this.server.notification(Response.message, 'Retry')
        this.excelLoad = false
        // this.isExcel = false
        // this.alertmessage = Response.message
        // this.isalert = true

      }
    },
      err => {
        this.excelLoad = false

        // this.isExcel = false
        this.server.notification("Error while creating excel", 'Retry')
      })
  }
 
  

  GetPlantList() {
    this.server.GetPlantList().subscribe((response: any) => {
      if (response.success) {
        var temp: any[] = []
        response.message.forEach((element: any, i: number) => {
          temp.push({ item_text: element, item_id: i })

        });

        console.log(temp)

        this.plants = of(temp)
        // this.plants=of(mess)
      }
    })
  }

  
  
  //..............multiselectdropdown selecting functions...................
   
  OnPlantSelect(event: any) {
    console.log(this.selectedPlant)
    this.selectedPlants=[]
    this.selectedPlant.forEach((element: any) => {
      this.selectedPlants.push(element.item_text)

    });
    
   // console.log(this.selectedPlants)

    this.GetAreaList()
    this.GetPanelList()
    // this.server.GetAreasByPlant()
  }

  OnAreaSelect(event: any) {
    this.selectedAreas=[]
    this.selectedArea.forEach((element: any) => {
      this.selectedAreas.push(element.item_text)

    });
    this.GetPanelList()
    console.log(this.selectedAreas)
  }

  OnPanelSelect(event:any){
    this.selectedPanels=[]
    this.selectedPanel.forEach((element: any) => {
      this.selectedPanels.push(element.item_text)

    });
   // this.GetPanelList()
    console.log(this.selectedAreas)
  }

  //............................................................................

  //................ngmultiselect deselect functions................................
  onDeselectPlant(event: any) {
    console.log(event)
    
    if (this.selectedPlant.length === 0) {
      this.isAreaDisable = true
    }
    var string=event.item_text
   var index= this.selectedPlants.indexOf(event.item_text)
   console.log(index)

   this.selectedPlants.splice(index,1)
   console.log(this.selectedPlants)
   this.GetAreaList()
  }

  OnDeselectArea(event:any){
    if (this.selectedArea.length === 0) {
      this.isPanelDisable = true
    }
    console.log(event.item_text)
    var string=event.item_text
   var index= this.selectedAreas.indexOf(event.item_text)
   this.selectedAreas.splice(index,1)
   console.log(this.selectedAreas)

  }
  OnDeselectPanel(event:any){
    console.log(event.item_text)
    var string=event.item_text
   var index= this.selectedPanels.indexOf(event.item_text)
   this.selectedPanels.splice(index,1)
   console.log(this.selectedPanels)

  }

  //..............................................................................



  GetAreaList() {
    this.server.GetAreasByPlant(this.selectedPlants).subscribe((response: any) => {
      if (response.success) {
        console.log(response)
        var temp: any[] = []
        response.message.forEach((element: any, i: number) => {
          temp.push({ item_text: element, item_id: i })
          this.isAreaDisable = false
        });

        console.log(temp)

        this.areas = of(temp)
      }
    })
  }

  GetPanelList() {
    // this.server.GetPanelsByArea()
    this.server.GetPanelsList(this.selectedPlants,this.selectedAreas).subscribe((response:any)=>{
      if (response.success) {
        console.log(response)
        var temp: any[] = []
        response.message.forEach((element: any, i: number) => {
          temp.push({ item_text: element, item_id: i })
          this.isPanelDisable = false
        });

        console.log(temp)

        this.panelNumbers = of(temp)
      }    })
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
        this.showPlant = false
        break;
      }
      case 2: {
        this.showArea = false
        break;
      }
      case 3: {
        this.showJD = false
        break;
      }
      case 4: {
        this.showPanel = false
        break;
      }
      case 5: {
        this.showNIP = false
        break;
      }
      case 6: {
        this.showIA = false
        break;
      }
      case 7: {
        this.showIP = false
        break;
      }
      case 8: {
        this.showPS = false
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
        this.showPlant = true
        break;
      }
      case 2: {
        this.showArea = true
        break;
      }
      case 3: {
        this.showJD = true
        break;
      }
      case 4: {
        this.showPanel = true
        break;
      }
      case 5: {
        this.showNIP = true
        break;
      }
      case 6: {
        this.showIA = true
        break;
      }
      case 7: {
        this.showIP = true
        break;
      }
      case 8: {
        this.showPS = true
        break;
      }
    }


  }
  getJobsheetData() {
    var table=document.getElementById('dataTable')
    table.classList.add('loader')
    this.server.GetJobSheet().subscribe((response: any) => {
      table.classList.remove('loader')
      console.log(response)
      if (response.success) {
        this.total = of(response.message.length)
        this.jobsheetData = of(response.message)
        this.tempData = response.message
        this.sliceData()
      }
      else {
      // this.server.notification('Data not found')
      }

    },
    err=>{
     // this.server.notification('Error while fetching the data','Retry')
      table.classList.remove('loading')
    })
  }

  GetJobsheetStatus() {
    this.server.GetJobsheetStatus().subscribe((response: any) => {
      console.log(response)
      this.notInJobList = response.message.invalid
      this.enabledCameras = response.message.working
      this.totalJobsheetEntries = response.message.invalid.length + response.message.working.length + response.message.not_working.length
    })
  }

  ResetJobSheet() {
    this.server.ResetJobsheet().subscribe((response:any)=>{
      if(response.success){
    this.router.navigate(['app/jobsheetUpload'])
      }
      else{
        this.server.notification(response.message)
        this.router.navigate(['app/jobsheetUpload'])

      }
  },
  err=>{
    this.server.notification("Something went wrong",'Retry')
  })
  }

  StartApplication(){
    this.server.StartApplication().subscribe((response:any)=>{
      this.server.notification(response.message)
    })
  }

  sliceData() {
    console.log(this.page, this.pageSize)
    this.total = of((this.tempData.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize)).length)
    this.total = of(this.tempData.length)
    this.jobsheetData = of((this.tempData.map((div: any, SINo: number) => ({ SNo: SINo + 1, ...div })).slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize)))
  }

  ToPPE(id: string) {
    var link=this.router.serializeUrl(this.router.createUrlTree(['app/panelViolation'], { queryParams: { panel: id } }))
    window.open(link,'_blank')
    //this.router.navigate(['app/panelViolation'], { queryParams: { panel: id } })

  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    console.log(column, direction)
    this.sortableHeaders.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
  }

  ShowData() {
    // var table=document.getElementById('data-Table')
    // table.classList.add('loader')
    this.server.GetJobSheetDataByfilter(this.selectedPlants, this.selectedAreas, this.selectedPanels).subscribe((response: any) => {
      console.log(response)
      //table.classList.remove('loader')
      if (response.success) {
        this.total = of(response.message.length)
        //this.jobsheetData = of(response.message)
        this.tempData = response.message
        this.sliceData()
      }
      else {
        this.total = of(0)
        //this.jobsheetData = of(response.message)
        this.tempData =[]
        this.sliceData()
      }
    }
    )
  }
  ngOnDestroy(): void {
    clearInterval(this.Interval)
  }
}
