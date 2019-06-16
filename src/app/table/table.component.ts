import {Component,OnInit, ViewChild,Inject} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { TableService } from './table.service';

import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { stringify } from '@angular/core/src/render3/util';
import {MatPaginator, MatTableDataSource,MatSort} from '@angular/material';
import { MessageService } from '../message.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {map, startWith} from 'rxjs/operators';

export interface HistoryElement {
  productKey: string;
  updated: string;
  description: string;
  changeId: string;
}

var cols:string[]=[];
@Component({
  selector: 'table-component',
  styleUrls: ['table.component.css'],
  templateUrl: 'table.component.html',
  providers:[TableService]
})
export class TableComponent implements OnInit {
  csvUrl:string="http://localhost:8080/"
  all_products:string[] = [
    'CP-PA-V-R-88',
    'CGL-PA-V-R-52'
  ]
  all_tables:string[]=[
    'CPPT201',
    'CPPT207',
    'CPPT219',
    'HOPT438',
    'CPPT203'
  ]
  soblcd:string;
  optionSOLMIT:Object = new Object()
  products = [];
  tables = [];
  optionRefs:Object = new Object();
  flag:boolean = false;
  selectedProduct = 'CP-PA-V-R-88'
  selectedTable = 'CPPT201'
  table_field: string;
  row_count:number;
  cols:string[] = [];
  displayedColumns:string[] = [];
  valueColumns:string[]=[];
  dataSource:MatTableDataSource<Object>= new MatTableDataSource([]);
  historyDataSource:MatTableDataSource<History> = new MatTableDataSource([]);

