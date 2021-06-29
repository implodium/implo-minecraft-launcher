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

      this.app.on('installationStatus', installationState => {
        const installationStateObject: InstallationStatus = JSON.parse(installationState)
        this.percentage = installationStateObject.percentage
        this.installStatus = installationStateObject
      })
    })
  }

  get logoPath(): string {
      return `assets/${this.logoSrc}`
  }

  installMinecraftModPack() {
    this.instanceState = InstanceState.installing
    this.app.request('installMinecraftModPack', () => {
      setTimeout(() => {
        this.instanceState = InstanceState.installed
      }, 1000)
    }, this.modPackId)
  }

  startMinecraftModPack() {
    this.app.request('startMinecraftModPack', () => {
      this.app.request("quit", () => { })
    })
  }
}
