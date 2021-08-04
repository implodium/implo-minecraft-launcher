import {Component, OnInit, ViewChild} from '@angular/core';
import {AppService} from "../services/app.service";
import InstanceState from "../../util/InstanceState";
import {InstallPromptComponent} from "../install-prompt/install-prompt.component";
import {SettingsWindowComponent} from "../settings-window/settings-window.component";

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
  memory: number = -1;

  @ViewChild(InstallPromptComponent)
  installPrompt?: InstallPromptComponent

  @ViewChild(SettingsWindowComponent)
  settingsWindow?: SettingsWindowComponent

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.request('getLastModPack', modPackConfig => {
      this.modPackName = modPackConfig.name;
      this.logoSrc = modPackConfig.logo;
      this.modPackId = modPackConfig.id;
      this.memory = modPackConfig.memory;

      console.log(modPackConfig)

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
    if (this.installPrompt) {
      this.installPrompt.open(this.modPackId)
    }
  }

  startMinecraftModPack() {
    this.app.request('startMinecraftModPack', () => {
      this.app.request("quit", () => { })
    })
  }

  changeToInstallState() {
    this.instanceState = InstanceState.installed
  }

  openSettings() {
    if (this.settingsWindow) {
      this.settingsWindow.open(this.modPackId, this.instanceState)
    }
  }

  changeInstallState(installState: InstanceState) {
    this.instanceState = installState
  }
}
