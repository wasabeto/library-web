import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthData } from './auth/auth.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Library';
  user$: Observable<AuthData>;

  constructor(private _authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this._authService.currentUser;
  }

  logout(): void {
    this._authService.logout();
    this.router.navigate(['/auth']);
  }
}
