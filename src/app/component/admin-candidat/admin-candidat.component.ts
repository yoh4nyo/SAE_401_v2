import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CandidatService } from '../../service/candidat.service';
import { EcoleService } from '../../service/ecole.service';
import { ExamService } from '../../service/exam.service';  
import { AvisService } from '../../service/avis.service';    
import * as bcrypt from 'bcryptjs';
import { forkJoin } from 'rxjs';


interface Candidat {
  id_candid: number;
  prenom: string;
  nom: string;
  phone: string;
  email: string;
  date_inscription: string;
  adresse: string;
  date_naissance: string;
  password: string;
  id_ecole: number;
  selected?: boolean;
}

interface ApiResponse {
  candidat: Candidat[];
}

@Component({
  selector: 'app-admin-candidat',
  standalone: false,
  templateUrl: './admin-candidat.component.html',
  styleUrls: ['./admin-candidat.component.css'],
})

export class AdminCandidatComponent implements OnInit {
  showPopup: boolean = false;
  showDeletePopup: boolean = false;
  showModifPopup: boolean = false;
  showTriPopup: boolean = false;
  selectedCandidatId: number | null = null;

  ajoutform!: FormGroup;
  modifForm!: FormGroup;
  triForm!: FormGroup;

  ecoles: any[] = [];
  allCandidats: Candidat[] = [];
  candidats: Candidat[] = [];

  constructor(
    private candidatService: CandidatService,
    private ecoleService: EcoleService,
    private examService: ExamService,  
    private avisService: AvisService    
  ) { }

  ngOnInit(): void {
    this.ajoutform = new FormGroup({
      nom: new FormControl(""),
      prenom: new FormControl(""),
      phone: new FormControl(""),
      email: new FormControl(""),
      password: new FormControl(""),
      adresse: new FormControl(""),
      date_naissance: new FormControl(""),
      id_ecole: new FormControl("")
    });

    this.modifForm = new FormGroup({
      nom: new FormControl(""),
      prenom: new FormControl(""),
      phone: new FormControl(""),
      email: new FormControl(""),
      password: new FormControl(""),
      adresse: new FormControl(""),
      date_naissance: new FormControl(""),
      id_ecole: new FormControl("")
    });

    this.triForm = new FormGroup({
      id_candid: new FormControl(""),
      id_ecole: new FormControl("")
    });

    this.ecoleService.getEcoles().subscribe(
      (data) => this.ecoles = data.ecole || data
    );

    this.candidatService.getCandidat().subscribe(
      (data: ApiResponse) => {
        this.allCandidats = (data.candidat || data).map((candidat: Candidat) => ({ ...candidat, selected: false }));
        this.candidats = [...this.allCandidats];
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

  getEcoleNomById(id_ecole: number): string {
    const ecole = this.ecoles.find(e => e.id_ecole === id_ecole);
    return ecole ? ecole.nom : 'Non attribuée';
  }

  togglePopup(): void {
    this.showPopup = !this.showPopup;
  }

  Ajouter() {
    if (this.ajoutform.valid) {
      const candidat = this.ajoutform.value;

      if (candidat.password) {
        candidat.password = bcrypt.hashSync(candidat.password, 10);
      }

      this.candidatService.addCandidat(candidat).subscribe(
        () => {
          alert("Candidat ajouté !");
          this.ajoutform.reset();
          this.togglePopup();
          window.location.reload();
        },
        (error) => {
          alert("Erreur lors de l'ajout du candidat.");
          console.error("Erreur lors de l'ajout :", error);
        }
      );
    }
  }

  toggleModifPopup(): void {
    this.showModifPopup = !this.showModifPopup;
    if (!this.showModifPopup) {
      this.selectedCandidatId = null;
    }
  }

  openModifPopup(candidatId: number): void {
    const candidat = this.candidats.find(c => c.id_candid === candidatId);
    if (candidat) {
      this.selectedCandidatId = candidatId;
      this.modifForm.patchValue({
        nom: candidat.nom,
        prenom: candidat.prenom,
        phone: candidat.phone,
        email: candidat.email,
        password: candidat.password,
        adresse: candidat.adresse,
        date_naissance: candidat.date_naissance,
        id_ecole: candidat.id_ecole
      });
      this.toggleModifPopup();
    }
  }

  confirmModif(): void {
    if (this.selectedCandidatId && this.modifForm.valid) {
      const candidat = this.modifForm.value;
      if (candidat.password) {
        candidat.password = bcrypt.hashSync(candidat.password, 10);
      }
      this.candidatService.updateCandidat(this.selectedCandidatId, candidat).subscribe(
        () => {
          alert("Candidat modifié !");
          this.modifForm.reset();
          this.toggleModifPopup();
          window.location.reload();
        },
        (error) => {
          alert("Erreur lors de la modification du candidat.");
          console.error("Erreur lors de la modification :", error);
        }
      );
    }
  }

  confirmDelete(): void {
    this.supprimer();
    this.toggleDeletePopup();
  }

  toggleDeletePopup(): void {
    this.showDeletePopup = !this.showDeletePopup;
  }

  supprimer(): void {
    const candidatsASupprimer = this.candidats.filter(candidat => candidat.selected);
    const idsASupprimer = candidatsASupprimer.map(candidat => candidat.id_candid);
  
    if (idsASupprimer.length === 0) {
      alert("Aucun candidat sélectionné.");
      return;
    }
  
    forkJoin({
      exams: this.examService.getExams(),
      avis: this.avisService.getAvis()
    }).subscribe(({ exams, avis }) => {
      const candidatsNonSupprimables: string[] = [];
  
      candidatsASupprimer.forEach(candidat => {
        const hasExam = exams.exam.some((examItem: any) => examItem.id_candid === candidat.id_candid);
        const hasAvis = avis.avis.some((avisItem: any) => avisItem.id_candid === candidat.id_candid);
  
        if (hasExam || hasAvis) {
          candidatsNonSupprimables.push(`${candidat.prenom} ${candidat.nom}`);
        }
      });
  
      if (candidatsNonSupprimables.length > 0) {
        const candidatNames = candidatsNonSupprimables.join(', ');
        alert(`Impossible de supprimer les candidats suivants car ils ont des examens ou des avis associés: ${candidatNames}. Veuillez les supprimer d'abord.`);
      } else {
        this.candidatService.deleteCandidats(idsASupprimer).subscribe(
          () => {
            this.candidats = this.candidats.filter(candidat => !candidat.selected);
            alert("Candidats supprimés avec succès !");
            this.toggleDeletePopup();
            window.location.reload();
          },
          (error) => {
            console.error("Erreur lors de la suppression :", error);
            alert("Erreur lors de la suppression des candidats.");
          }
        );
      }
    });
  }


  toggleTriPopup(): void {
    this.showTriPopup = !this.showTriPopup;
    if (!this.showTriPopup) {
      this.triForm.reset();
      if (this.candidats.length === 0) {
        this.candidats = [...this.allCandidats];
      }
    }
  }

  tri(): void {
    const idCandid = this.triForm.get('id_candid')?.value;
    const idEcole = this.triForm.get('id_ecole')?.value;

    if (idCandid) {
      this.candidats = this.allCandidats.filter(c => c.id_candid === +idCandid);
    } else if (idEcole) {
      this.candidats = this.allCandidats.filter(c => c.id_ecole === +idEcole);
    } else {
      this.candidats = [...this.allCandidats];
    }

    if (this.candidats.length === 0) {
      alert("Aucun candidat dans cette école !");
    }
    this.toggleTriPopup();
  }
}