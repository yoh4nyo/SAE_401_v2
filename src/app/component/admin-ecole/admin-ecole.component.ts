import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EcoleService } from '../../service/ecole.service';
import { CandidatService } from '../../service/candidat.service'; 

interface Ecole {
  id_ecole: number;
  nom: string;
  adresse: string;
  phone: string;
  email: string;
  date_ajout: string;
  selected?: boolean;
}

interface ApiResponse {
  ecole: Ecole[];
}

@Component({
  selector: 'app-admin-ecole',
  standalone: false,
  templateUrl: './admin-ecole.component.html',
  styleUrl: './admin-ecole.component.css'
})
export class AdminEcoleComponent implements OnInit {
  showPopup: boolean = false;
  showDeletePopup: boolean = false;
  showModifPopup: boolean = false;
  showTriPopup: boolean = false;
  selectedEcoleId: number | null = null;

  ajoutform!: FormGroup;
  modifForm!: FormGroup;
  triForm!: FormGroup;

  ecoles: any[] = []; 
  allEcoles: any[] = []; 
  filteredEcoles: any[] = []; 

  constructor(
    private EcoleService: EcoleService,
    private CandidatService: CandidatService 
  ) { }

  ngOnInit(): void {
    this.ajoutform = new FormGroup({
      id_ecole: new FormControl(""),
      nom: new FormControl(""),
      adresse: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl("")
    });

    this.modifForm = new FormGroup({
      id_ecole: new FormControl(""),
      nom: new FormControl(""),
      adresse: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl("")
    });

    this.triForm = new FormGroup({
      id_ecole: new FormControl("")
    });

    this.EcoleService.getEcoles().subscribe(
      (data: ApiResponse) => {
        this.ecoles = (data.ecole || data).map((ecole: Ecole) => ({ ...ecole, selected: false }));
        this.allEcoles = [...this.ecoles];
        this.filteredEcoles = [...this.ecoles];
      }
    );
  }

  togglePopup(): void {
    this.showPopup = !this.showPopup;
  }

  Ajouter() {
    const ecole = this.ajoutform.value;
    this.EcoleService.addEcole(ecole).subscribe(
      () => {
        alert("École ajoutée !");
        this.ajoutform.reset();
        this.togglePopup();
        this.EcoleService.getEcoles().subscribe(
          (data: ApiResponse) => {
            this.ecoles = (data.ecole || data).map((ecole: Ecole) => ({ ...ecole, selected: false }));
            this.allEcoles = [...this.ecoles];
            this.filteredEcoles = [...this.ecoles];
          }
        );
      },
      (error) => {
        console.error("Erreur lors de l'ajout :", error);
        alert("Erreur lors de l'ajout de l'école.");
      }
    );
  }

  toggleDeletePopup(): void {
    this.showDeletePopup = !this.showDeletePopup;
  }

  confirmDelete(): void {
    this.supprimer();
    this.toggleDeletePopup();
  }

  supprimer(): void {
    const ecolesASupprimer = this.ecoles.filter(ecole => ecole.selected);
    const idsASupprimer = ecolesASupprimer.map(ecole => ecole.id_ecole);

    if (idsASupprimer.length === 0) {
      alert("Aucune école sélectionnée.");
      return;
    }
    this.CandidatService.getCandidat().subscribe(
      (candidatData: any) => {
        const candidats = candidatData.candidat || candidatData;

        const ecolesNonSupprimables: string[] = [];
        ecolesASupprimer.forEach(ecole => {
          const hasCandidat = candidats.some((candidat: any) => candidat.id_ecole === ecole.id_ecole);
          if (hasCandidat) {
            ecolesNonSupprimables.push(ecole.nom);
          }
        });

        if (ecolesNonSupprimables.length > 0) {
          const ecoleNames = ecolesNonSupprimables.join(', ');
          alert(`Impossible de supprimer les écoles suivantes car des candidats y sont encore inscrits: ${ecoleNames}.`);
        } else {
          this.EcoleService.deleteEcoles(idsASupprimer).subscribe(
            () => {
              alert("Écoles supprimées avec succès !");
              this.EcoleService.getEcoles().subscribe(
                (data: ApiResponse) => {
                  this.ecoles = (data.ecole || data).map((ecole: Ecole) => ({ ...ecole, selected: false }));
                  this.allEcoles = [...this.ecoles];
                  this.filteredEcoles = [...this.ecoles];
                }
              );
            },
            (error) => {
              console.error("Erreur lors de la suppression :", error);
              alert("Erreur lors de la suppression des écoles.");
            }
          );
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des candidats :", error);
        alert("Erreur lors de la vérification des candidats associés aux écoles.");
      }
    );
  }

  toggleModifPopup(): void {
    this.showModifPopup = !this.showModifPopup;
    if (!this.showModifPopup) {
      this.selectedEcoleId = null;
    }
  }

  openModifPopup(ecoleId: number): void {
    const ecole = this.ecoles.find(c => c.id_ecole === ecoleId);
    if (ecole) {
      this.selectedEcoleId = ecoleId;
      this.modifForm.patchValue({
        nom: ecole.nom,
        adresse: ecole.adresse,
        phone: ecole.phone,
        email: ecole.email,
      });
      this.toggleModifPopup();
    }
  }

  confirmModif(): void {
    if (this.selectedEcoleId && this.modifForm.valid) {
      const ecole = this.modifForm.value;

      this.EcoleService.updateEcole(this.selectedEcoleId, ecole).subscribe(
        () => {
          alert("École modifiée !");
          this.modifForm.reset();
          this.toggleModifPopup();
          this.EcoleService.getEcoles().subscribe(
            (data: ApiResponse) => {
              this.ecoles = (data.ecole || data).map((ecole: Ecole) => ({ ...ecole, selected: false }));
              this.allEcoles = [...this.ecoles];
              this.filteredEcoles = [...this.ecoles];
            }
          );
        },
        (error) => {
          alert("Erreur lors de la modification de l'école.");
          console.error("Erreur lors de la modification :", error);
        }
      );
    }
  }

  toggleTriPopup(): void {
    this.showTriPopup = !this.showTriPopup;
    if (!this.showTriPopup) {
      this.ecoles = [...this.filteredEcoles];
    }
  }

  tri(): void {
    const idEcole = this.triForm.get('id_ecole')?.value;

    if (idEcole) {
      this.filteredEcoles = this.allEcoles.filter(ecole => ecole.id_ecole === +idEcole);
      this.ecoles = [...this.filteredEcoles]
      this.toggleTriPopup();
    } else {
      this.filteredEcoles = [...this.allEcoles];
      this.ecoles = [...this.filteredEcoles];
      this.toggleTriPopup();
    }

    if (this.ecoles.length === 0) {
      alert("Aucune école trouvée !");
    }

  }
}