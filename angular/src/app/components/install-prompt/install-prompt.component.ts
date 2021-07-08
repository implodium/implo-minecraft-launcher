import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-install-prompt',
  templateUrl: './install-prompt.component.html',
  styleUrls: ['./install-prompt.component.css']
})
export class InstallPromptComponent implements OnInit {

  pageNo: number = 1
  pageMax: number = 3
  finished: boolean = false

  constructor() { }

  ngOnInit(): void {
    console.log()
  }

  previous() {
    this.pageNo--
  }

  next() {
    this.pageNo++
  }

  finish() {

  }

  install() {

  }
}
