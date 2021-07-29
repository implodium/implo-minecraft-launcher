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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import { SettingsWindowComponent } from './components/settings-window/settings-window.component';
import { WindowComponent } from './components/window/window.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SetupComponent,
    MainComponent,
    LoadingScreenComponent,
    HomeComponent,
    InstallPromptComponent,
    SettingsWindowComponent,
    WindowComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        RouterModule.forRoot(Routes),
        NgxElectronModule,
        MatIconModule,
        FormsModule,
        MatSliderModule,
        MatProgressBarModule,
        MatInputModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
