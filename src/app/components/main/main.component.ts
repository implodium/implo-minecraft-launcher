import {Component, NgZone, OnInit} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private electronService: ElectronService,
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    // this.router.navigate(['/setup'])
    //   .catch(console.log)

    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.sendSync("checkInstallation");

      this.electronService.ipcRenderer.on('checkInstallation', (event, args) => {
        this.zone.run(() => {
          if (!args) {
            this.router.navigate(['/setup'])
              .catch(console.log)
          }
        });
      })
    }
  }
}
