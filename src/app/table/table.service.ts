import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from '../message.service';
import {
  HttpEvent, HttpEventType, HttpProgressEvent,
  HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
@Injectable()
export class TableService {
  constructor(
     public http: HttpClient,
    private messageService: MessageService) { }
     getTableColumns(filename:string){
        return this.http.get(filename)
          .pipe(
            tap( 
            )
          );
      }
      download(filename:string){
        return this.http.get(filename)
          .pipe(
            tap( 
             
            )
          );
      }
      getTableContents(filename:string){
        return this.http.get(filename)
          .pipe(
            tap( 
             
            )
          );
      }
      putTableContents(filename:string,body:Object){
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'my-auth-token'
          })
        };

        return this.http.put(filename,body)
        .pipe(
          tap()
        );
      }
      addTableContents(url:string,body:Object){
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer foo'
          })
        };

        return this.http.post(url,body,httpOptions)
        .pipe(
          tap()
        );
      }
      deleteTableContents(url:string){
        return this.http.delete(url)
        .pipe(
        );
      }
      upload(file: File) {
        if (!file) { return; }
        let formData = new FormData(); 
        formData.append("file", file, file.name); 
        const req = new HttpRequest('PUT', '/product/CP-PA-V-R-88/table/CPPT201/csv', file, {
          reportProgress: true
        });
    
        return this.http.request(req).pipe(
          tap(
            results=>{
              
            }
          )
        );
      }
      historyLink(url:string){
        return this.http.get(url)
          .pipe(
            tap( 
             
            )
          );
      }
      getOptionRef(url:string){
        return this.http.get(url)
        .pipe(
          tap()
        );
      }
}
