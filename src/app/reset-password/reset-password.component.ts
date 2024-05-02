import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  token: string;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.token = this.activatedRoute.snapshot.params['token'];
  }

  resetPassword(newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      // Handle password mismatch
      console.error('Passwords do not match');
      return;
    }
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        // Handle success response
        console.log(response);
      },
      error: (error) => {
        // Handle error response
        console.error(error);
      }
    });
  }
}
