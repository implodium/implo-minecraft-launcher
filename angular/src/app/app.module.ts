import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {RouterModule} from "@angular/router";
import Routes from './Routes';
import { SetupComponent } from './components/setup/setup.component';
import { MainComponent } from './components/main/main.component';
import {NgxElectronModule} from "ngx-electron";
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { HomeComponent } from './components/home/home.component';
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SetupComponent,
    MainComponent,
    LoadingScreenComponent,
    HomeComponent,
    InstallPromptComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(Routes),
    NgxElectronModule,
    MatIconModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
