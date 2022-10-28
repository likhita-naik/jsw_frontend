import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { elementAt, observable, Observable, of, Subject } from 'rxjs';
import { ServerService } from 'src/app/Services/server.service';
// import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid'
import { bottom } from '@popperjs/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
declare const fabric: any
export interface polygonPoints {
  x: number,
  y: number
}

export interface panel {
  panel_name_canvas?: any,
  roi_data?: any,
  roi_canvas?: any
}
@Component({
  selector: 'app-roi-settings',
  templateUrl: './roi-settings.component.html',
  styleUrls: ['./roi-settings.component.css']
})

export class RoiSettingsComponent implements OnInit, AfterViewInit {
  PanelData: any = {}
  PanelDataObservable: Observable<any> = of({})
  ID: string
  IP: string
  isPanelData: boolean = false
  canvas: any
  PanelsRoiPoints: any[] = []
  newPanelPoints: polygonPoints[] = []
  imageName: string
  isAddPanel: boolean = false
  newPt: any
  newPanel: any
  isChanges:boolean=false
  isPolygonDrawn: boolean = false
  isEdit: boolean = false
  isLock1: boolean = false
  isTag: boolean = false
  isLock2: boolean = false
  isRackWindow: boolean = false
  AllPanels: {}[] = []
  selectedEditId: any
  rectangle: any

  tempData: any[] = []
  allPanelData: any[] = []
  isEditText: boolean = false
  selectedId: number
  tempPanelID: any
  RackWindowRoiPoints: any[]
  tempRectPoints: any[]
  isEditPanel:boolean=false
  iseditRW:boolean=false
  polygonOptions: any = {
    fill: 'rgba(0,0, 0,0)',
    strokeWidth: 2,
    stroke: 'rgb(127, 255, 0)',
    scaleX: 1,
    scaleY: 1,
    objectCaching: false,
    selectable: false,
    transparentCorners: false,
    cornerColor: 'blue'
  }
  polygonOptions2: any = {
    fill: 'rgba(0,0,0,0)',
    strokeWidth: 2,
    stroke: 'rgba(15, 227, 242)',
    scaleX: 1,
    scaleY: 1,
    objectCaching: false,
    selectable: false,
    transparentCorners: false,
    cornerColor: 'blue'
  }
  isLoading: boolean = false
  newRw: any
  newRWPoints: polygonPoints[] = []
  isAddRW: boolean = false
  selectedPanelforRW:number

  panelNameControl: FormControl = new FormControl('', Validators.required)
  @ViewChild('panelNameChangeModal', { static: false }) panelChangeModal: TemplateRef<any>
  @ViewChild('panelNameModal', { static: false }) panelNameModal: TemplateRef<any>



  constructor(
    private ActiveRoute: ActivatedRoute,
    private server: ServerService,
    private router:Router,
    private modalService: NgbModal) {
    this.IP = server.IP

    this.ActiveRoute.queryParams.subscribe((params: any) => {
      console.log(params)
      this.ID = params.id
      this.imageName = params.image_name
      this.server.GetPanelCameraData(this.ID, this.imageName).subscribe((response: any) => {
        console.log(response.message)
        if (response.success) {
          this.PanelData = response.message
          console.log(this.imageName)
          this.PanelDataObservable = of(response.message)
          this.isPanelData = true
          this.GetPanelPoints()
          console.log(this.PanelData)
          // this.PanelDataObservable.subscribe((data:any)=>{
          //   this.PanelData=data
          //   console.log(data)
          //   console.log(this.PanelData)
          //  }) 
        }
        else {

          this.server.notification(response.message, 'Retry')
        }
      })


    })
  }

  ngOnInit(): void {
    //  this.canvas.on('mouse:down',(options:any)=>{

    //  })
  }

