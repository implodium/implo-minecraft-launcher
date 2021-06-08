import {Component, NgZone, OnInit} from '@angular/core';
import {ElectronService} from "ngx-electron";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  path = ''

  constructor(
    private electronService: ElectronService,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send('getPath')

      this.electronService.ipcRenderer.on('getPath', (event, args) => {
        this.zone.run(() => {
          this.path = args;
        })
      });
    }
  }

  quit() {
    this.electronService.ipcRenderer.send('quit')
  }

  install() {
  }
}
