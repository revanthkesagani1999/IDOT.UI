import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user.token) {
      window.sessionStorage.setItem('auth-token', user.token);  // Storing the token
    }
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem('auth-token');
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : {};
  }

  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  public clean(): void {
    window.sessionStorage.clear();
  }
}
