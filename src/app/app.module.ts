import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { CardModule } from "primeng/card"
import { InputTextModule } from "primeng/inputtext"
import { ButtonModule } from "primeng/button"
import { ToastModule } from "primeng/toast"
import { MessageService } from 'primeng/api';

import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './modules/home/home.component';
import { ToolbarNavigationComponent } from './shared/components/toolbar-navigation/toolbar-navigation.component';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //PrimeNg
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ToolbarModule
  ],
  providers: [
    CookieService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
