import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ESIMoniterComponent } from './features/esi-moniter/esi-moniter.component';
import { JobSheetUploadComponent } from './features/job-sheet-upload/job-sheet-upload.component';
import { LogHistoryComponent } from './features/log-history/log-history.component';
import { PanelViolationsComponent } from './features/panel-violations/panel-violations.component';
import { PpeViolationComponent } from './features/ppe-violation/ppe-violation.component';
import { RAViolationComponent } from './features/raviolation/raviolation.component';
import { RoiSettingsComponent } from './features/roi-settings/roi-settings.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CameraRoiComponent } from './settings/camera-roi/camera-roi.component';
import { CameraSettingsComponent } from './settings/camera-settings/camera-settings.component';
import { RoiComponent } from './settings/roi/roi.component';
import {AuthGuard} from './Services/auth.guard'
import {AuthGuardLogin} from './Services/authLogin.guard'
import { DashboardComponent } from './features/dashboard/dashboard.component';


const routes: Routes = 
             [{path:'login',canActivate:[AuthGuardLogin],
             // loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
             component:LoginComponent
            },
              {path:'app/Home',component:HomeComponent},
              {path:'app',component:HomeComponent,
               canActivate:[AuthGuard],
               children:[
                {
                path:'violations',component:LogHistoryComponent
                },
                {
                  path:'ROIViolations',component:RAViolationComponent
                  },
                  {
                    path:'ppeViolations',component:PpeViolationComponent
                    },
                    {
                      path:'panelViolation',component:PanelViolationsComponent
                      },
                    {
                      path:'CameraSettings',component:CameraSettingsComponent
                      },
                      {
                        path:'ROISettings',component:CameraRoiComponent
                        },
                        {
                          path:'panelROISettings',component:RoiSettingsComponent
                          },
                         
                            {
                              path:'dashboard',component:DashboardComponent
                              },
                {
                  path:'jobsheetViolation',component:RoiSettingsComponent
                }] },
{path:'',pathMatch:'full',component:LoginComponent}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
