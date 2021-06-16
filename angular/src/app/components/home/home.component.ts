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
  logoSrc: string = 'img/logo.png';

  constructor(private app: AppService) { }

  ngOnInit(): void {
    this.app.request('getLastModPack', args => {
      this.modPackName = args.name;
      this.logoSrc = args.logo;
    })
  }

  get logoPath(): string {
    return `assets/${this.logoSrc}`
  }

}
