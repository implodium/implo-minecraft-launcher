import {Component, OnInit} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private electronService: ElectronService, private router: Router) { }

  ngOnInit(): void {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.sendSync("checkInstallation");

      this.electronService.ipcRenderer.on('checkInstallation', (event, args) => {
        if (!args) {
          this.router.navigateByUrl('setup')
            .catch(console.log)
        }
      })
    }
  }
}
