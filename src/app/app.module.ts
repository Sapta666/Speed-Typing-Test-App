import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpeedTypingTestAppComponent } from './speed-typing-test-app/speed-typing-test-app.component';

@NgModule({
  declarations: [
    AppComponent,
    SpeedTypingTestAppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
