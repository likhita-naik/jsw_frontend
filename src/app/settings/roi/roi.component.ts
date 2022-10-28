import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import 'fabric';
import { ServerService } from 'src/app/Services/server.service';
declare const fabric: any;
// var pointIndex:any;
@Component({
  selector: 'app-roi',
  templateUrl: './roi.component.html',
  styleUrls: ['./roi.component.css']
})
export class RoiComponent implements OnInit, AfterViewInit {
  //POLYGON DATAS
  @Input() camera_rtsp:any
  @Input() device_id:any
  myCanvas: any;
  image = new Image();
  url: string;    
  isCanvasDrawn: boolean = true;
  canvas:any;
  polygon: any;
  isImageDrawn: boolean = false;
  isPolygonDrawn: boolean = false;
  points:any[] = [];
  newPt: any;
  isEdit:boolean=false
  roiList:any[]=[]
  roiNames:any[]=[]
  roiType:number=1;
  PolygonOptions:any={
    left: 0,
    top: 0,
    fill: 'rgba(255,0,0,0.1)',
    strokeWidth: 1,
    stroke: 'lightgrey',
    scaleX: 1,
    scaleY: 1,
    objectCaching: false,
    transparentCorners: false,
    cornerColor: 'blue'}
  PPEControl:FormControl=new FormControl(false,Validators.required)
  roilistObject:{roi_name:any,roi_bbox:any[]}[]=[]

  //canvas: any
  //isImageDrawn: any
  //url: any
  line: any = {}
  arrowHead1: any
  arrowHead2: any
  btnIndex: number = 1
  mouseDown: boolean = false
  triangle:any
  activeObj:any
  deltaX:any
  deltaY:any
  isRoi:boolean=false
//pointIndex:number=0
  polygonOptions:any={
   
    fill: 'rgba(255,0,0,0.1)',
    edit:false,
    dirty:true,
    objectCaching:false,
    transparentCorners: false,
    cornerColor: 'blue'
  }
  index:number=0
  constructor(private webServer:ServerService) {}

  ngOnInit(): void {
    
    //POLYGON INIT
    this.canvasSetup()
   
  }

  ngAfterViewInit(): void {
    this.canvas.on('mouse:up', (options:any) => {
      if(this.roiType==1){
      if (options.button === 1) {
        if(!this.isPolygonDrawn&& ! ((options.transform ==null?false:options.transform.action==='modifyPolygon' ?false:true))&& !this.isEdit
        ){
        console.log('polygon  is 1creating')
          this.getClickCoords(options.e);
        }
      }
      if(options.button===3){
        if (this.points.length < 3) {
          console.log('polygon is  3creating')
          this.isPolygonDrawn = false;
        } else {
          console.log('polygon is greater than 4')
          this.makePolygon();
          this.isPolygonDrawn = true;
        }
      }}
      else{
     this.stopCreatingOnMouseUp(options)
      }
    });

    this.canvas.on('mouse:down', (event:any) => {
      console.log(event)
      if(this.roiType==1){
      if (event.button === 3) {
        if (this.points.length < 3) {
          this.isPolygonDrawn = false;
        } else {
          this.makePolygon();
          this.isPolygonDrawn = true;
        }
      }
    }
    else{
      if ((event.transform ==null?true:event.transform.action==='drag' ?false:true)){
        this.addingShapeOnMouseDown(event)
       }
    }
  })
  
  this.canvas.on('mouse:move', (options:any) => {
    // console.log(options)
    if(this.roiType==2){
     this.creatingShapeOnMouseMove(options)
    }
   });

   this.canvas.on('object:moving',(options:any)=>{
     console.log(options)
    // this.Modify()
    this.objectModify(options)
   })
}

selectRoiType(type:number){
  // this.canvas.remove(...this.canvas.getObjects());
   this.isPolygonDrawn=false
  this.roiType=type
  

}




