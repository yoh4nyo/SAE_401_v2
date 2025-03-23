import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAvisComponent } from './component/admin-avis/admin-avis.component';
import { AdminCandidatComponent } from './component/admin-candidat/admin-candidat.component';
import { ConnexionComponent } from './component/connexion/connexion.component';
import { AdminEcoleComponent } from './component/admin-ecole/admin-ecole.component';
import { CandidatExamComponent } from './component/candidat-exam/candidat-exam.component';
import { CandidatAvisComponent } from './component/candidat-avis/candidat-avis.component';
import { AdminExamComponent } from './component/admin-exam/admin-exam.component';
import { CandidatStatsComponent } from './component/candidat-stats/candidat-stats.component';
import { AdminStatsComponent } from './component/admin-stats/admin-stats.component';
import { AccueilAvisComponent } from './component/accueil-avis/accueil-avis.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path:'admin/candidat',component: AdminCandidatComponent,canActivate: [AuthGuard],data: { role: 'admin' }},
  {path:'admin/avis',component: AdminAvisComponent,canActivate: [AuthGuard],data: { role: 'admin' }},
  {path:'admin/exam',component: AdminExamComponent,canActivate: [AuthGuard],data: { role: 'admin' }},
  {path:'admin/ecole',component: AdminEcoleComponent,canActivate: [AuthGuard],data: { role: 'admin' }},
  {path:'admin/stats',component: AdminStatsComponent,canActivate: [AuthGuard],data: { role: 'admin' }},
  {path:'candidat/exam',component: CandidatExamComponent,canActivate: [AuthGuard],data: { role: 'candidat' }},
  {path:'candidat/avis',component: CandidatAvisComponent,canActivate: [AuthGuard],data: { role: 'candidat' }},
  {path:'candidat/stats',component: CandidatStatsComponent,canActivate: [AuthGuard],data: { role: 'candidat' }},
  {path:'accueil/avis', component: AccueilAvisComponent},
  {path:'accueil', component: AccueilComponent},
  {path:'connexion', component: ConnexionComponent},
  {path:'', component: AccueilComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
