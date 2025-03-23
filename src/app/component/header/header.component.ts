import { Component } from '@angular/core';
import { LogoutService } from '../../service/logout.service';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private LogoutService: LogoutService) { }

  onLogout() {
    this.LogoutService.logout();
  }
}
