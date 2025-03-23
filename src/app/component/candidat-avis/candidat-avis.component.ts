import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AvisService } from '../../service/avis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EcoleService } from '../../service/ecole.service';
import { CandidatService } from '../../service/candidat.service';

@Component({
  selector: 'app-candidat-avis',
  standalone: false,
  templateUrl: './candidat-avis.component.html',
  styleUrls: ['./candidat-avis.component.css']
})
export class CandidatAvisComponent implements OnInit {
  userId: number | null = null; 
  showPopup: boolean = false; 
  showDeletePopup: boolean = false; 
  selectedAvisId: number | null = null;
  
  ajoutform!: FormGroup; 

  ecoles: any[] = []; 
  candidats: any[] = []; 
  aviss: any[] = [];
  avisFiltres: any[] = []; 

  constructor(
    private EcoleService: EcoleService,
    private CandidatService: CandidatService,
    private AvisService: AvisService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ajoutform = new FormGroup({
      id_avis: new FormControl(""),
      evaluation: new FormControl(""),
      texte: new FormControl(""),
      id_candid: new FormControl(""),
      id_ecole: new FormControl("")
    });
    this.route.queryParams.subscribe(params => {
      this.userId = params['id'] ? +params['id'] : null; 

      if (this.userId) {
        this.CandidatService.getCandidatById(this.userId).subscribe(
          (response) => {
            if (response && response.candidat) {
              const candidat = response.candidat.find((c: any) => c.id_candid === this.userId);

              if (candidat) {
                this.ajoutform.patchValue({
                  id_candid: candidat.id_candid,
                  id_ecole: candidat.id_ecole
                });
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

        this.AvisService.getAvis().subscribe(
          (data) => {
            this.aviss = data.avis || data;
            this.avisFiltres = this.aviss.filter(avis => avis.id_candid === this.userId); 
          },
          (error) => {
            console.error("Erreur lors de la récupération des avis :", error);
          }
        );
      }

      
    });

    this.EcoleService.getEcoles().subscribe(
      (data) => this.ecoles = data.ecole || data
    );

    this.CandidatService.getCandidat().subscribe(
      (data) => {
        this.candidats = data.candidat || data;
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

  getCandidatDateById(id_candid: number): string {
    const candidat = this.candidats.find(e => e.id_candid === id_candid);
    return candidat ? candidat.date_inscription : 'Date inconnue';
  }

  getStars(evaluation: number): number[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= evaluation ? 1 : 0); 
    }
    return stars;
  }

  toggleDeletePopup(): void {
    this.showDeletePopup = !this.showDeletePopup;
    if (!this.showDeletePopup) {
      this.selectedAvisId = null;
    }
  }

  openDeletePopup(avisId: number): void {
    this.selectedAvisId = avisId;
    this.toggleDeletePopup(); 
  }

  confirmDelete(): void {
    if (this.selectedAvisId) {
      this.supprimer(this.selectedAvisId); 
    }
  }

  supprimer(avisId: number): void {
    this.AvisService.deleteAvis(avisId).subscribe(
      () => {
        this.avisFiltres = this.avisFiltres.filter(avis => avis.id_avis !== avisId);
        this.aviss = this.aviss.filter(avis => avis.id_avis !== avisId); 

        alert("Avis supprimé avec succès !");
        this.toggleDeletePopup(); 
        window.location.reload();
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'avis :", error);
        alert("Erreur lors de la suppression de l'avis.");
      }
    );
  }

  navigateToExamPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/exam'], { queryParams: { id: this.userId } });
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

  navigateToAvisPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/avis'], { queryParams: { id: this.userId } });
    } else {
      console.error("ID du candidat non disponible.");
    }
  }

  togglePopup(): void {
    this.showPopup = !this.showPopup;
  }

  Ajouter() {
    if (this.ajoutform.valid) {
      const avis = this.ajoutform.value;

      this.AvisService.addAvis(avis).subscribe(
        () => {
          alert("Avis ajouté !");
          this.ajoutform.reset(); 
          this.togglePopup();
          this.AvisService.getAvis().subscribe(
            (data) => {
              this.aviss = data.avis || data;
              this.avisFiltres = this.aviss.filter(avis => avis.id_candid === this.userId); 
              window.location.reload();
            },
            (error) => {
              console.error("Erreur lors de la récupération des avis :", error);
            }
          );
        },
        (error) => {
          console.error("Erreur lors de l'ajout de l'avis :", error);
          alert("Erreur lors de l'ajout de l'avis.");
        }
      );
    } else {
      console.error("Formulaire invalide :", this.ajoutform.errors);
      alert("Formulaire invalide. Veuillez remplir tous les champs.");
    }
  }
}