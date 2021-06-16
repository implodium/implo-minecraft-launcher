import { Component, OnInit } from '@angular/core';
import {AppService} from "../services/app.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  installed: boolean = false;
  modPackName: string = 'invalid Name';
  logoSrc: string = "";
  imageFound: boolean = true

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.request('getLastModPack', modPackConfig => {
      this.modPackName = modPackConfig.name;
      this.logoSrc = modPackConfig.logo;

      this.app.request('checkModPackInstallation', isInstalled => {
        this.installed = isInstalled;
      }, modPackConfig.id)
    })
  }

  get logoPath(): string {
      return `assets/${this.logoSrc}`
  }

}
