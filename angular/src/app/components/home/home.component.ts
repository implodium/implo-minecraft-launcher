import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  installed: boolean = false;
  modPackName: string = 'invalid Name';
  logoSrc: string = 'img/logo.png';

  constructor() { }

  ngOnInit(): void {
  }

  get logoPath(): string {
    return `assets/${this.logoSrc}`
  }

}
