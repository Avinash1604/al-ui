import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiIntegratorComponent } from './ai-integrator/ai-integrator.component';
import { AppComponent } from './app.component';

const routes: Routes = [ 
  { path: '', component: AppComponent },
  { path: 'ai-integrator', component: AiIntegratorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
