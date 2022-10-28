import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServerService } from 'src/app/Services/server.service';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-job-sheet-upload',
  templateUrl: './job-sheet-upload.component.html',
  styleUrls: ['./job-sheet-upload.component.css']
})
export class JobSheetUploadComponent implements OnInit {

  listUsers!:any
  excelFile!: File
  showError=''
  showSuccess=''
  loading : boolean = false
  arrayBuffer:any;
  dataFromUser:any
  isLoading:boolean=false



  constructor(
    private modalService:NgbModal,
    private Server:ServerService,
    private Router:Router

  ) { 
    this.Server.GetJobSheet().subscribe((response:any)=>{
      if(response.success){
        if(response.message.length>0){
          this.Router.navigate(['app/jobsheetMoniter'])
        }
      }

    })
  }

  ngOnInit(): void {
    this.ekUpload()
  }

  downloadSampleFormat(){

  }

  openModal(modal:any){
    this.modalService.open(modal, { scrollable: false })
  }

  onFileChange(event:any) {
    const file:File = event.target.files[0];
   
        if (file) {
            this.excelFile=event.target.files[0]
            console.log(this.excelFile)        
        }
  }

  ekUpload(){
   var Init=() =>{
  
      console.log("Upload Initialised");
  
      var fileSelect    = document.getElementById('file-upload'),
          fileDrag      = document.getElementById('file-drag'),
          submitButton  = document.getElementById('submit-button');
  
      fileSelect.addEventListener('change', fileSelectHandler, false);
  
      // Is XHR2 available?
      var xhr = new XMLHttpRequest();
      if (xhr.upload) {
        // File Drop
        fileDrag.addEventListener('dragover', fileDragHover, false);
        fileDrag.addEventListener('dragleave', fileDragHover, false);
        fileDrag.addEventListener('drop', fileSelectHandler, false);
      }
    }
  
    var fileDragHover=(e:any) =>{
      var fileDrag = document.getElementById('file-drag');
  
      e.stopPropagation();
      e.preventDefault();
  
      fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
    }
  
    var fileSelectHandler=(e:any) =>{
      // Fetch FileList object
      var files = e.target.files || e.dataTransfer.files;
  
      // Cancel event and hover styling
      fileDragHover(e);
  
      // Process all File objects
      for (var i = 0, f; f = files[i]; i++) {
        parseFile(f);
        uploadFile(f);
      }
    }
  
    // Output
    var output=(msg:any)=> {
      // Response
      var m = document.getElementById('messages');
      m.innerHTML = msg;
    }
  
    var parseFile=(file:any)=>{
  
      console.log(file.name);
      output(
        '<strong>' + encodeURI(file.name) + '</strong>'
      );
      
      // var fileType = file.type;
      // console.log(fileType);
      var imageName = file.name;
      var loaderOverlayer=document.getElementById('file-upload-form')
      loaderOverlayer.classList.add('loading')
      var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
      // if (isGood) {
        document.getElementById('start').classList.add("hidden");
        document.getElementById('response').classList.remove("hidden");
      //  document.getElementById('notimage').classList.add("hidden");
        var formdata:FormData=new FormData()
        formdata.append('file',file)
        // this.Server.SampleExcelDownload().subscribe((response:any)=>{
        //   console.log(response)
        // })

        this.Server.JobSheetUpload(formdata).subscribe((response:any)=>{
         
          console.log(response)
          if(response.success){
            loaderOverlayer.classList.remove('loading')

            this.Router.navigate(['app/jobsheetMoniter'],)
            var link=this.Router.serializeUrl(this.Router.createUrlTree(['app/jobsheetMoniter']))
            window.open(link,'_blank')
            
          }
          else{
            loaderOverlayer.classList.remove('loading')
            loaderOverlayer.classList.remove('loading')
            document.getElementById('start').classList.remove("hidden");
            document.getElementById('response').classList.add("hidden");
            //this.ekUpload()
          }
         
        },
        Error=>{  
          loaderOverlayer.classList.remove('loading')
          document.getElementById('start').classList.remove("hidden");
          document.getElementById('response').classList.add("hidden");
         // document.getElementById('notimage').classList.remove("hidden");
          console.log(Error)   
          this.Server.notification('Error while uploading') 
      })
        
        // Thumbnail Preview
        // document.getElementById('file-image').classList.remove("hidden");
        // document.getElementById('file-image').src = URL.createObjectURL(file);
      // }
      // else {
      //   document.getElementById('file-image').classList.add("hidden");
      //   document.getElementById('notimage').classList.remove("hidden");
      //   document.getElementById('start').classList.remove("hidden");
      //   document.getElementById('response').classList.add("hidden");
      //   // document.getElementById("file-upload-form").reset();
      // }
    }
  
    var setProgressMaxValue=(e:any) =>{
      var pBar:any = document.getElementById('file-progress');
  
      if (e.lengthComputable) {
        pBar.max = e.total;
      }
    }
  
    var updateFileProgress =(e:any) =>{
      console.log(e)
      var pBar:any = document.getElementById('file-progress');
  
      if (e.lengthComputable) {
        pBar.value = e.loaded;
      }

      if(e.loaded){
        var loaderOverlayer=document.getElementById('file-upload-form')
        loaderOverlayer.classList.add('loading')
      
      }
    }
  
    var uploadFile=(file:any)=>{
      console.log(file)
      var xhr = new XMLHttpRequest(),
        fileInput = document.getElementById('class-roster-file'),
        pBar = document.getElementById('file-progress'),
        fileSizeLimit = 1024; // In MB
      if (xhr.upload) {
        // Check if file is less than x MB
        if (file.size <= fileSizeLimit * 1024 * 1024) {
          // Progress bar
          pBar.style.display = 'inline';
          xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
          xhr.upload.addEventListener('progress', updateFileProgress, false);
  
          // File received / failed
          xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
              // Everything is good!
  
              // progress.className = (xhr.status == 200 ? "success" : "failure");
              // document.location.reload(true);
            }
          };
  
          // Start upload
          var fileUpload:any=document.getElementById('file-upload-form')
          xhr.open('POST',fileUpload.action, true);
          xhr.setRequestHeader('X-File-Name', file.name);
          xhr.setRequestHeader('X-File-Size', file.size);
          xhr.setRequestHeader('Content-Type', 'multipart/form-data');
          xhr.send(file);
        } else {
          output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
        }
      }
    }
  
    // Check for the various File API support.
    if (window.File && window.FileList && window.FileReader) {
      Init();
    } else {
      document.getElementById('file-drag').style.display = 'none';
    }
  }
 






    // To add user into database
    submitExcel(){

        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
            this.dataFromUser = XLSX.utils.sheet_to_json(worksheet,{raw:true})
        }
        fileReader.readAsArrayBuffer(this.excelFile);
         


    }

    SampleExcelDownload(){
      this.isLoading=true
      this.Server.SampleExcelDownload().subscribe(
        (response:any) => {
          var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
         // console.log(response.headers.get('content-Type'))


          console.log(response)
          const blob = new Blob([response.body], { type: '.xls' });
          // var fileName =  response.headers.get('Content-Disposition').split(';')[1];
           var fileName = "SAMPLE_EXCEL" + " " +new Date()+'.xls'
          const file = new File([blob], fileName, { type: '.xls' });
          this.isLoading=false
          saveAs(blob, fileName);

        },
        err => {
          this.isLoading=false
          console.log(err)
        })
      
    }

}


