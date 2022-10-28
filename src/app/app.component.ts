import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LogHistoryComponent }  from './features/log-history/log-history.component';
import { ServerService } from './Services/server.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ServerService]
})
export class AppComponent {
  title = 'jsw';
activeHooterCameras:any[]=[]
activeRelayCameras:any[]=[]
hooterDelay:number
  constructor(public webServer: ServerService,private http:HttpClient) {
    this.hooterDelay=this.webServer.delay
    
    setInterval(()=>{
      if(new Date().getHours()==0){
        webServer.ResetLiveCount().subscribe((response:any)=>{
          console.log(response)
        })
      }
     
    },0)
    }

    

  }
