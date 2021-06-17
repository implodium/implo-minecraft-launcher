import {Component, OnInit} from '@angular/core';
import {AppService} from "../services/app.service";
import InstallationState from "../../util/InstallationState";

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
  InstallationState = InstallationState
  installationState = InstallationState.notInstalled
  percentage: number = -1

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.request('getLastModPack', modPackConfig => {
      this.modPackName = modPackConfig.name;
      this.logoSrc = modPackConfig.logo;
      this.modPackId = modPackConfig.id;

      this.app.request('checkModPackInstallation', isInstalled => {
        if(isInstalled) {
          this.installationState = InstallationState.installed
        }
      }, modPackConfig.id)
    })
  }

  get logoPath(): string {
      return `assets/${this.logoSrc}`
  }

  installMinecraftModPack() {
    this.installationState = InstallationState.installing
    this.app.request('installMinecraftModPack', () => {
      this.installationState = InstallationState.installed
    }, this.modPackId)
  }
}
