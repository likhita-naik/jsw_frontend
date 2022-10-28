import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()

export class configService{
public config:any
constructor(){
}
loadConfigFile(filepath:any){
    const JSON=this.readConfigFile(filepath,'application/json')
    return JSON
 


}
readConfigFile(filepath:any,mimeType:any){
   var xmlRequest=new XMLHttpRequest() 
   xmlRequest.open('GET',filepath,false)
   if (mimeType != null) {
    if (xmlRequest.overrideMimeType) {
        xmlRequest.overrideMimeType(mimeType);
    }
    xmlRequest.send()
    if(xmlRequest.status){
        return xmlRequest.response
    }
    else{
        return null
    }
}
}

}