  selectFile(event: any): void {
    var canvas = this.canvas;
    if (event.target.files) {
      var reader = new FileReader();
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      
        this.canvas.setWidth(document.getElementById("canvasContainer").clientWidth);
        
        console.log(canvas)
        console.log(this.url)
        fabric.Image.fromURL(this.url, (img:any)=> {
          this.canvas.setHeight(img.height);

          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
          });
        });
      };
      this.isImageDrawn = true;
    }
  }

  getClickCoords(event: any) {
    if (this.isCanvasDrawn && this.isImageDrawn) {
      this.newPt = {
        x: event.layerX,
        y: event.layerY
      };
      this.points.push(this.newPt);
      this.canvas.add(this.polygon);
      console.log(this.polygon)
      console.log(this.points)
      // if (this.points.length > 3) {
      //   this.isPolygonDrawn = true;
      // }
    }
  }

  makePolygon() {
    this.isImageDrawn = true;
    console.log(this.points);
  }

  copyCoords() {
    if (this.points.length >= 3) {
      let polygonStr = 'Coords (';
      let close = ')';
      let sp = ' ';
      let com = ', ';
      for (let i = 0; i < this.points.length - 1; i++) {
        let tempX = (this.points[i].x /this.canvas.width).toFixed(10);
        let tempY = (this.points[i].y /this.canvas.height).toFixed(10);
        tempX = tempX.toString();
        tempY = tempY.toString();
        polygonStr = polygonStr.concat(tempX, sp, tempY, com);
      }
      let last = this.points[this.points.length - 1];
      let tempX = (last.x / this.canvas.width).toFixed(10);
      let tempY = (last.y /this.canvas.height).toFixed(10);
      tempX = tempX.toString();
      tempY = tempY.toString();
      polygonStr = polygonStr.concat(tempX, sp, tempY, close);
      console.log(polygonStr);

      //Copying Polygon to clipboard
      let el = document.createElement('textarea');
      el.value = polygonStr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      //document.body.removeChild(el);
    }
  }

  saveChanges(){
    this.isEdit=false
    //this.points=this.canvas.getObjects()[0].points
   // this.clearPolygon()
   // console.log(this.points)

  }

  //POLYGON EDIT
  public Edit(object:any) {
    console.log(this.points)
  this.isEdit=true
  if(this.isEdit){
   console.log(this.points)

//var polygonPositionHandler=
    var anchorWrapper=(anchorIndex:any, fn:any)=> {
      return (eventData:any, transform:any, x:any, y:any) =>{
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
    var actionHandler=(eventData:any, transform:any, x:any, y:any)=> {
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
   
    let poly = object
    console.log(poly)
    this.canvas.setActiveObject(poly);
    // console.log(poly.edit)
    // poly.edit = !poly.edit;
    if (true) {
      console.log('poly first')
      let lastControl = poly.points.length - 1;
      poly.cornerStyle = 'circle';
      poly.cornerColor = 'rgba(0,0,255,0.5)';
      poly.controls = poly.points.reduce((acc:any, point:any, index:any)=> {
        // this.pointIndex=index
        // console.log(this.pointIndex)
        acc['p' + index] = new fabric['Control']({
          pointIndex: index,
          positionHandler: (dim:any, finalMatrix:any, fabricObject:any)=> {
          
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

    // poly.hasBorders = !poly.edit;
    this.canvas.renderAll();
  }
  }
  clearPolygon()
  {
    //this.points.splice(0,this.points.length)
    this.isImageDrawn=true;
    //this.isEdit=false
    this.isPolygonDrawn=false;
    console.log(this.isCanvasDrawn);

    this.isCanvasDrawn = true;
   
    console.log(...this.canvas.getObjects())
    this.canvas.remove(...this.canvas.getObjects());
    this.points.splice(0,this.points.length)
   // this.canvas.clear()
    

    console.log(this.points);
   // this.canvasSetup()
  }

  DeleteRoi(name:string){
    this.clearPolygon()
    this.roilistObject = this.roilistObject.filter(( obj ) =>{
      return obj.roi_name !== name;
  });
  

  }

  savepolygon()
  {
    var a:any = prompt("save polygon");
    var tempPoints=[...this.points]
     var temp:any[]=[] 
      alert(a);
      if(a!=null){
        var currentPolygon=new fabric.Polygon(tempPoints,this.polygonOptions)
        this.canvas.add(currentPolygon)
        this.canvas.renderAll()
      }
    
    var roi_points:any[]=[]
    this.roiList[a]={points:[],
  canvasObject:{}}
    this.roiList[a].points=[]
    this.roiList[a].canvasObject={}
    this.roiList[a].canvasObject=currentPolygon
   console.log(this.roiList[a].canvasObject)
    console.log(this.canvas.width) 
    console.log(this.canvas.height)
    for (let i = 0; i < this.points.length ; i++) {

      let tempX = (this.points[i].x )
    
      let tempY = (this.points[i].y)
      roi_points.push(`${tempX};${tempY};`)
      // tempX = tempX.toString();
      // tempY = tempY.toString();
      var point={x:tempX,y:tempY}
      this.roiList[a].points.push(point)
    }
    var points_string;
    var tmp=/,/g
    points_string=roi_points.toString().replace(tmp,'')
    console.log(points_string)
    temp.push(points_string)
    var obj={roi_name:a,roi_bbox:temp}
    this.roilistObject.push(obj)
    // console.log(Object.values[this.roiList[a].points])
    this.roiNames=Object.keys(this.roiList)
    console.log(this.roiList)
    // this.clearPolygon()
    this.points=this.points.splice(0,this.points.length)
  }

  EditPolygon(roiname:any){
    //this.clearPolygon()
    var currentPolygon:any =this.roiList[roiname]
    this.isPolygonDrawn=false
    var points=currentPolygon.points
    //this.points=points
    console.log(this.roiList[roiname])
    var object=currentPolygon.canvasObject
    console.log(object)
    this.canvas.add(new fabric.Polygon(points,this.polygonOptions))
    this.canvas.requestRenderAll();
  //   var gfg = new fabric.ActiveSelection(
  //     object, {
  //     borderColor: 'red',
  // });
  // this.canvas.setActiveObject(gfg);
  // this.canvas.requestRenderAll();
   //this.canvas.add(this.roiList[roiname])
   this.Edit(object)
    
  }

  canvasSetup(){
    this.canvas = new fabric.Canvas('canvasID', { fireRightClick: true });

    this.polygon = new fabric.Polygon(this.points, {
      left: 0,
      top: 0,
      fill: 'rgba(255,0,0,0.1)',
      strokeWidth: 1,
      stroke: 'lightgrey',
      scaleX: 1,
      scaleY: 1,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'blue'
    });
    this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    console.log(this.polygon)
  }

 addingShapeOnMouseDown(event: any) {
    this.mouseDown = true
    var pointer = this.canvas.getPointer(event.e)
   
    console.log(this.line)
    if(this.btnIndex==1){
      var linePath = 'M ' + pointer.x + ' ' + pointer.y + ' L ' + pointer.x + ' ' + pointer.y
    console.log(linePath)
    this.line = new fabric.Path(linePath,
      {
        stroke: 'red',
        strokeWidth: 3,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        uuid : this.generateUUID(),
        objectCaching: false,
        type:'line'
      });
    console.log(this.line)
   
      this.canvas.add(this.line)
      this.activeObj = this.line;
    }
    if(this.btnIndex===2){
      var points = [pointer.x, pointer.y, pointer.x, pointer.y];
      this.line = new fabric.Line(points, {
          strokeWidth: 3,
          fill: 'red',
          stroke: 'red',
          originX: 'center',
          originY: 'center',
          id:'arrow_line',
          lockScalingFlip : true,
          objectCaching:false,
          uuid : this.generateUUID(),
          type : 'arrow'
      });
    var centerX = (this.line.x1 + this.line.x2) / 2;
    var centerY = (this.line.y1 + this.line.y2) / 2;
   this.deltaX = this.line.left - centerX;
    this.deltaY = this.line.top - centerY;

    this.triangle = new fabric.Triangle({
        left: this.line.get('x1') + this.deltaX,
        top: this.line.get('y1') + this.deltaY,
        originX: 'center',
        originY: 'center',
        selectable: false,
        pointType: 'arrow_start',
        angle: -45,
        width: 20,
        height: 20,
        fill: 'red',
        id:'arrow_triangle',
        uuid : this.line.uuid
    });
    this.canvas.add(this.line, this.triangle);
 this.activeObj = this.line;
  }
  this.canvas.requestRenderAll()

      // this.arrowHead2=new  fabric.Path(this.arrowHead1,{
      //   stroke:'',
      //   fill:'red',
      //   strokeWidth:0,
      //   originX:'center',
      //   originY:'center',
      //   hasControls:false,
      //   hasBorders:false,
      //   top:pointer.y,
      //   left:pointer.x

      // }) 
     // this.canvas.add(this.arrowHead1)
    
    // if(this.btnIndex==1){
    //   this.canvas.add(this.line)
    // }
   

    //   console.log(pointer)
    // console.log(event)


  }
  creatingShapeOnMouseMove(event: any) {
    if (this.mouseDown === true) {
      console.log('mouse move')
      var pointer = this.canvas.getPointer(event.e)
      if(this.btnIndex===1){
        this.line.path[1][1] = pointer.x
        this.line.path[1][2] = pointer.y
        this.line.setCoords()
        this.canvas.add(this.line)
      }
      if(this.btnIndex===2){
      this.line.set({
        x2: pointer.x,
        y2: pointer.y
    });
    // var width = Math.abs(pointer.x - this.line.x1)
    // var height = Math.abs(pointer.y - this.line.y1)
    // this.line.width=width
    // this.line.height=height
    console.log(this.line)
    if(this.btnIndex==2){
    this.triangle.set({
        'left': pointer.x + this.deltaX,
        'top': pointer.y + this.deltaY,
        'angle':this._FabricCalcArrowAngle(this.line.x1,
                                        this.line.y1,
                                        this.line.x2,
                                        this.line.y2)
    });
}
      }
      
    }
    this.canvas.requestRenderAll()
  }
  

   // this.mouseDown=false
  // var len=this.line.path
  // this.canvas.remove(len)
  // this.line=new  fabric.Path(len,{
  //   stroke:'red',
  //     strokeWidth:3,
  //     originX:'center',
  //     originY:'center',
  //     hasControls:false,
  //     hasBorders:false,
  //     objectCaching:false

  // })
  _FabricCalcArrowAngle(x1:number, y1:number, x2:number, y2:number) {
    var angle = 0, x, y;
    x = (x2 - x1);
    y = (y2 - y1);
    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) {
        angle = (x > 0) ? 0 : Math.PI;
    } else {
        angle = (x < 0) ? Math.atan(y / x) + Math.PI :
            (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    }
    return (angle * 180 / Math.PI + 90);
};
 

  stopCreatingOnMouseUp(event: any) {
    this.mouseDown=false
    if(this.btnIndex==2){
      var group = new fabric.Group([this.line,this.triangle],
                {
                    borderColor: 'black',
                    cornerColor: 'green',
                    lockScalingFlip : true,
                    typeOfGroup : 'arrow',
                    userLevel : 1,
                    name:'my_ArrowGroup',
                    uuid : this.activeObj.uuid,
                    type : 'arrow'
                }
                );
      this.canvas.remove(this.line, this.triangle);// removing old object
      this.activeObj = group;
      this.canvas.add(group);
     this.canvas.requestRenderAll()
    }
     if(this.btnIndex==1){
      console.log(this.canvas.getActiveObject())

      var len=this.line.path
      console.log(this.line.path)
    this.canvas.remove(this.line)
    this.line=new  fabric.Path(len,{
      stroke:'red',
        strokeWidth:3,
        originX:'center',
        originY:'center',
       
        uuid : this.activeObj.uuid,
        type:'line'

    })

    this.activeObj=this.line
    this.canvas.add(this.line)
    this.canvas.requestRenderAll()
     }   
     
    // this.canvas.off('mouse:up',options=>{
    //   if(options.transform===null){
    //   this.stopCreatingOnMouseUp(options)
    //   }

    // })

    // this.canvas.off('mouse:down',options=>{
    //   if(options.transform===null){
    //   this.addingShapeOnMouseDown(options)
    //   }
    // })

    // this.canvas.off('mouse:move',options=>{

    //   this.creatingShapeOnMouseMove(options)
    // })
    //this.canvas.off()
    //this.canvas.off('mouse:down')

  }
  objectModify(e:any){
    var obj = e.target;
    if (obj.type === 'ellipse') {
obj.rx *= obj.scaleX;
obj.ry *= obj.scaleY;
     }
  if (obj.type === 'arrow' || obj.type=='line') {
obj.width *= obj.scaleX;
console.log('Arrow modifying')
      obj.height *= obj.scaleY;
    obj.scaleX = 1; 
      obj.scaleY = 1;
}
    //find text with the same UUID
    var currUUID = obj.uuid;
    var objs = this.canvas.getObjects();
    var currObjWithSameUUID = null;
    for (var i = 0 ; i < objs.length; i++) {
if (objs[i].uuid === currUUID && 
  objs[i].type === 'text') {
currObjWithSameUUID = objs[i];
break;
}
     }
     if (currObjWithSameUUID) {
       currObjWithSameUUID.left = obj.left;
       currObjWithSameUUID.top = obj.top - 30;
       currObjWithSameUUID.opacity = 1;
      }
} catch (E:any) {
}
  

  deleteArrow() 
  {
    // var objLen=this.canvas.getObjects().length
    // var activeObject= this.canvas.getObjects()[objLen-1]
    // console.log(activeObject)

    // this.canvas.remove(activeObject)
    // objLen=objLen-1
   this.canvas.remove(...this.canvas.getObjects())
  }
 
  generateUUID(){
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

  
Modify(){
  fabric.Object.prototype.controls.moveObject = new fabric.Control({
    x: -0.5,
    y: -0.5,
    actionHandler: fabric.controlsUtils.dragHandler,//change to this
    actionName: 'drag',
    cursorStyle:'pointer',
    
    cornerSize: 25
});

}
  
buttonType(id: number) {
  this.btnIndex = id
}

saveCameraAnalytics(){
    
  var ai_options:any[]=[]
  this.PPEControl.value===true?ai_options.push('PPE'):''
  var body:any={ camera_rtsp:"rtsp://admin:admin123@10.8.3.210:554/cam/realmonitor?channel=1&subtype=0",
  device_uniqueid:"docketdevice123",
  camera_rtsp_name:"testing",
  admin_id:"manashree@docketrun.com",
  AISolution_ids:"PPE,RA",
  analytics_config:{roi_config:[{roi_nam:"test_1",roi_bbox: ["4;100;1260;100;1260;406;4;406;2;80;"]},
    {roi_name:"test_2",roi_bbox: ["615;75;1293;80;1281;361;591;385;"]}],
  "file_loop":"0",
  cloud_database_delete_duration:15,
  cloud_images_delete_duration:15,
  cloud_videos_delete_duration:15,
  edge_database_delete_duration:15,
  edge_images_delete_duration:15,
  edge_videos_delete_duration:15}
}
  // this.webServer.addcameraAnalytics(body).subscribe(data=>{
  //   console.log(data)
  // })


}

}