  ngAfterViewInit(): void {
    this.canvasSetup()
    this.makeNewPanel()
    this.makeNewRW()
    this.canvas.on('mouse:up', (options: any) => {

      if (options.button === 1) {
        if (!((options.transform == null ? false : options.transform.action === 'modifyPolygon' ? false : true)) && !this.isEdit
        ) {
          console.log('polygon  is 1creating')
          if (this.isAddPanel) {
            console.log('panel cords')

            this.getClickCoords(options.e);
          }
          if (this.isAddRW) {
            console.log('rw cords')
            this.getClickCoordsForRW(options.e)
          }
        }
      }
      if (options.button === 3) {
        if (this.isAddPanel) {
          if (this.newPanelPoints.length < 4) {
            console.log('polygon is  3creating')
            this.isPolygonDrawn = false;
          } else {
            console.log('polygon is  3creating')
            this.isPolygonDrawn = true;
          }
        }
        if (this.isAddRW) {
          if (this.newRWPoints.length < 4) {
            console.log('polygon is  3creating')
            this.isPolygonDrawn = false;
          } else {
            console.log('polygon is  3creating')
            this.isPolygonDrawn = true;
          }
        }
      }

    });

    this.canvas.on('mouse:down', (event: any) => {
      console.log(event)
      if (event.button === 1) {
        if (!((event.transform == null ? false : event.transform.action === 'modifyPolygon' ? false : true)) && !this.isEdit
        ) {
          console.log('polygon  is 1creating')
          // if (this.isAddPanel) {
          //   console.log('panel cords')

          //   this.getClickCoords(event.e);
          // }
          // if (this.isAddRW) {
          //   console.log('rw cords')
          //   this.getClickCoordsForRW(event.e)
          // }
        }
      }
      //  this.CreateRectangle(event)
      if (this.isAddPanel) {
        if (event.button === 3) {
          if (this.newPanelPoints.length < 3) {
            this.isPolygonDrawn = false;
          } else {
            //this.makePolygon();
            // this.OnAddingNewPanel()
            this.PanelName()
           
            this.isPolygonDrawn = true;

          }
         
        }
      }
      if (this.isAddRW) {
        if (event.button === 3) {
          if (this.newRWPoints.length < 3) {
            this.isPolygonDrawn = false;
          } else {
            //this.makePolygon();
            // this.OnAddingNewPanel()
            //this.PanelName() if(this.isAddRW){
            console.log('rw is created')
            this.OnAddingNewRw()
          
            this.isPolygonDrawn = true;

          }


        }
      }
      else {
        if ((event.transform == null ? true : event.transform.action === 'drag' ? false : true)) {
        }
      }
    })

      this.canvas.on('mouse:move', (options: any) => {
      //  this.createRect2(options)
    })
    
this.canvas.on('object:moving', (options: any) => {
      console.log(options.target)
      var actObject=options.target
      console.log(this.iseditRW)

     // actObject.calcCoords()
if(this.iseditRW){
  console.log(this.allPanelData[this.selectedPanelforRW].rw_canvas.points)

      // this.allPanelData[this.selectedPanelforRW].rw_canvas=actObject 
      // this.allPanelData[this.selectedPanelforRW].rw_canvas.points[0]={x:options.target.oCoords.tl.x-options.pointer.x,y:options.target.oCoords.tl.y-options.pointer.y}
      // this.allPanelData[this.selectedPanelforRW].rw_canvas.points[1]={x:options.target.oCoords.bl.x-options.pointer.x,y:options.target.oCoords.bl.y-options.pointer.y}
      // this.allPanelData[this.selectedPanelforRW].rw_canvas.points[2]={x:options.target.oCoords.tr.x-options.pointer.x,y:options.target.oCoords.tr.y-options.pointer.y}
      // this.allPanelData[this.selectedPanelforRW].rw_canvas.points[3]={x:options.target.oCoords.br.x-options.pointer.x,y:options.target.oCoords.br.y-options.pointer.y}
      //this.allPanelData[this.selectedPanelforRW].rw_canvas=actObject 
      this.allPanelData[this.selectedPanelforRW].rw_canvas.top=options.target.top
      this.allPanelData[this.selectedPanelforRW].rw_canvas.left=options.target.left
      this.allPanelData[this.selectedPanelforRW].rw_canvas.points[0]=options.target.oCoords.tl
      this.allPanelData[this.selectedPanelforRW].rw_canvas.points[1]=options.target.oCoords.tr
      this.allPanelData[this.selectedPanelforRW].rw_canvas.points[2]=options.target.oCoords.br
      this.allPanelData[this.selectedPanelforRW].rw_canvas.points[3]=options.target.oCoords.bl
      //this.allPanelData[this.selectedPanelforRW].rw_canvas.calcTransformMatrix()
      
     

     // this.allPanelData[this.selectedPanelforRW].rw_canvas.setCoords()


   // this.EditRect(this.selectedPanelforRW)
     // this.EditRect(se\

}
    // console.log(actObject.calcCoords())

      // this.Modify()
    })
this.canvas.on('object:scaling',(options: any) => {
  console.log(options.target)
  var actObject=options.target
  console.log(this.iseditRW)

 // actObject.calcCoords()
if(this.iseditRW){
 
  this.allPanelData[this.selectedPanelforRW].rw_canvas.points[0]=options.target.oCoords.tl
  this.allPanelData[this.selectedPanelforRW].rw_canvas.points[1]=options.target.oCoords.bl
  this.allPanelData[this.selectedPanelforRW].rw_canvas.points[2]=options.target.oCoords.br
  this.allPanelData[this.selectedPanelforRW].rw_canvas.points[3]=options.target.oCoords.tr



 // this.allPanelData[this.selectedPanelforRW].rw_canvas.setCoords()


  console.log(this.allPanelData[this.selectedPanelforRW].rw_canvas.points)
// this.EditRect(this.selectedPanelforRW)
 // this.EditRect(se\
}
})

  }
canvasSetup() {
  var cContainer = document.getElementById('canvas-container')
  console.log(cContainer.clientWidth)
  this.canvas = new fabric.Canvas('canvasROI', { fireRightClick: true })
  console.log(this.canvas)
  this.canvas.selection = false
  this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
  this.canvas.setWidth(cContainer.clientWidth)
  // console.log(this.canvasContainer.clientx)
  // this.canvas.setWidth(img.width)
  fabric.Image.fromURL(this.IP + '/get_roi_image/' + this.imageName, (img: any) => {
    console.log(img.width)
    console.log(img.height)
    this.canvas.setWidth(img.width)

    //var newHeight= this.CalculateAspectRatio(img.width,img.height,cContainer.clientWidth)
    this.canvas.setHeight(img.height)
    //  this.canvas.setHeight(newHeight)


    // console.log(img.height)
    // scale image down, and flip it, before adding it onto canvas
    //img.scale(0.5)
    this.canvas.setBackgroundImage(img, this.canvas.requestRenderAll.bind(this.canvas), {
      scaleX: this.canvas.width / img.width,
      scaleY: this.canvas.height / img.height
    });

    // this.canvas.renderAll()
    // console.log(this.canvas.height)
    // console.log(this.canvas.width)
    //this.canvas.add(oImg);
  });
}

GetPanelPoints() {
  this.PanelData[0].panel_data.forEach((points: any) => {
    console.log(typeof (points.roi_data.RW))
    //accessing roi points
    var roi_points = points.roi_data.bbox.split(';')
    var rw_points = typeof (points.roi_data.RW) == 'string' ? points.roi_data.RW.split(';') : []
    console.log(rw_points)
    var polyGon: any[] = []
    this.tempRectPoints = []
    for (let i = 0; i < roi_points.length - 1; i = i + 2) {
      var tempPoint = {
        x: Number(roi_points[i]),
        y: Number(roi_points[i + 1])
      }
      polyGon.push(tempPoint)

    }
    for (let i = 0; i < rw_points.length - 1; i = i + 2) {
      var temp = {
        x: Number(rw_points[i]),
        y: Number(rw_points[i + 1])
      }
      this.tempRectPoints.push(temp)
    }

    //   if(rw_points.length>0){
    //   var x1=this.tempRectPoints[0].x
    //   var y1=this.tempRectPoints[0].y
    //   var x2=this.tempRectPoints[1].x
    //   var y2=this.tempRectPoints[1].y
    //   var xc = (x1 + x2)/2  ; 
    //   var   yc = (y1 + y2)/2  ;    // Center point
    //    var xd = (x1 - x2)/2  ;  
    //    var yd = (y1 - y2)/2  ;    // Half-diagonal

    // var  x3 = xc - yd  ; 
    // var y3 = yc + xd;    // Third corner
    //  var x4 = xc + yd  ; 
    //  var y4 = yc - xd; 
    //  var tempPoints={x:this.tempRectPoints[1].x,y:this.tempRectPoints[1].x}
    //  this.tempRectPoints[1]={x:x3,y:y3}
    //  this.tempRectPoints[2]=tempPoints

    //  this.tempRectPoints[3]={x:x4,y:y4}
    //   }
    // this.CalculateRectPoints(,,this.tempRectPoints[1].x,this.tempRectPoints[1].y)
    console.log(this.tempRectPoints)
    var tempObj = {
      rw: this.tempRectPoints,
      panel: polyGon,
      panel_id: points.panel_id
    }
    this.PanelsRoiPoints.push(tempObj)
    console.log(this.PanelsRoiPoints)
  });
  this.DrawExistPanels()
}

DrawExistPanels() {
  this.PanelsRoiPoints.forEach((element: any, id: number) => {
    console.log(element.panel)
    var Polygon: any = new fabric.Polygon(element.panel,{ ...this.polygonOptions,id:id})
    if (element.rw.length > 0) {
      var rw_roi = new fabric.Polygon(element.rw, {...this.polygonOptions2,id:id})
      rw_roi.set("aCoords", { tl: new fabric.Point(element.rw[0].x, element.rw[0].y), tr: new fabric.Point(element.rw[1].x, element.rw[1].y), br: new fabric.Point(element.rw[2].x, element.rw[2].y), bl: new fabric.Point(element.rw[3].x, element.rw[3].y) });
    }
    Polygon.id = uuid()
    console.log(Polygon)
    var text = new fabric.Text(element.panel_id === 'NA' ? (id + 1) + '.' + element.panel_id : element.panel_id, {
      fontSize: 20,
      // bottom:5
      backgroundColor: 'black',
      left: Polygon.left - 4,
      top: Polygon.top - 10,
      stroke: 'rgb(127, 255, 0)',
      fill: 'rgb(127, 255, 0)',
    });
    console.log(Polygon)

    var tempObj = {
      rw_canvas: element.rw.length ? rw_roi : null,
      panel_name_canvas: text,
      roi_canvas: Polygon,
      rw: element.rw,
      panel_id: this.PanelData[0].panel_data[id].panel_id === 'NA' ? this.PanelData[0].panel_data[id].panel_id + (id + 1) : this.PanelData[0].panel_data[id].panel_id,
      roi_data: this.PanelData[0].panel_data[id]

    }

    this.allPanelData.push(tempObj)
    console.log(rw_roi)
    if (element.rw.length > 0) {
      console.log(element.rw)
      this.canvas.add(Polygon, text, rw_roi);
    }
    else {
      this.canvas.add(Polygon, text)
    }
    // console.log(this.canvas.get)
    this.canvas.renderAll()

    // this.canvas.add(Polygon)
    // this.canvas.requestRenderAll()


  });
  console.log(this.allPanelData)


}

CalculateRectPoints(x1: any, y1: any, x2: any, y2: any){
  var xc = (x1 + x2) / 2;
  var yc = (y1 + y2) / 2;    // Center point
  var xd = (x1 - x2) / 2;
  var yd = (y1 - y2) / 2;    // Half-diagonal

  var x3 = xc - yd;
  var y3 = yc + xd;    // Third corner
  var x4 = xc + yd;
  var y4 = yc - xd;
  var temp = { x: this.tempRectPoints[1].x, y: this.tempRectPoints[1].x }
  this.tempRectPoints[1] = { x: x3, y: y3 }
  this.tempRectPoints[2] = temp

  this.tempRectPoints[4] = { x: x4, y: y4 }
}

PanelName(){
  this.isPolygonDrawn = true
  this.isAddPanel = false
  this.modalService.open(this.panelNameModal, { size: 'small', centered: true, backdrop: 'static' }).result.then((result) => {
    // this.closeResult = `Closed with: ${result}`;
    this.panelNameControl.setValue(null)
    this.DeleteNewPanel()
    // this.OnAddingNewPanel()
    // this.download = '',
    //   this.isalert = false
  }, (reason) => {
    //  this.panelNameControl.setValue(null)
    //  this.OnAddingNewPanel()
    /// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // this.download = '',
    //   this.isalert = false
  });

}

