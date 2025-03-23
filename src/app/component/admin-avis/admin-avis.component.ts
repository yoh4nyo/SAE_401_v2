import { Component, OnInit } from '@angular/core';
import { EcoleService } from '../../service/ecole.service';
import { CandidatService } from '../../service/candidat.service';
import { AvisService } from '../../service/avis.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-avis',
  standalone: false,
  templateUrl: './admin-avis.component.html',
  styleUrls: ['./admin-avis.component.css']
})
export class AdminAvisComponent implements OnInit {

  selectedAvisId: number | null = null;
  showDeletePopup: boolean = false;
  showTriPopup: boolean = false;

  triForm!: FormGroup;

  ecoles: any[] = [];
  candidats: any[] = [];
  aviss: any[] = [];
  allAvis: any[] = [];
  filteredAvis: any[] = [];

  constructor(
    private EcoleService: EcoleService,
    private CandidatService: CandidatService,
    private AvisService: AvisService,
  ) {}

  ngOnInit(): void {
    this.triForm = new FormGroup({
      id_candid: new FormControl(""),
      id_ecole: new FormControl("")
    });

    this.EcoleService.getEcoles().subscribe(
      (data) => this.ecoles = data.ecole || data
    );

    this.CandidatService.getCandidat().subscribe(
      (data) => {
        this.candidats = data.candidat || data;
      }
    );

    this.AvisService.getAvis().subscribe(
      (data) => {
        this.aviss = data.avis || data;
        this.allAvis = [...this.aviss]; 
        this.filteredAvis = [...this.aviss];
      }
    );
    this.triForm.get('id_candid')?.valueChanges.subscribe((value) => {
      if (value) {
        this.triForm.get('id_ecole')?.disable({ emitEvent: false });
      } else {
        this.triForm.get('id_ecole')?.enable({ emitEvent: false });
      }
    });

    this.triForm.get('id_ecole')?.valueChanges.subscribe((value) => {
      if (value) {
        this.triForm.get('id_candid')?.disable({ emitEvent: false });
      } else {
        this.triForm.get('id_candid')?.enable({ emitEvent: false });
      }
    });

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
    return candidat ? candidat.date_inscription : 'Non attribuée';
  }

  getEcoleNomById(id_ecole: number): string {
    const ecole = this.ecoles.find(e => e.id_ecole === id_ecole);
    return ecole ? ecole.nom : 'Non attribuée';
  }

  getStars(evaluation: number): number[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= evaluation) {
        stars.push(1); 
      } else {
        stars.push(0); 
      }
    }
    return stars;
  }

  toggleDeletePopup(): void {
    this.showDeletePopup = !this.showDeletePopup;
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

  toggleTriPopup(): void {
    this.showTriPopup = !this.showTriPopup;
    if (!this.showTriPopup) {
      this.aviss = [...this.filteredAvis];
    }
  }

  tri(): void {
    const idCandid = this.triForm.get('id_candid')?.value;
    const idEcole = this.triForm.get('id_ecole')?.value;

    let filteredAvis = this.allAvis;

    if (idCandid) {
      filteredAvis = filteredAvis.filter(avis => avis.id_candid === +idCandid);
    }

    if (idEcole) {
      filteredAvis = filteredAvis.filter(avis => avis.id_ecole === +idEcole);
    }

    this.filteredAvis = filteredAvis;
    this.aviss = [...this.filteredAvis];

    if (this.aviss.length === 0) {
      alert("Aucun examen trouvé avec ces critères !");
    }
    this.toggleTriPopup();
    this.triForm.reset();
  }
}
