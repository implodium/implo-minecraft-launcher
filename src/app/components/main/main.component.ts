import {Component, Inject, OnInit} from '@angular/core';
import {ElectronService} from "ngx-electron";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(@Inject(ElectronService) private electronService: ElectronService) { }

  ngOnInit(): void {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.sendSync("checkInstallation");

      this.electronService.ipcRenderer.on('checkInstallation', (event, args) => {
        console.log(args)
      })
    }
  }
}
