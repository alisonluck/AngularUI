import { Component } from '@angular/core';
import { DownloaderService } from './downloader.service';

@Component({
  selector: 'app-downloader',
  templateUrl: './downloader.component.html',
  providers: [ DownloaderService ]
})
export class DownloaderComponent {
  contents: string;
  constructor(private downloaderService: DownloaderService) {
    
  }


  download() {
    var url = '/product/CP-PA-V-R-88/table/CPPT201/csv';
    this.downloaderService.getTextFile(url)
      .subscribe(results => {
        alert(results)
      });
  }
}
