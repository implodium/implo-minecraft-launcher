import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {
  active: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.active = true
  }

  close() {
    this.active = false
  }

}
