import {Component, OnInit, ViewChild} from '@angular/core';
import {WindowComponent} from "../window/window.component";

@Component({
  selector: 'app-settings-window',
  templateUrl: './settings-window.component.html',
  styleUrls: ['./settings-window.component.css']
})
export class SettingsWindowComponent implements OnInit {

  @ViewChild(WindowComponent)
  window?: WindowComponent

  constructor() { }

  ngOnInit(): void {
  }

  open() {
    if (this.window) {
      this.window.open()
    }
  }

  close() {
    if (this.window) {
      this.window.close()
    }
  }



}
