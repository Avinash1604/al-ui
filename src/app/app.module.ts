import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AiIntegratorComponent } from './ai-integrator/ai-integrator.component';
import { RouterComponent } from './router/router.component';

@NgModule({
  declarations: [
    AppComponent,
    AiIntegratorComponent,
    RouterComponent,
    RouterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [RouterComponent]
})
export class AppModule { }
