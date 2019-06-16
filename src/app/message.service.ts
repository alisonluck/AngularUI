import { Injectable } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

@Injectable()
export class MessageService {
  messages: string[] = [];
  tableCols:string[] = [];
  tableContents:Object ;
  add(message: string) {
    this.messages.push(message);
  }
  addTableColumns(col:string){
    this.tableCols.push(col);
  }
  addTableContents(obj:Object){
    this.tableContents = obj;
  }
  clear() {
    this.messages = [];
  }
}