  private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

nameSubmit(){
  this.modalService.dismissAll()
  this.OnAddingNewPanel()
}

getClickCoords(event: any) {
  if (this.isAddPanel) {
    this.newPt = {
      x: event.layerX,
      y: event.layerY
    };
    this.newPanelPoints.push(this.newPt);
    console.log(this.newPt)

    console.log(this.newPanel)
    this.canvas.add(this.newPanel);

    // console.log(this.points)
    // if (this.points.length > 3) {
    //   this.isPolygonDrawn = true;
    // }
  }
}
getClickCoordsForRW(event: any) {
  if (this.isAddRW) {
    var newPt = {
      x: Math.round(event.layerX),
      y: Math.round(event.layerY)
    };
    this.newRWPoints.push(newPt);
    console.log(newPt)

    console.log(this.newRWPoints)
    this.canvas.add(this.newRw);

    // console.log(this.points)
    // if (this.points.length > 3) {
    //   this.isPolygonDrawn = true;
    // }
  }
}


makeNewPanel() {
  this.newPanel = new fabric.Polygon(this.newPanelPoints, this.polygonOptions)

}
makeNewRW(){
  this.newRw = new fabric.Polygon(this.newRWPoints, this.polygonOptions2)
}
AddNewPanel() {
  this.isAddPanel = true
  this.isAddRW = false
  this.isEdit = false
  this.iseditRW=false
}
AddNewRW(i:number){
  this.selectedPanelforRW=i
  this.selectedId=i
  this.selectedEditId=i
  this.isAddPanel = false
  this.isAddRW = true
  this.isEdit = false
  this.iseditRW=false


}

SaveChanges(){
  console.log(this.isLoading = true)


  console.log(this.allPanelData)
  var roiData: any[] = []
  this.PanelData.forEach((element: any, id: number) => {
    roiData.push({ ...element.roi_data, panel_key_id: id + 1 })


  });
  console.log(roiData)
  var cameraData = {
    id: this.ID,
    //  ai_solutions:['RA'],
    imagename: this.imageName,
    roi_data: roiData
  }


  console.log(cameraData)
  this.server.AddROI(cameraData).subscribe((response: any) => {
    console.log(response)
    this.isLoading = false
    if (response.success) {

    }
  })


}



DeleteNewPanel(){
  this.newPanelPoints.splice(0, this.newPanelPoints.length)
  this.newRWPoints.splice(0, this.newRWPoints.length)

  this.canvas.renderAll()
}



OnAddingNewPanel() {
  this.isAddPanel = false
  fabric.util.resetObjectTransform(this.newPanel)
  var roi_points: any[] = []
  const tempPoints = [...this.newPanelPoints]
  console.log(tempPoints)
  var dimensions = this.newPanel._calcDimensions()
  const currentPanel = new fabric.Polygon(tempPoints, this.polygonOptions)
  //this.modalService.open(this.panelNameModal,{size:'small',centered:true})
  var panelName = this.panelNameControl.value
  if (panelName != null) {
    console.log(panelName)
    this.canvas.add(currentPanel)
    this.canvas.renderAll()
    console.log(this.newPanel)
    for (let i = 0; i < this.newPanelPoints.length; i++) {

      let tempX = (this.newPanelPoints[i].x)

      let tempY = (this.newPanelPoints[i].y)
      roi_points.push(`${tempX};${tempY};`)
    }
    //to remove the ,
    var comma = /,/g
    var roiPointsString = roi_points.toString().replace(comma, '')
    console.log(roiPointsString)
    var panelNameObject = new fabric.Text(panelName, {
      fontSize: 20,
      // bottom:5
      backgroundColor: 'black',

      left: dimensions.left,
      top: dimensions.top,
      stroke: 'rgb(127, 255, 0)',
      fill: 'rgb(127, 255, 0)',
    });
    console.log(panelNameObject)
    this.canvas.add(panelNameObject)
    this.canvas.renderAll()

    var tempObj: any = {
      panel_name_canvas: panelNameObject,
      roi_canvas: currentPanel,
      panel_id: panelName,
      rw: [],
      roi_data: { panel_id: panelName, panel_status: false, roi_data: { panel_no: panelName, bbox: roiPointsString, panel_key_id: this.allPanelData.length+1,RW:[] } }
    }

    this.PanelData[0].panel_data.push(tempObj.roi_data)

    this.allPanelData.push(tempObj)

    console.log(this.allPanelData.length)
    this.newPanelPoints.splice(0, this.newPanelPoints.length)
    this.panelNameControl.setValue(null)
   // this.selectedEditId = this.allPanelData.length - 1
    console.log(this.selectedEditId)
    this.SaveAddedPanel()
  }
  else {
    //this.newPanelPoints.splice(0, this.newPanelPoints.length)
    this.DeleteNewPanel()
    this.isPolygonDrawn = false

  }

}

OnAddingNewRw() {
  this.isAddPanel = false
  this.isAddRW=false
  this.isChanges=true
  console.log('rw added')
  fabric.util.resetObjectTransform(this.newRw)
  var rw_points: any[] = []
  const tempPoints = [...this.newRWPoints]
  console.log(tempPoints)
  var tempRoiCanvas = this.allPanelData[this.selectedPanelforRW].rw_canvas
  this.canvas.remove(tempRoiCanvas)
  var dimensions = this.newRw._calcDimensions()
  const currentRw = new fabric.Polygon(tempPoints, this.polygonOptions2)
  //this.modalService.open(this.panelNameModal,{size:'small',centered:true})
  var panelName = this.panelNameControl.value
  if (true) {
    console.log(panelName)
    this.canvas.add(currentRw)
    this.canvas.renderAll()
    console.log(this.newPanel)
    for (let i = 0; i < this.newRWPoints.length; i++) {

      let tempX = (this.newRWPoints[i].x)

      let tempY = (this.newRWPoints[i].y)
      rw_points.push(`${tempX};${tempY};`)
    }
    //to remove the ,
    var comma = /,/g
    var rwPointsString = rw_points.toString().replace(comma, '')
    console.log(rwPointsString)
    // var panelNameObject = new fabric.Text(panelName, {
    //   fontSize: 20,
    //   // bottom:5
    //   backgroundColor: 'black',

    //   left: dimensions.left,
    //   top: dimensions.top,
    //   stroke: 'rgb(127, 255, 0)',
    //   fill: 'rgb(127, 255, 0)',
    // });
    // console.log(panelNameObject)
    // this.canvas.add(panelNameObject)
    // this.canvas.renderAll()

    // var tempObj: any = {
    //   panel_name_canvas: panelNameObject,
    //   roi_canvas: currentPanel,
    //   panel_id: panelName,
    //   rw: [],
    //   roi_data: { panel_id: panelName, panel_status: false, roi_data: { panel_no: panelName, bbox: roiPointsString, panel_key_id: this.allPanelData.length } }
    // }

    this.PanelData[0].panel_data[this.selectedPanelforRW].roi_data.RW=rwPointsString

    this.allPanelData[this.selectedPanelforRW].rw_canvas=currentRw

    console.log(this.allPanelData.length)
    this.newRWPoints.splice(0, this.newRWPoints.length)
    this.panelNameControl.setValue(null)
    this.selectedEditId = this.selectedPanelforRW
    console.log(this.selectedEditId)
    //this.SaveEditedPanel()
  }
  else {
    //this.newPanelPoints.splice(0, this.newPanelPoints.length)
    this.DeleteNewPanel()
    this.isPolygonDrawn = false

  }

}


SaveEditedChanges(){
  console.log(this.canvas.getObjects())
  if(this.allPanelData[this.selectedEditId].panel_id=='NA'){
  this.AlterPanelName(this.selectedEditId)
  }
  else{
    this.SaveEditedPanel()
}
}

SaveEditedPanel(){
  //this.AlterPanelName(this.selectedEditId)

  var roiData: any[] = []
  //  this.allCameraData.forEach((element:any,id:number) => {
  // roiData.push({...element.roi_data,roi_id:id+1})


  //  })
  var roi_points: any[] = []
 // this.allPanelData[this.selectedEditId].rw_canvas.calcCoords()
  // roiData.push(this.allCameraData[this.selectedEditId].roi_data)
  this.allPanelData[this.selectedEditId].rw_canvas!=null?fabric.util.resetObjectTransform(this.allPanelData[this.selectedEditId].rw_canvas):''
  var dimensions=this.allPanelData[this.selectedEditId].rw_canvas!=null?this.allPanelData[this.selectedEditId].rw_canvas._calcDimensions():''
  console.log(dimensions)
  for (let i = 0; i < this.allPanelData[this.selectedEditId].roi_canvas.points.length; i++) {
    console.log(this.allPanelData[this.selectedEditId].roi_canvas.points)
    var points = this.allPanelData[this.selectedEditId].roi_canvas.points
    let tempX = (Math.round(points[i].x))

    let tempY = (Math.round(points[i].y))
    roi_points.push(`${tempX};${tempY};`)
  }
  var comma = /,/g
  var roiPointsString = roi_points.toString().replace(comma, '')
  console.log(roiPointsString)
  console.log(this.allPanelData[this.selectedEditId].roi_data)
  this.allPanelData[this.selectedEditId].roi_data.bbox = roiPointsString
  this.PanelData[0].panel_data[this.selectedEditId].roi_data.bbox = roiPointsString

  var rw_points:any[]=[]
  if(this.allPanelData[this.selectedEditId].rw_canvas!=null){
  for (let i = 0; i < this.allPanelData[this.selectedEditId].rw_canvas.points.length; i++) {
    console.log(this.allPanelData[this.selectedEditId].rw_canvas.points)
    var points = this.allPanelData[this.selectedEditId].rw_canvas.points
    let tempX = (Math.round(points[i].x))

    let tempY = (Math.round(points[i].y))
    rw_points.push(`${tempX};${tempY};`)
  }
  //to remove the ,
  var comma = /,/g
  var rwPointsString = rw_points.toString().replace(comma, '')
  console.log(rwPointsString)
  console.log(this.allPanelData[this.selectedEditId].roi_data)
  this.allPanelData[this.selectedEditId].roi_data.RW = rwPointsString
  this.PanelData[0].panel_data[this.selectedEditId].roi_data.RW = rwPointsString

  console.log(this.allPanelData[this.selectedEditId].roi_data)
  }
  roiData.push(this.allPanelData[this.selectedEditId].roi_data)
  

  //  var cameraData={
  //   id:this.ID,
  //   imagename:this.imageName,
  //   panel_id:
  //   roi_data:roiData
  //  }
  console.log(this.selectedEditId)
  console.log(this.allPanelData[this.selectedEditId].roi_data.roi_data.panel_key_id)
  var data: any[] = []
  var cameraData = {
    id: this.ID,
    image_name: this.imageName,
    panel_id: this.allPanelData[this.selectedEditId].roi_data.panel_id,
    panel_key_id: this.allPanelData[this.selectedEditId].roi_data.roi_data.panel_key_id,
    roi_data: this.allPanelData[this.selectedEditId].roi_data.roi_data
  }
  data.push(cameraData)
  //

  console.log(data)
  var body = {
    data: data
  }
  this.server.UpdatePanelRoi(body).subscribe((response: any) => {
    console.log(response)
    if (response.success) {
  
      this.modalService.dismissAll()
    }

    this.server.notification(response.message)
  })

}
  SaveAddedPanel(){
    //this.AlterPanelName(this.selectedEditId)
  
    var roiData: any[] = []
    //  this.allCameraData.forEach((element:any,id:number) => {
    // roiData.push({...element.roi_data,roi_id:id+1})
  
  
    //  })
    var roi_points: any[] = []
   // this.allPanelData[this.selectedEditId].rw_canvas.calcCoords()
    // roiData.push(this.allCameraData[this.selectedEditId].roi_data)
    this.allPanelData[this.allPanelData.length-1].rw_canvas!=null?fabric.util.resetObjectTransform(this.allPanelData[this.allPanelData.length-1].rw_canvas):''
    var dimensions=this.allPanelData[this.allPanelData.length-1].rw_canvas!=null?this.allPanelData[this.allPanelData.length-1].rw_canvas._calcDimensions():''
    console.log(dimensions)
    for (let i = 0; i < this.allPanelData[this.allPanelData.length-1].roi_canvas.points.length; i++) {
      console.log(this.allPanelData[this.allPanelData.length-1].roi_canvas.points)
      var points = this.allPanelData[this.allPanelData.length-1].roi_canvas.points
      let tempX = (Math.round(points[i].x))
  
      let tempY = (Math.round(points[i].y))
      roi_points.push(`${tempX};${tempY};`)
    }
    var comma = /,/g
    var roiPointsString = roi_points.toString().replace(comma, '')
    console.log(roiPointsString)
    console.log(this.allPanelData[this.allPanelData.length-1].roi_data)
    this.allPanelData[this.allPanelData.length-1].roi_data.bbox = roiPointsString
    this.PanelData[0].panel_data[this.allPanelData.length-1].roi_data.bbox = roiPointsString
  
    var rw_points:any[]=[]
    if(this.allPanelData[this.allPanelData.length-1].rw_canvas!=null){
    for (let i = 0; i < this.allPanelData[this.allPanelData.length-1].rw_canvas.points.length; i++) {
      console.log(this.allPanelData[this.allPanelData.length-1].rw_canvas.points)
      var points = this.allPanelData[this.allPanelData.length-1].rw_canvas.points
      let tempX = (Math.round(points[i].x))
  
      let tempY = (Math.round(points[i].y))
      rw_points.push(`${tempX};${tempY};`)
    }
    //to remove the ,
    var comma = /,/g
    var rwPointsString = rw_points.toString().replace(comma, '')
    console.log(rwPointsString)
    console.log(this.allPanelData[this.allPanelData.length-1].roi_data)
    this.allPanelData[this.allPanelData.length-1].roi_data.RW = rwPointsString
    this.PanelData[0].panel_data[this.allPanelData.length-1].roi_data.RW = rwPointsString
  
    console.log(this.allPanelData[this.allPanelData.length-1].roi_data)
    }
    roiData.push(this.allPanelData[this.allPanelData.length-1].roi_data)
    
  
    //  var cameraData={
    //   id:this.ID,
    //   imagename:this.imageName,
    //   panel_id:
    //   roi_data:roiData
    //  }
    console.log(this.selectedEditId)
    console.log(this.allPanelData[this.allPanelData.length-1].roi_data.roi_data.panel_key_id)
    var data: any[] = []
    var cameraData = {
      id: this.ID,
      image_name: this.imageName,
      panel_id: this.allPanelData[this.allPanelData.length-1].roi_data.panel_id,
      panel_key_id: this.allPanelData[this.allPanelData.length-1].roi_data.roi_data.panel_key_id,
      roi_data: this.allPanelData[this.allPanelData.length-1].roi_data.roi_data
    }
    data.push(cameraData)
    //
  
    console.log(data)
    var body = {
      data: data
    }
    this.server.AddPanelRoi(body).subscribe((response: any) => {
      console.log(response)
      if (response.success) {
    
        this.modalService.dismissAll()
      }
  
      this.server.notification(response.message)
    })
  
  


}
CreateRectangle(e: any) {
  console.log('rect', e.e)
  var pointer = this.canvas.getPointer(e.e)
  var orgX = e.pointer.x
  var orgY = e.pointer.y

  this.rectangle = new fabric.Rect({ left: orgX, top: orgY, width: pointer.x - orgX, height: pointer.y - orgY, stroke: 'red', type: 'rect', strokeWidth: 2 })
  this.canvas.add(this.rectangle)
  if (orgX > pointer.x) {
    this.rectangle.set({ left: Math.abs(pointer.x) });
  }
  if (orgY > pointer.y) {
    this.rectangle.set({ top: Math.abs(pointer.y) });
  }

  this.rectangle.set({ width: Math.abs(orgX - pointer.x) });
  this.rectangle.set({ height: Math.abs(orgY - pointer.y) })

  this.canvas.renderAll()
}

createRect2(e: any) {
  var pointer = this.canvas.getPointer(e.e)
  var orgX = e.pointer.x
  var orgY = e.pointer.y
  if (e.button === 1) {
    if (orgX > pointer.x) {
      this.rectangle.set({ left: Math.abs(pointer.x) });
    }
    if (orgY > pointer.y) {
      this.rectangle.set({ top: Math.abs(pointer.y) });
    }

    this.rectangle.set({ width: Math.abs(orgX - pointer.x) });
    this.rectangle.set({ height: Math.abs(orgY - pointer.y) })
    this.canvas.renderAll()
  }
}

public Edit(i: number) {
  this.isEditPanel=true
  this.selectedEditId = i
  var canvasObject = this.allPanelData[i].roi_canvas
  this.isEdit = true
  if (this.isEdit) {

    //var polygonPositionHandler=
    var anchorWrapper = (anchorIndex: any, fn: any) => {
      return (eventData: any, transform: any, x: any, y: any) => {
        var fabricObject = transform.target,
          absolutePoint = fabric.util.transformPoint(
            new fabric.Point(
              fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
              fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
            ),
            fabricObject.calcTransformMatrix()
          ),
          actionPerformed = fn(eventData, transform, x, y),
          newDim = fabricObject._setPositionDimensions({}),
          polygonBaseSize = fabricObject._getNonTransformedDimensions(),
          newX =
            (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
            polygonBaseSize.x,
          newY =
            (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
            polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
      };
    }
    var actionHandler = (eventData: any, transform: any, x: number, y: number) => {
      console.log(eventData)
      var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(
          new fabric.Point(x, y),
          'center',
          'center'
        ),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x:
            (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
            polygon.pathOffset.x,
          y:
            (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
            polygon.pathOffset.y
        };
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      console.log(polygon.points)
      return true;
    }

    let poly = canvasObject
    console.log(poly)
    this.canvas.setActiveObject(canvasObject);
    poly = this.canvas.getActiveObject()
    console.log(poly)
    // poly.edit = !poly.edit;
    if (true) {
      console.log('poly first')
      let lastControl = poly.points.length - 1;
      poly.cornerStyle = 'circle';
      poly.cornerColor = 'rgba(0,0,255,0.5)';
      this.allPanelData[i].roi_canvas.controls = poly.points.reduce((acc: any, point: number, index: number) => {
        // this.pointIndex=index
        // console.log(this.pointIndex)
        acc['p' + index] = new fabric['Control']({
          pointIndex: index,
          positionHandler: (dim: any, finalMatrix: any, fabricObject: any) => {
            console.log(dim)
            console.log(finalMatrix)
            console.log(fabricObject)
            // fabricObject.points=points
            console.log(fabricObject)
            let x =
              fabricObject.points[index].x - fabricObject.pathOffset.x,
              y = fabricObject.points[index].y - fabricObject.pathOffset.y;
            return fabric.util.transformPoint(
              new fabric.Point(x, y),
              fabric.util.multiplyTransformMatrices(
                fabricObject.canvas.viewportTransform,
                fabricObject.calcTransformMatrix()
              )
            );
          },
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler
          ),
          actionName: 'modifyPolygon'
        });
        console.log(acc)
        return acc;
      }, {});
    }
    console.log(new fabric['Control'])
    // poly.hasBorders = !poly.edit;
    this.canvas.renderAll();
  }
}

EditRW(i:number){
  this.selectedPanelforRW=i
  this.selectedEditId = i
  this.iseditRW=true
  this.isEdit=true
  this.allPanelData[this.selectedPanelforRW].rw_canvas.selectable=true
}

    public EditRect(i: number) {
      this.selectedPanelforRW=i
  this.selectedEditId = i
  this.iseditRW=true
  var canvasObject = this.allPanelData[i].rw_canvas
  this.isEdit = true
  if (this.isEdit) {

    //var polygonPositionHandler=
    var anchorWrapper = (anchorIndex: any, fn: any) => {
      return (eventData: any, transform: any, x: any, y: any) => {
        var fabricObject = transform.target,
          absolutePoint = fabric.util.transformPoint(
            new fabric.Point(
              fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
              fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
            ),
            fabricObject.calcTransformMatrix()
          ),
          actionPerformed = fn(eventData, transform, x, y),
          newDim = fabricObject._setPositionDimensions({}),
          polygonBaseSize = fabricObject._getNonTransformedDimensions(),
          newX =
            (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
            polygonBaseSize.x,
          newY =
            (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
            polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
      };
    }
    var actionHandler = (eventData: any, transform: any, x: number, y: number) => {
      console.log(eventData)
      var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(
          new fabric.Point(x, y),
          'center',
          'center'
        ),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x:
            (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
            polygon.pathOffset.x,
          y:
            (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
            polygon.pathOffset.y
        };
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      console.log(polygon.points)
      return true;
    }

    let poly = canvasObject
    console.log(poly)
    this.canvas.setActiveObject(canvasObject);
    poly = this.canvas.getActiveObject()
    console.log(poly)
    // poly.edit = !poly.edit;
    if (true) {
      console.log('poly first')
      let lastControl = poly.points.length - 1;
      poly.cornerStyle = 'circle';
      poly.cornerColor = 'rgba(0,0,255,0.5)';
      this.allPanelData[i].roi_canvas.controls = poly.points.reduce((acc: any, point: number, index: number) => {
        // this.pointIndex=index
        // console.log(this.pointIndex)
        acc['p' + index] = new fabric['Control']({
          pointIndex: index,
          positionHandler: (dim: any, finalMatrix: any, fabricObject: any) => {
            console.log(dim)
            console.log(finalMatrix)
            console.log(fabricObject)
            // fabricObject.points=points
            console.log(fabricObject)
            let x =
              fabricObject.points[index].x - fabricObject.pathOffset.x,
              y = fabricObject.points[index].y - fabricObject.pathOffset.y;
            return fabric.util.transformPoint(
              new fabric.Point(x, y),
              fabric.util.multiplyTransformMatrices(
                fabricObject.canvas.viewportTransform,
                fabricObject.calcTransformMatrix()
              )
            );
          },
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler
          ),
          actionName: 'modifyPolygon'
        });
        console.log(acc)
        return acc;
      }, {});
    }
    console.log(new fabric['Control'])
    // poly.hasBorders = !poly.edit;
    this.canvas.renderAll();
  }
}





EditPanel(id: string){
  console.log(id)
  var currentObject: any = this.allPanelData.filter((panel: any) => {
    return panel.panel_id === id ? panel.roi_canvas : ''
  })
  var currentPolygon = currentObject[0].roi_canvas
  console.log(currentPolygon)

  //this.Edit(currentPolygon)
  console.log(this.allPanelData)
}


DeletePanel(id: number){
  var confirmDelete = confirm('Do you want to delete this Panel?')
  if (confirmDelete) {
    var tempRoiCanvas = this.allPanelData[id].roi_canvas
    var tempRWCanvas=this.allPanelData[id].rw_canvas
    var tempTextCanvas = this.allPanelData[id].panel_name_canvas
    this.canvas.remove(tempRoiCanvas)
    this.canvas.remove(tempTextCanvas)
    this.canvas.remove(tempRWCanvas)
    this.allPanelData.splice(id, 1)
    this.PanelData[0].panel_data.splice(id, 1)
    this.canvas.renderAll()
  }

}


DeletePanelRW(id: number){
  var confirmDelete = confirm('Do you want to delete this Rack window?')
  if (confirmDelete) {
   
    var tempRWCanvas=this.allPanelData[id].rw_canvas
  
    this.canvas.remove(tempRWCanvas)
  
    console.log( this.PanelData[0].panel_data)
    console.log(this.allPanelData)
    this.canvas.renderAll()
  }

}

Back(){
  this.router.navigate(['app/jobsheetMoniter'])
  
}

AlterPanelName(id: number){
  console.log(id)
  this.isEditText = !this.isEditText
  this.selectedId = id
  this.selectedEditId=id
  this.tempPanelID = this.PanelData[0].panel_data[id].panel_id
  this.modalService.open(this.panelChangeModal, { size: 'small', animation: true, centered: true }).result.then((result) => {
    // this.closeResult = `Closed with: ${result}`;
    
    // this.OnAddingNewPanel()
    // this.download = '',
    //   this.isalert = false
  }, (reason) => {
    //  this.panelNameControl.setValue(null)
    //  this.OnAddingNewPanel()
    /// this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // this.download = '',
    //   this.isalert = false
  });


}

ChangePanelName(){
  this.PanelData[0].panel_data[this.selectedId].panel_id = this.tempPanelID
  this.allPanelData[this.selectedId].panel_id = this.tempPanelID

  console.log(this.PanelData[0].panel_data[this.selectedId].panel_id)
  this.PanelData[0].panel_data[this.selectedId].roi_data.panel_number = this.tempPanelID

  this.allPanelData[this.selectedId].panel_name_canvas.text = this.tempPanelID
  this.allPanelData[this.selectedId].panel_name_canvas.panel_id = this.tempPanelID

  this.canvas.renderAll()
  this.modalService.dismissAll()
  this.SaveEditedPanel()

}
}