  updatedColumns:string[] = ['productKey','updated','description','changeId'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<Object>(true, []);

  ngOnInit() {
   
  }

  
  openDialog(row): void {
    const dialogRef = this.dialog.open(EditDialog, {
      width: '50%',
      height:'60%',
      data: {values: row,names:this.valueColumns,header:"Edit Row"}
    });
   dialogRef.afterClosed().subscribe(result => {
      if(result == undefined) return;
      var pos = result['position'];
      this.dataSource.data[pos] = result;
      var id = result['ID']
      delete result['position']
      var url = '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/entries/'+id
      this.tableService.putTableContents(url,result)
      .subscribe(results=>{
        alert("Update successfully")
      });
    });
  }
  openHistoryDialog(){
    this.flag = true;;
    this.displayedColumns = [];
    this.valueColumns = [];
    this.cols.length = 0;
    this.dataSource.data = [];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    var url = '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/history'
    
    this.tableService.historyLink(url)
      .subscribe(results => {
        var tmp_row:Object[] = [];
        this.row_count = 0;
        while(results[this.row_count] != null){
          tmp_row.push(results[this.row_count]);
          this.row_count++;
        }
        this.displayedColumns = ["productKey","updated","description","changeId"];
        this.valueColumns = this.displayedColumns
        this.dataSource = new MatTableDataSource(tmp_row);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  newDialog(row):void{
    const dialogRef = this.dialog.open(EditDialog, {
      width: '50%',
      height:'60%',
      data: {values: row,names:this.valueColumns,header:"Add Row"}
    });
   dialogRef.afterClosed().subscribe(result => {
      if(result == undefined) return;
      result['position'] = this.row_count;
      this.row_count++;
      var url = '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/entries/'
      this.tableService.addTableContents(url,result)
      .subscribe(results=>{
        this.dataSource.data.push(results);
        this.dataSource.data = this.dataSource.data;
      });
    });
  }
  filteredOptions: Observable<string[]>;
  inputText(txt,column,row){
    
    var id = row['ID']
    var url = '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/entries/'+id
    row[column] = txt
    var pos = row['position']
    this.dataSource.data[pos] = row;
    this.tableService.putTableContents(url,row)
      .subscribe(results=>{
        alert("Update successfully")
    });
    if(column == "SOBLCD"){
      var optionUrl = "/product/1-2-3/lookup/coverage/"+txt+"/limit"
          
      this.tableService.getOptionRef(optionUrl)
      .subscribe(
        results=>{
          var l_uri = results['sourceURI']
          var str_uri = new String(l_uri);
          var index = str_uri.lastIndexOf('/');
          var f_id = str_uri.indexOf('coverage');
          var ff_id = str_uri.indexOf('/',f_id+1)
          var str = str_uri.substr(ff_id+1,index-ff_id-1)
          this.optionSOLMIT[str] = [];
          for(var k=0;k<results['options'].length;k++){
            this.optionSOLMIT[str].push(results['options'][k]['value']);           
          }
         
        }
      )
    }
  }
  saveRow(event,column,row):void{
    var id = row['ID']
    var url = '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/entries/'+id
    row[column] = event.option.value;
    var pos = row['position']
    this.dataSource.data[pos] = row;
    this.tableService.putTableContents(url,row)
      .subscribe(results=>{
        alert("Update successfully")
    });
    if(column == "SOBLCD"){
     var optionUrl = "/product/1-2-3/lookup/coverage/"+event.option.value+"/limit"
          
        this.tableService.getOptionRef(optionUrl)
        .subscribe(
          results=>{

            var l_uri = results['sourceURI']
            var str_uri = new String(l_uri);
            var index = str_uri.lastIndexOf('/');
            var f_id = str_uri.indexOf('coverage');
            var ff_id = str_uri.indexOf('/',f_id+1)
            var str = str_uri.substr(ff_id+1,index-ff_id-1)
            this.optionSOLMIT[str] = [];
            for(var k=0;k<results['options'].length;k++){
              this.optionSOLMIT[str].push(results['options'][k]['value']);
              
            }
          }
        )
      }
  }
  deleteRow(row):void{
    var pos = row['position'];
    for(var i=0;i<this.dataSource.data.length;i++){
      if(this.dataSource.data[i]['position'] == pos){
        var id = this.dataSource.data[i]['ID']
        var url = '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/entries/'+id
        this.dataSource.data.splice(i,1)
        this.dataSource.data = this.dataSource.data;
        this.tableService.deleteTableContents(url)
        .subscribe(results=>{
        });
        break;
      }
    }
  }
  addRow(){
    var obj = new Object();
    this.newDialog(obj);
  }
  delRow(){
    for(var i=0;i<this.selection.selected.length;i++){
      this.deleteRow(this.selection.selected[i]);
    }
    alert(this.selection.selected.length+" rows deleted.");
  }
  download(){
    
  //  this.tableService.download('/product/CP-PA-V-R-88/table/CPPT207/csv')
  this.tableService.download('/product/CP-PA-V-R-88/table/CPPT207/history/')
    .subscribe(results=>{
      alert(results)
    });
  }
  onPicked(input: HTMLInputElement) {
    const file = input.files[0];
    alert(file.name);
    if (file) {
      this.tableService.upload(file).subscribe(
        msg => {
          
        }
      );
    }
  }
  changeUrl(str:string){
    this.flag = false;
    this.displayedColumns = [];
    this.valueColumns = [];
    this.cols.length = 0;
    this.dataSource.data = [];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    var tableColumnUrl = '/product/'+this.selectedProduct+'/table/'+this.selectedTable
    this.csvUrl = 'http://localhost:8080'
    this.csvUrl += '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/csv'
    this.tableService.getTableColumns(tableColumnUrl)
    .subscribe(results => {
      this.displayedColumns.push("select")
      this.displayedColumns.push("menu");
      for(var i=0;i<results['fields'].length;i++){
        if(results['fields'][i]['visible'] == false) continue;
        this.cols.push(results['fields'][i]['name']);
        this.displayedColumns.push(results['fields'][i]['name'])
        var optionUrl=""
        if(results['fields'][i]['name'] !="SOLMIT"){
          optionUrl = results['fields'][i]['optionsRef']
        }
        if(optionUrl.length!=0){
          this.optionRefs[results['fields'][i]['name']]=[]
          this.tableService.getOptionRef(optionUrl)
          .subscribe(
            results=>{
              var l_uri = results['sourceURI']
              var str_uri = new String(l_uri);
              var index = str_uri.lastIndexOf('/');
              var str = str_uri.substr(index+1,(str_uri.length-index));
              if(str == 'limit'){
                str = "LMIT"
              }
              var prefix = this.cols[0].substr(0,2)
              var name = prefix+str
              for(var k=0;k<results['options'].length;k++){
                this.optionRefs[name].push(results['options'][k]['value']);
              }
            }
          )
        }

      }
      
      this.valueColumns = this.cols
      var tableContentUrl = tableColumnUrl + '/entries'
      this.tableService.getTableContents(tableContentUrl)
      .subscribe(results => {
        var tmp_row:Object[] = [];
        this.row_count = 0;
        while(results[this.row_count] != null){
          var str_json = '{'
          str_json += '"position":' + this.row_count + ',';
          str_json += '"ID":' +'"' + results[this.row_count]['ID'] + '"'+ ',';
          for(var i=0;i<this.cols.length;i++){
            
            if(i != this.cols.length-1){
              str_json +='"' + this.cols[i] + '"' + ':' + '"' + results[this.row_count][this.cols[i]] + '"' + ',';
            }else{
              str_json += '"' + this.cols[i] + '"' + ':' + '"' + results[this.row_count][this.cols[i]] + '"' + '}';
            }
            if(this.cols[i] == "SOLMIT"){
              var optionUrl = "/product/1-2-3/lookup/coverage/"+results[this.row_count][this.cols[i-1]]+"/limit"
          
              this.tableService.getOptionRef(optionUrl)
              .subscribe(
                results=>{

                  var l_uri = results['sourceURI']
                  var str_uri = new String(l_uri);
                  var index = str_uri.lastIndexOf('/');
                  var f_id = str_uri.indexOf('coverage');
                  var ff_id = str_uri.indexOf('/',f_id+1)
                  var str = str_uri.substr(ff_id+1,index-ff_id-1)
                  this.optionSOLMIT[str] = [];
                  for(var k=0;k<results['options'].length;k++){
                    this.optionSOLMIT[str].push(results['options'][k]['value']);
                    
                  }
                }
              )
          }
          }
          
          var row: Object = JSON.parse(str_json);
          tmp_row.push(row)
          this.row_count++;
        }
        this.dataSource = new MatTableDataSource(tmp_row);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
    

  }
  constructor(private route: ActivatedRoute,private tableService: TableService,public dialog: MatDialog) {
   
    this.route.queryParams.subscribe(params => {
      if(params['product_id'] == undefined || params['table']==undefined){
        this.selectedTable = ""
        this.selectedProduct=""
        
        return;
      }
      this.selectedProduct = params['product_id']
      this.selectedTable = params['table']
      var tableColumnUrl = '/product/'+this.selectedProduct+'/table/'+this.selectedTable
      this.csvUrl = 'http://localhost:8080'
      this.csvUrl += '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/csv'
      this.flag = false;
       this.tableService.getTableColumns(tableColumnUrl)
       .subscribe(results => {
         this.displayedColumns.push("select")
         this.displayedColumns.push("menu");
         if(results['fields'].length == 0 || results['fields'] == undefined){
          this.selectedTable = ""
          this.selectedProduct=""
         }
         if(results['fields'].length >0){
          this.tables=this.all_tables;
          this.products = this.all_products;
         }
         for(var i=0;i<results['fields'].length;i++){
           if(results['fields'][i]['visible'] == false) continue;
          
           this.cols.push(results['fields'][i]['name']);
           this.displayedColumns.push(results['fields'][i]['name'])
           var optionUrl=""
           if(results['fields'][i]['name'] !="SOLMIT"){
             optionUrl = results['fields'][i]['optionsRef']
           }
           if(optionUrl.length!=0){
             this.optionRefs[results['fields'][i]['name']]=[]
             
             this.tableService.getOptionRef(optionUrl)
             .subscribe(
               results=>{
                 var l_uri = results['sourceURI']
                 var str_uri = new String(l_uri);
                 var index = str_uri.lastIndexOf('/');
                 var str = str_uri.substr(index+1,(str_uri.length-index));
                 var prefix = this.cols[0].substr(0,2)
                 if(str == 'limit'){
                   str = "LMIT"
                 }
                 var name = prefix+str
                 for(var k=0;k<results['options'].length;k++){
                   this.optionRefs[name].push(results['options'][k]['value']);
                   
                 }
               }
             )
           }
         }
         this.valueColumns = this.cols
         var tableContentUrl = tableColumnUrl + '/entries'
         this.tableService.getTableContents(tableContentUrl)
         .subscribe(results => {
           var tmp_row:Object[] = [];
           this.row_count = 0;
           while(results[this.row_count] != null){
             var str_json = '{'
             str_json += '"position":' + this.row_count + ',';
             str_json += '"ID":' +'"' + results[this.row_count]['ID'] + '"'+ ',';
             for(var i=0;i<this.cols.length;i++){
               if(i != this.cols.length-1){
                 str_json +='"' + this.cols[i] + '"' + ':' + '"' + results[this.row_count][this.cols[i]] + '"' + ',';
               }else{
                 str_json += '"' + this.cols[i] + '"' + ':' + '"' + results[this.row_count][this.cols[i]] + '"' + '}';
               }
               if(this.cols[i] == "SOLMIT"){
                    var optionUrl = "/product/1-2-3/lookup/coverage/"+results[this.row_count][this.cols[i-1]]+"/limit"
                
                    this.tableService.getOptionRef(optionUrl)
                    .subscribe(
                      results=>{
                        var l_uri = results['sourceURI']
                        var str_uri = new String(l_uri);
                        var index = str_uri.lastIndexOf('/');
                        var f_id = str_uri.indexOf('coverage');
                        var ff_id = str_uri.indexOf('/',f_id+1)
                        var str = str_uri.substr(ff_id+1,index-ff_id-1)
                        this.optionSOLMIT[str] = [];
                        for(var k=0;k<results['options'].length;k++){
                          this.optionSOLMIT[str].push(results['options'][k]['value']);
                          
                        }
                      }
                    )
                }
              }
               var row: Object = JSON.parse(str_json);
               tmp_row.push(row)
               
               this.row_count++;
           }
           
           this.dataSource = new MatTableDataSource(tmp_row);
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
         });
    
       });
       
  });
  /*

  var tableColumnUrl = '/product/'+this.selectedProduct+'/table/'+this.selectedTable
   this.csvUrl = 'http://localhost:8080'
   this.csvUrl += '/product/'+this.selectedProduct+'/table/'+this.selectedTable+'/csv'
   this.flag = false;
    this.tableService.getTableColumns(tableColumnUrl)
    .subscribe(results => {
      this.displayedColumns.push("select")
      this.displayedColumns.push("menu");
      for(var i=0;i<results['fields'].length;i++){
        if(results['fields'][i]['visible'] == false) continue;
        this.cols.push(results['fields'][i]['name']);
        this.displayedColumns.push(results['fields'][i]['name'])
        var optionUrl = results['fields'][i]['optionsRef']
        if(optionUrl.length!=0){
          this.optionRefs[results['fields'][i]['name']]=[]
          this.tableService.getOptionRef(optionUrl)
          .subscribe(
            results=>{
              var l_uri = results['sourceURI']
              var str_uri = new String(l_uri);
              var index = str_uri.lastIndexOf('/');
              var str = str_uri.substr(index+1,(str_uri.length-index));
              var name = "SM"+str;
              for(var k=0;k<results['options'].length;k++){
                this.optionRefs[name].push(results['options'][k]['value']);
              }
            }

          )
        }
      }
      this.valueColumns = this.cols
      var tableContentUrl = tableColumnUrl + '/entries'
      this.tableService.getTableContents(tableContentUrl)
      .subscribe(results => {
        var tmp_row:Object[] = [];
        this.row_count = 0;
        while(results[this.row_count] != null){
          var str_json = '{'
          str_json += '"position":' + this.row_count + ',';
          str_json += '"ID":' +'"' + results[this.row_count]['ID'] + '"'+ ',';
          for(var i=0;i<this.cols.length;i++){
            if(i != this.cols.length-1){
              str_json +='"' + this.cols[i] + '"' + ':' + '"' + results[this.row_count][this.cols[i]] + '"' + ',';
            }else
              str_json += '"' + this.cols[i] + '"' + ':' + '"' + results[this.row_count][this.cols[i]] + '"' + '}';
          }
         
            var row: Object = JSON.parse(str_json);
            tmp_row.push(row)
            this.row_count++;
        }
        
        this.dataSource = new MatTableDataSource(tmp_row);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
   
    });
    */
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }
  
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Object): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row['position'] + 1}`;
    }

}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'dialog.html',
})
export class EditDialog {

  constructor(
    public dialogRef: MatDialogRef<EditDialog>, @Inject(MAT_DIALOG_DATA) public data: Object) {
     
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
