import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { MessageService } from '../message.service';

@Injectable()
export class DownloaderService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getTextFile(filename: string) {
    return this.http.get(filename)
      .pipe(
        tap( // Log the result or error
         
        )
      );
  }
  

}
