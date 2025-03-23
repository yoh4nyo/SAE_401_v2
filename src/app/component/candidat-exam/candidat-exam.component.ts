import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { EcoleService } from '../../service/ecole.service';
import { CandidatService } from '../../service/candidat.service';
import { ExamService } from '../../service/exam.service';

@Component({
  selector: 'app-candidat-exam',
  standalone: false,
  templateUrl: './candidat-exam.component.html',
  styleUrls: ['./candidat-exam.component.css']
})

export class CandidatExamComponent implements OnInit {
  userId: number | null = null; 

  ecoles: any[] = []; 
  candidats: any[] = []; 
  exams: any[] = []; 

  constructor(
    private EcoleService: EcoleService,
    private CandidatService: CandidatService,
    private ExamService: ExamService,
    private route: ActivatedRoute,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['id'] ? +params['id'] : null; 

      if (this.userId) {
        this.CandidatService.getCandidatById(this.userId).subscribe(
          (response) => {
            if (response && response.candidat) {
              const candidat = response.candidat.find((c: any) => c.id_candid === this.userId);

              if (candidat) {
              } else {
                console.error("Candidat non trouvé dans la réponse.");
              }
            } else {
              console.error("Réponse de l'API invalide :", response);
            }
          },
          (error) => {
            console.error("Erreur lors de la récupération des informations du candidat :", error);
          }
        );
      }
    });

    this.EcoleService.getEcoles().subscribe(
      (data) => this.ecoles = data.ecole || data
    );

    this.CandidatService.getCandidat().subscribe(
      (data) => this.candidats = data.candidat || data
    );

    this.ExamService.getExams().subscribe(
      (data) => {
        this.exams = data.exam || data;
        if (this.userId) {
          this.exams = this.exams.filter(exam => exam.id_candid === this.userId);
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des examens :", error);
      }
    );
  }

  getEcoleNomById(id_ecole: number): string {
    const ecole = this.ecoles.find(e => e.id_ecole === id_ecole);
    return ecole ? ecole.nom : 'Non attribuée';
  }

  getCandidatNomById(id_candid: number): string {
    const candidat = this.candidats.find(e => e.id_candid === id_candid);
    return candidat ? candidat.nom : 'Non attribuée';
  }

  getCandidatPrenomById(id_candid: number): string {
    const candidat = this.candidats.find(e => e.id_candid === id_candid);
    return candidat ? candidat.prenom : 'Non attribuée';
  }

  navigateToAvisPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/avis'], { queryParams: { id: this.userId } });
    } else {
      console.error("ID du candidat non disponible.");
    }
  }

  navigateToStatsPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/stats'], { queryParams: { id: this.userId } });
    } else {
      console.error("ID du candidat non disponible.");
    }
  }

  navigateToExamPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/exam'], { queryParams: { id: this.userId } });
    } else {
      console.error("ID du candidat non disponible.");
    }
  }
}