import { Component, OnInit } from '@angular/core';
import { DownloaderService } from './downloader.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [ DownloaderService ]
})
export class HistoryComponent implements OnInit {

  constructor(private downloaderService: DownloaderService) { }

  ngOnInit() {
  }
  

}
