import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeedTypingTestAppComponent } from './speed-typing-test-app/speed-typing-test-app.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "SpeedTypingTestApp"},
  { path: "SpeedTypingTestApp", component: SpeedTypingTestAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
