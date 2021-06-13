import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppService} from "../services/app.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.appService.request("checkInstallation", args => {
      if (!args) {
        this.router.navigate(['/setup'])
          .catch(console.log)
      }
    })
  }
}
