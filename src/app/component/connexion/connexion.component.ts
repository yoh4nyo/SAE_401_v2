import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  standalone: false,
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {

  connexionform!: FormGroup;
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.connexionform = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('', Validators.required)
    });
  }

  connexion(): void {
    const email = this.connexionform.get('email')?.value;
    const password = this.connexionform.get('password')?.value;

    this.apiService.login(email, password).subscribe(
      (response) => {
        if (response && response.success && response.user) {
          const userId = response.user.id;
          const userRole = response.user.role; 

          this.apiService.setLoggedIn(true);
          this.apiService.setRole(userRole);

          if (userRole === "admin") {
            this.router.navigate(['/admin/candidat']);
          } else if (userRole === "candidat") {
            this.router.navigate(['/candidat/exam'], { queryParams: { id: userId } });
          }
        } else {
          this.errorMessage = "Identifiants incorrects.";
        }
      },
      (error) => {
        this.errorMessage = "Identifiants incorrects.";
      }
    );
  }
}