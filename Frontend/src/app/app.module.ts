import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NgbdToastGlobal } from './components/pages/common-pages/toast-global/toast-global.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastService } from 'src/services/toast.service';
import { APIService } from 'src/services/api.service';
import { ToastsContainer } from 'src/services/ToastsContainer.component';
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ToastsContainer,
    NgbdToastGlobal,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxNavbarModule,
    HttpClientModule,
    ScrollingModule,
    FontAwesomeModule,
    NoopAnimationsModule,
  ],
  providers: [HttpClient, ToastService, APIService],
  bootstrap: [AppComponent],
})
export class AppModule { }
