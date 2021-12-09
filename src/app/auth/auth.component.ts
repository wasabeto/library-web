import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  title: string = 'Login';
  loginForm: FormGroup;
  subscriptions: Subscription[] = new Array<Subscription>();

  constructor(private _authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      this.subscriptions.push(
        this._authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
          (response: any) => {
            if (response['id']) {
              this.router.navigate(['/books']);
            } else {
              // Catch errors
              console.error(response);
            }
          }
        )
      );
    } else {
      // handle form errors
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
