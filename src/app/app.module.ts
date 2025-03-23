import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { ConnexionComponent } from './component/connexion/connexion.component';
import { AdminCandidatComponent } from './component/admin-candidat/admin-candidat.component';
import { AdminAvisComponent } from './component/admin-avis/admin-avis.component';
import { FormsModule } from '@angular/forms';
import { AdminEcoleComponent } from './component/admin-ecole/admin-ecole.component';
import { CandidatExamComponent } from './component/candidat-exam/candidat-exam.component';
import { AdminExamComponent } from './component/admin-exam/admin-exam.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidatAvisComponent } from './component/candidat-avis/candidat-avis.component';
import { CandidatStatsComponent } from './component/candidat-stats/candidat-stats.component';
import { AccueilAvisComponent } from './component/accueil-avis/accueil-avis.component';
import { AccueilComponent } from './component/accueil/accueil.component';
import { AdminStatsComponent } from './component/admin-stats/admin-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ConnexionComponent,
    AdminCandidatComponent,
    AdminAvisComponent,
    AdminEcoleComponent,
    CandidatExamComponent,
    AdminExamComponent,
    CandidatAvisComponent,
    CandidatStatsComponent,
    AccueilAvisComponent,
    AccueilComponent,
    AdminStatsComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
