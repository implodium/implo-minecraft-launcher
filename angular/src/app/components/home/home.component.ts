import {Component, OnInit} from '@angular/core';
import {AppService} from "../services/app.service";
import InstanceState from "../../util/InstanceState";
import InstallationStatus from "../../util/InstallationStatus";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modPackName: string = 'invalid Name';
  logoSrc: string = "";
  imageFound: boolean = true
  modPackId: string = "";
  InstanceState = InstanceState
  instanceState = InstanceState.notInstalled
  installStatus?: InstallationStatus
  percentage: number = 0

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.request('getLastModPack', modPackConfig => {
      this.modPackName = modPackConfig.name;
      this.logoSrc = modPackConfig.logo;
      this.modPackId = modPackConfig.id;

      this.app.request('checkModPackInstallation', isInstalled => {
        if(isInstalled) {
          this.instanceState = InstanceState.installed
        }
      }, modPackConfig.id)
    })
  }

  get logoPath(): string {
    return `assets/${this.logoSrc}`
  }

  openInstallPrompt() {

  }

  installMinecraftModPack() {
    this.instanceState = InstanceState.installing
    this.app.requestProcess('installMinecraftModPack', this.modPackId)
      .subscribe({
        next: (status) => {
          this.installStatus = status
        },
        complete: () => {
          this.instanceState = InstanceState.installed
        }
      })
  }

  startMinecraftModPack() {
    this.app.request('startMinecraftModPack', () => {
      this.app.request("quit", () => { })
    })
  }
}
