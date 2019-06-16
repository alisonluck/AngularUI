import {Component,OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { TableService } from './table.service';
import { DataSource } from '@angular/cdk/table';
import { stringify } from '@angular/core/src/render3/util';
import {MatPaginator, MatTableDataSource,MatSort} from '@angular/material';
import { MessageService } from '../message.service';

var cols:string[]=[];
const ELEMENT_DATA: Object[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'table-component',
  styleUrls: ['table.component.css'],
  templateUrl: 'table.component.html',
  providers:[TableService]
})
export class TableComponent implements OnInit{
  table_field: string;
  col_count:number;
  cols:string[] = [];
  displayedColumns:string[] = [];
  dataSource:MatTableDataSource<Object>= new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    
  }
  
  selection = new SelectionModel<Object>(true, []);
  constructor(private tableService: TableService) {
    this.tableService.getTableColumns('/product/CP-PA-V-R-88/table/CPPT201')
    .subscribe(results => {
      for(var i=0;i<results['fields'].length;i++){
        this.cols.push(results['fields'][i]['name']);
       
      }
      this.displayedColumns = this.cols
    });
    this.tableService.getTableContents('/product/CP-PA-V-R-88/table/CPPT201/entries')
    .subscribe(results => {
      var tmp_row:Object[] = [];
      this.col_count = 0;
      while(results[this.col_count] != null){
        var str_json = '{'
        str_json += '"position":' + this.col_count + ',';
        for(var i=0;i<this.cols.length;i++){
          if(i != this.cols.length-1){
            str_json +='"' + this.cols[i] + '"' + ':' + '"' + results[this.col_count][this.cols[i]] + '"' + ',';
          }else
            str_json += '"' + this.cols[i] + '"' + ':' + '"' + results[this.col_count][this.cols[i]] + '"' + '}';
        }
        var row: Object = JSON.parse(str_json);
        tmp_row.push(row)
        this.col_count++;
      }
      this.dataSource = new MatTableDataSource(tmp_row);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
   
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
      console.log(row)
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row['position'] + 1}`;
    }

/*
  constructor(private tableService: TableService) {
  
    this.tableService.getTableColumns('/product/CP-PA-V-R-88/table/CPPT201')
    .subscribe(results => {
      for(var i=0;i<results['fields'].length;i++){
        this.cols.push(results['fields'][i]['name']);
        this.displayedColumns.push(results['fields'][i]['name']);
        
      }
    });
    
    this.tableService.getTableContents('/product/CP-PA-V-R-88/table/CPPT201/entries')
    .subscribe(results => {
      var tmp_row:Object[] = [];
      this.col_count = 0;
      while(results[this.col_count] != null){
        var str_json = '{'
        for(var i=0;i<this.cols.length;i++){
          if(i != this.cols.length-1){
            str_json +='"' + this.cols[i] + '"' + ':' + '"' + results[this.col_count][this.cols[i]] + '"' + ',';
          }else
            str_json += '"' + this.cols[i] + '"' + ':' + '"' + results[this.col_count][this.cols[i]] + '"' + '}';
        }
        var row: Object = JSON.parse(str_json);
        tmp_row.push(row)
        this.col_count++;
      }
      this.dataSource = new MatTableDataSource(tmp_row);
    });
   
  }
*/
}
