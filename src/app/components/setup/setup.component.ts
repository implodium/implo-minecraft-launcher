import {Component, OnInit} from '@angular/core';
import {AppService} from "../services/app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  path = 'could not get path'
  loading: boolean = false;

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.appService.request("getPath", args =>  {
      this.path = args;
    })
  }

  quit() {
    this.appService.send("quit");
  }

  install() {
    this.loading = true;
    this.appService.request("installBase", () => {
      this.router.navigate([""])
        .then(() => this.loading = false)
        .catch(console.log)
    });
  }
}
